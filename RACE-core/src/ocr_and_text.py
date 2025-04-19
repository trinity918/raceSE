from pypdf import PdfReader
import os

import cv2
import pytesseract

from PIL import Image
import base64
import openai

import docx

from dotenv import load_dotenv
load_dotenv()

assets_dir = r'C:\Users\Jash\OneDrive\Desktop\RACE\assets'

def get_text_from_pdf(file):

    path = os.path.join(assets_dir, file)
    reader = PdfReader(path)

    text = ""

    for i in range(len(reader.pages)):
        page = reader.pages[i]
        text += page.extract_text()

    return text

def get_text_from_text(file):

    text = ""

    path = os.path.join(assets_dir, file)

    with open(path, "r") as file:
        lines = file.readlines()

    for line in lines:
        text += line

    return text

def get_text_from_img(file):

    path = os.path.join(assets_dir, file)
    openai.api_key = os.getenv("KEY")

    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    os.environ["TESSDATE_PREFIX"] = r"C:\Program Files\Tesseract-OCR\tessdata"

    image = cv2.imread(path)
    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(grayscale, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (18, 18))
    dilated_img = cv2.dilate(binary_image, kernel, iterations=1)
    contours, _ = cv2.findContours(dilated_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    text = ""

    for contour in contours:
        x, y, width, height = cv2.boundingRect(contour)
        cropped_region = image[y:y + height, x:x + width]

        t = pytesseract.image_to_string(cropped_region)
        text += t

    with open(path, "rb") as file:
        img_data = base64.b64encode(file.read()).decode("utf-8")

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You're an OCR assistant that helps clean and interpret image-based text accurately."
            },
            {
                "role": "user",
                "content": [
                     {"type": "text", "text": f"Here's the text extracted from the image:\n\n{text}\n\nCan you clean and interpret it better using the image for reference? Only provide the text, no other output, and also remove any astrix from the result."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_data}"}}
                ]
            }
        ],
        max_tokens=1000
    )

    final_text = response.choices[0].message.content
    return final_text

def get_text_from_docx(file):

    path = os.path.join(assets_dir, file)
    doc = docx.Document(path)

    text = []
    for para in doc.paragraphs:
        text.append(para.text)

    return '\n'.join(text)