"""Vision API endpoints for image analysis"""
from flask import Blueprint, request, jsonify
from app.services.gemini_service import get_gemini_service
from app.utils.validators import validate_language, validate_image_format
from app.utils.logger import logger
from app.config.settings import Config
import base64

vision_bp = Blueprint('vision', __name__)

@vision_bp.route('/analyze', methods=['POST'])
def analyze_image():
    """
    Analyze uploaded image file
    
    Request: multipart/form-data
    - file: image file
    - language: optional, default 'english'
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No file selected'
            }), 400
        
        # Validate file format
        if not validate_image_format(file.filename):
            return jsonify({
                'success': False,
                'message': 'Invalid image format. Supported: JPG, PNG, WEBP, GIF'
            }), 400
        
        # Get language
        language = request.form.get('language', 'english').lower()
        if not validate_language(language):
            language = 'english'
        
        # Read file data
        image_data = file.read()
        
        # Check file size (16MB max)
        if len(image_data) > Config.MAX_CONTENT_LENGTH:
            return jsonify({
                'success': False,
                'message': f'File too large. Maximum size: {Config.MAX_CONTENT_LENGTH / (1024*1024)}MB'
            }), 400
        
        # Get Gemini service
        try:
            gemini_service = get_gemini_service()
        except ValueError as e:
            return jsonify({
                'success': False,
                'message': 'AI service is not configured. Please check GEMINI_API_KEY.'
            }), 500
        
        # Analyze image
        result = gemini_service.analyze_image(
            image_data=image_data,
            language=language
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'identified': result.get('identified', False),
                'data': result.get('data', {}),
                'raw_response': result.get('raw_response', ''),
                'language': language
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Failed to analyze image')
            }), 500
            
    except Exception as e:
        logger.error(f"Error in analyze_image: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@vision_bp.route('/analyze-base64', methods=['POST'])
def analyze_image_base64():
    """
    Analyze image from base64 string
    
    Request body:
    {
        "image": "data:image/jpeg;base64,...",
        "language": "english|hindi|garhwali|kumaoni"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Request body is required'
            }), 400
        
        image_base64 = data.get('image', '')
        if not image_base64:
            return jsonify({
                'success': False,
                'message': 'Image data is required'
            }), 400
        
        # Validate base64 format
        if not image_base64.startswith('data:image/'):
            return jsonify({
                'success': False,
                'message': 'Invalid image format. Expected data:image/...;base64,...'
            }), 400
        
        # Get language
        language = data.get('language', 'english').lower()
        if not validate_language(language):
            language = 'english'
        
        # Get Gemini service
        try:
            gemini_service = get_gemini_service()
        except ValueError as e:
            return jsonify({
                'success': False,
                'message': 'AI service is not configured. Please check GEMINI_API_KEY.'
            }), 500
        
        # Analyze image
        result = gemini_service.analyze_image_base64(
            base64_data=image_base64,
            language=language
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'identified': result.get('identified', False),
                'data': result.get('data', {}),
                'raw_response': result.get('raw_response', ''),
                'language': language
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Failed to analyze image')
            }), 500
            
    except Exception as e:
        logger.error(f"Error in analyze_image_base64: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

