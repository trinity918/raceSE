import openai
import json
import os
from dotenv import load_dotenv
load_dotenv()

api_key = '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'

client = openai.OpenAI(api_key=os.getenv("KEY"))

output_path = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\output'

resume_data = {
    "name": "Jake Ryan",
    "phone": "123-456-7890",
    "email": "jake@su.edu",
    "linkedin": "linkedin.com/in/jake",
    "github": "github.com/jake",
    "education": [
        {
            "institution": "Southwestern University",
            "location": "Georgetown, TX",
            "degree": "Bachelor of Arts in Computer Science, Minor in Business",
            "dates": "Aug. 2018 -- May 2021"
        },
        {
            "institution": "Blinn College",
            "location": "Bryan, TX",
            "degree": "Associate's in Liberal Arts",
            "dates": "Aug. 2014 -- May 2018"
        }
    ],
    "experience": [
        {
            "title": "Undergraduate Research Assistant",
            "company": "Texas A and M University",
            "location": "College Station, TX",
            "dates": "June 2020 -- Present",
            "details": [
                "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
                "Developed a full-stack web app using Flask, React, PostgreSQL, Docker",
                "Explored ways to visualize GitHub collaboration in classrooms"
            ]
        },
        {
            "title": "Information Technology Support Specialist",
            "company": "Southwestern University",
            "location": "Georgetown, TX",
            "dates": "Sep. 2018 -- Present",
            "details": [
                "Communicated with managers to set up campus computers",
                "Troubleshot issues for students, faculty, and staff",
                "Maintained computers and 200 printers across campus"
            ]
        }
    ],
    "projects": [
        {
            "name": "Gitlytics",
            "stack": "Python, Flask, React, PostgreSQL, Docker",
            "dates": "June 2020 -- Present",
            "details": [
                "Developed full-stack app with Flask (REST API) and React frontend",
                "Implemented GitHub OAuth and visualized collaboration data",
                "Used Celery + Redis for async tasks"
            ]
        },
        {
            "name": "Simple Paintball",
            "stack": "Spigot API, Java, Maven, TravisCI, Git",
            "dates": "May 2018 -- May 2020",
            "details": [
                "Built Minecraft server plugin, 2K+ downloads and 4.5+ star rating",
                "CI/CD with TravisCI on releases",
                "Collaborated with community for feedback and improvements"
            ]
        }
    ],
    "skills": {
        "languages": "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R",
        "frameworks": "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI",
        "tools": "Git, Docker, TravisCI, GCP, VS Code, PyCharm, IntelliJ, Eclipse",
        "libraries": "pandas, NumPy, Matplotlib"
    }
}

def enhance_data(data):
    system_prompt = (
        "You are an expert technical resume writer. Given a JSON resume input, "
        "enhance each bullet point to be more impactful by adding quantifiable metrics, "
        "industry jargon, and clear accomplishments using active verbs, Return the entire structure unchanged except for enhanced content in the `details` fields. Also do no add ```json in the output. and change the sign % to the word percent, "
    )

    user_prompt = json.dumps(data, indent=2)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    enhanced_resume = response.choices[0].message.content

    file_path = os.path.join(output_path, 'enhanced_resume.txt')

    with open(file_path, "w") as file:
        file.write(enhanced_resume)

    return enhanced_resume