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
@offre_blueprint.route("/candidates/matching/<_id>", methods=["GET"])
def get_matching_candidates(_id):
    try:
        # Vérifier que _id est un ObjectId valide
        if not ObjectId.is_valid(_id):
            return jsonify({"error": "ID d'offre invalide"}), 400

        # Convertir la chaîne _id en ObjectId (MongoDB)
        mongo_id = ObjectId(_id)
        print(mongo_id)
        # Récupérer l'offre depuis la collection 'offres'
        offre = current_app.mongo.db.offres.find_one({"_id": mongo_id})
        
        if not offre:
            return jsonify({"error": "Offre non trouvée"}), 404
        
        # Extraire le champ 'offre_id' de l'offre récupérée
        mon_offre_id = offre.get("offre_id")
        print(mon_offre_id)
    
        
        # Chercher les candidats qui correspondent à cet 'offre_id' dans 'CandidatsMeilleursOffres'
        candidates = current_app.mongo.db.OffresMeuilleurCandidat.find({"offre_id":mon_offre_id})
        result = []
        for candidate in candidates:
            candidat_id = str(candidate.get("candidat_id"))
            print(f"✅ ID du candidat trouvé : {candidat_id}")  # Affichage dans le terminal
            
            # Ajouter le document candidat complet dans le résultat
            # Si tu veux seulement l'ID, faire result.append(candidat_id)
            result.append(candidate)
        
        print(f"Nombre de candidats trouvés: {len(result)}")
        
        # Pour que jsonify puisse retourner le résultat, il faut transformer l'objet Mongo (ObjectId) en string
        # car ObjectId n'est pas JSON serializable
        # Donc on convertit chaque document candidat en dict avec stringification des ObjectId
        def transform_candidate(doc):
            doc["_id"] = str(doc["_id"])
            # Si candidat_id est aussi un ObjectId, on peut aussi le convertir, sinon laisse tel quel
            if isinstance(doc.get("candidat_id"), ObjectId):
                doc["candidat_id"] = str(doc["candidat_id"])
            return doc
        
        result_json = [transform_candidate(c) for c in result]

        return jsonify(result_json), 200

    except Exception as e:
        print(f"Erreur lors de la récupération des candidats: {str(e)}")
        return jsonify({"error": f"Erreur lors de la récupération des candidats: {str(e)}"}), 500
