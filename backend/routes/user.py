from bson import ObjectId
from flask import Blueprint, jsonify
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
