from pydantic import BaseModel, Field

class ResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)

class ATSRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_description: str = Field(..., min_length=20)