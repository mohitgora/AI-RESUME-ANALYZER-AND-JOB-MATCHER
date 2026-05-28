from typing import List, Dict, Tuple
from collections import Counter
import re
import numpy as np

from sentence_transformers import util
from .ml_service import ml_service


class ATSService:

    # =========================
    # CONFIG
    # =========================

    WEIGHTS = {
        "semantic": 0.35,
        "skills": 0.30,
        "experience": 0.15,
        "projects": 0.10,
        "formatting": 0.05,
        "role_alignment": 0.05,
    }

    # =========================
    # SKILL NORMALIZATION
    # =========================

    SKILL_ALIASES = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node",
        "nodejs": "node",
        "express.js": "express",
        "next.js": "nextjs",
        "machine learning": "ml",
        "deep learning": "dl",
        "artificial intelligence": "ai",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "k8s": "kubernetes",
        "ci/cd": "cicd",
    }

    ROLE_KEYWORDS = {
        "AI Engineer": [
            "llm",
            "langchain",
            "transformer",
            "huggingface",
            "embedding",
            "rag",
            "pytorch",
            "tensorflow",
            "ai",
            "ml"
        ],

        "Data Scientist": [
            "pandas",
            "numpy",
            "matplotlib",
            "analytics",
            "statistics",
            "sql",
            "data analysis"
        ],

        "Frontend Developer": [
            "react",
            "nextjs",
            "javascript",
            "typescript",
            "tailwind",
            "redux",
            "css"
        ],

        "Backend Developer": [
            "fastapi",
            "django",
            "flask",
            "node",
            "express",
            "api",
            "microservices"
        ],

        "DevOps Engineer": [
            "docker",
            "kubernetes",
            "jenkins",
            "aws",
            "terraform",
            "linux",
            "cicd"
        ],

        "Security Engineer": [
            "penetration testing",
            "siem",
            "burp suite",
            "owasp",
            "xss",
            "csrf",
            "cybersecurity"
        ]
    }

    # =========================
    # MAIN FUNCTION
    # =========================

    @staticmethod
    def calculate_ats_score(
        resume_text: str,
        job_description: str
    ) -> Dict:

        resume_text = ATSService._clean_text(resume_text)
        job_description = ATSService._clean_text(job_description)

        # =========================
        # EXTRACT SKILLS
        # =========================

        resume_skills = ATSService._normalize_skills(
            ml_service.extract_skills(resume_text)
        )

        jd_skills = ATSService._normalize_skills(
            ml_service.extract_skills(job_description)
        )

        # =========================
        # SCORES
        # =========================

        semantic_score = ATSService._calculate_semantic_score(
            resume_text,
            job_description
        )

        skill_score, matched_skills, missing_skills = (
            ATSService._calculate_skill_score(
                resume_skills,
                jd_skills
            )
        )

        experience_score = ATSService._calculate_experience_score(
            resume_text
        )

        project_score = ATSService._calculate_project_score(
            resume_text,
            jd_skills
        )

        formatting_score = ATSService._calculate_formatting_score(
            resume_text
        )

        role, role_confidence = ATSService._predict_role(
            resume_skills
        )

        role_alignment_score = ATSService._calculate_role_alignment(
            role,
            jd_skills
        )

        # =========================
        # FINAL SCORE
        # =========================

        final_score = ATSService._calculate_final_score(
            semantic_score,
            skill_score,
            experience_score,
            project_score,
            formatting_score,
            role_alignment_score
        )

        # =========================
        # FEEDBACK
        # =========================

        feedback = ATSService._generate_feedback(
            final_score,
            missing_skills,
            semantic_score,
            experience_score,
            formatting_score
        )

        explanation = ATSService._generate_explanation(
            role,
            semantic_score,
            skill_score,
            experience_score,
            project_score
        )

        return {
            "predicted_role": role,
            "role_confidence": round(role_confidence, 2),

            "final_score": round(final_score, 2),

            "semantic_score": round(semantic_score, 2),
            "skill_score": round(skill_score, 2),
            "experience_score": round(experience_score, 2),
            "project_score": round(project_score, 2),
            "formatting_score": round(formatting_score, 2),
            "role_alignment_score": round(role_alignment_score, 2),

            "resume_skills": resume_skills,
            "jd_skills": jd_skills,

            "matched_skills": matched_skills,
            "missing_skills": missing_skills,

            "feedback": feedback,
            "explanation": explanation,
        }

    # =========================
    # CLEANING
    # =========================

    @staticmethod
    def _clean_text(text: str) -> str:
        text = text.lower()
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    # =========================
    # NORMALIZE SKILLS
    # =========================

    @staticmethod
    def _normalize_skills(skills: List[str]) -> List[str]:

        normalized = []

        for skill in skills:
            s = skill.lower().strip()

            if s in ATSService.SKILL_ALIASES:
                s = ATSService.SKILL_ALIASES[s]

            normalized.append(s)

        return list(set(normalized))

    # =========================
    # SEMANTIC SCORE
    # =========================

    @staticmethod
    def _calculate_semantic_score(
        resume_text: str,
        jd_text: str
    ) -> float:

        similarity = ml_service.calculate_similarity(
            resume_text,
            jd_text
        )

        return min(100.0, similarity * 100)

    # =========================
    # SKILL SCORE
    # =========================

    @staticmethod
    def _calculate_skill_score(
        resume_skills: List[str],
        jd_skills: List[str]
    ) -> Tuple[float, List[str], List[str]]:

        if not jd_skills:
            return 100.0, [], []

        matched = []
        missing = []

        for jd_skill in jd_skills:

            found = False

            for resume_skill in resume_skills:

                similarity = ATSService._skill_similarity(
                    jd_skill,
                    resume_skill
                )

                if similarity >= 0.75:
                    matched.append(jd_skill)
                    found = True
                    break

            if not found:
                missing.append(jd_skill)

        score = (len(matched) / len(jd_skills)) * 100

        return score, matched, missing

    # =========================
    # SKILL SIMILARITY
    # =========================

    @staticmethod
    def _skill_similarity(skill1: str, skill2: str) -> float:

        emb1 = ml_service.embedding_model.encode(
            skill1,
            convert_to_tensor=True
        )

        emb2 = ml_service.embedding_model.encode(
            skill2,
            convert_to_tensor=True
        )

        similarity = util.cos_sim(emb1, emb2).item()

        return similarity

    # =========================
    # EXPERIENCE SCORE
    # =========================

    @staticmethod
    def _calculate_experience_score(
        resume_text: str
    ) -> float:

        score = 0

        achievement_patterns = [
            r"\d+%",
            r"\$\d+",
            r"\d+x",
            r"increased",
            r"improved",
            r"reduced",
            r"optimized",
            r"scaled",
            r"led",
            r"built",
            r"developed",
            r"implemented"
        ]

        for pattern in achievement_patterns:
            matches = re.findall(pattern, resume_text)
            score += len(matches) * 5

        word_count = len(resume_text.split())

        if word_count > 300:
            score += 20

        if word_count > 600:
            score += 10

        return min(score, 100)

    # =========================
    # PROJECT SCORE
    # =========================

    @staticmethod
    def _calculate_project_score(
        resume_text: str,
        jd_skills: List[str]
    ) -> float:

        project_keywords = [
            "project",
            "developed",
            "built",
            "created",
            "designed",
            "implemented"
        ]

        score = 0

        for keyword in project_keywords:
            if keyword in resume_text:
                score += 10

        for skill in jd_skills:
            if skill in resume_text:
                score += 3

        return min(score, 100)

    # =========================
    # FORMATTING SCORE
    # =========================

    @staticmethod
    def _calculate_formatting_score(
        resume_text: str
    ) -> float:

        score = 100

        if len(resume_text.split()) < 150:
            score -= 30

        important_sections = [
            "experience",
            "skills",
            "education",
            "project"
        ]

        for section in important_sections:
            if section not in resume_text:
                score -= 10

        return max(score, 0)

    # =========================
    # ROLE PREDICTION
    # =========================

    @staticmethod
    def _predict_role(
        resume_skills: List[str]
    ) -> Tuple[str, float]:

        role_scores = {}

        for role, keywords in ATSService.ROLE_KEYWORDS.items():

            matches = 0

            for keyword in keywords:
                for skill in resume_skills:

                    similarity = ATSService._skill_similarity(
                        keyword,
                        skill
                    )

                    if similarity >= 0.70:
                        matches += 1

            role_scores[role] = matches / len(keywords)

        best_role = max(role_scores, key=role_scores.get)

        confidence = role_scores[best_role] * 100

        return best_role, confidence

    # =========================
    # ROLE ALIGNMENT
    # =========================

    @staticmethod
    def _calculate_role_alignment(
        role: str,
        jd_skills: List[str]
    ) -> float:

        if role not in ATSService.ROLE_KEYWORDS:
            return 50.0

        role_keywords = ATSService.ROLE_KEYWORDS[role]

        matched = 0

        for keyword in role_keywords:
            if keyword in jd_skills:
                matched += 1

        return (matched / len(role_keywords)) * 100

    # =========================
    # FINAL SCORE
    # =========================

    @staticmethod
    def _calculate_final_score(
        semantic_score: float,
        skill_score: float,
        experience_score: float,
        project_score: float,
        formatting_score: float,
        role_alignment_score: float
    ) -> float:

        final_score = (
            semantic_score * ATSService.WEIGHTS["semantic"] +
            skill_score * ATSService.WEIGHTS["skills"] +
            experience_score * ATSService.WEIGHTS["experience"] +
            project_score * ATSService.WEIGHTS["projects"] +
            formatting_score * ATSService.WEIGHTS["formatting"] +
            role_alignment_score * ATSService.WEIGHTS["role_alignment"]
        )

        return min(final_score, 100)

    # =========================
    # FEEDBACK
    # =========================

    @staticmethod
    def _generate_feedback(
        final_score: float,
        missing_skills: List[str],
        semantic_score: float,
        experience_score: float,
        formatting_score: float
    ) -> List[str]:

        feedback = []

        if missing_skills:
            feedback.append(
                f"Add missing skills: {', '.join(missing_skills[:5])}"
            )

        if semantic_score < 70:
            feedback.append(
                "Resume content is not strongly aligned with job description."
            )

        if experience_score < 60:
            feedback.append(
                "Add quantified achievements and measurable impact."
            )

        if formatting_score < 80:
            feedback.append(
                "Improve resume structure with proper sections."
            )

        if final_score >= 85:
            feedback.append(
                "Excellent resume match for this role."
            )

        return feedback

    # =========================
    # EXPLANATION
    # =========================

    @staticmethod
    def _generate_explanation(
        role: str,
        semantic_score: float,
        skill_score: float,
        experience_score: float,
        project_score: float
    ) -> str:

        return (
            f"The resume is most aligned with the role "
            f"'{role}'. Semantic relevance is "
            f"{semantic_score:.0f}%, skill alignment is "
            f"{skill_score:.0f}%, experience quality is "
            f"{experience_score:.0f}%, and project relevance "
            f"is {project_score:.0f}%."
        )


ats_service = ATSService()
