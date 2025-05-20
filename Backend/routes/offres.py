
from flask import Blueprint, request, jsonify, current_app
import csv
import io
from bson.objectid import ObjectId

offre_blueprint = Blueprint("offres", __name__)

# Fonction pour normaliser les données d'offre
def normalize_offer_data(data, source="form"):
    normalized = {}
    
    if source == "form":
        # Normalisation des données du formulaire - Utiliser directement les noms de champs du formulaire
        normalized = {
            "Nom_poste": data.get("Nom_poste", ""),
            "Contrat": data.get("Contrat", ""),
            "Description": data.get("Description", ""),
            "Entreprise": data.get("Entreprise", ""),
            "Experience": data.get("Experience", ""),
            "missions": data.get("missions", ""),
            "profil": data.get("profil", ""),
            "stack_technique": data.get("stack_technique", ""),
            "groupe_metier": data.get("groupe_metier", ""),
            "Lieu": data.get("Lieu", ""),
            "recruteur_id": data.get("recruteur_id", ""),
            "source": "formulaire"
        }
    elif source == "csv":
        # Normalisation des données du CSV - Utiliser directement les noms des colonnes du CSV
        normalized = {
            "Nom_poste": data.get("Nom_poste", ""),
            "Contrat": data.get("Contrat", ""),
            "Description": data.get("Description", ""),
            "Entreprise": data.get("Entreprise", ""),
            "Experience": data.get("Experience", ""),
            "missions": data.get("missions", ""),
            "profil": data.get("profil", ""),
            "stack_technique": data.get("stack_technique", ""),
            "groupe_metier": data.get("groupe_metier", ""),
            "Lieu": data.get("Lieu", ""),
            "recruteur_id": data.get("recruteur_id", ""),
            "source": "csv"
        }
    
    return normalized

@offre_blueprint.route("/add", methods=["POST"])
def ajouter_offre():
    # Récupération des données envoyées dans la requête
    data = request.get_json()
    
    # Normalisation des données du formulaire
    offre = normalize_offer_data(data, "form")

    # Vérification des champs requis
    if not offre["Nom_poste"] or not offre["Entreprise"] or not offre["Description"]:
        return jsonify({"error": "Champs requis manquants"}), 400

    try:
        # Insertion dans la base de données MongoDB
        inserted = current_app.mongo.db.offres.insert_one(offre)
        return jsonify({
            "message": "Offre ajoutée avec succès", 
            "id": str(inserted.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout: {str(e)}"}), 500

@offre_blueprint.route("/list", methods=["GET"])
def lister_offres():
    try:
        limit = request.args.get('limit', default=100, type=int)
        # Récupération des offres depuis la base de données avec limite
        cursor = current_app.mongo.db.offres.find({}).limit(limit)
        
        # Conversion des ObjectId en strings pour la sérialisation JSON
        offres = []
        for offre in cursor:
            offre["_id"] = str(offre["_id"])
            offres.append(offre)
            
        return jsonify(offres), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération: {str(e)}"}), 500

# Route pour récupérer une offre par son ID
@offre_blueprint.route("/<offre_id>", methods=["GET"])
def get_offre_by_id(offre_id):
    try:
        # Vérifier que l'ID est valide
        if not ObjectId.is_valid(offre_id):
            return jsonify({"error": "ID d'offre invalide"}), 400
            
        # Récupérer l'offre par son ID
        offre = current_app.mongo.db.offres.find_one({"_id": ObjectId(offre_id)})
        
        if not offre:
            return jsonify({"error": "Offre non trouvée"}), 404
            
        # Convertir ObjectId en string pour la sérialisation JSON
        offre["_id"] = str(offre["_id"])
        return jsonify(offre), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération: {str(e)}"}), 500

# Route pour récupérer les offres par ID de recruteur
@offre_blueprint.route("/recruiter/<recruteur_id>", methods=["GET"])
def lister_offres_recruteur(recruteur_id):
    try:
        # Récupération des offres du recruteur spécifié
        cursor = current_app.mongo.db.offres.find({"recruteur_id": recruteur_id})
        
        # Conversion des ObjectId en strings pour la sérialisation JSON
        offres = []
        for offre in cursor:
            offre["_id"] = str(offre["_id"])
            offres.append(offre)
            
        return jsonify(offres), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération: {str(e)}"}), 500

# Route pour importer des offres depuis un fichier CSV
@offre_blueprint.route("/import_csv", methods=["POST"])
def importer_offres_csv():
    if 'file' not in request.files:
        return jsonify({"message": "Aucun fichier n'a été téléchargé"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "Aucun fichier sélectionné"}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({"message": "Le fichier doit être au format CSV"}), 400
    
    # Récupération de l'ID du recruteur
    recruteur_id = request.form.get("recruiterId")
    
    if not recruteur_id:
        return jsonify({"message": "ID du recruteur manquant"}), 400
    
    try:
        # Lire le fichier CSV
        csv_content = io.StringIO(file.stream.read().decode('utf-8'))
        csv_reader = csv.DictReader(csv_content)
        
        imported_count = 0
        for row in csv_reader:
            # Ajouter l'ID du recruteur
            row["recruteur_id"] = recruteur_id
            
            # Normaliser les données du CSV
            offre_data = normalize_offer_data(row, "csv")
            
            # Insérer l'offre dans la base de données
            current_app.mongo.db.offres.insert_one(offre_data)
            imported_count += 1
        
        return jsonify({
            "message": f"{imported_count} offres ont été importées avec succès",
            "count": imported_count
        }), 201
        
    except Exception as e:
        return jsonify({"message": "Erreur lors de l'importation du fichier CSV", "error": str(e)}), 500

# Route pour récupérer les candidats correspondants à une offre
@offre_blueprint.route("/candidates/matching/<offre_id>", methods=["GET"])
def get_matching_candidates(offre_id):
    try:
        # Vérifier que l'ID est valide
        if not ObjectId.is_valid(offre_id):
            return jsonify({"error": "ID d'offre invalide"}), 400
            
        # Cette partie va simuler une recherche dans la base de données Matchrh
        # En production, vous devez implémenter la vraie logique de recherche
        # dans la base de données Matchrh où offre_id = candidat_id
        
        # Pour démonstration, nous retournons des données simulées
        # Dans une vraie implémentation, recherchez dans la collection CandidatsMeilleursOffres
        mock_candidates = [
            {
                "_id": "c1",
                "nom": "Dupont",
                "prenom": "Jean",
                "email": "jean.dupont@example.com",
                "telephone": "06 12 34 56 78",
                "experience": "5 ans",
                "competences": ["Python", "SQL", "Data Analysis"],
                "matching_score": 85,
                "disponibilite": "Immédiate",
                "mobilite": "France",
                "cv_url": "https://example.com/cv/dupont.pdf"
            },
            {
                "_id": "c2",
                "nom": "Martin",
                "prenom": "Sophie",
                "email": "s.martin@example.com",
                "telephone": "07 65 43 21 09",
                "experience": "3 ans",
                "competences": ["JavaScript", "React", "Node.js"],
                "matching_score": 75,
                "disponibilite": "1 mois",
                "mobilite": "Remote",
            },
            {
                "_id": "c3",
                "nom": "Leroy",
                "prenom": "Thomas",
                "email": "thomas.l@example.com",
                "experience": "2 ans",
                "competences": ["Java", "Spring", "Hibernate"],
                "matching_score": 60,
            }
        ]
        
        return jsonify(mock_candidates), 200
        
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des candidats: {str(e)}"}), 500
