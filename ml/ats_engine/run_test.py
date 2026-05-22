from ml.embeddings.embeddings_utils import generate_embedding
from ml.ats_engine.advanced_ats import ats_engine

import pandas as pd

df = pd.read_pickle(
    "ml/embeddings/saved_embeddings/resume_embeddings.pkl"
)

job_text = "python machine learning data science sql"

job_emb = generate_embedding(job_text)

print("\n ATS RESULTS\n")

for _, r in df.head(5).iterrows():

    res_emb = r["embedding"]

    result = ats_engine(
        r["cleaned_resume"],
        job_text,
        res_emb,
        job_emb
    )

    print(result)
    print("-" * 60)