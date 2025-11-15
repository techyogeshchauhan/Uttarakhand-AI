from flask import Flask
from flask_cors import CORS
from app.config.settings import Config
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    # Register blueprints
    from app.api.chat import chat_bp
    from app.api.vision import vision_bp
    from app.api.itinerary import itinerary_bp
    from app.api.emergency import emergency_bp
    
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(vision_bp, url_prefix='/api/vision')
    app.register_blueprint(itinerary_bp, url_prefix='/api/itinerary')
    app.register_blueprint(emergency_bp, url_prefix='/api/emergency')
    
    return app