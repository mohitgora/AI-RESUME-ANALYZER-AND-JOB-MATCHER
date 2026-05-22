def explain(result):
    score = result["final_score"]

    if score >= 75:
        return "Strong match: Skills + semantic alignment excellent"

    elif score >= 50:
        return "Moderate match: Some key skills missing"

    else:
        return "Weak match: Major skill gap detected"