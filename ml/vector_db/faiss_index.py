import faiss
import numpy as np


class FAISSVectorDB:
    def __init__(self, dim=384):
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.metadata = []  # store resume info

    def add_embeddings(self, embeddings, metadata):
        """
        embeddings: np.array (n, dim)
        metadata: list of dict (resume info)
        """
        self.index.add(np.array(embeddings).astype('float32'))
        self.metadata.extend(metadata)

    def search(self, query_vector, top_k=5):
        query_vector = np.array([query_vector]).astype('float32')

        distances, indices = self.index.search(query_vector, top_k)

        results = []
        for i in indices[0]:
            if i < len(self.metadata):
                results.append(self.metadata[i])

        return results