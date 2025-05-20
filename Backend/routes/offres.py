
from flask import Blueprint, request, jsonify, current_app
import csv
import io
from bson.objectid import ObjectId

offre_blueprint = Blueprint("offres", __name__)

# Fonction pour normaliser les données d'offre
def normalize_offer_data(data, source="form"):
    normalized = {}
    
    if source == "form":
        # Normalisation des données du formulaire
        normalized = {
            "Nom_poste": data.get("title", ""),
            "Contrat": data.get("contract", ""),
            "Description": data.get("description", ""),
            "Entreprise": data.get("company", ""),
            "Experience": data.get("experience", ""),
            "missions": "",  # Champ présent dans le CSV mais pas dans le formulaire
            "profil": "",    # Champ présent dans le CSV mais pas dans le formulaire
            "stack_technique": "",  # Nouveau champ présent dans le CSV
            "groupe_metier": "", # Champ présent dans le CSV mais pas dans le formulaire
            "Lieu": "",      # Champ présent dans le CSV mais pas dans le formulaire
            "recruteur_id": data.get("recruiterId", ""),
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
        current_app.mongo.db.offres.insert_one(offre)
        return jsonify({"message": "Offre ajoutée avec succès"}), 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout: {str(e)}"}), 500

@offre_blueprint.route("/list", methods=["GET"])
def lister_offres():
    try:
        # Récupération des offres depuis la base de données
        offres = list(current_app.mongo.db.offres.find({}, {"_id": 0}))
        return jsonify(offres), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération: {str(e)}"}), 500

# Route pour récupérer les offres par ID de recruteur
@offre_blueprint.route("/recruiter/<recruteur_id>", methods=["GET"])
def lister_offres_recruteur(recruteur_id):
    try:
        # Récupération des offres du recruteur spécifié
        offres = list(current_app.mongo.db.offres.find({"recruteur_id": recruteur_id}, {"_id": 0}))
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
