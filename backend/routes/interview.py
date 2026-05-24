import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from backend.utils.db import db
from backend.services.ai_service import generate_question, generate_expected_answer, score_answer, create_feedback, transcribe_audio

interview_bp = Blueprint('interview', __name__, url_prefix='/interview')


@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_interview():
    payload = request.get_json(force=True)
    interview_type = payload.get('type')
    role = payload.get('role')
    difficulty = payload.get('difficulty')
    if not interview_type or not role or not difficulty:
        return jsonify({'message': 'Missing interview metadata.'}), 400

    session = {
        'user_id': ObjectId(get_jwt_identity()),
        'type': interview_type,
        'role': role,
        'difficulty': difficulty,
        'status': 'started',
        'created_at': datetime.datetime.utcnow().isoformat(),
    }
    result = db.interviews.insert_one(session)
    return jsonify({'session_id': str(result.inserted_id)})


@interview_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_question():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'message': 'Session id required.'}), 400

    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Session not found.'}), 404

    if session.get('question'):
        return jsonify({'question': session['question']})

    skills = session.get('skills', [])
    resume = ''
    user = db.users.find_one({'_id': session['user_id']})
    if user and user.get('resume'):
        skills = user['resume'].get('skills', [])
        resume = user['resume'].get('summary', '')

    question_text = generate_question(session['role'], skills, session['difficulty'], resume)
    db.interviews.update_one({'_id': ObjectId(session_id)}, {'$set': {'question': question_text}})
    return jsonify({'question': question_text})


@interview_bp.route('/answer', methods=['POST'])
@jwt_required()
def submit_answer():
    session_id = request.form.get('session_id')
    answer = request.form.get('answer')
    question = request.form.get('question')
    if not session_id or not answer or not question:
        return jsonify({'message': 'Session, question and answer are required.'}), 400

    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Interview session not found.'}), 404

    audio_text = None
    if 'audio' in request.files:
        audio = request.files['audio']
        audio_text = transcribe_audio(audio)
        answer = f"{answer}\n{audio_text}"

    expected = generate_expected_answer(question, session['role'])
    similarity = score_answer(expected, answer)
    feedback_payload = create_feedback(question, answer, similarity)

    db.interviews.update_one(
        {'_id': ObjectId(session_id)},
        {
            '$set': {
                'answer': answer,
                'question': question,
                'expected': expected,
                'similarity': feedback_payload['similarity'],
                'technical_score': feedback_payload['technical_score'],
                'communication_score': feedback_payload['communication_score'],
                'feedback': feedback_payload['feedback'],
                'audio_transcript': audio_text,
                'completed_at': datetime.datetime.utcnow().isoformat(),
                'status': 'completed',
            }
        },
    )

    return jsonify(feedback_payload)
