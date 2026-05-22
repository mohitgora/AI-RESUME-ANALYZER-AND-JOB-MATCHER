import numpy as np

def learning_to_rank(emb, skill, exp, bm25=0):

    # FAANG-style weighted ranking model (simulated LTR)
    score = (
        0.45 * emb +
        0.35 * skill +
        0.15 * exp +
        0.05 * bm25
    )

    # sigmoid calibration (important for realism)
    return 100 * (1 / (1 + np.exp(-score / 20)))