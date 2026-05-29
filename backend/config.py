import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/smarthire')
JWT_SECRET = os.getenv('JWT_SECRET', 'super-secret-change-me')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
TRANSFORMER_MODEL = os.getenv('TRANSFORMER_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')

# Hardcode known production origins + any additional ones from env var
# This ensures CORS works even if env var is missing/wrong
_env_origins = [o.strip() for o in os.getenv('CORS_ORIGINS', '').split(',') if o.strip()]

CORS_ORIGINS = list(dict.fromkeys([
    'https://smarthire-ai-three.vercel.app',   # stable Vercel production URL
    'http://localhost:5173',                    # Vite dev server
    'http://localhost:4173',                    # Vite preview
    'http://localhost:3000',                    # Next.js dev
    *_env_origins,                              # any extras from Render env var
]))
