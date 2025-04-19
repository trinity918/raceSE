from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

import os
import shutil

import json

from ast import literal_eval

output_dir = r'C:\Users\Jash\OneDrive\Desktop\RACE\output'
assets_dir = r'C:\Users\Jash\OneDrive\Desktop\RACE\assets'
db_location = "./vector_db"

# if os.path.exists(db_location):
#     shutil.rmtree(db_location)

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

Return them in a json format only. No extra text.
Also generate 2 cover letters to the company based on the skills, and also return them in the json format.

Here are some resume chunks:
{chunks}

here is the expected json format:

{{
    skills: [],
    missing: [],
    cover_letters: []
}}

DO NOT ADD ANY ```json and ``` in the output.
For cover_letters, only provide complete cv strings, make each one to be atleadt 300 words.
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

docs = retriever.invoke("skills in resume and job description")
retrieved_chunks = "\n\n".join([doc.page_content for doc in docs])

def return_json_data():

    result = chain.invoke({"chunks": retrieved_chunks})

    result = json.loads(result)
    print(result)
    return result['skills'], result['missing'], result['cover_letters']