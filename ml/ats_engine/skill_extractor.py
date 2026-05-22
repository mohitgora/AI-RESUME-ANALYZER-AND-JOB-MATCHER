from ml.ats_engine.config import SKILL_SYNONYMS, SKILL_WEIGHTS

def normalize(text):
    text = text.lower()

    for k, v in SKILL_SYNONYMS.items():
        text = text.replace(k, v)

    return text


def extract_skills(text):
    text = normalize(text)

    found = []

    for skill in SKILL_WEIGHTS.keys():
        if skill in text:
            found.append(skill)

    return list(set(found))