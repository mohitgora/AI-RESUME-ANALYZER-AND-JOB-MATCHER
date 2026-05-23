from typing import List, Dict
from .ml_service import ml_service

class ATSService:
    
    @staticmethod
    def calculate_ats_score(resume_text: str, job_description: str) -> Dict:
        """Calculate comprehensive ATS score"""
        
        resume_skills = ml_service.extract_skills(resume_text)
        jd_skills = ml_service.extract_skills(job_description)
        
        skill_score = ATSService._calculate_skill_score(resume_skills, jd_skills)
        embedding_score = ATSService._calculate_embedding_score(resume_text, job_description)
        experience_score = ATSService._calculate_experience_score(resume_text)
        
        role = ml_service.predict_category(resume_text)
        role_boost = ATSService._calculate_role_boost(role, jd_skills)
        
        final_score = ATSService._calculate_final_score(
            skill_score, embedding_score, experience_score, role_boost
        )
        
        feedback = ATSService._generate_feedback(
            skill_score, embedding_score, experience_score, jd_skills, resume_skills
        )
        
        explanation = ATSService._generate_explanation(
            skill_score, embedding_score, experience_score, role
        )
        
        return {
            "role": role,
            "final_score": final_score,
            "embedding_score": embedding_score,
            "skill_score": skill_score,
            "experience_score": experience_score,
            "role_boost": role_boost,
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "feedback": feedback,
            "explanation": explanation,
        }
    
    @staticmethod
    def _calculate_skill_score(resume_skills: List[str], jd_skills: List[str]) -> float:
        """Calculate skill match percentage"""
        if not jd_skills:
            return 100.0
        
        matched = len(set(resume_skills) & set(jd_skills))
        return min(100.0, (matched / len(jd_skills)) * 100)
    
    @staticmethod
    def _calculate_embedding_score(resume_text: str, jd_text: str) -> float:
        """Calculate semantic similarity score"""
        similarity = ml_service.calculate_similarity(resume_text, jd_text)
        return min(100.0, similarity * 100)
    
    @staticmethod
    def _calculate_experience_score(resume_text: str) -> float:
        """Calculate experience score based on text length and keywords"""
        experience_keywords = [
            "year", "experience", "led", "managed", "developed", "built",
            "implemented", "designed", "architected", "optimized"
        ]
        
        text_lower = resume_text.lower()
        keyword_count = sum(1 for kw in experience_keywords if kw in text_lower)
        word_count = len(resume_text.split())
        
        experience_score = min(100.0, (keyword_count * 5) + (word_count / 100))
        return experience_score
    
    @staticmethod
    def _calculate_role_boost(role: str, jd_skills: List[str]) -> float:
        """Calculate role-based boost"""
        role_keywords = {
            "AI Engineer": ["ai", "ml", "llm", "langchain", "embedding"],
            "Data Scientist": ["data", "sql", "pandas", "numpy", "analytics"],
            "DevOps Engineer": ["docker", "kubernetes", "ci/cd", "aws"],
            "Frontend Developer": ["react", "angular", "vue", "javascript"],
        }
        
        boost = 0.0
        for role_name, keywords in role_keywords.items():
            if role == role_name:
                matched_keywords = sum(1 for kw in keywords if any(kw in skill.lower() for skill in jd_skills))
                boost = (matched_keywords / len(keywords)) * 15
        
        return boost
    
    @staticmethod
    def _calculate_final_score(skill_score: float, embedding_score: float, 
                               experience_score: float, role_boost: float) -> float:
        """Calculate weighted final ATS score"""
        weights = {
            "skill": 0.35,
            "embedding": 0.40,
            "experience": 0.25,
        }
        
        final_score = (
            (skill_score * weights["skill"]) +
            (embedding_score * weights["embedding"]) +
            (experience_score * weights["experience"]) +
            role_boost
        )
        
        return min(100.0, final_score)
    
    @staticmethod
    def _generate_feedback(skill_score: float, embedding_score: float, 
                          experience_score: float, jd_skills: List[str], 
                          resume_skills: List[str]) -> str:
        """Generate actionable feedback"""
        
        missing_skills = set(jd_skills) - set(resume_skills)
        
        if skill_score < 60:
            return f"Missing critical skills: {', '.join(list(missing_skills)[:3])}. Add relevant experience with required technologies."
        elif embedding_score < 70:
            return "Resume content doesn't closely match job description. Use more domain-specific terminology and keywords."
        elif experience_score < 60:
            return "Add more quantifiable achievements and specific project examples to strengthen experience section."
        else:
            return "Strong resume! Minor tweaks to keywords could improve match further."
    
    @staticmethod
    def _generate_explanation(skill_score: float, embedding_score: float, 
                             experience_score: float, role: str) -> str:
        """Generate explanation for the score"""
        
        return f"Score breakdown: Your resume shows strong alignment as {role} with {embedding_score:.0f}% semantic match, {skill_score:.0f}% skill coverage, and {experience_score:.0f}% experience level. Focus on the weak areas to improve overall competitiveness."

ats_service = ATSService()
