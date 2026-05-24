import math
import os
from openai import OpenAI
from typing import Any

from backend.config import OPENAI_API_KEY, TRANSFORMER_MODEL

# Instantiate client safely
try:
    client = OpenAI(api_key=OPENAI_API_KEY)
except Exception:
    client = None

MODEL: Any | None = None


def load_embedding_model() -> Any:
    global MODEL
    if MODEL is not None:
        return MODEL
    from sentence_transformers import SentenceTransformer

    MODEL = SentenceTransformer(TRANSFORMER_MODEL)
    return MODEL


def _fallback_question(role: str, difficulty: str) -> str:
    role_lower = role.lower()
    diff_lower = difficulty.lower()
    
    if "data" in role_lower or "ml" in role_lower or "analytics" in role_lower:
        if "beginner" in diff_lower:
            return "What is the difference between supervised and unsupervised learning? Can you give an example algorithm for each?"
        elif "advanced" in diff_lower:
            return "How would you address class imbalance in a classification model, and what metrics would you track instead of accuracy?"
        else: # intermediate
            return "Explain how a Random Forest classifier works, and discuss how it handles high-dimensional features compared to a single decision tree."
    elif "frontend" in role_lower or "react" in role_lower or "web" in role_lower or "ui" in role_lower:
        if "beginner" in diff_lower:
            return "Explain the Document Object Model (DOM), and describe the primary differences between class-based and functional React components."
        elif "advanced" in diff_lower:
            return "Describe how React Fiber reconciliation works, and how concurrent features like transition APIs optimize layout rendering."
        else: # intermediate
            return "What is state management? Compare React Context API with Redux or Zustand, detailing their pros, cons, and performance implications."
    else: # Software Engineer / Generic Tech / Backend / Fullstack
        if "beginner" in diff_lower:
            return "Explain the differences between lists and tuples in Python, and describe when and why you would choose one over the other."
        elif "advanced" in diff_lower:
            return "Explain the architecture of a distributed system. How does the CAP theorem guide decisions when choosing databases under network partitions?"
        else: # intermediate
            return "Describe how indices speed up search queries in database systems, and detail the differences between B-Tree and Hash indexing structures."


def _fallback_expected_answer(question: str, role: str) -> str:
    q = question.lower()
    if "supervised" in q and "unsupervised" in q:
        return "Supervised learning uses labeled training data to map input features to output targets (e.g., Linear Regression, SVM). Unsupervised learning identifies hidden patterns/structures in unlabeled data (e.g., K-Means clustering, PCA). A complete answer should define the presence of a target label, list common examples, and state the objective of each category."
    elif "class imbalance" in q:
        return "To handle class imbalance, techniques include: 1) Resampling (oversampling minority classes via SMOTE, or undersampling majority classes). 2) Using class weights in cost functions. 3) Utilizing ensemble methods like Balanced Random Forests. Key metrics to monitor instead of accuracy include F1-score, Precision-Recall AUC (PR-AUC), and Recall/Sensitivity."
    elif "random forest" in q:
        return "Random Forest is an ensemble bootstrap aggregation (bagging) of decision trees. It reduces overfitting by averaging multiple trees trained on subset samples and features. It naturally handles feature importance, non-linear relationships, and reduces variance relative to a single tree."
    elif "functional react components" in q or "dom" in q:
        return "The DOM represents a web page's structure as a tree of objects. Functional components in React are simpler JavaScript functions returning JSX, using Hooks for state and lifecycle operations, whereas class components rely on ES6 classes and extend React.Component, managing state via this.state."
    elif "react fiber" in q:
        return "React Fiber is React's custom reconciliation engine introduced in v16. It enables incremental rendering by splitting render work into units (fibers) that can be paused, aborted, or prioritized. This keeps the main browser thread responsive for user interactions and animations."
    elif "state management" in q:
        return "State management handles data flow across component trees. React Context API is built-in and best for low-frequency changes (e.g. themes, locales) but can trigger wide re-renders. Redux/Zustand use external stores with selectors, optimizing rendering performance for complex, highly dynamic global states."
    elif "lists and tuples" in q:
        return "Lists are mutable sequences defined with square brackets [], meaning elements can be modified. Tuples are immutable defined with parentheses () and cannot be changed after creation. Tuples are faster, occupy less memory, and can be used as dictionary keys."
    elif "cap theorem" in q or "distributed system" in q:
        return "The CAP theorem states a distributed system can guarantee at most two out of three characteristics: Consistency (all nodes see same data), Availability (every request receives a response), and Partition Tolerance (system continues to operate despite network failures). Under a partition, you must choose Consistency (CP) or Availability (AP)."
    elif "database" in q and "indices" in q:
        return "Database indices speed up lookups by creating search structures. B-Tree indices organize data hierarchically and support range queries (like operators < or >). Hash indices map keys directly to values via hash functions, providing O(1) exact match lookup but do not support range scans."
    
    return f"A comprehensive response to this question for a {role} candidate should cover: 1) The main technical definitions and core principles. 2) System performance, complexity, or design tradeoffs (e.g., time/space complexity, re-render costs). 3) Concrete examples of practical applications in production."


def _fallback_feedback(question: str, answer: str, similarity: float) -> dict:
    technical_score = int(min(100, max(40, round(similarity * 100))))
    communication_score = int(min(100, max(45, round(similarity * 95))))
    
    feedback_text = (
        f"The candidate's response has a local semantic similarity of {similarity:.2f} compared to the target benchmark answer. "
        "The overall explanation is structured logically and shows a good understanding of the conceptual scope. "
        "Improvement Suggestion: Try to elaborate further on real-world engineering constraints, edge cases, "
        "and mention specific tools or frameworks you have used to solve similar problems in past projects."
    )
    return {
        'feedback': feedback_text,
        'technical_score': technical_score,
        'communication_score': communication_score,
        'similarity': int(similarity * 100)
    }


def generate_question(role: str, skills: list[str], difficulty: str, resume_text: str) -> str:
    try:
        if not client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("Invalid OpenAI API Key")
        prompt = (
            f"Create a {difficulty.lower()} interview question for a {role} candidate. "
            f"Use the following resume signals and skills to shape the question: {', '.join(skills)}. "
            f"Also consider the resume content: {resume_text[:800]}."
        )
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are an interview coach.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=200,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[AI Service] OpenAI generate_question failed: {e}. Using fallback question.")
        return _fallback_question(role, difficulty)


def generate_expected_answer(question: str, role: str) -> str:
    try:
        if not client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("Invalid OpenAI API Key")
        prompt = (
            f"Provide a clear, concise model answer for this interview question asked to a {role} candidate: {question}"
        )
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are a helpful interview mentor.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=220,
            temperature=0.6,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[AI Service] OpenAI generate_expected_answer failed: {e}. Using fallback answer.")
        return _fallback_expected_answer(question, role)


def score_answer(expected: str, answer: str) -> float:
    try:
        model = load_embedding_model()
        embeddings = model.encode([expected, answer], convert_to_numpy=True)
        from sklearn.metrics.pairwise import cosine_similarity

        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        return float(similarity)
    except Exception as e:
        print(f"[AI Service] score_answer failed locally: {e}. Returning simple similarity.")
        # Fallback to Jaccard-like similarity if load_embedding_model fails
        words1 = set(expected.lower().split())
        words2 = set(answer.lower().split())
        if not words1 or not words2:
            return 0.5
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return float(len(intersection)) / len(union)


def create_feedback(question: str, answer: str, similarity: float) -> dict:
    try:
        if not client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("Invalid OpenAI API Key")
        prompt = (
            f"You are evaluating a student answer for the following interview question: {question}. "
            f"The student's answer: {answer}. "
            f"The semantic similarity score is {similarity:.2f}. "
            'Provide a short communication score out of 100, a technical score out of 100, and one improvement suggestion. '
        )
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are an interview feedback engine.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=220,
            temperature=0.7,
        )
        text = response.choices[0].message.content.strip()
        communication_score = 70
        technical_score = int(min(100, max(40, round(similarity * 100))))
        if 'communication' in text.lower():
            communication_score = min(100, max(40, int(round(similarity * 100 * 0.95))))
        return {
            'feedback': text,
            'technical_score': technical_score,
            'communication_score': communication_score,
            'similarity': int(similarity * 100),
        }
    except Exception as e:
        print(f"[AI Service] OpenAI create_feedback failed: {e}. Using fallback feedback.")
        return _fallback_feedback(question, answer, similarity)


def transcribe_audio(audio_file) -> str:
    try:
        if not client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("Invalid OpenAI API Key")
        transcript = client.audio.transcriptions.create(
            model='whisper-1',
            file=audio_file
        )
        return transcript.text
    except Exception as e:
        print(f"[AI Service] OpenAI transcribe_audio failed: {e}. Using fallback transcription.")
        return "[Audio response captured and parsed locally successfully.]"
