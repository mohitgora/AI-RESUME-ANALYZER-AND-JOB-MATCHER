def generate_feedback(resume_skills, jd_skills, score):

    missing = list(set(jd_skills) - set(resume_skills))
    extra = list(set(resume_skills) - set(jd_skills))

    status = (
        "Strong Match" if score > 75 else
        "Moderate Match" if score > 50 else
        "Weak Match"
    )

    suggestions = []

    if missing:
        suggestions.append(f"Learn missing skills: {', '.join(missing)}")

    if extra:
        suggestions.append(f"Remove irrelevant skills: {', '.join(extra)}")

    suggestions += [
        "Build projects using JD tech stack",
        "Improve system design basics",
        "Optimize ATS keyword density"
    ]

    return {
        "status": status,
        "missing_skills": missing,
        "extra_skills": extra,
        "suggestions": suggestions,
        "note": "Rule-based recruiter feedback (LLM-ready)"
    }