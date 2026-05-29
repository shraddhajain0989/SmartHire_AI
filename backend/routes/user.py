from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from backend.utils.db import db

user_bp = Blueprint('user', __name__, url_prefix='/user')


@user_bp.route('/me', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user.get('role', 'student'),
        'created_at': user.get('created_at'),
    })

@user_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        user = db.users.find_one({'_id': ObjectId(user_id)}, {'password': 0})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user['_id'] = str(user['_id'])
        return jsonify(user)
        
    elif request.method == 'PUT':
        update_data = {}
        
        # Check if multipart form data is used (for file upload)
        if request.content_type and 'multipart/form-data' in request.content_type:
            bio = request.form.get('bio')
            skills = request.form.get('skills')
            preferred_role = request.form.get('preferred_role')
            
            if bio is not None: update_data['bio'] = bio
            if preferred_role is not None: update_data['preferred_role'] = preferred_role
            if skills is not None:
                import json
                try:
                    skills_parsed = json.loads(skills)
                    if isinstance(skills_parsed, list):
                        update_data['skills'] = skills_parsed
                except Exception:
                    update_data['skills'] = [s.strip() for s in skills.split(',') if s.strip()]
        else:
            payload = request.get_json(force=True, silent=True) or {}
            bio = payload.get('bio')
            skills = payload.get('skills')
            preferred_role = payload.get('preferred_role')
            
            if bio is not None: update_data['bio'] = bio
            if skills is not None: update_data['skills'] = skills
            if preferred_role is not None: update_data['preferred_role'] = preferred_role

        # Handle profile image file upload
        if 'profile_image' in request.files:
            file = request.files['profile_image']
            if file and file.filename != '':
                ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
                if ext not in ['jpg', 'jpeg', 'png', 'webp']:
                    return jsonify({'message': 'Invalid file type. Allowed: JPG, PNG, WEBP.'}), 400
                
                try:
                    import os
                    import cloudinary
                    import cloudinary.uploader
                    if os.getenv('CLOUDINARY_URL'):
                        upload_result = cloudinary.uploader.upload(file, folder="profiles")
                        update_data['profile_image'] = upload_result.get('secure_url')
                    else:
                        from flask import current_app
                        upload_dir = os.path.join(current_app.root_path, 'static', 'profiles')
                        os.makedirs(upload_dir, exist_ok=True)
                        filename = f"{user_id}.{ext}"
                        filepath = os.path.join(upload_dir, filename)
                        file.save(filepath)
                        update_data['profile_image'] = f"{request.host_url}static/profiles/{filename}"
                except Exception as e:
                    print(f"Error uploading profile image: {e}")

        if update_data:
            db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
            
        return jsonify({'message': 'Profile updated successfully'})
