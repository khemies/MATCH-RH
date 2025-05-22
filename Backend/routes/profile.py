
from flask import Blueprint, request, jsonify, current_app
import json
import os
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

profile_blueprint = Blueprint("profile", __name__)

# Fonction pour normaliser les données du profil
def normalize_profile_data(data, source="form"):
    normalized = {}
    
    if source == "form":
        # Normalisation des données du formulaire
        normalized = {
            "profile": data.get("profile", ""),
            "location": data.get("location", ""),
            "availability": data.get("availability", "immediate"),
            "strengths": data.get("strengths", "").strip(),
            "skills": data.get("skills", []) if isinstance(data.get("skills"), list) else [s.strip() for s in data.get("skills", "").split(",") if s.strip()],
            "experience": "",  # Champ présent dans le CSV mais pas dans le formulaire
            "contract_type": "",  # Champ présent dans le CSV mais pas dans le formulaire
            "job_category": "",  # Champ présent dans le CSV mais pas dans le formulaire
            "user_id": data.get("user_id", ""),
            "source": "formulaire"
        }
    elif source == "csv":
        # Normalisation des données du CSV
        normalized = {
            "profile": data.get("Profil", ""),
            "location": data.get("Lieu_de_recherche", ""),
            "availability": data.get("Disponibilité", "immediate"),
            "strengths": data.get("Points_forts", "").strip(),
            "skills": data.get("Compétence", "").split(",") if isinstance(data.get("Compétence"), str) else data.get("Compétence", []),
            "experience": data.get("Expérience", ""),
            "contract_type": data.get("Contrat", ""),
            "job_category": data.get("Metier_regroupe", ""),
            "user_id": data.get("user_id", ""),
            "source": "csv"
        }
    
    return normalized

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

    # Normalisation des données du profil
    profile_data = normalize_profile_data(data, "form")

    # Vérifie si un CV est présent
    if "cv" in request.files:
        cv = request.files["cv"]
        if cv:
            filename = cv.filename
            upload_path = os.path.join("uploads", filename)
            cv.save(upload_path)
            profile_data["cv_filename"] = filename

    # Vérifier si un profil existe déjà pour cet utilisateur
    candidat_id = None
    if profile_data["user_id"]:
        existing_profile = current_app.mongo.db.profiles.find_one({"user_id": profile_data["user_id"]})

        if existing_profile:
            # Mise à jour du profil existant
            current_app.mongo.db.profiles.update_one(
                {"user_id": profile_data["user_id"]},
                {"$set": profile_data}
            )
            candidat_id = str(existing_profile["_id"])
        else:
            # Création d'un nouveau profil
            result = current_app.mongo.db.profiles.insert_one(profile_data)
            candidat_id = str(result.inserted_id)

        # 🔁 Stocker temporairement ce profil pour le matching dans une collection dédiée
        current_app.mongo.db.candidat_temp.insert_one({
            "candidat_id": candidat_id,
            "user_id": profile_data["user_id"],
            "profil": profile_data["profile"],
            "skills": profile_data["skills"],
            "source": "formulaire"
        })

        return jsonify({"message": "Profil enregistré ou mis à jour avec succès", "id": candidat_id}), 200

    return jsonify({"message": "User ID manquant dans le profil"}), 400

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

@profile_blueprint.route("/all", methods=["GET"])
@jwt_required()
def get_all_profiles():
    # Récupérer tous les profils
    profiles = list(current_app.mongo.db.profiles.find({}))
    
    # Convertir ObjectId en string pour la sérialisation JSON
    for profile in profiles:
        profile["_id"] = str(profile["_id"])
    
    return jsonify(profiles), 200

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
    
    # Récupérer le profil avant de le supprimer pour avoir des informations
    profile = current_app.mongo.db.profiles.find_one({"user_id": user_id})
    
    if not profile:
        return jsonify({"message": "Profil non trouvé"}), 404
    
    # Supprimer le fichier CV associé si existant
    if "cv_filename" in profile and profile["cv_filename"]:
        try:
            cv_path = os.path.join("uploads", profile["cv_filename"])
            if os.path.exists(cv_path):
                os.remove(cv_path)
        except Exception as e:
            # Log l'erreur mais continuez la suppression du profil
            print(f"Erreur lors de la suppression du fichier CV: {str(e)}")
    
    # Supprimer le profil de la base de données
    result = current_app.mongo.db.profiles.delete_one({"user_id": user_id})
    
    if result.deleted_count > 0:
        return jsonify({"message": "Profil supprimé avec succès"}), 200
    else:
        return jsonify({"message": "Erreur lors de la suppression du profil"}), 500

# Route pour importer les profils depuis un fichier CSV
@profile_blueprint.route("/import_csv", methods=["POST"])
@jwt_required()
def import_csv_profiles():
    if 'file' not in request.files:
        return jsonify({"message": "Aucun fichier n'a été téléchargé"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "Aucun fichier sélectionné"}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({"message": "Le fichier doit être au format CSV"}), 400
    
    # Traiter le fichier CSV
    try:
        import csv
        import io
        
        # Lire le fichier CSV
        csv_content = io.StringIO(file.stream.read().decode('utf-8'))
        csv_reader = csv.DictReader(csv_content)
        
        imported_count = 0
        for row in csv_reader:
            # Normaliser les données du CSV
            profile_data = normalize_profile_data(row, "csv")
            
            if not profile_data.get("user_id"):
                profile_data["user_id"] = str(ObjectId())
            
            current_app.mongo.db.profiles.insert_one(profile_data)
            imported_count += 1
        
        return jsonify({
            "message": f"{imported_count} profils ont été importés avec succès",
            "count": imported_count
        }), 201
        
    except Exception as e:
        return jsonify({"message": "Erreur lors de l'importation du fichier CSV", "error": str(e)}), 500
