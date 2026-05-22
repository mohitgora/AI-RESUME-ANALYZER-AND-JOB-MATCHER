import pandas as pd
import numpy as np

from ml.embeddings.embeddings_utils import generate_embedding

# LOAD DATASET
df = pd.read_csv(
    "ml/preprocessing/processed_data/cleaned_resume_dataset.csv"
)

print("\nDATASET LOADED\n")

# REMOVE NULLS
df = df.dropna(subset=["cleaned_resume"])

print("\nGENERATING EMBEDDINGS...\n")

#  SAFE EMBEDDINGS
df["embedding"] = df["cleaned_resume"].apply(generate_embedding)

print("\nEMBEDDINGS GENERATED\n")

# SAVE
embeddings = np.vstack(df["embedding"].values)

np.save(
    "ml/embeddings/saved_embeddings/resume_embeddings.npy",
    embeddings
)

df.to_pickle(
    "ml/embeddings/saved_embeddings/resume_embeddings.pkl"
)

print("\nEMBEDDINGS SAVED\n")
print("SHAPE:", embeddings.shape)