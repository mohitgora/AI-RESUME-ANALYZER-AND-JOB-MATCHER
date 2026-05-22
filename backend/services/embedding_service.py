import sys, os
import numpy as np

sys.path.append(os.path.abspath("ml"))

from ml.embeddings.embeddings_utils import generate_embedding
from sklearn.metrics.pairwise import cosine_similarity


def semantic_match(resume_text, jd_text):

    res_emb = generate_embedding(resume_text)
    jd_emb = generate_embedding(jd_text)

    score = cosine_similarity(
        [res_emb],
        [jd_emb]
    )[0][0]

    return round(score * 100, 2)