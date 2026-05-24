# SmartHire AI Backend API Documentation

## Authentication

### POST /auth/register
Create a new user.

Request body:
- name
- email
- password

Response:
- access_token

### POST /auth/login
Authenticate with email and password.

Request body:
- email
- password

Response:
- access_token

## User

### GET /user/me
Get current authenticated user profile.

Headers:
- Authorization: Bearer <token>

## Resume

### POST /resume/upload
Upload a PDF resume.

Form-data:
- resume: file (application/pdf)

Response:
- summary
- skills
- projects

## Interview

### POST /interview/start
Start a new interview session.

Request body:
- type
- role
- difficulty

Response:
- session_id

### GET /interview/questions
Fetch or generate the next AI question.

Query parameters:
- session_id

Response:
- question

### POST /interview/answer
Submit a response for evaluation.

Form-data:
- session_id
- question
- answer
- audio (optional file)

Response:
- technical_score
- communication_score
- similarity
- feedback

## Analytics

### GET /analytics/summary
Get student analytics summary.

Response fields:
- interview_count
- confidence_score
- average_similarity
- completed_interviews
- trend
- weak_topics
- skills

## Admin

### GET /admin/users
List all registered users.

Headers:
- Authorization: Bearer <token>

Only accessible to admin users.
