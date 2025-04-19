from flask import Flask, request, send_file
import os
from werkzeug.utils import secure_filename
from first_integration import file_to_resume_latex

app  = Flask(__name__)

ASSETS_FOLDER = r'C:\Users\Jash\OneDrive\Desktop\RACE\assets'
OUTPUT_FOLDER = r'C:\Users\Jash\OneDrive\Desktop\RACE\output'

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

        file_to_resume_latex(filename)

        tex_path = os.path.join(OUTPUT_FOLDER, 'output.tex')

        return send_file(tex_path, as_attachment=True)
    
    return {'error': 'Invalid file type. Allowed types are PDF, TXT, DOC, PNG AND JPG.'}, 400

if __name__ == "__main__":
    app.run(debug=True)


