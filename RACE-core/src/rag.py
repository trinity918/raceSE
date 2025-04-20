from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

import os
import re

output_dir = r'C:\Users\Jash\OneDrive\Desktop\RACE\output'
assets_dir = r'C:\Users\Jash\OneDrive\Desktop\RACE\assets'
db_location = "./vector_db"

with open(os.path.join(output_dir, 'enhanced_resume.txt')) as f1, \
     open(os.path.join(assets_dir, 'sample_job_desc.txt')) as f2:
    resume_text = f1.read()
    jd_text = f2.read()

combined_text = f"Resume:\n{resume_text}\n\nJob Description:\n{jd_text}"

def chunk_text(text, chunk_size=500, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

chunks = chunk_text(combined_text)
documents = [Document(page_content=chunk) for chunk in chunks]

embeddings = OllamaEmbeddings(model="mxbai-embed-large")
vector_store = Chroma(
    collection_name="resume",
    persist_directory=db_location,
    embedding_function=embeddings
)
vector_store.add_documents(documents)

retriever = vector_store.as_retriever(search_kwargs={"k": 10})
model = OllamaLLM(model="llama3.2")

template = """
You are an expert resume and Job description reader and analyser.
Find:
1. Common skills between the resume and the JD
2. Skills missing in the resume but mentioned in JD

Return them in the following plain text format:

---SKILLS---
<list each skill on a new line>

---MISSING---
<list each missing skill on a new line>

---COVER LETTER 1---
<first cover letter, minimum 300 words>

---COVER LETTER 2---
<second cover letter, minimum 300 words>
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

docs = retriever.invoke("skills in resume and job description")
retrieved_chunks = "\n\n".join([doc.page_content for doc in docs])

def return_data_without_json():
    result = chain.invoke({"chunks": retrieved_chunks})

    skills = []
    missing = []
    cover_letters = []

    try:
        skill_match = re.search(r'---SKILLS---(.*?)---MISSING---', result, re.DOTALL | re.IGNORECASE)
        if skill_match:
            skills = [line.strip() for line in skill_match.group(1).splitlines() if line.strip()]

        missing_match = re.search(r'---MISSING---(.*?)(---COVER LETTER|\Z)', result, re.DOTALL | re.IGNORECASE)
        if missing_match:
            missing = [line.strip() for line in missing_match.group(1).splitlines() if line.strip()]

        cl1 = re.search(r'---COVER LETTER 1---(.*?)(---COVER LETTER 2---|\Z)', result, re.DOTALL | re.IGNORECASE)
        cl2 = re.search(r'---COVER LETTER 2---(.*)', result, re.DOTALL | re.IGNORECASE)

        if cl1:
            cover_letters.append(cl1.group(1).strip())
        if cl2:
            cover_letters.append(cl2.group(1).strip())

    except Exception as e:
        print("[ERROR] Failed to parse LLM output properly.")
        print(e)
        print("\n---- RAW RESULT FROM LLM ----\n")
        print(result)

    return skills, missing, cover_letters

