from fastapi import APIRouter, HTTPException
from schemas import PredictRequest, PredictResponse
from services.ml_service import ml_service

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict_resume(request: PredictRequest):
    """Predict resume category using ML model"""
    try:
        if not request.resume_text or len(request.resume_text) < 50:
            raise HTTPException(status_code=400, detail="Resume text too short")
        
        category = ml_service.predict_category(request.resume_text)
        
        return PredictResponse(category=category)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
