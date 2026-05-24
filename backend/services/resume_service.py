import os
import re
import tempfile
from typing import Any

import PyPDF2

nlp: Any | None = None


def load_spacy_model() -> Any | None:
    global nlp
    if nlp is not None:
        return nlp
    try:
        import spacy

        nlp = spacy.load('en_core_web_sm')
    except Exception:
        try:
            from spacy.cli import download
            import spacy

            download('en_core_web_sm')
            nlp = spacy.load('en_core_web_sm')
        except Exception:
            nlp = None
    return nlp

KNOWN_SKILLS = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Flask', 'Django', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'Kubernetes',
    'data analysis', 'machine learning', 'NLP', 'computer vision', 'REST API', 'TypeScript', 'graphQL', 'testing', 'agile',
]


def extract_text_from_pdf(uploaded_file) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        tmp.write(uploaded_file.read())
        tmp_path = tmp.name

    text = ''
    try:
        with open(tmp_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            for page in reader.pages:
                text += page.extract_text() or ''
    finally:
        os.remove(tmp_path)

    return text


def parse_resume_text(text: str) -> dict[str, Any]:
    if not text:
        return {'summary': '', 'skills': [], 'projects': []}

    content = re.sub(r'\s+', ' ', text)
    skills = []
    for skill in KNOWN_SKILLS:
        if re.search(rf'\b{re.escape(skill)}\b', content, flags=re.IGNORECASE):
            skills.append(skill)

    if not skills:
        model = load_spacy_model()
        if model:
            doc = model(content)
            skills = [ent.text for ent in doc.ents if ent.label_ in {'ORG', 'PRODUCT', 'TECHNOLOGY'}]

    project_lines = []
    for line in text.splitlines():
        if 'project' in line.lower() or 'capstone' in line.lower():
            clean_line = line.strip()
            if clean_line and clean_line not in project_lines:
                project_lines.append(clean_line)
        if len(project_lines) >= 5:
            break

    summary = content[:1500].strip()
    return {
        'summary': summary,
        'skills': skills[:12],
        'projects': project_lines[:5] or ['Resume parsed successfully.'],
    }
