
from flask import Flask
from routes.auth import auth_blueprint
<<<<<<< HEAD
from routes.offres import offre_blueprint
=======
from routes.profile import profile_blueprint
>>>>>>> dc568e9f7fddb3a978e1c9a2f2613dc67d0add0d
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from config import MONGO_URI

app = Flask(__name__)
CORS(app)

# Configuration JWT
app.config["JWT_SECRET_KEY"] = "123456" 
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# Configuration Mongo
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)
app.mongo = mongo

# Initialisation JWT
jwt = JWTManager(app)

# Enregistrement des blueprints
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
app.register_blueprint(offre_blueprint, url_prefix="/api/offres")

# Ajouter les routes de profil
app.register_blueprint(profile_blueprint, url_prefix="/api/profile")

if __name__ == "__main__":
    app.run(debug=True)
