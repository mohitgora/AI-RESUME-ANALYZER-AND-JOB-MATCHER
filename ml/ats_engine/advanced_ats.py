import numpy as np

from ml.ats_engine.skill_extractor import extract_skills
from ml.ats_engine.role_classifier import detect_role
from ml.ats_engine.scorer import cosine, normalize_score
from ml.skill_model.skill_scorer import ml_skill_score

from ml.llm.gemini_feedback import generate_feedback
from ml.explain.explainer import explain_score
from ml.ranker.ltr_model import LTRModel


# -------------------------
# INIT LTR MODEL
# -------------------------
ltr = LTRModel()


# -------------------------
# EXPERIENCE SCORE
# -------------------------
def experience_score(text):
    text = text.lower()
    score = 0
    if "intern" in text: score += 5
    if "project" in text: score += 5
    if "experience" in text: score += 10
    if "lead" in text: score += 8
    return score


# -------------------------
# ROLE BOOST
# -------------------------
def role_boost_fn(role, text):
    return 10 if role.lower() in text.lower() else 0


# -------------------------
# MAIN ATS ENGINE
# -------------------------
def ats_engine(resume_text, job_text, res_emb, jd_emb):

    role = detect_role(job_text)

    res_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_text)

    emb_score = cosine(res_emb, jd_emb) * 100
    skill_score = ml_skill_score(res_skills, jd_skills)
    exp_score = experience_score(resume_text)
    role_boost = role_boost_fn(role, resume_text)

    # -------------------------
    # LTR SCORING (fallback safe)
    # -------------------------
    features = np.array([[emb_score, skill_score, exp_score, role_boost]])

    if hasattr(ltr.model, "estimators_"):
        ltr_score = ltr.model.predict(features)[0]
    else:
        ltr_score = (
            0.4 * emb_score +
            0.4 * skill_score +
            0.2 * exp_score
        )

    final_score = normalize_score(ltr_score)

    # -------------------------
    # FEEDBACK
    # -------------------------
    feedback = generate_feedback(res_skills, jd_skills, final_score)

    # -------------------------
    # EXPLANATION (FIXED INDENTATION)
    # -------------------------
    explanation = explain_score(res_skills, jd_skills, final_score)

    return {
        "role": role,
        "final_score": round(final_score, 2),
        "embedding_score": round(emb_score, 2),
        "skill_score": round(skill_score, 2),
        "experience_score": exp_score,
        "role_boost": role_boost,
        "resume_skills": res_skills,
        "jd_skills": jd_skills,
        "feedback": feedback,
        "explanation": explanation
    }