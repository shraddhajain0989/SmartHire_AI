from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt, jwt_required
from backend.utils.db import db
from bson import ObjectId

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


def _is_admin():
    claims = get_jwt()
    return claims.get('role') == 'admin'


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    if not _is_admin():
        return jsonify({'message': 'Admin access required'}), 403

    users = list(db.users.find().sort('created_at', -1))
    payload = [
        {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user.get('role', 'student'),
            'created_at': user.get('created_at'),
        }
        for user in users
    ]
    return jsonify({'users': payload})
