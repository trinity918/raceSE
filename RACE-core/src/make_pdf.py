output_path = r'C:\Users\Jash\OneDrive\Documents\GitHub\RACE-SE-Hackathon-Repo\RACE-core\output'

import subprocess
import os

def compile_tex_in_place(tex_path):
    tex_file = os.path.join(output_path, tex_path)

    try:
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", tex_file],
            cwd=output_path,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print(f"PDF generated successfully in: output")

    except subprocess.CalledProcessError as e:
        print("LaTeX compilation failed:")
        print(e.stderr.decode())


