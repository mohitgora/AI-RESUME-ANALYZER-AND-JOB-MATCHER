from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    Text,
    JSON,
    Integer,
    ForeignKey,
    Boolean
)

from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from backend.database import Base


# =========================================================
# UUID GENERATOR
# =========================================================

def generate_uuid():

    return str(uuid.uuid4())


# =========================================================
# RESUME MODEL
# =========================================================

class Resume(Base):

    __tablename__ = "resumes"

    # =====================================================
    # PRIMARY INFO
    # =====================================================

    id = Column(
        String,
        primary_key=True,
        default=generate_uuid
    )

    user_id = Column(
        String,
        nullable=True
    )

    filename = Column(
        String,
        nullable=False
    )

    original_filename = Column(
        String,
        nullable=True
    )

    file_size = Column(
        Integer,
        nullable=True
    )

    file_type = Column(
        String,
        nullable=True
    )

    # =====================================================
    # RESUME CONTENT
    # =====================================================

    text_content = Column(
        Text,
        nullable=False
    )

    cleaned_text = Column(
        Text,
        nullable=True
    )

    detected_role = Column(
        String,
        nullable=True
    )

    confidence_score = Column(
        Float,
        nullable=True
    )

    extracted_skills = Column(
        JSON,
        nullable=True
    )

    experience_years = Column(
        Integer,
        nullable=True
    )

    resume_quality = Column(
        String,
        nullable=True
    )

    # =====================================================
    # FLAGS
    # =====================================================

    is_active = Column(
        Boolean,
        default=True
    )

    is_deleted = Column(
        Boolean,
        default=False
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # =====================================================
    # RELATIONSHIP
    # =====================================================

    analyses = relationship(

        "Analysis",

        back_populates="resume",

        cascade="all, delete-orphan"
    )


# =========================================================
# ANALYSIS MODEL
# =========================================================

class Analysis(Base):

    __tablename__ = "analyses"

    # =====================================================
    # PRIMARY INFO
    # =====================================================

    id = Column(
        String,
        primary_key=True,
        default=generate_uuid
    )

    resume_id = Column(

        String,

        ForeignKey("resumes.id"),

        nullable=False
    )

    analysis_type = Column(
        String,
        nullable=False
    )

    # =====================================================
    # JOB DESCRIPTION
    # =====================================================

    job_description = Column(
        Text,
        nullable=True
    )

    # =====================================================
    # ATS SCORES
    # =====================================================

    ats_final_score = Column(
        Float,
        nullable=True
    )

    ats_embedding_score = Column(
        Float,
        nullable=True
    )

    ats_skill_score = Column(
        Float,
        nullable=True
    )

    ats_experience_score = Column(
        Float,
        nullable=True
    )

    ats_role_score = Column(
        Float,
        nullable=True
    )

    ats_role = Column(
        String,
        nullable=True
    )

    # =====================================================
    # SEMANTIC ANALYSIS
    # =====================================================

    semantic_score = Column(
        Float,
        nullable=True
    )

    keyword_score = Column(
        Float,
        nullable=True
    )

    similarity_score = Column(
        Float,
        nullable=True
    )

    match_level = Column(
        String,
        nullable=True
    )

    # =====================================================
    # FEEDBACK
    # =====================================================

    ats_feedback = Column(
        Text,
        nullable=True
    )

    ats_explanation = Column(
        Text,
        nullable=True
    )

    recommendation = Column(
        Text,
        nullable=True
    )

    # =====================================================
    # SKILLS
    # =====================================================

    matched_skills = Column(
        JSON,
        nullable=True
    )

    missing_skills = Column(
        JSON,
        nullable=True
    )

    resume_skills = Column(
        JSON,
        nullable=True
    )

    jd_skills = Column(
        JSON,
        nullable=True
    )

    # =====================================================
    # PROCESSING METADATA
    # =====================================================

    processing_time = Column(
        Float,
        nullable=True
    )

    model_version = Column(
        String,
        nullable=True
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # =====================================================
    # RELATIONSHIP
    # =====================================================

    resume = relationship(

        "Resume",

        back_populates="analyses"
    )


# =========================================================
# SYSTEM LOG MODEL
# =========================================================

class SystemLog(Base):

    __tablename__ = "system_logs"

    id = Column(
        String,
        primary_key=True,
        default=generate_uuid
    )

    event_type = Column(
        String,
        nullable=False
    )

    event_message = Column(
        Text,
        nullable=False
    )

    status = Column(
        String,
        nullable=True
    )

    metadata = Column(
        JSON,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# =========================================================
# API USAGE MODEL
# =========================================================

class APIUsage(Base):

    __tablename__ = "api_usage"

    id = Column(
        String,
        primary_key=True,
        default=generate_uuid
    )

    endpoint = Column(
        String,
        nullable=False
    )

    request_method = Column(
        String,
        nullable=False
    )

    response_status = Column(
        Integer,
        nullable=False
    )

    processing_time = Column(
        Float,
        nullable=True
    )

    client_ip = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
