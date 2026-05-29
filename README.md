# 🌌 SmartHire AI — Next-Gen AI Mock Interview & Coding Arena Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-2.x-lightgrey.svg?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-orange.svg?style=for-the-badge&logo=openai)](https://openai.com/)

An intelligent, glassmorphism-designed SaaS platform powered by OpenAI, advanced NLP models, and real-time audio/video processing. It conducts automated technical mock interviews, compiles multi-language algorithms, compresses candidate session recordings, and serves exhaustive cognitive feedback.

**[Explore API Docs](file:///Users/dskumar/SmartHire_AI/backend/API_DOCS.md) • [View Structure](#-project-structure) • [Start Practicing](#-installation--setup-guide)**

</div>

---

## 📖 Project Overview

### The Problem
Traditional interview prep tools are either passive (reading Q&As) or highly fragmented (one site for coding, another for behavioral video practice). Candidates lack objective, automated, real-time analytics concerning their technical precision, communication flow, and psychological confidence.

### The Solution
**SmartHire AI** merges code execution, audio speech-to-text behavioral parsing, video recording with automated local FFmpeg compression, and SpaCy NLP semantic evaluation into a single, cohesive, premium Apple iOS 26 glassmorphism dashboard. 

### Key Advantages
*   **Contextual AI Adaptation:** The platform reads uploaded candidate resumes, parses core skills, and tailors mock questions to target roles dynamically.
*   **Multi-Dimensional Scoring:** Scores candidates out of 100 on Technical Depth, Communication Delivery, and Confidence/Pacing metrics.
*   **Optimized Video Pipeline:** Records mock session video natively and compresses files using a multi-threaded Python-FFmpeg subprocess script before saving, reducing storage footprint by up to 90% without losing playback quality.

---

## ✨ Features

### 🎙️ Mock Interview Studio
*   **Role-Specific Generation:** Supports custom target roles (e.g., *Frontend Architect*, *ML Engineer*).
*   **Speech & Text Inputs:** Record responses via microphone. Integrates OpenAI Whisper for automated speech-to-text transcriptions.
*   **Evaluation Engine:** Parses text response similarities against generated benchmarks using the `sentence-transformers/all-MiniLM-L6-v2` semantic model.

### 🐍 Multi-Language Coding Arena
*   **Integrated Monaco Editor:** Visual Studio Code-grade interactive editor.
*   **Local Code Compiler:** Subprocess sandboxing supporting **Python**, **JavaScript (Node.js)**, **C (GCC)**, **C++ (G++)**, and **Java**.
*   **Pre-built Test Cases:** Automatically parses test outputs and compares inputs against expected outputs.

### 📉 Candidate Analytics Dashboard
*   **Performance Trajectory:** Responsive AreaCharts plotting score history.
*   **Activity Metrics:** Completed interview counts, streak days, and average similarity rates.
*   **Topic Focus Cards:** Highlights identified weakness modules (e.g., *Algorithms*, *System Design*).

### 📑 Intelligent Resume Parser
*   **PDF Extraction:** Upload and extract metadata from PDF resumes.
*   **SpaCy NER Integration:** Identifies and registers skills, projects, and educational metadata.

### ⚙️ Admin Console
*   **User Directory Panel:** Search, filter, and review profiles of registered users.
*   **Metrics Oversight:** Monitor system-wide interview activity.

### 🎨 Apple iOS 26 Glassmorphic Design
*   **Adaptive Dark & Light Modes:** Smooth animated transitions with carefully balanced contrast.
*   **Micro-Animations:** Framer Motion-based transitions, hover state scaling, and blur glow backdrops.

---

## 📸 Screenshots Section

<div align="center">
  <table style="border: none;">
    <tr>
      <td width="50%"><p align="center"><b>Dashboard (Dark Glassmorphism)</b></p><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Dashboard Dark Mode" style="border-radius:12px;"/></td>
      <td width="50%"><p align="center"><b>Interview Studio (Light Glassmorphism)</b></p><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" alt="Interview Studio Light Mode" style="border-radius:12px;"/></td>
    </tr>
    <tr>
      <td width="50%"><p align="center"><b>Coding practice Arena</b></p><img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" alt="Coding practice" style="border-radius:12px;"/></td>
      <td width="50%"><p align="center"><b>Candidate Analytics Summary</b></p><img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" alt="Analytics Summary" style="border-radius:12px;"/></td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack

### Frontend
*   **Core:** React 18 (TypeScript), Vite
*   **Styling:** Tailwind CSS, Custom Glassmorphism System
*   **Animations:** Framer Motion, Lucide Icons
*   **Data Vis:** Recharts (responsive charting)
*   **Peripherals:** Monaco Code Editor, React Webcam

### Backend
*   **Engine:** Flask (Python 3.12)
*   **Authentication:** JWT (Flask-JWT-Extended)
*   **CORS Management:** Flask-CORS
*   **NLP Pipeline:** SpaCy (Entity Extraction), Sentence-Transformers (Semantic Similarity)
*   **Audio/Video Utility:** FFmpeg (Subprocess-based compression & encoding)

### Database
*   **DBMS:** MongoDB Atlas
*   **Driver:** PyMongo

---

## 🚀 Installation & Setup Guide

Ensure you have [Node.js v18+](https://nodejs.org/), [Python 3.12](https://www.python.org/downloads/), and [FFmpeg](https://ffmpeg.org/download.html) installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/shraddhajain0989/SmartHire_AI.git
cd SmartHire_AI
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your credentials:
```ini
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smarthire
JWT_SECRET=your-strong-random-key-here
OPENAI_API_KEY=sk-your-openai-api-key
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
TRANSFORMER_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### Step 3: Setup Virtual Environment & Install Backend Dependencies
```bash
# Create virtual environment
python3 -m venv backend/venv

# Activate virtual environment
# On macOS/Linux:
source backend/venv/bin/activate
# On Windows:
backend\venv\Scripts\activate

# Install required python packages
pip install -r requirements.txt
```

### Step 4: Setup Database & Run Seeding
Initialize the database questions and setup the default Administrator profile:
```bash
PYTHONPATH=. python backend/db_init.py
PYTHONPATH=. python backend/seed.py
```
*Default Admin Credentials:*
*   **Username / Email:** `admin@smarthire.ai`
*   **Password:** `AdminPass123!`

### Step 5: Install Frontend Dependencies
Open a new terminal window, navigate to the `frontend` folder, and install package dependencies:
```bash
cd frontend
npm install
```

### Step 6: Run Application Servers

#### Run Backend (Terminal 1)
Make sure your Python virtual environment is active in the project root directory:
```bash
PYTHONPATH=. python -m backend.app
```
*The Flask API server runs on http://localhost:5050.*

#### Run Frontend (Terminal 2)
Navigate to the `frontend` directory and start the Vite dev server:
```bash
cd frontend
npm run dev
```
*The dev server runs on http://localhost:5173.*

---

## 🔑 Environment Variables

The project uses a central configuration file. The variables configured in `.env` are:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `MONGO_URI` | Connection URI for the MongoDB Database cluster. | `mongodb://localhost:27017/smarthire` |
| `JWT_SECRET` | Secret key utilized to sign & verify JSON Web Tokens. | `super-secret-change-me` |
| `OPENAI_API_KEY` | Key for GPT-4o question generation and audio transcripts. | *None* |
| `CORS_ORIGINS` | Permitted browser ports separated by commas. | `http://localhost:5173,http://localhost:4173` |
| `TRANSFORMER_MODEL` | Hugging Face NLP model used for similarity checking. | `sentence-transformers/all-MiniLM-L6-v2` |

---

## 📂 Project Structure

```
SmartHire_AI/
├── backend/
│   ├── models/            # Database schema mappings & definitions
│   ├── routes/            # Flask API endpoint endpoints (auth, coding, analytics...)
│   ├── services/          # Business logic layers (OpenAI interfaces, resume NLP)
│   ├── static/            # Static assets and upload repositories (resumes, webm clips)
│   │   ├── profiles/      # User avatar image uploads
│   │   └── uploads/       # Raw and compressed interview video files
│   ├── utils/             # Helper utilities (FFmpeg multi-thread compression)
│   ├── app.py             # Main entry point for Flask API Gateway
│   ├── config.py          # Environment configuration loading script
│   ├── db_init.py         # DB initializer & core database collection setup
│   └── seed.py            # System admin profile seeder
├── frontend/
│   ├── public/            # Static files & document samples
│   ├── src/
│   │   ├── components/    # Reusable layouts, charts, and video players
│   │   ├── hooks/         # Custom React hooks (auth interfaces)
│   │   ├── pages/         # Page components (Dashboard, Arena, Interview...)
│   │   ├── services/      # Axios request handlers for API interaction
│   │   ├── styles/        # Global stylesheet and custom glassmorphism styles
│   │   ├── App.tsx        # Router tree configuration
│   │   └── main.tsx       # Root React initialization mount script
│   ├── index.html         # Vite root entry template
│   ├── package.json       # Node package manager declarations
│   └── vite.config.ts     # Build configuration setup
├── requirements.txt       # Global Python packages
├── docker-compose.yml     # Containerized execution mapping
└── README.md              # Main system documentation
```

---

## 📡 REST API Summary

Full backend routes are documented inside the [API Documentation File](file:///Users/dskumar/SmartHire_AI/backend/API_DOCS.md). Key routes are highlighted below:

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | No | Creates a student account & returns a JWT token. |
| **POST** | `/auth/login` | No | Verifies credentials & logs user in. |
| **GET** | `/user/me` | Yes | Retrieves current user state. |
| **PUT** | `/user/profile` | Yes | Updates skills, target role, bio, or upload avatar. |
| **POST** | `/resume/upload` | Yes | Uploads a PDF resume and extracts keywords/summary. |
| **POST** | `/interview/start` | Yes | Initializes a mock interview session. |
| **GET** | `/interview/questions`| Yes | Feeds or generates next AI behavioral question. |
| **POST** | `/interview/answer` | Yes | Submits and evaluates question answer (optional audio). |
| **GET** | `/analytics/summary` | Yes | Gathers confidence, streak, and historical analytics. |
| **GET** | `/admin/users` | Admin | Lists registered candidate directory. |

---

## 💡 Usage Guide

1.  **Register/Login:** Set up a candidate profile. Fill in your preferred role and skills, or upload a resume to let AI extract them.
2.  **Start Mock Interview:** Go to the *Interview* tab, choose a category and difficulty level, and click *Start*.
3.  **Record Responses:** Enable your camera/microphone. Click *Start Recording* to answer using speech, then click *Save*.
4.  **Practice Code:** Go to the *Coding* tab, select an algorithm question, select your language, type your code, and click *Run Code*.
5.  **Review Dashboard:** Track your success margins, strengths, and weaknesses on the *Dashboard* and *Analytics* pages.

---

## 🚢 Deployment

### Frontend (Static Site Hosting)
The frontend is built using Vite and compiles to a standard SPA. You can build it for production and host it on **Vercel**, **Netlify**, or **AWS S3**:
```bash
cd frontend
npm run build
```
This outputs a production-ready bundle in `frontend/dist/`.

### Backend (WSGI Hosting)
You can deploy the Flask API using **Gunicorn** or **uWSGI** on platforms like **Render**, **Heroku**, or **AWS EC2**:
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:5050 backend.app:app
```

### Database
Setup a managed MongoDB instance on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), configure network access (IP whitelisting), and point the `MONGO_URI` to your connection string.

---

## 🔮 Future Improvements (Roadmap)
*   [ ] **Real-time Video Sentiment Analysis:** Evaluate facial expressions and stress levels during playback.
*   [ ] **Peer Coding Rooms:** Collaborative live coding interviews with web-socket boards.
*   [ ] **PDF Report Export:** Allow candidates to download structured performance reports.
*   [ ] **Interactive Calendar Booking:** Set up real-time interviews with human mentors.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork this repository.
2.  Create a feature branch: `git checkout -b feature/AmazingFeature`.
3.  Commit your changes: `git commit -m 'Add some AmazingFeature'`.
4.  Push to the branch: `git push origin feature/AmazingFeature`.
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

*   **Shraddha Jain**
    *   GitHub: [@shraddhajain0989](https://github.com/shraddhajain0989)
    *   Email: [shraddhajain0989@gmail.com](mailto:shraddhajain0989@gmail.com)
