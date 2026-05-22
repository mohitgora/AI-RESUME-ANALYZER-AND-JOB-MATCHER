from collections import Counter

def bm25_score(resume_text, jd_text):

    res_tokens = resume_text.lower().split()
    jd_tokens = jd_text.lower().split()

    res_count = Counter(res_tokens)

    score = 0
    for token in jd_tokens:
        score += res_count.get(token, 0)

    return score