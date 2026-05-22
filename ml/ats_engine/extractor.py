import re
from ml.ats_engine.config import SKILL_WEIGHTS, SKILL_SYNONYMS


def normalize(skill):
    return SKILL_SYNONYMS.get(skill.lower(), skill.lower())


def extract_skills(text):
    text = text.lower()
    found = []

    for skill in SKILL_WEIGHTS.keys():
        pattern = rf"\b{skill}\b"
        if re.search(pattern, text):
            found.append(normalize(skill))

    return list(set(found))