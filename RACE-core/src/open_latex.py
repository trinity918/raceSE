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

latex_template = r"""
{# Set up custom hrefs #}
{%- set email_href = 'mailto:' ~ email -%}
{%- set linkedin_href = 'https://linkedin.com/in/' ~ linkedin -%}
{%- set github_href = 'https://github.com/' ~ github -%}

{% raw %}
\documentclass[letterpaper,11pt]{article}

% Packages
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

% Page style
\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Page margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

% Link style
\urlstyle{same}

% Layout
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Section formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% PDF Unicode
\pdfgentounicode=1

% Custom commands
\newcommand{\resumeItem}[1]{\item\small{#1 \vspace{-2pt}}}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
  \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
{% endraw %}

\begin{document}

%----------Heading----------
\begin{center}
  \textbf{\Huge \scshape {{ name }}} \\ \vspace{1pt}
  \small {{ phone }} $|$ \href{{{{ email_href }}}}{ {{ email }} } $|$
  \href{{{{ linkedin_href }}}}{ {{ linkedin }} } $|$
  \href{{{{ github_href }}}}{ {{ github }} }
\end{center}

%----------Education----------
\section{Education}
\resumeSubHeadingListStart
{% for edu in education %}
  \resumeSubheading
    { {{ edu.institution }} }{ {{ edu.location }} }
    { {{ edu.degree }} }{ {{ edu.dates }} }
{% endfor %}
\resumeSubHeadingListEnd

%----------Experience----------
\section{Experience}
\resumeSubHeadingListStart
{% for job in experience %}
  \resumeSubheading
    { {{ job.title }} }{ {{ job.dates }} }
    { {{ job.company }} }{ {{ job.location }} }
  \resumeItemListStart
  {% for item in job.details %}
    \resumeItem{ {{ item }} }
  {% endfor %}
  \resumeItemListEnd
{% endfor %}
\resumeSubHeadingListEnd

%----------Projects----------
\section{Projects}
\resumeSubHeadingListStart
{% for project in projects %}
  \resumeProjectHeading
    {\textbf{ {{ project.name }} } $|$ \emph{ {{ project.stack }} }}{ {{ project.dates }} }
  \resumeItemListStart
  {% for item in project.details %}
    \resumeItem{ {{ item }} }
  {% endfor %}
  \resumeItemListEnd
{% endfor %}
\resumeSubHeadingListEnd

%----------Technical Skills----------
\section{Technical Skills}
\resumeSubHeadingListStart
  \resumeItemListStart
    \resumeItem{\textbf{Languages}: {{ skills.languages }}}
    \resumeItem{\textbf{Frameworks}: {{ skills.frameworks }}}
    \resumeItem{\textbf{Developer Tools}: {{ skills.tools }}}
    \resumeItem{\textbf{Libraries}: {{ skills.libraries }}}
  \resumeItemListEnd
\resumeSubHeadingListEnd

\end{document}
"""

def generate_tex(data):

    prompt = f"""
    You are given a dictionary of resume data in JSON.

    Using ONLY the resume data, render a valid LaTeX document of a resume that looks professional, gets a high ATS score, and the template is widely used, and it properly compiles. Fix any errors and bugs you think are present in the template and the final Latex. 

    Do Not Include any ```latex and ``` before and after the latex code and please fix all bugs.

    Make the Latex Format as good as possible, include linings and proper highlighting.

    You can use this latex template as an inspiration:
    -- Latex Template --
    {latex_template}

    If some columns and values are missing, REMOVE them from the latex code, BUT MAKE SURE THAT IT STILL COMPILES.

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
