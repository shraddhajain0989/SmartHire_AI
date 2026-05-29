import datetime
import random
import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from backend.utils.db import db
from backend.services.ai_service import (
    score_answer,
    create_feedback,
    transcribe_audio,
    client as openai_client,
    OPENAI_API_KEY
)

practice_bp = Blueprint('practice', __name__, url_prefix='/practice')

# Helper to shuffle MCQ options and adjust correct index
def shuffle_options(options, correct_idx):
    pairs = list(enumerate(options))
    random.shuffle(pairs)
    shuffled = [p[1] for p in pairs]
    new_correct_idx = next(i for i, p in enumerate(pairs) if p[0] == correct_idx)
    return shuffled, new_correct_idx


# --- Custom Questions CRUD ---

@practice_bp.route('/custom', methods=['POST'])
@jwt_required()
def create_custom_question():
    payload = request.get_json(force=True)
    user_id = ObjectId(get_jwt_identity())
    
    title = payload.get('title')
    description = payload.get('description')
    q_type = payload.get('type') # 'coding', 'mcq', 'verbal'
    difficulty = payload.get('difficulty', 'Medium')
    category = payload.get('category', 'General')
    options = payload.get('options', []) # for MCQs
    correct_index = payload.get('correctIndex', 0) # for MCQs
    explanation = payload.get('explanation', '')
    
    if not title or not description or not q_type:
        return jsonify({'message': 'Missing required fields'}), 400
        
    question = {
        'user_id': user_id,
        'title': title,
        'description': description,
        'type': q_type,
        'difficulty': difficulty,
        'category': category,
        'options': options,
        'correctIndex': correct_index,
        'explanation': explanation,
        'attempts': [],
        'best_score': 0,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    result = db.custom_questions.insert_one(question)
    return jsonify({'message': 'Question created successfully', 'id': str(result.inserted_id)}), 201


@practice_bp.route('/custom', methods=['GET'])
@jwt_required()
def get_custom_questions():
    user_id = ObjectId(get_jwt_identity())
    questions = list(db.custom_questions.find({'user_id': user_id}).sort('created_at', -1))
    
    for q in questions:
        q['_id'] = str(q['_id'])
        q['user_id'] = str(q['user_id'])
        
    return jsonify(questions)


@practice_bp.route('/custom/<id>', methods=['GET'])
@jwt_required()
def get_single_custom_question(id):
    user_id = ObjectId(get_jwt_identity())
    q = db.custom_questions.find_one({'_id': ObjectId(id), 'user_id': user_id})
    if not q:
        return jsonify({'message': 'Question not found'}), 404
        
    q['_id'] = str(q['_id'])
    q['user_id'] = str(q['user_id'])
    return jsonify(q)


@practice_bp.route('/custom/<id>', methods=['PUT'])
@jwt_required()
def update_custom_question(id):
    user_id = ObjectId(get_jwt_identity())
    payload = request.get_json(force=True)
    
    q = db.custom_questions.find_one({'_id': ObjectId(id), 'user_id': user_id})
    if not q:
        return jsonify({'message': 'Question not found'}), 404
        
    update_fields = {}
    for key in ['title', 'description', 'difficulty', 'category', 'options', 'correctIndex', 'explanation']:
        if key in payload:
            update_fields[key] = payload[key]
            
    if update_fields:
        db.custom_questions.update_one({'_id': ObjectId(id)}, {'$set': update_fields})
        
    return jsonify({'message': 'Question updated successfully'})


@practice_bp.route('/custom/<id>', methods=['DELETE'])
@jwt_required()
def delete_custom_question(id):
    user_id = ObjectId(get_jwt_identity())
    result = db.custom_questions.delete_one({'_id': ObjectId(id), 'user_id': user_id})
    if result.deleted_count == 0:
        return jsonify({'message': 'Question not found or unauthorized'}), 404
        
    return jsonify({'message': 'Question deleted successfully'})


@practice_bp.route('/custom/<id>/attempt', methods=['POST'])
@jwt_required()
def attempt_custom_question(id):
    user_id = ObjectId(get_jwt_identity())
    payload = request.get_json(force=True)
    
    q = db.custom_questions.find_one({'_id': ObjectId(id), 'user_id': user_id})
    if not q:
        return jsonify({'message': 'Question not found'}), 404
        
    selected_option = payload.get('selected_option') # for MCQs
    answer = payload.get('answer') # for verbal / free-text
    
    passed = False
    score = 0
    
    if q['type'] == 'mcq' and selected_option is not None:
        passed = int(selected_option) == int(q.get('correctIndex', 0))
        score = 100 if passed else 0
    elif q['type'] == 'verbal' and answer:
        # Simple local semantic benchmark
        from backend.services.ai_service import generate_expected_answer
        expected = generate_expected_answer(q['description'], "Software Engineer")
        similarity = score_answer(expected, answer)
        score = int(similarity * 100)
        passed = score >= 60
        
    attempt_obj = {
        'selected_option': selected_option,
        'answer': answer,
        'passed': passed,
        'score': score,
        'completed_at': datetime.datetime.utcnow().isoformat()
    }
    
    db.custom_questions.update_one(
        {'_id': ObjectId(id)},
        {
            '$push': {'attempts': attempt_obj},
            '$max': {'best_score': score}
        }
    )
    
    return jsonify({
        'passed': passed,
        'score': score,
        'correctIndex': q.get('correctIndex'),
        'explanation': q.get('explanation', '')
    })


# --- MCQ quiz / practice endpoints ---

@practice_bp.route('/mcq/questions', methods=['GET'])
@jwt_required()
def get_mcq_questions():
    topic = request.args.get('topic')
    difficulty = request.args.get('difficulty')
    limit = int(request.args.get('limit', 5))
    
    query = {}
    if topic:
        query['topic'] = topic
    if difficulty:
        query['difficulty'] = difficulty
        
    mcqs = list(db.mcqs.find(query))
    
    if not mcqs:
        # Predefined fallback if DB is empty
        mcqs = [
            {
                "_id": "mcq_1",
                "topic": "OOPs",
                "difficulty": "Easy",
                "question": "Which of the following is NOT a fundamental concept of OOP?",
                "options": ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"],
                "correctIndex": 2,
                "explanation": "Compilation is a build phase concept, whereas Encapsulation, Polymorphism, and Inheritance are core OOP pillars."
            },
            {
                "_id": "mcq_2",
                "topic": "DBMS",
                "difficulty": "Medium",
                "question": "What is the worst-case lookup complexity in a binary search tree?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correctIndex": 2,
                "explanation": "In a skewed binary search tree, search degrades to O(n) linear scans."
            }
        ]
        if topic:
            mcqs = [m for m in mcqs if m['topic'] == topic]
            
    # Draw random selection
    selected_mcqs = random.sample(mcqs, min(len(mcqs), limit))
    
    # Process options shuffling dynamically
    payload = []
    for item in selected_mcqs:
        options = item['options']
        correct_idx = item['correctIndex']
        
        shuffled_options, new_correct_idx = shuffle_options(options, correct_idx)
        
        payload.append({
            'id': str(item.get('_id', item.get('id'))),
            'topic': item.get('topic', 'General'),
            'difficulty': item.get('difficulty', 'Medium'),
            'question': item['question'],
            'options': shuffled_options,
            'correctIndex': new_correct_idx,
            'explanation': item.get('explanation', '')
        })
        
    return jsonify({'questions': payload})


@practice_bp.route('/mcq/ai-generate', methods=['POST'])
@jwt_required()
def ai_generate_mcq():
    payload = request.get_json(force=True)
    topic = payload.get('topic', 'DBMS')
    difficulty = payload.get('difficulty', 'Medium')
    
    try:
        if not openai_client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("No OpenAI credentials found")
            
        prompt = (
            f"Generate 3 multiple choice questions (MCQs) for computer science students.\n"
            f"Topic: {topic}\n"
            f"Difficulty: {difficulty}\n"
            f"Each question must have exactly 4 choices, a correct index (0-3), and a brief explanation.\n\n"
            f"Output MUST be in strict JSON array format matching this schema:\n"
            f"[\n"
            f"  {{\n"
            f"    \"question\": \"Question text?\",\n"
            f"    \"options\": [\"Choice A\", \"Choice B\", \"Choice C\", \"Choice D\"],\n"
            f"    \"correctIndex\": 2,\n"
            f"    \"explanation\": \"Detailed explanation text\"\n"
            f"  }}\n"
            f"]\n"
            f"Return ONLY raw JSON. No markdown blocks."
        )
        
        response = openai_client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are an MCQ quiz generator. Return only raw JSON arrays.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=600,
            temperature=0.7,
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
            
        mcq_items = json.loads(content)
        
        # Insert them to DB
        for item in mcq_items:
            item['topic'] = topic
            item['difficulty'] = difficulty
            db.mcqs.insert_one(item)
            
        # Format payload to return (shuffle options)
        payload = []
        for item in mcq_items:
            shuffled_options, new_correct_idx = shuffle_options(item['options'], item['correctIndex'])
            payload.append({
                'id': str(item.get('_id', item.get('id'))),
                'topic': topic,
                'difficulty': difficulty,
                'question': item['question'],
                'options': shuffled_options,
                'correctIndex': new_correct_idx,
                'explanation': item.get('explanation', '')
            })
            
        return jsonify({'questions': payload})
        
    except Exception as e:
        print(f"[AI Service] OpenAI MCQ generation failed: {e}. Falling back to DB database.")
        # Fallback to fetching existing from DB
        query = {'topic': topic, 'difficulty': difficulty}
        mcqs = list(db.mcqs.find(query))
        if not mcqs:
            mcqs = list(db.mcqs.find())
            
        selected_mcqs = random.sample(mcqs, min(len(mcqs), 3)) if mcqs else []
        payload = []
        for item in selected_mcqs:
            shuffled_options, new_correct_idx = shuffle_options(item['options'], item['correctIndex'])
            payload.append({
                'id': str(item.get('_id', item.get('id'))),
                'topic': item.get('topic', topic),
                'difficulty': item.get('difficulty', difficulty),
                'question': item['question'],
                'options': shuffled_options,
                'correctIndex': new_correct_idx,
                'explanation': item.get('explanation', '')
            })
        return jsonify({'questions': payload})


@practice_bp.route('/mcq', methods=['POST'])
@jwt_required()
def save_mcq_attempt():
    payload = request.get_json(force=True)
    user_id = ObjectId(get_jwt_identity())
    
    topic = payload.get('topic', 'General')
    # Fetch option indices and score details
    selected = payload.get('selected_option')
    correct = payload.get('correct_option')
    score = payload.get('score', 0)
    
    # Try fetching the actual topic if question exists in database
    mcq_id = payload.get('mcq_id')
    if mcq_id and len(mcq_id) == 24:
        db_mcq = db.mcqs.find_one({'_id': ObjectId(mcq_id)})
        if db_mcq:
            topic = db_mcq.get('topic', topic)
            
    attempt = {
        'user_id': user_id,
        'mcq_id': mcq_id,
        'selected_option': selected,
        'correct_option': correct,
        'score': score,
        'topic': topic,
        'completed_at': datetime.datetime.utcnow().isoformat()
    }
    
    db.mcq_attempts.insert_one(attempt)
    return jsonify({'message': 'MCQ Attempt logged successfully'}), 201


# --- Verbal Evaluate Fallback ---

@practice_bp.route('/verbal', methods=['POST'])
@jwt_required()
def evaluate_verbal():
    user_id = ObjectId(get_jwt_identity())
    question = request.form.get('question')
    answer = request.form.get('answer', '')
    topic = request.form.get('topic', 'Communication')
    
    if not question:
        return jsonify({'message': 'Question is required'}), 400
        
    audio_text = None
    if 'audio' in request.files:
        audio = request.files['audio']
        audio_text = transcribe_audio(audio)
        answer = f"{answer}\n{audio_text}".strip()
        
    if not answer.strip():
        return jsonify({'message': 'Answer is required'}), 400
        
    from backend.services.ai_service import generate_expected_answer
    expected = generate_expected_answer(question, "Software Engineer")
    similarity = score_answer(expected, answer)
    feedback_payload = create_feedback(question, answer, similarity)
    
    # Simple confidence scoring
    confidence_score = int(min(100, max(50, round(similarity * 105))))
    
    db.verbal_attempts.insert_one({
        'user_id': user_id,
        'question': question,
        'answer': answer,
        'expected': expected,
        'topic': topic,
        'technical_score': feedback_payload['technical_score'],
        'communication_score': feedback_payload['communication_score'],
        'confidence_score': confidence_score,
        'feedback': feedback_payload['feedback'],
        'created_at': datetime.datetime.utcnow().isoformat()
    })
    
    feedback_payload['confidence_score'] = confidence_score
    return jsonify(feedback_payload)
