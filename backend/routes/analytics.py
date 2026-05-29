from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from backend.utils.db import db
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/analytics')


@analytics_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    user_id = ObjectId(get_jwt_identity())
    
    # 1. Load attempts
    interviews = list(db.interviews.find({'user_id': user_id, 'status': 'completed'}).sort('completed_at', 1))
    coding_attempts = list(db.coding_attempts.find({'user_id': user_id}))
    mcq_attempts = list(db.mcq_attempts.find({'user_id': user_id}))
    verbal_attempts = list(db.verbal_attempts.find({'user_id': user_id}))
    
    # 2. Basic statistics
    total_interviews = len(interviews)
    coding_solved = len([c for c in coding_attempts if c.get('passed')])
    total_mcqs = len(mcq_attempts)
    mcq_passed = len([m for m in mcq_attempts if m.get('score', 0) > 0])
    
    # Average score computations
    avg_interview_score = 0
    if total_interviews > 0:
        avg_interview_score = int(sum(i.get('technical_score', i.get('similarity', 0)) for i in interviews) / total_interviews)
        
    avg_coding_accuracy = 0
    if len(coding_attempts) > 0:
        avg_coding_accuracy = int((coding_solved / len(coding_attempts)) * 100)
        
    avg_mcq_accuracy = 0
    if total_mcqs > 0:
        avg_mcq_accuracy = int((mcq_passed / total_mcqs) * 100)
        
    # 3. Calculate Streaks & Consistency Heatmap
    all_timestamps = []
    # Collect completion timestamps from all activities
    for i in interviews:
        all_timestamps.append(i.get('completed_at') or i.get('created_at'))
    for c in coding_attempts:
        all_timestamps.append(c.get('created_at'))
    for m in mcq_attempts:
        all_timestamps.append(m.get('completed_at'))
    for v in verbal_attempts:
        all_timestamps.append(v.get('created_at'))
        
    # Convert to dates and unique sort
    unique_dates = set()
    for ts in all_timestamps:
        if ts:
            try:
                date_str = ts.split('T')[0]
                unique_dates.add(date_str)
            except Exception:
                pass
                
    sorted_dates = sorted(list(unique_dates), reverse=True)
    
    # Calculate current streak
    streak = 0
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    
    today_str = today.isoformat()
    yesterday_str = yesterday.isoformat()
    
    # If there are attempts, count backwards
    if sorted_dates:
        # Check if the streak is active (attempts made today or yesterday)
        if sorted_dates[0] in [today_str, yesterday_str]:
            streak = 1
            check_date = datetime.strptime(sorted_dates[0], "%Y-%m-%d").date()
            for date_str in sorted_dates[1:]:
                expected_prev = check_date - timedelta(days=1)
                prev_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                if prev_date == expected_prev:
                    streak += 1
                    check_date = prev_date
                elif prev_date < expected_prev:
                    break # gap in streak
        else:
            streak = 0 # Streak lost
            
    # Generate 90-day consistency heatmap
    heatmap = []
    start_date = today - timedelta(days=90)
    for d in range(91):
        curr_d = start_date + timedelta(days=d)
        curr_d_str = curr_d.isoformat()
        
        # Count activities on this day
        count = 0
        for ts in all_timestamps:
            if ts and ts.startswith(curr_d_str):
                count += 1
                
        heatmap.append({
            'date': curr_d_str,
            'count': count
        })
        
    # 4. Strength and Weakness Analysis by Topic
    topic_scores = {} # maps topic -> [scores]
    
    # Add coding attempt results (by category)
    for c in coding_attempts:
        cat = c.get('category', 'Algorithms')
        score = 100 if c.get('passed') else 0
        topic_scores.setdefault(cat, []).append(score)
        
    # Add MCQ attempt results
    for m in mcq_attempts:
        topic = m.get('topic', 'General')
        score = 100 if m.get('score', 0) > 0 else 0
        topic_scores.setdefault(topic, []).append(score)
        
    # Add Verbal attempts
    for v in verbal_attempts:
        topic = v.get('topic', 'Verbal')
        score = v.get('technical_score', 50)
        topic_scores.setdefault(topic, []).append(score)
        
    # Evaluate topic statistics
    skills_radar = []
    weaknesses = []
    strengths = []
    
    # Default skills if no data exists
    default_topics = ['Algorithms', 'DBMS', 'OOPs', 'Operating Systems', 'CN', 'React', 'Python']
    for t in default_topics:
        if t not in topic_scores:
            topic_scores[t] = [60] # default baseline
            
    for topic, scores in topic_scores.items():
        avg = int(sum(scores) / len(scores))
        skills_radar.append({'subject': topic, 'A': avg, 'fullMark': 100})
        if avg < 60:
            weaknesses.append(topic)
        elif avg >= 75:
            strengths.append(topic)
            
    # 5. Weakest topic & communication progress warnings
    weakest_topic = min(skills_radar, key=lambda x: x['A'])['subject'] if skills_radar else "DBMS"
    ai_insight = f"Your weakest topic is {weakest_topic}. We recommend practicing custom MCQ quizzes or review coding questions on this topic."
    
    # Generate progress remarks
    if total_interviews > 1:
        prev_comm = interviews[-2].get('communication_score', 0)
        curr_comm = interviews[-1].get('communication_score', 0)
        diff = curr_comm - prev_comm
        if diff > 0:
            ai_insight += f" Excellent! Your communication score improved by {diff}% in your last session."
        elif diff < 0:
            ai_insight += f" Warning: Your communication score dropped by {abs(diff)}% in your last session. Focus on verbal delivery!"
            
    if avg_coding_accuracy < 50 and len(coding_attempts) > 3:
        ai_insight += " Your coding accuracy dropped this week. Try solving easy topic-wise challenges to build confidence."
        
    # Score trend data
    trend_data = []
    if total_interviews > 0:
        trend_data = [{'session': f'S{idx+1}', 'score': i.get('technical_score', i.get('similarity', 0))} for idx, i in enumerate(interviews[-8:])]
    else:
        trend_data = [{'session': 'S1', 'score': 45}, {'session': 'S2', 'score': 60}, {'session': 'S3', 'score': 75}]

    # Weekly progress distribution
    weekly_breakdown = [
        {'name': 'Coding', 'value': len(coding_attempts)},
        {'name': 'MCQ', 'value': len(mcq_attempts)},
        {'name': 'Verbal', 'value': len(verbal_attempts)},
        {'name': 'Interviews', 'value': total_interviews}
    ]
    # Filter breakdown elements to guarantee at least value of 1 for pie charts to render safely
    for w in weekly_breakdown:
        if w['value'] == 0:
            w['value'] = 0.1

    return jsonify({
        'average_similarity': avg_interview_score,
        'completed_interviews': total_interviews,
        'coding_solved': coding_solved,
        'coding_accuracy': avg_coding_accuracy,
        'mcq_accuracy': avg_mcq_accuracy,
        'streak': streak,
        'trend': trend_data,
        'skills': skills_radar,
        'practice_breakdown': weekly_breakdown,
        'heatmap': heatmap,
        'weak_topics': weaknesses,
        'strong_topics': strengths,
        'ai_insight': ai_insight
    })
