from sentence_transformers import SentenceTransformer

# ONE GLOBAL MODEL (IMPORTANT)
model = SentenceTransformer("all-MiniLM-L6-v2")  # 384-dim fixed model


def generate_embedding(text: str):
    if not isinstance(text, str):
        text = str(text)

    return model.encode(text)