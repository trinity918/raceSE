from flask import Flask, request, send_file
import os
from werkzeug.utils import secure_filename
from first_integration import file_to_resume

from flask_cors import CORS
from rag import return_data

app  = Flask(__name__)
CORS(app)

ASSETS_FOLDER = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\assets'
OUTPUT_FOLDER = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\output'

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):

    return '.' in filename and filename.split('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def handle_upload():

    if 'file' not in request.files:
        return {"error": "No file in request"}, 400
    
    file = request.files['file']

    if file.filename == '':
        return {"error", "No file selected"}, 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(ASSETS_FOLDER, filename)
        file.save(file_path)

        file_to_resume(filename)

        pdf_path = os.path.join(OUTPUT_FOLDER, 'output.pdf')

        return send_file(pdf_path)
    
    return {'error': 'Invalid file type. Allowed types are PDF, TXT, DOC, PNG AND JPG.'}, 400

@app.route("/get_skills_data", methods=['GET'])
def get_data():

    skills, missing, cover_letters = return_data()

    try:
        return {'skills': skills, 'missing': missing, 'cover_letters': cover_letters}, 200
    
    except:
        return {'error': 'Unexpected error occured'}, 400
    
@app.route("/get_resume_data", methods=['GET'])
def get_data_resume():

    with open(os.path.join(OUTPUT_FOLDER, 'enhanced_resume.txt'), "r") as file:
        lines = file.readlines()

    text = ('\n').join(lines)

    try:
        return {'resume': text}, 200
    
    except:
        return {'error': 'Unexpected error occured'}, 400

if __name__ == "__main__":
    app.run(debug=True)


