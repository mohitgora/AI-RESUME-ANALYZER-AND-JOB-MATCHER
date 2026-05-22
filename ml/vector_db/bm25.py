from rank_bm25 import BM25Okapi

class BM25Search:
    def __init__(self, documents):
        tokenized = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)
        self.docs = documents

    def search(self, query, top_k=5):
        scores = self.bm25.get_scores(query.lower().split())
        ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
        return [self.docs[i] for i in ranked[:top_k]]