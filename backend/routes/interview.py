import datetime
import os
from flask import Blueprint, jsonify, request, Response, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from backend.utils.db import db
from backend.services.ai_service import (
    generate_expected_answer,
    score_answer,
    create_feedback,
    transcribe_audio,
    client as openai_client,
    OPENAI_API_KEY
)
import cloudinary
import cloudinary.uploader

interview_bp = Blueprint('interview', __name__, url_prefix='/interview')

# Rich Question Bank for all 14 categories
QUESTION_BANK = {
    'HR': {
        'Easy': [
            "Tell me about yourself. Why are you interested in this role?",
            "What are your greatest professional strengths and weaknesses?",
            "Describe a time when you had to work closely with a teammate on a project."
        ],
        'Medium': [
            "How do you handle tight deadlines or pressure? Share a past example.",
            "Tell me about a time you made a mistake at work or school, and how you resolved it.",
            "Where do you see yourself in five years, and how does this role fit that vision?"
        ],
        'Hard': [
            "Tell me about a time you had to lead a project under extreme constraints and resource deficits.",
            "Describe a major professional conflict you resolved. What strategies did you employ?",
            "How do you prioritize competing requests from multiple high-profile stakeholders?"
        ]
    },
    'Technical': {
        'Easy': [
            "Explain the difference between a process and a thread.",
            "What is a REST API? What are the standard HTTP methods?",
            "Explain the differences between stack and heap memory."
        ],
        'Medium': [
            "Explain the concept of database indexing. How does it improve query performance?",
            "What is CORS, and how do browsers handle it to secure cross-origin requests?",
            "How does asynchronous event-driven architecture differ from synchronous multithreading?"
        ],
        'Hard': [
            "Describe how you would design a system to handle 100,000 read/write requests per second.",
            "Explain the internals of garbage collection in modern runtimes, and how it impacts latency.",
            "Detail the architecture of a distributed message queue like Kafka. How does it guarantee durability?"
        ]
    },
    'DSA': {
        'Easy': [
            "What is the time complexity of searching in a sorted array using binary search?",
            "Describe the main differences between an Array and a Linked List.",
            "Explain how a hash map resolves collisions."
        ],
        'Medium': [
            "Explain how the QuickSort algorithm works. What is its worst-case complexity?",
            "Describe the difference between depth-first search (DFS) and breadth-first search (BFS).",
            "What is a binary search tree? How do you perform an inorder traversal?"
        ],
        'Hard': [
            "Explain how Dijkstra's algorithm finds the shortest path. How does a priority queue optimize it?",
            "Describe the concept of dynamic programming. How does it differ from divide-and-conquer?",
            "How does a Red-Black Tree maintain its self-balancing property during inserts or deletes?"
        ]
    },
    'DBMS': {
        'Easy': [
            "What is the difference between primary key and foreign key?",
            "Explain what the ACID properties stand for in transaction management.",
            "What is the difference between SQL and NoSQL databases?"
        ],
        'Medium': [
            "Explain the difference between clustered and non-clustered indexes.",
            "What is database normalization? Explain 1NF, 2NF, and 3NF.",
            "What are database joins? Explain Inner, Left, Right, and Full joins."
        ],
        'Hard': [
            "Describe database sharding and partitioning. When should you use each?",
            "How do write-ahead logging (WAL) and checkpoints ensure durability in DBMS?",
            "Explain the two-phase locking (2PL) protocol and how it prevents concurrency anomalies."
        ]
    },
    'OOPs': {
        'Easy': [
            "What are the four pillars of Object-Oriented Programming?",
            "Explain the difference between a class and an object.",
            "What is method overloading and how does it differ from method overriding?"
        ],
        'Medium': [
            "What is the difference between an abstract class and an interface?",
            "Describe encapsulation. How do access specifiers support it?",
            "What is a constructor? Explain the copy constructor."
        ],
        'Hard': [
            "Explain dynamic binding and virtual tables (vtables) in OOP execution.",
            "What is multiple inheritance, and how does the diamond problem arise?",
            "Explain the SOLID design principles in Object-Oriented Design."
        ]
    },
    'Operating Systems': {
        'Easy': [
            "What is virtual memory and why is it used?",
            "Describe what paging and segmentation are in memory management.",
            "What is a deadlock? List the four necessary conditions for deadlock."
        ],
        'Medium': [
            "Explain the difference between context switching in threads vs processes.",
            "What is cache coherence and why is it important in multi-core OS?",
            "Explain CPU scheduling. Compare Round Robin with Shortest Job First."
        ],
        'Hard': [
            "How does virtual memory translation (TLB) work? What is a TLB miss?",
            "Describe the dining philosophers problem and how to prevent it programmatically.",
            "Explain the differences between monolithic, microkernel, and hybrid OS architectures."
        ]
    },
    'CN': {
        'Easy': [
            "What are the layers of the OSI model? Name them in order.",
            "Explain the difference between TCP and UDP protocols.",
            "What is DNS (Domain Name System) and how does it work?"
        ],
        'Medium': [
            "Explain the TCP three-way handshake and connection termination.",
            "What is the difference between HTTP and HTTPS? How does SSL/TLS secure connection?",
            "Explain IP addressing. What is the difference between IPv4 and IPv6?"
        ],
        'Hard': [
            "Describe how TCP congestion control mechanisms (like slow start and congestion avoidance) work.",
            "Explain the Border Gateway Protocol (BGP) and how routing is decided on the internet scale.",
            "How does a Content Delivery Network (CDN) resolve latency and handle caching headers?"
        ]
    },
    'Aptitude': {
        'Easy': [
            "A person crosses a 600m long street in 5 minutes. What is his speed in km/hr?",
            "If a card is drawn from a well-shuffled pack of 52 cards, what is the probability of getting a queen?",
            "The average of 5 consecutive numbers is 20. What is the largest of these numbers?"
        ],
        'Medium': [
            "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, what fraction of work is left?",
            "Two trains running in opposite directions cross a man standing on the platform in 27s and 17s. What is the ratio of their speeds?",
            "Find the compound interest on Rs. 10,000 for 2 years at 10% per annum, compounded annually."
        ],
        'Hard': [
            "A boat travels 24 km upstream and 28 km downstream in 6 hours. It travels 30 km upstream and 21 km downstream in 6.5 hours. Find the speed of the boat in still water.",
            "Three pipes A, B, and C can fill a tank in 6 hours. After working together for 2 hours, C is closed and A and B fill it in 7 hours. How much time will C take alone?",
            "A sum of money double itself in 4 years at compound interest. In how many years will it become 8 times itself?"
        ]
    },
    'Data Analytics': {
        'Easy': [
            "What is the difference between qualitative and quantitative data?",
            "Explain what a histogram is and when it should be used.",
            "What is the difference between mean, median, and mode?"
        ],
        'Medium': [
            "What is outlier detection? Name two techniques to find outliers in data.",
            "Explain what a correlation coefficient is and how to interpret it.",
            "Describe the difference between descriptive, predictive, and prescriptive analytics."
        ],
        'Hard': [
            "Explain the concept of A/B testing, statistical significance, and p-values.",
            "How do you deal with missing data values in large datasets before running analytics?",
            "Describe dimension reduction. Compare Principal Component Analysis (PCA) with t-SNE."
        ]
    },
    'Machine Learning': {
        'Easy': [
            "What is the difference between supervised and unsupervised machine learning?",
            "Describe what overfitting is and how it can be prevented.",
            "Explain the difference between classification and regression."
        ],
        'Medium': [
            "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization.",
            "What is a confusion matrix? Explain Precision, Recall, and F1-score.",
            "Describe how a Support Vector Machine (SVM) finds the optimal hyperplane."
        ],
        'Hard': [
            "Explain the bias-variance tradeoff in detail. How do ensemble methods impact it?",
            "How does a gradient boosting machine (like XGBoost) work compared to a Random Forest?",
            "Explain the architecture of a deep neural network and how backpropagation works."
        ]
    },
    'React': {
        'Easy': [
            "What is the Virtual DOM and how does React use it to render pages?",
            "Explain the difference between state and props in React.",
            "What is JSX and how is it compiled by browsers?"
        ],
        'Medium': [
            "Explain the React component lifecycle and how hooks map to it.",
            "What is context in React, and when should you use it over props drilling?",
            "Describe React.memo, useMemo, and useCallback. How do they optimize performance?"
        ],
        'Hard': [
            "Describe React's reconciliation algorithm (React Fiber) and how batching works.",
            "How would you design a custom hook to handle API loading, success, error, and caching?",
            "Explain the differences between SSR (Server-Side Rendering) and Hydration in React."
        ]
    },
    'Python': {
        'Easy': [
            "What is the difference between a list and a tuple in Python?",
            "What are decorators in Python and when do you use them?",
            "Explain how memory management and garbage collection work in Python."
        ],
        'Medium': [
            "What are generators and yield in Python? How do they improve memory footprint?",
            "Explain the difference between shallow copy and deep copy in Python.",
            "Describe the Global Interpreter Lock (GIL) and how it affects multithreading."
        ],
        'Hard': [
            "Explain Python's method resolution order (MRO) under multiple inheritance.",
            "What are metaclasses in Python and how do you customize class creation?",
            "Describe asynchronous programming in Python using async/await and event loops."
        ]
    },
    'Java': {
        'Easy': [
            "Explain the difference between JDK, JRE, and JVM.",
            "What is the difference between String, StringBuffer, and StringBuilder?",
            "Explain the stack vs heap memory structure in Java execution."
        ],
        'Medium': [
            "Explain Java's Garbage Collection mechanism and the generations of Heap memory.",
            "What is the difference between abstract classes and interfaces in Java 8 and beyond?",
            "Explain exception handling in Java. Compare Checked vs Unchecked exceptions."
        ],
        'Hard': [
            "Explain how Java's HashMap works internally, including treeifying nodes on collisions.",
            "What is Java's Memory Model (JMM)? Explain volatile, synchronized, and locks.",
            "Describe Java reflection and annotation processing. What are the performance costs?"
        ]
    },
    'SQL': {
        'Easy': [
            "What is the difference between WHERE and HAVING clauses in SQL?",
            "What is the difference between UNION and UNION ALL?",
            "Explain what primary key, unique key, and foreign key are."
        ],
        'Medium': [
            "Explain database indexes. How do they work, and what are their write performance costs?",
            "What are window functions in SQL? Give examples like ROW_NUMBER and DENSE_RANK.",
            "Explain the difference between subqueries and CTEs (Common Table Expressions)."
        ],
        'Hard': [
            "How do SQL transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) prevent anomalies?",
            "Explain query optimization. How would you analyze a query execution plan to resolve a slow join?",
            "What are triggers and stored procedures? Discuss their maintenance and scalability issues in distributed systems."
        ]
    }
}

def generate_multi_question(category: str, difficulty: str, previous_questions: list) -> str:
    # Use OpenAI API if available
    try:
        if openai_client and OPENAI_API_KEY and "REPLACE" not in OPENAI_API_KEY:
            prompt = (
                f"Create a unique {difficulty.lower()} mock interview question about '{category}'.\n"
                f"Ensure the question is suitable for a technical interview and encourages detailed answers.\n"
            )
            if previous_questions:
                prompt += f"IMPORTANT: Do NOT repeat or closely resemble these previously asked questions in this session: {previous_questions}\n"
            
            response = openai_client.chat.completions.create(
                model='gpt-3.5-turbo',
                messages=[
                    {'role': 'system', 'content': 'You are a professional mock interviewer.'},
                    {'role': 'user', 'content': prompt},
                ],
                max_tokens=200,
                temperature=0.8,
            )
            question = response.choices[0].message.content.strip()
            if question:
                return question
    except Exception as e:
        print(f"[AI Service] OpenAI generate_multi_question failed: {e}. Using pre-defined bank.")
    
    # Fallback to local question bank
    category_clean = category if category in QUESTION_BANK else 'Technical'
    diff_clean = difficulty if difficulty in ['Easy', 'Medium', 'Hard'] else 'Medium'
    
    choices = QUESTION_BANK[category_clean][diff_clean]
    # Filter choices to avoid previous questions if possible
    filtered_choices = [q for q in choices if q not in previous_questions]
    
    if not filtered_choices:
        filtered_choices = choices # reset if all are exhausted
        
    import random
    return random.choice(filtered_choices)


@interview_bp.route('/video/<filename>')
def stream_video(filename):
    filepath = os.path.join(current_app.root_path, 'static', 'uploads', filename)
    if not os.path.exists(filepath):
        return jsonify({'message': 'Video not found'}), 404
        
    file_size = os.path.getsize(filepath)
    range_header = request.headers.get('Range', None)
    
    # Simple Content-Type matching
    mimetype = 'video/webm'
    if filename.endswith('.mp4'):
        mimetype = 'video/mp4'
        
    if not range_header:
        # Stream whole file
        def generate():
            with open(filepath, 'rb') as f:
                yield from f
        return Response(
            generate(),
            mimetype=mimetype,
            headers={
                'Content-Length': str(file_size),
                'Accept-Ranges': 'bytes'
            }
        )
        
    # Range-header parsing, e.g. "bytes=100-200"
    try:
        byte_range = range_header.replace('bytes=', '').split('-')
        start = int(byte_range[0])
        end = int(byte_range[1]) if byte_range[1] else file_size - 1
    except Exception:
        return Response('Invalid Range Header', status=400)
        
    if start >= file_size or end >= file_size:
        return Response('Range Not Satisfiable', status=416)
        
    chunk_size = end - start + 1
    
    def generate_range():
        with open(filepath, 'rb') as f:
            f.seek(start)
            remaining = chunk_size
            while remaining > 0:
                chunk = f.read(min(remaining, 16384))
                if not chunk:
                    break
                yield chunk
                remaining -= len(chunk)
                
    headers = {
        'Content-Range': f'bytes {start}-{end}/{file_size}',
        'Accept-Ranges': 'bytes',
        'Content-Length': str(chunk_size),
        'Content-Type': mimetype
    }
    return Response(generate_range(), status=206, headers=headers)


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
        'status': 'in_progress',
        'questions': [],
        'answers': [],
        'expected': [],
        'scores': [],
        'feedbacks': [],
        'videos': [],
        'current_question_index': 0,
        'max_questions': 3, # Let's support 3 questions per session
        'created_at': datetime.datetime.utcnow().isoformat(),
    }
    result = db.interviews.insert_one(session)
    return jsonify({
        'session_id': str(result.inserted_id),
        'max_questions': 3
    })


@interview_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_question():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'message': 'Session id required.'}), 400

    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Session not found.'}), 404

    # If first question not generated, generate it
    if not session.get('questions'):
        q_text = generate_multi_question(session['type'], session['difficulty'], [])
        db.interviews.update_one(
            {'_id': ObjectId(session_id)},
            {
                '$push': {'questions': q_text},
                '$set': {'status': 'in_progress'}
            }
        )
        return jsonify({'question': q_text, 'index': 0})
        
    curr_idx = session.get('current_question_index', 0)
    # Check if we need to return a generated question or generate next
    if curr_idx < len(session['questions']):
        return jsonify({
            'question': session['questions'][curr_idx],
            'index': curr_idx
        })
    else:
        # Generate next question dynamically
        q_text = generate_multi_question(session['type'], session['difficulty'], session['questions'])
        db.interviews.update_one(
            {'_id': ObjectId(session_id)},
            {'$push': {'questions': q_text}}
        )
        return jsonify({
            'question': q_text,
            'index': curr_idx
        })


@interview_bp.route('/next_question', methods=['POST'])
@jwt_required()
def next_question():
    payload = request.get_json(force=True)
    session_id = payload.get('session_id')
    if not session_id:
        return jsonify({'message': 'Session id required.'}), 400
        
    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Session not found.'}), 404
        
    curr_idx = session.get('current_question_index', 0)
    max_q = session.get('max_questions', 3)
    
    if curr_idx >= max_q:
        return jsonify({'ended': True, 'message': 'Interview has already completed.'})
        
    # Generate new question that does not repeat
    q_text = generate_multi_question(session['type'], session['difficulty'], session.get('questions', []))
    
    db.interviews.update_one(
        {'_id': ObjectId(session_id)},
        {'$push': {'questions': q_text}}
    )
    
    return jsonify({
        'ended': False,
        'question': q_text,
        'index': len(session.get('questions', [])) # index is length after push
    })


@interview_bp.route('/answer', methods=['POST'])
@jwt_required()
def submit_answer():
    session_id = request.form.get('session_id')
    answer = request.form.get('answer') or ''
    question = request.form.get('question')
    if not session_id or not question:
        return jsonify({'message': 'Session and question are required.'}), 400

    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Interview session not found.'}), 404

    # Handle optional audio recording transcript
    audio_text = None
    if 'audio' in request.files:
        audio = request.files['audio']
        audio_text = transcribe_audio(audio)
        answer = f"{answer}\n{audio_text}".strip()

    # Generate expected response & calculate AI evaluation
    expected = generate_expected_answer(question, session['role'])
    similarity = score_answer(expected, answer)
    feedback_payload = create_feedback(question, answer, similarity)

    # Calculate local confidence scoring
    confidence_score = int(min(100, max(50, round(similarity * 105))))
    # AI confidence adjustments if confidence signals appear in text
    answer_lower = answer.lower()
    hesitations = ["um", "uh", "i don't know", "like", "actually"]
    confidence_hits = sum(1 for h in hesitations if h in answer_lower)
    confidence_score = max(30, confidence_score - (confidence_hits * 5))

    # Add score fields to payload
    feedback_payload['confidence_score'] = confidence_score

    # Handle video files (Cloudinary or local static folder)
    video_url = None
    if 'video' in request.files:
        video_file = request.files['video']
        try:
            if os.getenv('CLOUDINARY_URL'):
                upload_result = cloudinary.uploader.upload(video_file, resource_type="video", folder="interviews")
                video_url = upload_result.get('secure_url')
            else:
                import tempfile
                import uuid
                from backend.utils.video_compression import compress_video_ffmpeg
                
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                
                ext = 'webm'
                if video_file.filename and '.' in video_file.filename:
                    ext = video_file.filename.rsplit('.', 1)[1].lower()
                elif video_file.content_type == 'video/mp4':
                    ext = 'mp4'
                
                temp_filename = f"temp_raw_{str(uuid.uuid4())}.{ext}"
                temp_filepath = os.path.join(tempfile.gettempdir(), temp_filename)
                video_file.save(temp_filepath)
                
                # Compress to mp4 aggressively
                final_filename = f"{session_id}_{len(session.get('answers', []))}.mp4"
                final_filepath = os.path.join(upload_dir, final_filename)
                
                success = compress_video_ffmpeg(temp_filepath, final_filepath)
                
                if success:
                    video_url = f"{request.host_url}interview/video/{final_filename}"
                    print(f"Compressed Video saved locally to {final_filepath} -> {video_url}")
                else:
                    # Fallback to saving raw if compression failed
                    import shutil
                    final_filename_raw = f"{session_id}_{len(session.get('answers', []))}.{ext}"
                    final_filepath_raw = os.path.join(upload_dir, final_filename_raw)
                    shutil.move(temp_filepath, final_filepath_raw)
                    video_url = f"{request.host_url}interview/video/{final_filename_raw}"
                    print(f"Compression failed, raw video saved locally to {final_filepath_raw} -> {video_url}")
                
                # Cleanup temp file if it still exists
                if os.path.exists(temp_filepath):
                    try:
                        os.remove(temp_filepath)
                    except:
                        pass
        except Exception as e:
            print(f"Error uploading/saving/compressing video file: {e}")

    # Build response dictionary
    ans_obj = {
        'question': question,
        'answer': answer,
        'expected': expected,
        'feedback': feedback_payload['feedback'],
        'technical_score': feedback_payload['technical_score'],
        'communication_score': feedback_payload['communication_score'],
        'confidence_score': confidence_score,
        'video_url': video_url,
        'audio_transcript': audio_text,
        'created_at': datetime.datetime.utcnow().isoformat()
    }

    curr_idx = session.get('current_question_index', 0) + 1
    max_q = session.get('max_questions', 3)
    ended = curr_idx >= max_q

    # Update database
    update_fields = {
        'current_question_index': curr_idx
    }
    
    if ended:
        update_fields['status'] = 'completed'
        update_fields['completed_at'] = datetime.datetime.utcnow().isoformat()

    db.interviews.update_one(
        {'_id': ObjectId(session_id)},
        {
            '$push': {
                'questions_details': ans_obj,
                # maintain flat structure fallbacks
                'answers': answer,
                'expected_answers': expected,
                'scores': {
                    'technical': feedback_payload['technical_score'],
                    'communication': feedback_payload['communication_score'],
                    'confidence': confidence_score
                },
                'feedbacks': feedback_payload['feedback'],
                'videos': video_url if video_url else ""
            },
            '$set': update_fields
        }
    )

    # Fetch updated session to calculate averages for flat compatibility fields
    if ended:
        updated_session = db.interviews.find_one({'_id': ObjectId(session_id)})
        details = updated_session.get('questions_details', [])
        if details:
            avg_tech = int(sum(d.get('technical_score', 0) for d in details) / len(details))
            avg_comm = int(sum(d.get('communication_score', 0) for d in details) / len(details))
            avg_conf = int(sum(d.get('confidence_score', 0) for d in details) / len(details))
            
            # Save final flat score parameters on document root
            db.interviews.update_one(
                {'_id': ObjectId(session_id)},
                {
                    '$set': {
                        'question': details[0].get('question', ''),
                        'answer': details[0].get('answer', ''),
                        'expected': details[0].get('expected', ''),
                        'feedback': f"Average Session Summary: Tech: {avg_tech}, Communication: {avg_comm}, Confidence: {avg_conf}. Detailed: " + details[0].get('feedback', ''),
                        'technical_score': avg_tech,
                        'communication_score': avg_comm,
                        'similarity': avg_tech,
                        'video_url': next((d.get('video_url') for d in details if d.get('video_url')), None)
                    }
                }
            )

    feedback_payload['ended'] = ended
    return jsonify(feedback_payload)


@interview_bp.route('/end', methods=['POST'])
@jwt_required()
def end_interview():
    payload = request.get_json(force=True)
    session_id = payload.get('session_id')
    if not session_id:
        return jsonify({'message': 'Session id required.'}), 400
        
    session = db.interviews.find_one({'_id': ObjectId(session_id)})
    if not session:
        return jsonify({'message': 'Session not found.'}), 404
        
    db.interviews.update_one(
        {'_id': ObjectId(session_id)},
        {
            '$set': {
                'status': 'completed',
                'completed_at': datetime.datetime.utcnow().isoformat()
            }
        }
    )
    return jsonify({'message': 'Interview session completed successfully.'})


@interview_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = ObjectId(get_jwt_identity())
    interviews = list(db.interviews.find({'user_id': user_id, 'status': 'completed'}).sort('completed_at', -1))
    
    adapted_interviews = []
    for item in interviews:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        
        # Adaptation layer for backward compatibility
        if 'questions_details' not in item or not item['questions_details']:
            # Create a mock detailed element for single-question history entries
            legacy_obj = {
                'question': item.get('question', 'Mock Question'),
                'answer': item.get('answer', 'Mock Answer'),
                'expected': item.get('expected', ''),
                'feedback': item.get('feedback', 'No feedback provided.'),
                'technical_score': item.get('technical_score', 0),
                'communication_score': item.get('communication_score', 0),
                'confidence_score': 80,
                'video_url': item.get('video_url'),
                'created_at': item.get('completed_at', item.get('created_at'))
            }
            item['questions_details'] = [legacy_obj]
            
        adapted_interviews.append(item)
        
    return jsonify(adapted_interviews)
