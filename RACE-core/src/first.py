from latex_improver import improve_latex

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

from jinja2 import Environment, FileSystemLoader
import os
import json

template_dir = os.path.join(os.path.dirname(__file__), "..", 'latex')
env = Environment(loader=FileSystemLoader(template_dir))
template = env.get_template('jakes_template.tex')

def generate_latex(data):

    if isinstance(data, list) and len(data) == 1 and isinstance(data[0], dict):
        data = data[0]

    print(type(data))

    data= json.loads(data)

    code = template.render(data)

    improved = improve_latex(code)

    with open("output/output.tex", "w") as file:
        file.write(improved)
