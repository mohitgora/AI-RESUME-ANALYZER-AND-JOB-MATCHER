import os
import re
import json
import pickle
from typing import List, Dict, Tuple

import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer


class MLService:

    # ==========================================
    # INIT
    # ==========================================

    def __init__(self):

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        self.model_path = os.path.join(
            BASE_DIR,
            "..",
            "models_data"
        )

        os.makedirs(self.model_path, exist_ok=True)

        # ==========================================
        # JOB ROLES
        # ==========================================

        self.categories = [
            "AI Engineer",
            "ML Engineer",
            "Software Engineer",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Data Scientist",
            "DevOps Engineer",
            "Cloud Engineer",
            "Security Engineer",
            "Mobile App Developer",
            "Product Manager",
        ]

        # ==========================================
        # EMBEDDING MODEL
        # ==========================================

        self.embedding_model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        # ==========================================
        # LOAD MODEL
        # ==========================================

        self.classifier = self._load_or_train_classifier()

        # ==========================================
        # LOAD CACHE
        # ==========================================

        self.embeddings_cache = self._load_embeddings_cache()

        # ==========================================
        # SKILLS DATABASE
        # ==========================================

        self.skills_db = self._build_skills_database()

    # ==========================================
    # TRAIN / LOAD CLASSIFIER
    # ==========================================

    def _load_or_train_classifier(self):

        model_path = os.path.join(
            self.model_path,
            "resume_classifier.pkl"
        )

        if os.path.exists(model_path):

            with open(model_path, "rb") as f:
                return pickle.load(f)

        # ==========================================
        # TRAINING DATA
        # ==========================================

        train_texts = [

            # AI / ML
            "python pytorch tensorflow llm langchain rag transformers ai ml deep learning",
            "machine learning neural networks embeddings huggingface nlp generative ai",
            "computer vision opencv cnn deep learning pytorch",

            # Software Engineer
            "java spring boot backend api microservices sql system design",
            "software engineer dsa algorithms backend development scalable systems",
            "python fastapi django backend rest api architecture",

            # Frontend
            "react nextjs javascript typescript redux frontend ui ux tailwind",
            "frontend developer html css react vite angular web development",

            # Full Stack
            "mern stack react node mongodb express full stack web application",
            "full stack developer nextjs fastapi postgres redis docker",

            # DevOps
            "docker kubernetes aws ci cd terraform jenkins infrastructure",
            "devops cloud deployment monitoring linux nginx",

            # Data Science
            "pandas numpy matplotlib seaborn statistics analytics sql data science",
            "data visualization machine learning analytics tableau powerbi",

            # Security
            "penetration testing cybersecurity owasp burp suite xss csrf siem",
            "security engineer encryption authentication network security",

            # Cloud
            "aws azure gcp cloud architecture infrastructure lambda ec2 s3",

            # Mobile
            "flutter react native android ios kotlin mobile development",

            # Product
            "roadmap stakeholder agile scrum product management business strategy"
        ]

        train_labels = [

            "AI Engineer",
            "ML Engineer",
            "AI Engineer",

            "Backend Developer",
            "Software Engineer",
            "Backend Developer",

            "Frontend Developer",
            "Frontend Developer",

            "Full Stack Developer",
            "Full Stack Developer",

            "DevOps Engineer",
            "DevOps Engineer",

            "Data Scientist",
            "Data Scientist",

            "Security Engineer",
            "Security Engineer",

            "Cloud Engineer",

            "Mobile App Developer",

            "Product Manager"
        ]

        # ==========================================
        # PIPELINE
        # ==========================================

        model = Pipeline([
            (
                "tfidf",
                TfidfVectorizer(
                    max_features=15000,
                    ngram_range=(1, 2),
                    stop_words="english"
                )
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=5000,
                    class_weight="balanced"
                )
            )
        ])

        model.fit(train_texts, train_labels)

        with open(model_path, "wb") as f:
            pickle.dump(model, f)

        return model

    # ==========================================
    # SKILLS DATABASE
    # ==========================================

    def _build_skills_database(self):

        return {

            # LANGUAGES
            "python": [
                "python",
                "py"
            ],

            "javascript": [
                "javascript",
                "js"
            ],

            "typescript": [
                "typescript",
                "ts"
            ],

            "java": [
                "java",
                "spring"
            ],

            "c++": [
                "c++",
                "cpp"
            ],

            "go": [
                "golang",
                "go"
            ],

            # FRONTEND
            "react": [
                "react",
                "reactjs"
            ],

            "nextjs": [
                "nextjs",
                "next.js"
            ],

            "angular": [
                "angular"
            ],

            "vue": [
                "vue",
                "vuejs"
            ],

            "redux": [
                "redux"
            ],

            "tailwind": [
                "tailwind",
                "tailwindcss"
            ],

            # BACKEND
            "fastapi": [
                "fastapi"
            ],

            "django": [
                "django"
            ],

            "flask": [
                "flask"
            ],

            "nodejs": [
                "node",
                "nodejs"
            ],

            "express": [
                "express",
                "expressjs"
            ],

            # DATABASES
            "mongodb": [
                "mongodb"
            ],

            "mysql": [
                "mysql"
            ],

            "postgresql": [
                "postgresql",
                "postgres"
            ],

            "redis": [
                "redis"
            ],

            # CLOUD / DEVOPS
            "docker": [
                "docker"
            ],

            "kubernetes": [
                "kubernetes",
                "k8s"
            ],

            "aws": [
                "aws",
                "amazon web services"
            ],

            "azure": [
                "azure"
            ],

            "gcp": [
                "gcp",
                "google cloud"
            ],

            "terraform": [
                "terraform"
            ],

            "jenkins": [
                "jenkins"
            ],

            "ci/cd": [
                "ci/cd",
                "github actions",
                "gitlab ci"
            ],

            # AI / ML
            "machine learning": [
                "machine learning",
                "ml"
            ],

            "deep learning": [
                "deep learning",
                "dl"
            ],

            "tensorflow": [
                "tensorflow"
            ],

            "pytorch": [
                "pytorch"
            ],

            "langchain": [
                "langchain"
            ],

            "llm": [
                "llm",
                "large language model"
            ],

            "rag": [
                "rag",
                "retrieval augmented generation"
            ],

            "nlp": [
                "nlp",
                "natural language processing"
            ],

            "huggingface": [
                "huggingface",
                "transformers"
            ],

            "computer vision": [
                "opencv",
                "computer vision"
            ],

            # DATA SCIENCE
            "pandas": [
                "pandas"
            ],

            "numpy": [
                "numpy"
            ],

            "scikit-learn": [
                "scikit-learn",
                "sklearn"
            ],

            "powerbi": [
                "power bi",
                "powerbi"
            ],

            "tableau": [
                "tableau"
            ],

            # SECURITY
            "owasp": [
                "owasp"
            ],

            "burp suite": [
                "burp suite"
            ],

            "xss": [
                "xss"
            ],

            "csrf": [
                "csrf"
            ],

            "penetration testing": [
                "penetration testing",
                "pentesting"
            ],

            # TOOLS
            "git": [
                "git",
                "github",
                "gitlab"
            ],

            "linux": [
                "linux"
            ],

            "rest api": [
                "rest api",
                "restful api"
            ],

            "graphql": [
                "graphql"
            ]
        }

    # ==========================================
    # EMBEDDING CACHE
    # ==========================================

    def _load_embeddings_cache(self):

        cache_path = os.path.join(
            self.model_path,
            "embeddings_cache.json"
        )

        if os.path.exists(cache_path):

            with open(cache_path, "r") as f:
                return json.load(f)

        return {}

    # ==========================================
    # CLEAN TEXT
    # ==========================================

    def clean_text(self, text: str) -> str:

        text = text.lower()

        text = re.sub(r"http\S+", "", text)

        text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)

        text = re.sub(r"\s+", " ", text)

        return text.strip()

    # ==========================================
    # ROLE PREDICTION
    # ==========================================

    def predict_category(self, resume_text: str) -> Dict:

        text = self.clean_text(resume_text)

        prediction = self.classifier.predict([text])[0]

        probabilities = self.classifier.predict_proba([text])[0]

        confidence = np.max(probabilities) * 100

        top_predictions = sorted(
            zip(
                self.classifier.classes_,
                probabilities
            ),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        return {
            "predicted_role": prediction,
            "confidence": round(confidence, 2),
            "top_predictions": [
                {
                    "role": role,
                    "probability": round(prob * 100, 2)
                }
                for role, prob in top_predictions
            ]
        }

    # ==========================================
    # SKILL EXTRACTION
    # ==========================================

    def extract_skills(self, text: str) -> List[str]:

        text = self.clean_text(text)

        extracted = set()

        for skill, keywords in self.skills_db.items():

            for keyword in keywords:

                pattern = r"\b" + re.escape(keyword) + r"\b"

                if re.search(pattern, text):

                    extracted.add(skill.upper())
                    break

        return sorted(list(extracted))

    # ==========================================
    # GET EMBEDDINGS
    # ==========================================

    def get_embeddings(self, text: str):

        text = self.clean_text(text)

        if text in self.embeddings_cache:

            return np.array(
                self.embeddings_cache[text]
            )

        embedding = self.embedding_model.encode(
            text
        )

        self.embeddings_cache[text] = (
            embedding.tolist()
        )

        cache_path = os.path.join(
            self.model_path,
            "embeddings_cache.json"
        )

        with open(cache_path, "w") as f:

            json.dump(
                self.embeddings_cache,
                f
            )

        return embedding

    # ==========================================
    # SIMILARITY
    # ==========================================

    def calculate_similarity(
        self,
        text1: str,
        text2: str
    ) -> float:

        emb1 = self.get_embeddings(text1)

        emb2 = self.get_embeddings(text2)

        similarity = cosine_similarity(
            [emb1],
            [emb2]
        )[0][0]

        return float(similarity)

    # ==========================================
    # EXPERIENCE ESTIMATION
    # ==========================================

    def estimate_experience_years(
        self,
        text: str
    ) -> int:

        text = text.lower()

        patterns = [
            r"(\d+)\+?\s+years",
            r"(\d+)\+?\s+yrs",
            r"experience\s+of\s+(\d+)"
        ]

        years = []

        for pattern in patterns:

            matches = re.findall(pattern, text)

            years.extend([
                int(m)
                for m in matches
            ])

        if years:
            return max(years)

        return 0

    # ==========================================
    # KEYWORD COVERAGE
    # ==========================================

    def keyword_coverage(
        self,
        resume_text: str,
        jd_text: str
    ) -> Dict:

        resume_skills = set(
            self.extract_skills(resume_text)
        )

        jd_skills = set(
            self.extract_skills(jd_text)
        )

        matched = resume_skills.intersection(
            jd_skills
        )

        missing = jd_skills - resume_skills

        score = 0

        if len(jd_skills) > 0:

            score = (
                len(matched)
                / len(jd_skills)
            ) * 100

        return {
            "score": round(score, 2),
            "matched_skills": sorted(list(matched)),
            "missing_skills": sorted(list(missing))
        }

    # ==========================================
    # COMPLETE ANALYSIS
    # ==========================================

    def analyze_resume(
        self,
        resume_text: str,
        jd_text: str
    ) -> Dict:

        role_data = self.predict_category(
            resume_text
        )

        keyword_data = self.keyword_coverage(
            resume_text,
            jd_text
        )

        similarity_score = (
            self.calculate_similarity(
                resume_text,
                jd_text
            ) * 100
        )

        experience_years = (
            self.estimate_experience_years(
                resume_text
            )
        )

        final_score = (
            similarity_score * 0.5
            + keyword_data["score"] * 0.4
            + min(experience_years * 5, 10)
        )

        return {

            "predicted_role":
                role_data["predicted_role"],

            "role_confidence":
                role_data["confidence"],

            "top_predictions":
                role_data["top_predictions"],

            "similarity_score":
                round(similarity_score, 2),

            "keyword_score":
                keyword_data["score"],

            "matched_skills":
                keyword_data["matched_skills"],

            "missing_skills":
                keyword_data["missing_skills"],

            "experience_years":
                experience_years,

            "final_score":
                round(min(final_score, 100), 2)
        }


ml_service = MLService()
