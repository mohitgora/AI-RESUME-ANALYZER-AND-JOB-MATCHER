from .ml_service import ml_service

class SemanticService:
    
    @staticmethod
    def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
        """Calculate semantic similarity using embeddings"""
        similarity = ml_service.calculate_similarity(resume_text, job_description)
        return float(similarity)

semantic_service = SemanticService()
