def match_skills(resume_skills, jd_skills):

    resume_set = set(resume_skills)

    jd_set = set(jd_skills)

    # MATCHED SKILLS
    matched_skills = list(
        resume_set.intersection(jd_set)
    )

    # MISSING SKILLS
    missing_skills = list(
        jd_set - resume_set
    )

    # SKILL MATCH %
    if len(jd_set) == 0:
        match_percentage = 0

    else:
        match_percentage = (
            len(matched_skills) / len(jd_set)
        ) * 100

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": round(match_percentage, 2)
    }


# TEST
if __name__ == "__main__":

    resume_skills = [
        "python",
        "react",
        "docker",
        "sql"
    ]

    jd_skills = [
        "python",
        "aws",
        "docker",
        "kubernetes"
    ]

    result = match_skills(
        resume_skills,
        jd_skills
    )

    print("\nMATCH RESULT:\n")

    print(result)