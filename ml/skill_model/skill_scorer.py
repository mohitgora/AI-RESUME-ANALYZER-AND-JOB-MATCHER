import numpy as np

def ml_skill_score(resume_skills, jd_skills):

    if not jd_skills:
        return 0

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    intersection = resume_set.intersection(jd_set)

    precision = len(intersection) / len(jd_set)
    recall = len(intersection) / len(resume_set) if resume_set else 0

    # F1 style scoring (industry standard idea)
    if precision + recall == 0:
        return 0

    score = 2 * (precision * recall) / (precision + recall)

    return round(score * 100, 2)