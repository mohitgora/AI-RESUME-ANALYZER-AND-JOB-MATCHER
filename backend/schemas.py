from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PredictRequest(BaseModel):
    resume_text: str

class PredictResponse(BaseModel):
    category: str

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

class ATSResponse(BaseModel):
    role: str
    final_score: float
    embedding_score: float
    skill_score: float
    experience_score: float
    role_boost: float
    resume_skills: List[str]
    jd_skills: List[str]
    feedback: str
    explanation: str

class SemanticRequest(BaseModel):
    resume_text: str
    job_description: str

class SemanticResponse(BaseModel):
    similarity_score: float

class ResumeSchema(BaseModel):
    id: str
    filename: Optional[str]
    detected_role: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalysisSchema(BaseModel):
    id: str
    analysis_type: str
    ats_final_score: Optional[float]
    semantic_score: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True
