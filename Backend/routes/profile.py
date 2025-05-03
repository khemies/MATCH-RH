from flask import Blueprint, request, jsonify, current_app
import json
import os
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

    profile_data = {
        "location": data.get("location", ""),
        "availability": data.get("availability", "immediate"),
        "profile": data.get("profile", ""),
        "strengths": data.get("strengths", []),
        "skills": data.get("skills", []),
    }

    # Vérifie si un CV est présent
    if "cv" in request.files:
        cv = request.files["cv"]
        if cv:
            filename = cv.filename
            upload_path = os.path.join("uploads", filename)
            cv.save(upload_path)
            profile_data["cv_filename"] = filename

    # Insertion simple dans MongoDB (sans utilisateur)
    result = current_app.mongo.db.profiles.insert_one(profile_data)

    return jsonify({"message": "Profil enregistré avec succès", "id": str(result.inserted_id)}), 201
