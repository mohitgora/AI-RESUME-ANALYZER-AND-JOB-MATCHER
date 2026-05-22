import numpy as np
from ml.skill_model.rank_model import RankModel

# fake training data (replace later with real dataset)
X = np.random.rand(100, 3)
y = np.random.rand(100)

model = RankModel()
model.train(X, y)

import pickle

with open("ml/skill_model/rank_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("RANK MODEL TRAINED")