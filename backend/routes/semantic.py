from fastapi import APIRouter
from backend.schemas.request_models import ATSRequest
from backend.services.embedding_service import semantic_match

router = APIRouter(prefix="/api", tags=["Semantic Matching"])


@router.post("/semantic-score")
def semantic(data: ATSRequest):

    score = semantic_match(
        data.resume_text,
        data.job_description
    )

    return {
        "semantic_score": score
    }