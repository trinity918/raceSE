import fitz  # PyMuPDF
from PIL import Image, ImageDraw

def highlight_resume_sections(pdf_path, output_image_path):
    doc = fitz.open(pdf_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=150)
    image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    draw = ImageDraw.Draw(image)

    blocks = page.get_text("dict")["blocks"]

    # Target section titles and colors
    sections = {
        "contact": {
            "keywords": ["email", "phone", "github", "linkedin"],
            "color": "red"
        },
        "education": {
            "keywords": ["education"],
            "color": "blue"
        },
        "skills": {
            "keywords": ["skills", "languages", "tools", "technologies"],
            "color": "green"
        },
        "projects": {
            "keywords": ["projects"],
            "color": "purple"
        }
    }

    # Normalize text for comparison
    def normalize(text):
        return text.lower().strip()

    # Get a flat list of all lines with their bounding boxes
    lines_with_boxes = []
    for block in blocks:
        for line in block.get("lines", []):
            line_text = " ".join([span["text"] for span in line["spans"]])
            bbox = [min([span["bbox"][0] for span in line["spans"]]),
                    min([span["bbox"][1] for span in line["spans"]]),
                    max([span["bbox"][2] for span in line["spans"]]),
                    max([span["bbox"][3] for span in line["spans"]])]
            lines_with_boxes.append((normalize(line_text), bbox))

    for section, data in sections.items():
        matched_boxes = []
        for line_text, bbox in lines_with_boxes:
            if any(keyword in line_text for keyword in data["keywords"]):
                matched_boxes.append(bbox)

        for bbox in matched_boxes:
            draw.rectangle(bbox, outline=data["color"], width=2)

    image.save(output_image_path)
    print(f"Saved highlighted image to: {output_image_path}")
