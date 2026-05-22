def explain_score(resume_skills, jd_skills, score):

    missing = list(set(jd_skills) - set(resume_skills))
    extra = list(set(resume_skills) - set(jd_skills))

    explanation = []

    # -------------------------
    # Skill gap analysis
    # -------------------------
    if missing:
        explanation.append(
            f"You are missing critical skills: {', '.join(missing)} required for this role."
        )

    if extra:
        explanation.append(
            f"Your resume contains extra skills not required: {', '.join(extra)}"
        )

    # -------------------------
    # Score reasoning
    # -------------------------
    if score < 50:
        explanation.append(
            "Low semantic match between resume and job description."
        )
    elif score < 75:
        explanation.append(
            "Moderate match — improve keyword alignment and projects."
        )
    else:
        explanation.append(
            "Strong match — minor optimization needed."
        )

    # -------------------------
    # FINAL OUTPUT (STRUCTURED - IMPORTANT)
    # -------------------------
    return {
        "missing_skills": missing,
        "extra_skills": extra,
        "explanation": explanation,
        "summary": " | ".join(explanation)
    }