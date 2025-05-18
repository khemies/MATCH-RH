
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
    # ... keep existing code (list offers functionality)
