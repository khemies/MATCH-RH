
from flask import Blueprint, request, jsonify, current_app

offre_blueprint = Blueprint("offres", __name__)

@offre_blueprint.route("/add", methods=["POST"])
def ajouter_offre():
    # Récupération des données envoyées dans la requête
    data = request.get_json()
    
    titre = data.get("title")
    contrat = data.get("contract")
    description = data.get("description")
    entreprise = data.get("company")
    experience = data.get("experience")
    recruteur_id = data.get("recruiterId")  # Ajout du champ recruiterId

    # Vérification des champs requis
    if not titre or not entreprise or not description or not recruteur_id:
        return jsonify({"error": "Champs requis manquants"}), 400

    # Création de l'offre à insérer dans la base de données
    offre = {
        "titre": titre,
        "contrat": contrat,
        "description": description,
        "entreprise": entreprise,
        "experience": experience,
        "recruteur_id": recruteur_id  # Stockage de l'ID du recruteur
    }

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

# Ajout d'une nouvelle route pour récupérer les offres par ID de recruteur
@offre_blueprint.route("/recruiter/<recruteur_id>", methods=["GET"])
def lister_offres_recruteur(recruteur_id):
    try:
        # Récupération des offres du recruteur spécifié
        offres = list(current_app.mongo.db.offres.find({"recruteur_id": recruteur_id}, {"_id": 0}))
        return jsonify(offres), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération: {str(e)}"}), 500
