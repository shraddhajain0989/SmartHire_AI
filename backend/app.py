import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.config import CORS_ORIGINS, JWT_SECRET
from backend.routes.auth import auth_bp
from backend.routes.user import user_bp
from backend.routes.resume import resume_bp
from backend.routes.interview import interview_bp
from backend.routes.analytics import analytics_bp
from backend.routes.admin import admin_bp
from backend.routes.coding import coding_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = JWT_SECRET
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

CORS(app, origins=CORS_ORIGINS, supports_credentials=True)
JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(resume_bp)
app.register_blueprint(interview_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(coding_bp)


@app.route('/')
def index():
    return jsonify({'message': 'SmartHire AI backend is running'})


if __name__ == '__main__':
    port = int(os.getenv('PORT', '5050'))
    app.run(host='0.0.0.0', port=port, debug=True)
