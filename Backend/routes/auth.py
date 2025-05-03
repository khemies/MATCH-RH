from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # "candidat" ou "recruteur"

    mongo = current_app.mongo
    users = mongo.db.users

    # Vérifier si l'utilisateur existe déjà dans la base
    existing_user = users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Un utilisateur avec cet email existe déjà"}), 409

    # Si l'utilisateur n'existe pas, on hache le mot de passe et on l'ajoute à la base
    hashed_pw = generate_password_hash(password)
    user = {"email": email, "password": hashed_pw, "role": role}
    users.insert_one(user)

    return jsonify({"message": "Utilisateur enregistré avec succès"}), 201




@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = current_app.mongo.db.users.find_one({"email": email})

    if user and check_password_hash(user["password"], password):
        access_token = create_access_token(identity=str(user["_id"]))  # <-- Clé
        return jsonify({
            "message": "Connexion réussie",
            "token": access_token,
            "user_id": str(user["_id"]),
            "role": user.get("role", "recruteur")
        }), 200
    else:
        return jsonify({"message": "Identifiants invalides"}), 401
