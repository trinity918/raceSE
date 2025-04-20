import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("KEY"))

output_path = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\output'

resume_data = {
    "name": "Jake Ryan",
    "phone": "123-456-7890",
    "email": "jake@su.edu",
    "linkedin": "jake",
    "github": "jake",
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

def generate_tex(data):

    prompt = f"""
    You are given a dictionary of resume data in JSON.

    Using ONLY the resume data, render a valid LaTeX document of a resume that looks professional, gets a high ATS score, and the template is widely used, and it properly compiles. Fix any errors and bugs you think are present in the template and the final Latex. 

    Do Not Include any ```latex and ``` before and after the latex code and please fix all bugs.

    Make the Latex Format as good as possible, include linings and proper highlighting.

    ONLY return the final LaTeX code.

    -- Resume Data --
    {json.dumps(data, indent=2)}
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that formats resumes professionally."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    latex_result = response.choices[0].message.content

    file_path = os.path.join(output_path, "output.tex")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(latex_result)
