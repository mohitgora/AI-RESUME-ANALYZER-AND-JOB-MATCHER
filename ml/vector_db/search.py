import pickle
from ml.embeddings.embeddings_utils import generate_embedding


with open("ml/vector_db/storage/faiss_db.pkl", "rb") as f:
    db = pickle.load(f)


def hybrid_score(resume, query):
    resume_text = resume.get("cleaned_resume", "")
    query_words = query.lower().split()

    match = sum(1 for w in query_words if w in resume_text.lower())
    return match


def search_resumes(query, top_k=5):

    query_vector = generate_embedding(query)

    results = db.search(query_vector, top_k=top_k)

    #  rerank layer (NEW)
    for r in results:
        r["hybrid_score"] = hybrid_score(r, query)

    # sort again
    results = sorted(
        results,
        key=lambda x: x.get("hybrid_score", 0),
        reverse=True
    )

    return results