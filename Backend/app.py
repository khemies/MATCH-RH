
from flask import Flask
from routes.auth import auth_blueprint
from routes.profile import profile_blueprint
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import MONGO_URI


app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# Rendre mongo accessible dans les blueprints
app.mongo = mongo

# Ajouter les routes d'auth
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")

# Ajouter les routes de profil
app.register_blueprint(profile_blueprint, url_prefix="/api/profile")

if __name__ == "__main__":
    app.run(debug=True)
