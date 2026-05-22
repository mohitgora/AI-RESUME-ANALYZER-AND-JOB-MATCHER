import numpy as np

def cosine(a, b):
    a = np.array(a)
    b = np.array(b)

    a = a / (np.linalg.norm(a) + 1e-8)
    b = b / (np.linalg.norm(b) + 1e-8)

    return np.dot(a, b)


def normalize_score(score):
    return max(0, min(100, score))