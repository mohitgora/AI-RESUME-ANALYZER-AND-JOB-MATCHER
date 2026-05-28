from typing import Dict, List
import numpy as np

from .ml_service import ml_service


class SemanticService:

    # ==========================================
    # MAIN SEMANTIC ANALYSIS
    # ==========================================

    @staticmethod
    def analyze_resume_match(
        resume_text: str,
        job_description: str
    ) -> Dict:

        """
        Production-grade semantic analysis
        """

        # ==========================================
        # BASIC VALIDATION
        # ==========================================

        if not resume_text or len(resume_text.strip()) < 50:
            raise ValueError("Resume text too short")

        if not job_description or len(job_description.strip()) < 50:
            raise ValueError("Job description too short")

        # ==========================================
        # OVERALL SIMILARITY
        # ==========================================

        overall_similarity = (
            ml_service.calculate_similarity(
                resume_text,
                job_description
            )
        )

        semantic_score = round(
            overall_similarity * 100,
            2
        )

        # ==========================================
        # SKILLS ANALYSIS
        # ==========================================

        resume_skills = (
            ml_service.extract_skills(
                resume_text
            )
        )

        jd_skills = (
            ml_service.extract_skills(
                job_description
            )
        )

        matched_skills = sorted(
            list(
                set(resume_skills)
                &
                set(jd_skills)
            )
        )

        missing_skills = sorted(
            list(
                set(jd_skills)
                -
                set(resume_skills)
            )
        )

        skill_match_score = (
            SemanticService._calculate_skill_match_score(
                matched_skills,
                jd_skills
            )
        )

        # ==========================================
        # ROLE PREDICTION
        # ==========================================

        predicted_role = (
            ml_service.predict_category(
                resume_text
            )
        )

        # ==========================================
        # EXPERIENCE ANALYSIS
        # ==========================================

        experience_score = (
            SemanticService._calculate_experience_relevance(
                resume_text,
                job_description
            )
        )

        # ==========================================
        # FINAL SCORE
        # ==========================================

        final_score = round(

            (
                semantic_score * 0.50
            ) +

            (
                skill_match_score * 0.35
            ) +

            (
                experience_score * 0.15
            ),

            2
        )

        # ==========================================
        # MATCH LEVEL
        # ==========================================

        match_level = (
            SemanticService._get_match_level(
                final_score
            )
        )

        # ==========================================
        # FEEDBACK
        # ==========================================

        feedback = (
            SemanticService._generate_feedback(
                final_score,
                missing_skills,
                semantic_score,
                experience_score
            )
        )

        return {

            "predicted_role":
                predicted_role,

            "semantic_score":
                semantic_score,

            "skill_match_score":
                skill_match_score,

            "experience_score":
                experience_score,

            "final_score":
                final_score,

            "match_level":
                match_level,

            "matched_skills":
                matched_skills,

            "missing_skills":
                missing_skills,

            "resume_skills":
                resume_skills,

            "job_description_skills":
                jd_skills,

            "feedback":
                feedback
        }

    # ==========================================
    # BASIC SIMILARITY
    # ==========================================

    @staticmethod
    def calculate_semantic_similarity(
        resume_text: str,
        job_description: str
    ) -> float:

        similarity = (
            ml_service.calculate_similarity(
                resume_text,
                job_description
            )
        )

        return round(
            similarity * 100,
            2
        )

    # ==========================================
    # SKILL MATCH SCORE
    # ==========================================

    @staticmethod
    def _calculate_skill_match_score(
        matched_skills: List[str],
        jd_skills: List[str]
    ) -> float:

        if not jd_skills:
            return 100.0

        score = (
            len(matched_skills)
            /
            len(jd_skills)
        ) * 100

        return round(
            min(score, 100.0),
            2
        )

    # ==========================================
    # EXPERIENCE RELEVANCE
    # ==========================================

    @staticmethod
    def _calculate_experience_relevance(
        resume_text: str,
        job_description: str
    ) -> float:

        important_keywords = [

            "developed",
            "implemented",
            "designed",
            "built",
            "optimized",
            "deployed",
            "engineered",
            "managed",
            "architecture",
            "microservices",
            "api",
            "scalable",
            "cloud",
            "ai",
            "machine learning"
        ]

        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()

        relevant_matches = 0

        for keyword in important_keywords:

            if (
                keyword in jd_lower
                and
                keyword in resume_lower
            ):
                relevant_matches += 1

        score = (
            relevant_matches
            /
            len(important_keywords)
        ) * 100

        return round(
            min(score, 100.0),
            2
        )

    # ==========================================
    # MATCH LEVEL
    # ==========================================

    @staticmethod
    def _get_match_level(
        score: float
    ) -> str:

        if score >= 85:
            return "EXCELLENT MATCH"

        elif score >= 70:
            return "STRONG MATCH"

        elif score >= 55:
            return "MODERATE MATCH"

        elif score >= 40:
            return "WEAK MATCH"

        return "POOR MATCH"

    # ==========================================
    # FEEDBACK
    # ==========================================

    @staticmethod
    def _generate_feedback(
        final_score: float,
        missing_skills: List[str],
        semantic_score: float,
        experience_score: float
    ) -> List[str]:

        feedback = []

        # Overall score
        if final_score >= 80:

            feedback.append(
                "Resume strongly aligns with the job description."
            )

        elif final_score >= 60:

            feedback.append(
                "Resume has moderate alignment with the role."
            )

        else:

            feedback.append(
                "Resume requires major improvements for this role."
            )

        # Missing skills
        if missing_skills:

            feedback.append(
                f"Missing important skills: {', '.join(missing_skills[:5])}"
            )

        # Semantic score
        if semantic_score < 65:

            feedback.append(
                "Use more role-specific keywords and terminology."
            )

        # Experience score
        if experience_score < 50:

            feedback.append(
                "Add more project impact and measurable achievements."
            )

        # Strong profile
        if final_score > 85:

            feedback.append(
                "Your profile is highly competitive for this position."
            )

        return feedback


semantic_service = SemanticService()
