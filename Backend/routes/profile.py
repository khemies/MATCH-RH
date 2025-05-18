
from flask import Blueprint, request, jsonify, current_app
import json
import os
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

profile_blueprint = Blueprint("profile", __name__)

@profile_blueprint.route("/upload_cv", methods=["PUT"])
def upload_cv():
    # Récupère les données du formulaire
    data_str = request.form.get("data")
    if not data_str:
        return jsonify({"message": "Données du profil manquantes"}), 400

    try:
        data = json.loads(data_str)
    except Exception as e:
        return jsonify({"message": "Erreur de parsing JSON", "error": str(e)}), 400

    # Traite les compétences comme une chaîne de texte et la convertit en liste
    skills = data.get("skills", "")
    if isinstance(skills, str):
        # Divise la chaîne par virgules et nettoie les espaces
        skills_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
    else:
        skills_list = skills

    profile_data = {
        "location": data.get("location", ""),
        "availability": data.get("availability", "immediate"),
        "profile": data.get("profile", ""),
        "strengths": data.get("strengths", []),
        "skills": skills_list,
        "user_id": data.get("user_id", "")  # Ajouter l'ID de l'utilisateur
    }

    # Vérifie si un CV est présent
    if "cv" in request.files:
        cv = request.files["cv"]
        if cv:
            filename = cv.filename
            upload_path = os.path.join("uploads", filename)
            cv.save(upload_path)
            profile_data["cv_filename"] = filename

    # Vérifier si un profil existe déjà pour cet utilisateur
    existing_profile = None
    if profile_data["user_id"]:
        existing_profile = current_app.mongo.db.profiles.find_one({"user_id": profile_data["user_id"]})
    
    if existing_profile:
        # Mise à jour du profil existant
        current_app.mongo.db.profiles.update_one(
            {"user_id": profile_data["user_id"]},
            {"$set": profile_data}
        )
        return jsonify({"message": "Profil mis à jour avec succès", "id": str(existing_profile["_id"])}), 200
    else:
        # Création d'un nouveau profil
        result = current_app.mongo.db.profiles.insert_one(profile_data)
        return jsonify({"message": "Profil enregistré avec succès", "id": str(result.inserted_id)}), 201

@profile_blueprint.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    # Recherche du profil par ID utilisateur
    profile = current_app.mongo.db.profiles.find_one({"user_id": user_id})
    
    if profile:
        # Convertir ObjectId en string pour la sérialisation JSON
        profile["_id"] = str(profile["_id"])
        return jsonify(profile), 200
    else:
        return jsonify({"message": "Profil non trouvé"}), 404

@profile_blueprint.route("/check", methods=["GET"])
@jwt_required()
def check_profile():
    user_id = get_jwt_identity()
    
    # Vérifier si le profil existe
    profile = current_app.mongo.db.profiles.find_one({"user_id": user_id})
    
    if profile:
        return jsonify({"exists": True, "profile_id": str(profile["_id"])}), 200
    else:
        return jsonify({"exists": False}), 200

@profile_blueprint.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_profile():
    user_id = get_jwt_identity()
    
    # Trouver et supprimer le profil
    result = current_app.mongo.db.profiles.delete_one({"user_id": user_id})
    
    if result.deleted_count > 0:
        return jsonify({"message": "Profil supprimé avec succès"}), 200
    else:
        return jsonify({"message": "Profil non trouvé"}), 404
