import openai
import json, os

from dotenv import load_dotenv
load_dotenv()

assets_dir = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\assets'
output_dir = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\output'

client = openai.OpenAI(api_key=os.getenv("KEY"))

def get_openai_response(resume, jd):
    prompt = f"""
You are an expert resume and job description reader and analyser.

Find:
1. Common skills between the resume and the JD.
2. Skills missing in the resume but mentioned in JD.
3. 2 Cover letters in the range of 150-200 words.

DO NOT INCLUDE '```json' and '```' in the OUTPUT.

Return in this JSON format (no markdown, no explanation, just plain text):

{{
  "skills": ["Skill1", "Skill2"],
  "missing": ["MissingSkill1"],
  "cover_letters": [
    "Cover letter 1 text here.",
    "Cover letter 2 text here."
  ]
}}

Resume:
{resume}

Job Description:
{jd}
"""

    try:
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        temperature=0.7,
        messages=[
            {"role": "user", "content": prompt},
        ]
    )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        print("[!] Failed to parse response as JSON:", e)
        print("Raw response:", content if 'content' in locals() else "No content received.")
        return None

def return_data():
    resume_text = ""
    with open(os.path.join(output_dir, 'enhanced_resume.txt'), "r", encoding='utf-8') as file:
        lines = file.readlines()

    resume_text += ('\n').join(lines)

    jd_text = ""
    with open(os.path.join(assets_dir, 'sample_job_desc.txt'), "r", encoding='utf-8') as file:
        lines_ = file.readlines()

    jd_text += ('\n').join(lines_)   

    result = get_openai_response(resume_text, jd_text)

    if result:
        skills = result["skills"]
        missing = result["missing"]
        cover_letters = result["cover_letters"]
        return skills, missing, cover_letters
    else:
        return [], [], []