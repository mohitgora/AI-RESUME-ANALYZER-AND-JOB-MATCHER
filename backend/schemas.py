from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime


# =========================================
# COMMON BASE CONFIG
# =========================================
class BaseSchema(BaseModel):
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {}
        }
    }


# =========================================
# PREDICT SCHEMAS
# =========================================
class PredictRequest(BaseSchema):
    resume_text: str = Field(
        ...,
        min_length=50,
        description="Extracted resume text"
    )

    @field_validator("resume_text")
    @classmethod
    def validate_resume(cls, value):
        if not value.strip():
            raise ValueError("Resume text cannot be empty")
        return value.strip()


class PredictResponse(BaseSchema):
    category: str
    confidence: float
    top_predictions: List[Dict[str, Any]]
    extracted_skills: List[str]
    experience_years: float
    candidate_level: str


# =========================================
# ATS SCHEMAS
# =========================================
class ATSRequest(BaseSchema):
    resume_text: str = Field(
        ...,
        min_length=50,
        description="Resume content"
    )

    job_description: str = Field(
        ...,
        min_length=50,
        description="Job description content"
    )

    @field_validator("resume_text", "job_description")
    @classmethod
    def validate_text(cls, value):
        if not value.strip():
            raise ValueError("Text cannot be empty")
        return value.strip()


class ATSResponse(BaseSchema):
    role: str

    # FINAL SCORES
    final_score: float
    semantic_score: float
    skill_score: float
    keyword_score: float
    experience_score: float
    project_score: float
    education_score: float
    role_match_score: float

    # ANALYSIS
    confidence: float
    candidate_level: str
    experience_years: float

    # SKILLS
    resume_skills: List[str]
    jd_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]

    # KEYWORDS
    matched_keywords: List[str]
    missing_keywords: List[str]

    # FEEDBACK
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

    # DETAILED INSIGHTS
    explanation: str

    # OPTIONAL EXTRA METADATA
    metadata: Optional[Dict[str, Any]] = None


# =========================================
# SEMANTIC MATCHING
# =========================================
class SemanticRequest(BaseSchema):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=50)

    @field_validator("resume_text", "job_description")
    @classmethod
    def validate_text(cls, value):
        if not value.strip():
            raise ValueError("Text cannot be empty")
        return value.strip()


class SemanticResponse(BaseSchema):
    similarity_score: float
    semantic_alignment: str
    matched_topics: List[str]
    missing_topics: List[str]
    explanation: str


# =========================================
# RESUME DATABASE SCHEMA
# =========================================
class ResumeSchema(BaseSchema):
    id: str
    user_id: Optional[str] = None

    filename: Optional[str] = None
    detected_role: Optional[str] = None

    experience_years: Optional[float] = None
    candidate_level: Optional[str] = None

    extracted_skills: Optional[List[str]] = []

    created_at: datetime
    updated_at: Optional[datetime] = None


# =========================================
# ANALYSIS DATABASE SCHEMA
# =========================================
class AnalysisSchema(BaseSchema):
    id: str

    analysis_type: str

    ats_final_score: Optional[float] = None
    semantic_score: Optional[float] = None

    role: Optional[str] = None
    confidence: Optional[float] = None

    created_at: datetime


# =========================================
# UPLOAD RESPONSE
# =========================================
class UploadResponse(BaseSchema):
    filename: str
    extracted_text_length: int

    category: str
    confidence: float

    extracted_skills: List[str]

    experience_years: float
    candidate_level: str


# =========================================
# HEALTH CHECK
# =========================================
class HealthResponse(BaseSchema):
    status: str
    model_loaded: bool
    embedding_model: str
    timestamp: datetime


# =========================================
# ERROR RESPONSE
# =========================================
class ErrorResponse(BaseSchema):
    success: bool = False
    error: str
    detail: Optional[str] = None
