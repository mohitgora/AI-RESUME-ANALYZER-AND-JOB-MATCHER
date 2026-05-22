# import pandas as pd

# from sklearn.feature_extraction.text import TfidfVectorizer

# from sklearn.model_selection import train_test_split

# from sklearn.linear_model import LogisticRegression


# from sklearn.metrics import accuracy_score


# import joblib


# # LOAD CLEANED DATASET
# df = pd.read_csv(
#     "ml/preprocessing/processed_data/cleaned_resume_dataset.csv"
# )

# print("\nDATASET LOADED\n")

# # FEATURES
# X = df["cleaned_resume"]

# # LABELS
# y = df["Category"]

# print("\nCREATING TF-IDF FEATURES...\n")

# # TF-IDF
# vectorizer = TfidfVectorizer(
#     max_features=5000
# )

# X_vectorized = vectorizer.fit_transform(X)

# print("\nTF-IDF COMPLETED\n")

# # TRAIN TEST SPLIT
# X_train, X_test, y_train, y_test = train_test_split(
#     X_vectorized,
#     y,
#     test_size=0.2,
#     random_state=42
# )

# print("\nTRAINING MODEL...\n")

# # MODEL
# model = LogisticRegression()

# model.fit(X_train, y_train)

# print("\nMODEL TRAINED\n")

# # PREDICTIONS
# y_pred = model.predict(X_test)

# # ACCURACY
# accuracy = accuracy_score(y_test, y_pred)

# print(f"\nMODEL ACCURACY: {accuracy * 100:.2f}%")

# # SAVE MODEL
# joblib.dump(
#     model,
#     "ml/classification/saved_models/resume_classifier.pkl"
# )

# # SAVE VECTORIZER
# joblib.dump(
#     vectorizer,
#     "ml/classification/vectorizers/tfidf_vectorizer.pkl"
# )

# print("\nMODEL AND VECTORIZER SAVED\n")


## by using logisticregression accuracy is 47% now ise increase karte hai by using LinearSVC...

import pandas as pd

import joblib

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split

from sklearn.svm import LinearSVC

from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report


# LOAD CLEANED DATASET
df = pd.read_csv(
    "ml/preprocessing/processed_data/cleaned_resume_dataset.csv"
)

print("\nDATASET LOADED\n")

# REMOVE NULL VALUES
df = df.dropna(subset=["cleaned_resume", "Category"])

# REMOVE RARE CATEGORIES
category_counts = df["Category"].value_counts()

valid_categories = category_counts[
    category_counts >= 5
].index

df = df[df["Category"].isin(valid_categories)]

print("\nRARE CATEGORIES REMOVED\n")

# FEATURES
X = df["cleaned_resume"]

# LABELS
y = df["Category"]

print("\nCREATING TF-IDF FEATURES...\n")

# IMPROVED TF-IDF
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 2),
    stop_words="english"
)

X_vectorized = vectorizer.fit_transform(X)

print("\nTF-IDF COMPLETED\n")

# TRAIN TEST SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTRAINING MODEL...\n")

# BETTER MODEL
model = LinearSVC()

# TRAIN MODEL
model.fit(X_train, y_train)

print("\nMODEL TRAINED\n")

# PREDICTIONS
y_pred = model.predict(X_test)

# ACCURACY
accuracy = accuracy_score(y_test, y_pred)

print(f"\nMODEL ACCURACY: {accuracy * 100:.2f}%")

# CLASSIFICATION REPORT
print("\nCLASSIFICATION REPORT:\n")

report = classification_report(y_test, y_pred)

print(report)

# SAVE REPORT
with open(
    "ml/classification/reports/classification_report.txt",
    "w"
) as file:

    file.write(report)

# SAVE MODEL
joblib.dump(
    model,
    "ml/classification/saved_models/resume_classifier.pkl"
)

# SAVE VECTORIZER
joblib.dump(
    vectorizer,
    "ml/classification/vectorizers/tfidf_vectorizer.pkl"
)

print("\nMODEL AND VECTORIZER SAVED\n")