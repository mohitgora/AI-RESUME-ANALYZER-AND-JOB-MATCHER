def format_results(results):
    formatted = []

    for r in results:
        formatted.append({
            "name": r.get("name", "Unknown"),
            "skills": r.get("skills", ""),
            "experience": r.get("experience", "")
        })

    return formatted