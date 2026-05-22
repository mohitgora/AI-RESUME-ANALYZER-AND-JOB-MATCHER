import pandas as pd

from extract_skills import extract_skills

# LOAD CLEANED RESUME DATASET
df = pd.read_csv(
    "ml/preprocessing/processed_data/cleaned_resume_dataset.csv"
)

print("\nCLEANED RESUME DATASET LOADED\n")

# EXTRACT SKILLS
print("\nEXTRACTING SKILLS...\n")

df["extracted_skills"] = df["cleaned_resume"].apply(extract_skills)

print("\nSKILL EXTRACTION COMPLETED\n")

# SAVE OUTPUT
output_path = (
    "ml/skill_extraction/extracted_data/"
    "resume_skills_dataset.csv"
)

df.to_csv(output_path, index=False)

print(f"\nSKILL DATASET SAVED:\n{output_path}")

# SHOW SAMPLE
print(df[["cleaned_resume", "extracted_skills"]].head(3))