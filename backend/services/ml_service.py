import pickle
import json
import os
from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class MLService:
    def __init__(self):
        self.model_path = "models_data"
        os.makedirs(self.model_path, exist_ok=True)
        
        self.categories = [
            "AI Engineer", "Software Engineer", "Data Scientist", "DevOps Engineer",
            "Product Manager", "Frontend Developer", "Backend Developer", "ML Engineer",
            "Cloud Architect", "Security Engineer"
        ]
        
        self.tfidf = self._load_or_create_tfidf()
        self.classifier = self._load_or_create_classifier()
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embeddings_cache = self._load_embeddings_cache()
    
    def _load_or_create_tfidf(self):
        path = os.path.join(self.model_path, "tfidf_model.pkl")
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        
        vectorizer = TfidfVectorizer(max_features=5000, lowercase=True)
        sample_docs = [
            "Python machine learning deep learning tensorflow pytorch",
            "JavaScript React Vue Angular frontend development",
            "DevOps Kubernetes Docker infrastructure AWS",
            "Data analysis SQL pandas numpy scikit-learn"
        ]
        vectorizer.fit(sample_docs)
        
        with open(path, 'wb') as f:
            pickle.dump(vectorizer, f)
        return vectorizer
    
    def _load_or_create_classifier(self):
        path = os.path.join(self.model_path, "classifier_model.pkl")
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        
        X_train = self.tfidf.transform([
            "Python machine learning AI neural networks tensorflow deep learning",
            "JavaScript React Vue frontend HTML CSS web development",
            "DevOps Kubernetes Docker deployment infrastructure cloud",
            "Data science analytics SQL pandas numpy statistics",
            "Java Spring enterprise backend microservices",
            "Product management strategy roadmap",
            "Security authentication encryption cryptography",
            "Cloud AWS Azure GCP infrastructure",
            "DevOps CI/CD pipeline automation",
            "AI LLM NLP embeddings transformer"
        ])
        y_train = self.categories[:X_train.shape[0]]
        
        clf = MultinomialNB()
        clf.fit(X_train, y_train)
        
        with open(path, 'wb') as f:
            pickle.dump(clf, f)
        return clf
    
    def _load_embeddings_cache(self):
        path = os.path.join(self.model_path, "embeddings_cache.json")
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return {}
    
    def predict_category(self, resume_text: str) -> str:
        """Predict job category using hybrid approach"""
        X = self.tfidf.transform([resume_text.lower()])
        probs = self.classifier.predict_proba(X)[0]
        predicted_idx = np.argmax(probs)
        return self.categories[predicted_idx]
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        skills_db = {
            "python": ["python", "py"],
            "javascript": ["javascript", "js", "node"],
            "java": ["java"],
            "c++": ["c++", "cpp"],
            "sql": ["sql", "postgresql", "mysql"],
            "docker": ["docker", "containerization"],
            "kubernetes": ["kubernetes", "k8s"],
            "aws": ["aws", "amazon"],
            "azure": ["azure"],
            "gcp": ["gcp", "google cloud"],
            "react": ["react", "reactjs"],
            "angular": ["angular"],
            "vue": ["vue", "vuejs"],
            "fastapi": ["fastapi"],
            "django": ["django"],
            "langchain": ["langchain"],
            "pytorch": ["pytorch"],
            "tensorflow": ["tensorflow"],
            "pandas": ["pandas"],
            "numpy": ["numpy"],
            "scikit-learn": ["scikit-learn", "sklearn"],
            "llm": ["llm", "large language model"],
            "nlp": ["nlp", "natural language"],
            "embedding": ["embedding", "embeddings"],
            "git": ["git", "github", "gitlab"],
            "ci/cd": ["ci/cd", "jenkins", "gitlab-ci"],
            "agile": ["agile", "scrum", "sprint"],
            "rest api": ["rest api", "rest", "api"],
            "graphql": ["graphql"],
            "redis": ["redis", "caching"],
            "mongodb": ["mongodb", "nosql"],
        }
        
        text_lower = text.lower()
        found_skills = set()
        
        for skill, keywords in skills_db.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found_skills.add(skill.upper())
                    break
        
        return sorted(list(found_skills))
    
    def get_embeddings(self, text: str) -> np.ndarray:
        """Get sentence embeddings with caching"""
        if text in self.embeddings_cache:
            return np.array(self.embeddings_cache[text])
        
        embedding = self.embedding_model.encode(text)
        self.embeddings_cache[text] = embedding.tolist()
        
        # Save cache
        with open(os.path.join(self.model_path, "embeddings_cache.json"), 'w') as f:
            json.dump(self.embeddings_cache, f)
        
        return embedding
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity between two texts"""
        emb1 = self.get_embeddings(text1)
        emb2 = self.get_embeddings(text2)
        
        similarity = cosine_similarity([emb1], [emb2])[0][0]
        return float(similarity)

ml_service = MLService()
