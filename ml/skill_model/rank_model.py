import numpy as np
from sklearn.ensemble import RandomForestRegressor

class RankModel:

    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=50)

    def train(self, X, y):
        self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)