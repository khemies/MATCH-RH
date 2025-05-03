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

    # Vérification des champs requis
    if not titre or not entreprise or not description:
        return jsonify({"error": "Champs requis manquants"}), 400

    # Création de l'offre à insérer dans la base de données
    offre = {
        "titre": titre,
        "contrat": contrat,
        "description": description,
        "entreprise": entreprise,
        "experience": experience
    }

    try:
        # Insertion dans la base de données MongoDB
        current_app.mongo.db.offres.insert_one(offre)
        return jsonify({"message": "Offre ajoutée avec succès"}), 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout: {str(e)}"}), 500
