"""Emergency API endpoints"""
from flask import Blueprint, request, jsonify
from app.services.gemini_service import get_gemini_service
from app.services.weather_service import get_weather_service
from app.utils.validators import validate_language
from app.utils.logger import logger

emergency_bp = Blueprint('emergency', __name__)

# Emergency contacts data
EMERGENCY_CONTACTS = {
    'police': {
        'name': 'Police',
        'number': '100',
        'description': 'Emergency police assistance'
    },
    'ambulance': {
        'name': 'Ambulance',
        'number': '108',
        'description': 'Medical emergency'
    },
    'fire': {
        'name': 'Fire Department',
        'number': '101',
        'description': 'Fire emergency'
    },
    'disaster': {
        'name': 'Disaster Management',
        'number': '1070',
        'description': 'Natural disaster assistance'
    },
    'women_helpline': {
        'name': 'Women Helpline',
        'number': '1091',
        'description': 'Women safety and support'
    },
    'child_helpline': {
        'name': 'Child Helpline',
        'number': '1098',
        'description': 'Child protection services'
    },
    'tourist_helpline': {
        'name': 'Tourist Helpline',
        'number': '1363',
        'description': 'Tourism assistance and information'
    },
    'dehradun_police': {
        'name': 'Dehradun Police Control',
        'number': '0135-2656666',
        'description': 'Dehradun district police'
    },
    'nainital_police': {
        'name': 'Nainital Police Control',
        'number': '05942-231100',
        'description': 'Nainital district police'
    },
    'haridwar_police': {
        'name': 'Haridwar Police Control',
        'number': '01334-223344',
        'description': 'Haridwar district police'
    }
}

@emergency_bp.route('/contacts', methods=['GET'])
def get_contacts():
    """
    Get emergency contact numbers
    
    Query params:
    - category: optional filter (police, ambulance, fire, etc.)
    """
    try:
        category = request.args.get('category', '').lower()
        
        if category:
            # Filter by category
            filtered = {k: v for k, v in EMERGENCY_CONTACTS.items() if category in k.lower()}
            contacts = list(filtered.values())
        else:
            contacts = list(EMERGENCY_CONTACTS.values())
        
        return jsonify({
            'success': True,
            'contacts': contacts,
            'count': len(contacts)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_contacts: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get contacts'
        }), 500

@emergency_bp.route('/advice', methods=['POST'])
def get_advice():
    """
    Get emergency advice using AI
    
    Request body:
    {
        "situation": "string",
        "location": "string (optional)",
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
        
        situation = data.get('situation', '').strip()
        if not situation:
            return jsonify({
                'success': False,
                'message': 'Situation description is required'
            }), 400
        
        location = data.get('location', '')
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
        
        # Get advice
        result = gemini_service.get_emergency_advice(
            situation=situation,
            location=location,
            language=language
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'advice': result.get('advice', ''),
                'language': language
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Failed to get advice')
            }), 500
            
    except Exception as e:
        logger.error(f"Error in get_advice: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@emergency_bp.route('/weather', methods=['GET'])
def get_weather():
    """
    Get weather information for a location
    
    Query params:
    - location: required, city name in Uttarakhand
    """
    try:
        location = request.args.get('location', '').strip()
        
        if not location:
            return jsonify({
                'success': False,
                'message': 'Location is required'
            }), 400
        
        # Get weather service
        weather_service = get_weather_service()
        
        # Get weather data
        result = weather_service.get_weather(location)
        
        return jsonify(result), 200 if result.get('success') else 500
        
    except Exception as e:
        logger.error(f"Error in get_weather: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@emergency_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """
    Get active travel alerts and warnings
    
    Query params:
    - location: optional, filter by location
    """
    try:
        location = request.args.get('location', '').strip()
        
        # In a real application, this would fetch from a database or external API
        # For now, return sample alerts
        alerts = [
            {
                'id': 1,
                'type': 'weather',
                'severity': 'moderate',
                'title': 'Heavy Rainfall Warning',
                'message': 'Heavy rainfall expected in Dehradun and surrounding areas. Avoid trekking.',
                'location': 'Dehradun',
                'valid_until': '2024-12-31'
            },
            {
                'id': 2,
                'type': 'road',
                'severity': 'high',
                'title': 'Road Closure',
                'message': 'NH-58 closed between Rishikesh and Devprayag due to landslide. Use alternate route.',
                'location': 'Rishikesh-Devprayag',
                'valid_until': '2024-12-30'
            }
        ]
        
        # Filter by location if provided
        if location:
            alerts = [a for a in alerts if location.lower() in a['location'].lower()]
        
        return jsonify({
            'success': True,
            'alerts': alerts,
            'count': len(alerts)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_alerts: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get alerts'
        }), 500

