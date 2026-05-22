import re
import spacy
from nltk.corpus import stopwords
import nltk

# Download stopwords once
nltk.download('stopwords')

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# English stopwords
stop_words = set(stopwords.words("english"))


def clean_resume_text(text):
    """
    Cleans resume/job description text
    """

    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove emails
    text = re.sub(r'\S+@\S+', '', text)

    # Remove phone numbers
    text = re.sub(r'\d{10}', '', text)

    # Remove special characters
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)

    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()

    # Process with spaCy
    doc = nlp(text)

    cleaned_tokens = []

    for token in doc:

        # Remove stopwords
        if token.text in stop_words:
            continue

        # Remove short words
        if len(token.text) < 2:
            continue

        # Lemmatization
        cleaned_tokens.append(token.lemma_)

    return " ".join(cleaned_tokens)

# TEST
if __name__ == "__main__":

    sample_text = """
    Experienced Python Developer with Machine Learning skills.
    Email: test@gmail.com
    """

    cleaned = clean_resume_text(sample_text)

    print("\n CLEANED TEXT:\n")
    print(cleaned)