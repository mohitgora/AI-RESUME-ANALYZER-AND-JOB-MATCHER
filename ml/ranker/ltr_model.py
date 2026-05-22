import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

class LTRModel:
    def __init__(self):
        self.model = GradientBoostingRegressor()

    def train(self, X, y):
        self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)


def build_features(emb_score, skill_score, exp_score):
    return np.array([emb_score, skill_score, exp_score]).reshape(1, -1)