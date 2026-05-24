import certifi
from pymongo import MongoClient
from backend.config import MONGO_URI

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())

try:
    db = client.get_database()
except Exception:
    db = client['smarthire']

