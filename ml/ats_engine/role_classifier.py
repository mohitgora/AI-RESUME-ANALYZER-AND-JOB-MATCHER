def detect_role(text):
    text = text.lower()

    if any(x in text for x in ["machine learning", "data science", "nlp"]):
        return "Data Scientist"

    if any(x in text for x in ["django", "flask", "backend", "api"]):
        return "Backend Developer"

    if "python" in text:
        return "Python Developer"

    if "frontend" in text:
        return "Frontend Developer"

    return "General"