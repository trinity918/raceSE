from together import Together
import os
from dotenv import load_dotenv

client = Together(api_key=os.getenv("TOGETHER_KEY"))

def improve_latex(latex):

    prompt = f"""You are a LaTeX debugger. A user gives you LaTeX code. Your task is to return only the corrected LaTeX code, with no explanation or extra text. Return it as a plain string.

Here is the LaTeX code:
{latex}
"""
    response = client.chat.completions.create(
        model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()