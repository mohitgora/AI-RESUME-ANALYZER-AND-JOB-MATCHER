from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.schemas import PredictResponse
from backend.services.pdf_service import pdf_service
from backend.services.ml_service import ml_service

router = APIRouter()

@router.post("/upload", response_model=PredictResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume PDF"""
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        content = await file.read()
        
        if len(content) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        text = pdf_service.extract_text_from_pdf(content)
        
        if len(text) < 50:
            raise HTTPException(status_code=400, detail="PDF has insufficient text")
        
        category = ml_service.predict_category(text)
        
        return PredictResponse(category=category)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
