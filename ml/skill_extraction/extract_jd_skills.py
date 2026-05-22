import pandas as pd

from extract_skills import extract_skills

# LOAD CLEANED JD DATASET
df = pd.read_csv(
    "ml/preprocessing/processed_data/cleaned_jd_dataset.csv"
)

print("\nCLEANED JD DATASET LOADED\n")

# EXTRACT SKILLS
print("\nEXTRACTING JD SKILLS...\n")

df["required_skills"] = df["cleaned_jd"].apply(extract_skills)

print("\nJD SKILL EXTRACTION COMPLETED\n")

# SAVE OUTPUT
output_path = (
    "ml/skill_extraction/extracted_data/"
    "jd_skills_dataset.csv"
)

df.to_csv(output_path, index=False)

print(f"\nJD SKILL DATASET SAVED:\n{output_path}")

# SHOW SAMPLE
print(df[["cleaned_jd", "required_skills"]].head(3))