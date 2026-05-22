from fastapi import APIRouter
from backend.schemas.request_models import ResumeRequest
from backend.services.classification_service import predict_category

router = APIRouter()

@router.post("/predict")
def predict(req: ResumeRequest):
    try:
        result = predict_category(req.resume_text)
        return {"category": result}

    except Exception as e:
        return {
            "error": "Prediction failed",
            "details": str(e)
        }