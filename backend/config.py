import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/smarthire')
JWT_SECRET = os.getenv('JWT_SECRET', 'super-secret-change-me')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
CORS_ORIGINS = [origin.strip() for origin in os.getenv('CORS_ORIGINS', 'http://localhost:4173').split(',') if origin.strip()]
TRANSFORMER_MODEL = os.getenv('TRANSFORMER_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
