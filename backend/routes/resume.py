import os
import tempfile
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from backend.services.resume_service import extract_text_from_pdf, parse_resume_text
from backend.utils.db import db
from bson import ObjectId

resume_bp = Blueprint('resume', __name__, url_prefix='/resume')


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    user_id = get_jwt_identity()
    file = request.files.get('resume')
    if not file or file.filename.split('.')[-1].lower() != 'pdf':
        return jsonify({'message': 'A PDF resume file is required.'}), 400

    text = extract_text_from_pdf(file)
    parsed = parse_resume_text(text)

    db.resumes.insert_one({
        'user_id': ObjectId(user_id),
        'summary': parsed['summary'],
        'skills': parsed['skills'],
        'projects': parsed['projects'],
        'created_at': __import__('datetime').datetime.utcnow().isoformat(),
    })

    db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'resume': parsed, 'updated_at': __import__('datetime').datetime.utcnow().isoformat()}},
    )

    return jsonify(parsed)
