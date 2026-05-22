import sys, os

sys.path.append(os.path.abspath("ml"))

from ml.ats_engine.advanced_ats import ats_engine
from ml.embeddings.embeddings_utils import generate_embedding


def get_ats_score(resume_text, job_text):

    # Generate embeddings
    res_emb = generate_embedding(resume_text)
    jd_emb = generate_embedding(job_text)

    # Call ATS engine
    result = ats_engine(resume_text, job_text, res_emb, jd_emb)

    return result