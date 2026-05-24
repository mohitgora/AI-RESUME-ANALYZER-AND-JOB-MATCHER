from fastapi import APIRouter, HTTPException
from backend.schemas import SemanticRequest, SemanticResponse
from backend.services.semantic_service import semantic_service

router = APIRouter()

@router.post("/semantic", response_model=SemanticResponse)
async def semantic_match(request: SemanticRequest):
    """Calculate semantic similarity score"""
    try:
        if not request.resume_text or len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short")
        
        if not request.job_description or len(request.job_description) < 50:
            raise HTTPException(status_code=400, detail="Job description too short")
        
        similarity = semantic_service.calculate_semantic_similarity(
            request.resume_text,
            request.job_description
        )
        
        return SemanticResponse(similarity_score=similarity)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
