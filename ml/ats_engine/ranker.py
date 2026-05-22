def final_score(emb, skill, exp, role_match):

    score = (
        0.35 * emb +
        0.50 * skill +
        0.10 * exp +
        0.05 * role_match
    )

    return max(0, min(100, score))