import pandas as pd

from clean_text import clean_resume_text

# LOAD JD DATASET
df = pd.read_csv('C:\\Users\\mohit gora\\Documents\\KingsoftData\\OneDrive\\Desktop\\AI-RESUME-PLATFORM\\datasets\\JD dataset.csv')

print("\nJD DATASET LOADED\n")

# SHOW COLUMNS
print(df.columns)

# CLEAN JOB DESCRIPTIONS
print("\nCLEANING JOB DESCRIPTIONS...\n")

df["cleaned_jd"] = df["Job Description"].apply(clean_resume_text)

print("\nJD CLEANING COMPLETED\n")

# SAVE CLEANED JD DATASET
output_path = "ml/preprocessing/processed_data/cleaned_jd_dataset.csv"

df.to_csv(output_path, index=False)

print(f"\nCLEANED JD DATASET SAVED:\n{output_path}")

# SHOW SAMPLE
print(df[["Job Description", "cleaned_jd"]].head(2))