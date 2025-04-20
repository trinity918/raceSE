from ocr_and_text import get_text_from_docx, get_text_from_img, get_text_from_pdf, get_text_from_text
from text_to_json import json_from_text
from enhancer import enhance_data

from open_latex import generate_tex
from make_pdf import compile_tex_in_place

import os, json
from ast import literal_eval

def file_to_resume(file):

    '''
    flow :
    file -> text -> json -> enhanced -> latex
    '''

    path = file.split(".")
    text = None

    print(path)

    if path[len(path) - 1] == "pdf":
        text = get_text_from_pdf(file)        

    elif path[len(path) - 1] == "docx":
        text = get_text_from_docx(file)

    elif path[len(path) - 1] == "txt":
        text = get_text_from_text(file)

    elif path[len(path) - 1] == "png" or path[len(path) - 1] == "jpg":
        text = get_text_from_img(file)

    print("File to text done.")
    print("----------------------------------")
    print("----------------------------------")

    json_resume = json_from_text(text)
    print("Text to JSON done.")
    print("----------------------------------")
    print("----------------------------------")

    enhanced = enhance_data(json_resume)
    print("Resume Enhanced.")
    print("----------------------------------")
    print("----------------------------------")

    enhanced = literal_eval(enhanced)
    generate_tex(enhanced)
    print("Tex Generated.")

    compile_tex_in_place('output.tex')
    print("PDF Generated.")