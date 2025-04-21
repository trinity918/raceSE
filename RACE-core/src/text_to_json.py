import openai
import os
from dotenv import load_dotenv
load_dotenv()

api_key = 'ur-api-key'

client = openai.OpenAI(api_key=os.getenv("KEY"))

def json_from_text(text):

    system_prompt = """You are an expert resume parser. Your task is to extract information from a resume and format it into a specific JSON structure.

            The output JSON should have this EXACT structure:
            {
                "name": "string",
                "phone": "string",
                "email": "string",
                "linkedin": "string (just the URL path like linkedin.com/in/username)",
                "github": "string (just the URL path like github.com/username)",
                "education": [
                    {
                        "institution": "string",
                        "location": "string",
                        "degree": "string",
                        "dates": "string"
                    }
                ],
                "experience": [
                    {
                        "title": "string",
                        "company": "string",
                        "location": "string",
                        "dates": "string",
                        "details": [
                            "string (bullet point 1)",
                            "string (bullet point 2)"
                        ]
                    }
                ],
                "projects": [
                    {
                        "name": "string",
                        "stack": "string",
                        "dates": "string",
                        "details": [
                            "string (bullet point 1)",
                            "string (bullet point 2)"
                        ]
                    }
                ],
                "skills": {
                    "languages": "string (comma-separated list)",
                    "frameworks": "string (comma-separated list)",
                    "tools": "string (comma-separated list)",
                    "libraries": "string (comma-separated list)"
                }
            }

            Important:
            - Extract all bullet points for experience and projects as separate strings in the details array
            - If a field is missing, use an empty string "" for strings or empty array [] for arrays
            - For LinkedIn and GitHub, only extract the path part (e.g., linkedin.com/in/username not the full URL)
            - Return ONLY the JSON object, nothing else
            """
    
    user_prompt = f"""Parse this resume text into the required JSON structure, only provide the resume, do not provide any other text:

            {text}
            """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    resume = response.choices[0].message.content

    return resume
