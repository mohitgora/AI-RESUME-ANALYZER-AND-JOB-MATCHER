from sqlalchemy import Column, String, Float, DateTime, Integer, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    filename = Column(String, nullable=True)
    text_content = Column(Text)
    detected_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String)
    analysis_type = Column(String)  # "predict", "ats", "semantic"
    job_description = Column(Text, nullable=True)
    
    # ATS Results
    ats_final_score = Column(Float, nullable=True)
    ats_embedding_score = Column(Float, nullable=True)
    ats_skill_score = Column(Float, nullable=True)
    ats_experience_score = Column(Float, nullable=True)
    ats_role = Column(String, nullable=True)
    ats_feedback = Column(Text, nullable=True)
    ats_explanation = Column(Text, nullable=True)
    
    # Semantic Results
    semantic_score = Column(Float, nullable=True)
    
    # Metadata
    resume_skills = Column(JSON, nullable=True)
    jd_skills = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
