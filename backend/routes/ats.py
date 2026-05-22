from fastapi import APIRouter
from backend.schemas.request_models import ATSRequest
from backend.services.ats_service import get_ats_score

router = APIRouter(prefix="/api", tags=["ATS"])


@router.post("/ats")
def ats(data: ATSRequest):

    score = get_ats_score(
        data.resume_text,
        data.job_description
    )

    return {
        "ats_score": score
    }