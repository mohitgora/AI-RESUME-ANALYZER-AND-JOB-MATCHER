from fastapi import APIRouter, HTTPException
from schemas import ATSRequest, ATSResponse
from services.ats_service import ats_service

router = APIRouter()

@router.post("/ats", response_model=ATSResponse)
async def analyze_ats(request: ATSRequest):
    """Calculate ATS score for resume against job description"""
    try:
        if not request.resume_text or len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short")
        
        if not request.job_description or len(request.job_description) < 50:
            raise HTTPException(status_code=400, detail="Job description too short")
        
        result = ats_service.calculate_ats_score(
            request.resume_text,
            request.job_description
        )
        
        return ATSResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
