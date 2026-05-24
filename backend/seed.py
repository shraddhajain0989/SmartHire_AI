import bcrypt
from datetime import datetime
from backend.utils.db import db

ADMIN_EMAIL = 'admin@smarthire.ai'
ADMIN_PASSWORD = 'AdminPass123!'

if __name__ == '__main__':
    existing = db.users.find_one({'email': ADMIN_EMAIL})
    if existing:
        print('Admin user already exists')
    else:
        password_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
        db.users.insert_one({
            'name': 'SmartHire Admin',
            'email': ADMIN_EMAIL,
            'password': password_hash,
            'role': 'admin',
            'created_at': datetime.utcnow().isoformat(),
        })
        print('Seeded admin user:', ADMIN_EMAIL)
