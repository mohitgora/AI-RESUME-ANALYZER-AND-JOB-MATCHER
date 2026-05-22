import numpy as np

class HybridSearch:
    def __init__(self, faiss_db, bm25):
        self.faiss = faiss_db
        self.bm25 = bm25

    def search(self, query_vector, query_text, top_k=5):

        faiss_results = self.faiss.search(query_vector, top_k)
        bm25_results = self.bm25.search(query_text, top_k)

        # merge + deduplicate
        combined = faiss_results + bm25_results

        seen = set()
        final = []
        for r in combined:
            key = str(r)
            if key not in seen:
                final.append(r)
                seen.add(key)

        return final[:top_k]