
from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename

profile_blueprint = Blueprint('profile', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}
UPLOAD_FOLDER = 'uploads/cv'

# Vérifier si le dossier d'upload existe, sinon le créer
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@profile_blueprint.route('/upload-cv', methods=['POST'])
def upload_cv():
    # Vérifier si l'utilisateur est authentifié
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({"error": "Utilisateur non authentifié"}), 401
    
    # Vérifier si un fichier est présent dans la requête
    if 'cv' not in request.files:
        return jsonify({"error": "Aucun fichier trouvé"}), 400
        
    file = request.files['cv']
    
    # Si l'utilisateur n'a pas sélectionné de fichier
    if file.filename == '':
        return jsonify({"error": "Aucun fichier sélectionné"}), 400
        
    if file and allowed_file(file.filename):
        # Sécuriser le nom du fichier
        filename = secure_filename(file.filename)
        
        # Créer un nom unique pour le fichier basé sur l'ID utilisateur
        extension = filename.rsplit('.', 1)[1].lower()
        new_filename = f"{user_id}_cv.{extension}"
        
        # Sauvegarder le fichier
        file_path = os.path.join(UPLOAD_FOLDER, new_filename)
        file.save(file_path)
        
        # Mettre à jour la référence au CV dans la base de données MongoDB
        mongo = current_app.mongo
        users = mongo.db.users
        
        users.update_one(
            {"_id": user_id}, 
            {"$set": {"cv_path": file_path}}
        )
        
        return jsonify({
            "message": "CV téléchargé avec succès",
            "file_path": file_path
        }), 201
    
    return jsonify({"error": "Type de fichier non autorisé"}), 400
