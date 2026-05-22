import numpy as np
import pandas as pd
import os

from ml.vector_db.faiss_index import FAISSVectorDB


# LOAD DATA
df = pd.read_pickle(
    "ml/embeddings/saved_embeddings/resume_embeddings.pkl"
)

embeddings = np.load(
    "ml/embeddings/saved_embeddings/resume_embeddings.npy"
)

print("DATA LOADED")


# CREATE METADATA (important)
metadata = df.to_dict(orient="records")


# INIT VECTOR DB
db = FAISSVectorDB(dim=384)

print("BUILDING INDEX...")


# ADD DATA TO FAISS
db.add_embeddings(embeddings, metadata)


# SAVE INDEX
os.makedirs("ml/vector_db/storage", exist_ok=True)

import pickle

with open("ml/vector_db/storage/faiss_db.pkl", "wb") as f:
    pickle.dump(db, f)

print("INDEX BUILT & SAVED")