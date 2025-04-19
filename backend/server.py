# backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Process the data (example processing)
        # This is where you would implement your resume generation logic
        # For now, we'll just echo back the received data with a confirmation
        
        # Example: Store the received data for future reference
        os.makedirs('data', exist_ok=True)
        resume_id = str(hash(json.dumps(data, sort_keys=True)))
        
        with open(f'data/resume_{resume_id}.json', 'w') as f:
            json.dump(data, f)
        
        # Return a success response
        return jsonify({
            "status": "success",
            "message": "Resume data received successfully",
            "resume_id": resume_id
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask server is running"})

# Add more routes as needed

if __name__ == '__main__':
    # Running with SSL is recommended but requires certificates
    # For development, you can use app.run(debug=True)
    # For production with SSL: app.run(ssl_context=('cert.pem', 'key.pem'))
    app.run(host='0.0.0.0', port=5000, debug=True)