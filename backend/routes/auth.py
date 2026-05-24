from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
import bcrypt
from backend.utils.db import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Missing fields'}), 400

    existing = db.users.find_one({'email': email.lower()})
    if existing:
        return jsonify({'message': 'Email already registered'}), 400

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = {
        'name': name,
        'email': email.lower(),
        'password': hashed_password,
        'role': 'student',
        'created_at': datetime.utcnow().isoformat(),
    }
    result = db.users.insert_one(user)
    access_token = create_access_token(identity=str(result.inserted_id), additional_claims={'role': user['role'], 'email': user['email']})
    return jsonify({'access_token': access_token})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = db.users.find_one({'email': email.lower()})
    if not user or not bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user['_id']), additional_claims={'role': user.get('role', 'student'), 'email': user['email']})
    return jsonify({'access_token': access_token})
