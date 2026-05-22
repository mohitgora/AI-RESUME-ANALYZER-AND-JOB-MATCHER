import joblib
import sys, os
from functools import lru_cache

# PATH FIX
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
sys.path.append(os.path.abspath("ml"))

from ml.preprocessing.clean_text import clean_resume_text
from ml.embeddings.embeddings_utils import generate_embedding

from sklearn.metrics.pairwise import cosine_similarity

from backend.utils.logger import logger
from backend.db.database import cursor, conn

# LOAD MODEL
model = joblib.load("ml/classification/saved_models/resume_classifier.pkl")
vectorizer = joblib.load("ml/classification/vectorizers/tfidf_vectorizer.pkl")


# -----------------------------
# 💾 SAVE TO DB
# -----------------------------
def save_prediction(resume, category):
    cursor.execute(
        "INSERT INTO predictions (resume, category) VALUES (?, ?)",
        (resume, category)
    )
    conn.commit()


# -----------------------------
#  RULE-BASED (HIGHEST PRIORITY)
# -----------------------------
def rule_based_prediction(text):

    text = text.lower()

    if any(k in text for k in [
        "dsa", "data structures", "algorithms",
        "system design", "lld", "hld"
    ]):
        return "Software Engineer"

    if any(k in text for k in [
        "langchain", "llm", "gpt", "rag",
        "agentic ai", "generative ai"
    ]):
        return "AI / GenAI Engineer"

    if any(k in text for k in [
        "react", "frontend", "html", "css", "javascript"
    ]):
        return "Frontend Developer"

    return None


# -----------------------------
#  EMBEDDING BASED MATCH
# -----------------------------
category_map = {
    "Software Engineer": "coding dsa system design backend development",
    "Data Science": "machine learning data analysis statistics python",
    "AI / GenAI Engineer": "llm langchain generative ai rag agents",
    "Frontend Developer": "react javascript html css frontend ui",
}

def embedding_prediction(text):

    text_emb = generate_embedding(text)

    best_score = -1
    best_category = None

    for category, desc in category_map.items():
        cat_emb = generate_embedding(desc)

        score = cosine_similarity([text_emb], [cat_emb])[0][0]

        if score > best_score:
            best_score = score
            best_category = category

    return best_category


# -----------------------------
#  CACHING (ML fallback only)
# -----------------------------
@lru_cache(maxsize=100)
def cached_ml_prediction(text):
    cleaned = clean_resume_text(text)
    vector = vectorizer.transform([cleaned])
    return model.predict(vector)[0]


# -----------------------------
#  FINAL HYBRID FUNCTION
# -----------------------------
def predict_category(resume_text):

    logger.info("Prediction started")

    try:
        # 1️ RULE BASED (STRONGEST)
        rule_pred = rule_based_prediction(resume_text)
        if rule_pred:
            save_prediction(resume_text, rule_pred)
            logger.info(f"Rule-based prediction: {rule_pred}")
            return rule_pred

        # 2️ EMBEDDING BASED
        emb_pred = embedding_prediction(resume_text)

        # 3️ ML FALLBACK
        ml_pred = cached_ml_prediction(resume_text)

        final_pred = emb_pred if emb_pred else ml_pred

        # SAVE
        save_prediction(resume_text, final_pred)

        logger.info(f"Final prediction: {final_pred}")

        return final_pred

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise e