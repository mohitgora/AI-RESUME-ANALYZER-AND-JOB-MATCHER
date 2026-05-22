import pandas as pd

from clean_text import clean_resume_text

# LOAD DATASET
df = pd.read_csv('C:\\Users\\mohit gora\\Documents\\KingsoftData\\OneDrive\\Desktop\\AI-RESUME-PLATFORM\\datasets\\resume_dataset.csv')

print("\nDATASET LOADED SUCCESSFULLY\n")

# SHOW COLUMNS
print("COLUMNS:\n")
print(df.columns)

# SHOW FIRST 2 ROWS
print("\nFIRST 2 ROWS:\n")
print(df.head(2))

# CLEAN RESUME TEXT
print("\nCLEANING RESUME TEXT...\n")

df["cleaned_resume"] = df["Resume"].apply(clean_resume_text)

print("\nCLEANING COMPLETED\n")

# SHOW CLEANED OUTPUT
print(df[["Resume", "cleaned_resume"]].head(2))

# SAVE CLEANED DATASET
output_path = "ml/preprocessing/processed_data/cleaned_resume_dataset.csv"

df.to_csv(output_path, index=False)

print(f"\nCLEANED DATASET SAVED:\n{output_path}")