from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    status
)

from time import perf_counter
import traceback

from backend.schemas import PredictResponse
from backend.services.pdf_service import pdf_service
from backend.services.ml_service import ml_service

router = APIRouter()


# ==========================================================
# RESUME PDF UPLOAD API
# ==========================================================

@router.post(
    "/upload",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload Resume PDF"
)
async def upload_resume(file: UploadFile = File(...)):

    start_time = perf_counter()

    try:

        # ==========================================================
        # FILE VALIDATION
        # ==========================================================

        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        allowed_types = [
            "application/pdf",
            "application/x-pdf"
        ]

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        # ==========================================================
        # READ FILE
        # ==========================================================

        content = await file.read()

        max_size_mb = 10
        if len(content) > max_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max {max_size_mb}MB allowed"
            )

        # ==========================================================
        # PDF TEXT EXTRACTION (FIXED PART)
        # ==========================================================

        result = pdf_service.extract_text_from_pdf(content)

        extracted_text = (
            result.get("cleaned_text")
            or result.get("raw_text")
            or ""
        )

        if not extracted_text:
            raise HTTPException(
                status_code=400,
                detail="No readable text found in PDF"
            )

        if len(extracted_text) < 100:
            raise HTTPException(
                status_code=400,
                detail="PDF contains insufficient text"
            )

        # ==========================================================
        # AI MODEL PROCESSING
        # ==========================================================

        prediction_result = ml_service.predict_category(extracted_text)

        extracted_skills = ml_service.extract_skills(extracted_text)

        experience_years = ml_service.estimate_experience_years(extracted_text)

        # ==========================================================
        # QUALITY SCORE
        # ==========================================================

        resume_quality = _calculate_resume_quality(
            prediction_result["confidence"],
            len(extracted_skills),
            experience_years
        )

        # ==========================================================
        # RESPONSE TIME
        # ==========================================================

        processing_time = round(perf_counter() - start_time, 3)

        # ==========================================================
        # FINAL RESPONSE
        # ==========================================================

        response_data = {
    "category": prediction_result["predicted_role"],
    "confidence": prediction_result["confidence"],
    "top_predictions": prediction_result["top_predictions"],

    "extracted_skills": extracted_skills,

    "experience_years": float(experience_years),

    # IMPORTANT FIX: derive level from experience
    "candidate_level": (
        "Senior" if experience_years >= 5 else
        "Mid" if experience_years >= 2 else
        "Junior"
    ),

    "filename": file.filename,
    "success": True
}

        return PredictResponse(**response_data)

    # ==========================================================
    # ERROR HANDLING
    # ==========================================================

    except HTTPException:
        raise

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail={
                "message": "Resume upload failed",
                "error": str(e),
                "success": False
            }
        )


# ==========================================================
# QUALITY SCORE FUNCTION
# ==========================================================

def _calculate_resume_quality(confidence, skill_count, experience_years):

    score = 0

    if confidence >= 90:
        score += 40
    elif confidence >= 75:
        score += 30
    elif confidence >= 60:
        score += 20
    else:
        score += 10

    if skill_count >= 15:
        score += 35
    elif skill_count >= 10:
        score += 25
    elif skill_count >= 5:
        score += 15
    else:
        score += 5

    if experience_years >= 5:
        score += 25
    elif experience_years >= 2:
        score += 18
    elif experience_years >= 1:
        score += 12
    else:
        score += 5

    if score >= 85:
        return "EXCELLENT"
    elif score >= 70:
        return "STRONG"
    elif score >= 50:
        return "GOOD"
    elif score >= 35:
        return "AVERAGE"
    return "WEAK"


# ==========================================================
# HEALTH CHECK
# ==========================================================

@router.get("/upload/health")
async def upload_health():
    return {
        "service": "Resume Upload Service",
        "status": "running",
        "success": True
    }


# ==========================================================
# SUPPORTED FORMATS
# ==========================================================

@router.get("/upload/supported-formats")
async def supported_formats():
    return {
        "supported_formats": ["PDF"],
        "max_file_size_mb": 10,
        "features": [
            "Resume Classification",
            "Skill Extraction",
            "Experience Detection",
            "AI Role Prediction",
            "Semantic Analysis"
        ]
    }
