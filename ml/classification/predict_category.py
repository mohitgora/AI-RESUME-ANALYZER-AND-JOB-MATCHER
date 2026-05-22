import joblib
import pandas as pd

import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from preprocessing.clean_text import clean_resume_text


# LOAD MODEL
model = joblib.load(
    "ml/classification/saved_models/resume_classifier.pkl"
)

# LOAD VECTORIZER
vectorizer = joblib.load(
    "ml/classification/vectorizers/tfidf_vectorizer.pkl"
)

print("\nMODEL AND VECTORIZER LOADED\n")

# SAMPLE RESUME
resume_text = """
Experienced Python Developer with Machine Learning,
Deep Learning, NLP, TensorFlow,
FastAPI, Docker and SQL skills.
"""

# CLEAN TEXT
cleaned_text = clean_resume_text(
    resume_text
)

# VECTORIZE
vectorized_text = vectorizer.transform(
    [cleaned_text]
)

# PREDICT
prediction = model.predict(
    vectorized_text
)

predicted_category = prediction[0]

print("\nPREDICTED CATEGORY:\n")

print(predicted_category)

# CREATE RESULT DATAFRAME
result_df = pd.DataFrame({
    "resume_text": [resume_text],
    "cleaned_text": [cleaned_text],
    "predicted_category": [predicted_category]
})

# SAVE RESULTS
result_df.to_csv(
    "ml/classification/reports/prediction_results.csv",
    index=False
)

print("\nPREDICTION RESULTS SAVED\n")