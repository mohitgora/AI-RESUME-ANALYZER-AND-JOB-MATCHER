def detect_role(text):
    text = text.lower()

    if "machine learning" in text or "deep learning" in text:
        return "Data Scientist"

    if "system design" in text or "dsa" in text:
        return "SDE"

    if "django" in text or "flask" in text:
        return "Backend Developer"

    return "General"