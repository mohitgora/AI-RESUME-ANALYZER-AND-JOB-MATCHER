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

from backend.services.pdf_service import (
    pdf_service
)

from backend.services.ml_service import (
    ml_service
)

router = APIRouter()


# ==========================================================
# RESUME PDF UPLOAD API
# ==========================================================

@router.post(
    "/upload",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload Resume PDF",
    description="""
    Upload and analyze resume PDF using AI.

    Features:
    - PDF parsing
    - Resume classification
    - Skill extraction
    - Experience detection
    - Confidence scoring
    - Resume intelligence
    """
)

async def upload_resume(
    file: UploadFile = File(...)
):

    start_time = perf_counter()

    try:

        # ==========================================================
        # FILE VALIDATION
        # ==========================================================

        if not file:

            raise HTTPException(
                status_code=400,
                detail="No file uploaded"
            )

        # ==========================================================
        # CONTENT TYPE VALIDATION
        # ==========================================================

        allowed_types = [

            "application/pdf",

            "application/x-pdf"
        ]

        if file.content_type not in allowed_types:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Only PDF files are allowed"
                )
            )

        # ==========================================================
        # READ FILE CONTENT
        # ==========================================================

        content = await file.read()

        # ==========================================================
        # FILE SIZE VALIDATION
        # ==========================================================

        max_size_mb = 10

        if len(content) > max_size_mb * 1024 * 1024:

            raise HTTPException(

                status_code=400,

                detail=(
                    f"File too large. "
                    f"Maximum allowed size is "
                    f"{max_size_mb}MB"
                )
            )

        # ==========================================================
        # EXTRACT TEXT FROM PDF
        # ==========================================================

        extracted_text = (
            pdf_service.extract_text_from_pdf(
                content
            )
        )

        # ==========================================================
        # VALIDATE EXTRACTED TEXT
        # ==========================================================

        if not extracted_text:

            raise HTTPException(

                status_code=400,

                detail=(
                    "No readable text found in PDF"
                )
            )

        extracted_text = extracted_text.strip()

        if len(extracted_text) < 100:

            raise HTTPException(

                status_code=400,

                detail=(
                    "PDF contains insufficient text. "
                    "Please upload a proper resume."
                )
            )

        # ==========================================================
        # AI RESUME ANALYSIS
        # ==========================================================

        prediction_result = (
            ml_service.predict_resume(
                extracted_text
            )
        )

        # ==========================================================
        # SKILL EXTRACTION
        # ==========================================================

        extracted_skills = (
            ml_service.extract_skills(
                extracted_text
            )
        )

        # ==========================================================
        # EXPERIENCE DETECTION
        # ==========================================================

        experience_years = (
            ml_service.extract_experience_years(
                extracted_text
            )
        )

        # ==========================================================
        # RESUME QUALITY SCORE
        # ==========================================================

        resume_quality = (
            _calculate_resume_quality(
                prediction_result["confidence"],
                len(extracted_skills),
                experience_years
            )
        )

        # ==========================================================
        # PROCESSING TIME
        # ==========================================================

        processing_time = round(
            perf_counter() - start_time,
            3
        )

        # ==========================================================
        # FINAL RESPONSE
        # ==========================================================

        response_data = {

            "predicted_role":
                prediction_result["role"],

            "confidence":
                prediction_result["confidence"],

            "top_predictions":
                prediction_result["top_predictions"],

            "skills":
                extracted_skills,

            "experience_years":
                experience_years,

            "resume_quality":
                resume_quality,

            "processing_time":
                processing_time,

            "text_length":
                len(extracted_text),

            "filename":
                file.filename,

            "success":
                True
        }

        return PredictResponse(
            **response_data
        )

    # ==========================================================
    # HTTP ERRORS
    # ==========================================================

    except HTTPException:
        raise

    # ==========================================================
    # VALUE ERRORS
    # ==========================================================

    except ValueError as e:

        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    # ==========================================================
    # UNKNOWN ERRORS
    # ==========================================================

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail={

                "message":
                    "Resume upload failed",

                "error":
                    str(e),

                "success":
                    False
            }
        )


# ==========================================================
# RESUME QUALITY CALCULATION
# ==========================================================

def _calculate_resume_quality(
    confidence: float,
    skill_count: int,
    experience_years: int
) -> str:

    score = 0

    # ==========================================================
    # CONFIDENCE SCORE
    # ==========================================================

    if confidence >= 90:
        score += 40

    elif confidence >= 75:
        score += 30

    elif confidence >= 60:
        score += 20

    else:
        score += 10

    # ==========================================================
    # SKILLS SCORE
    # ==========================================================

    if skill_count >= 15:
        score += 35

    elif skill_count >= 10:
        score += 25

    elif skill_count >= 5:
        score += 15

    else:
        score += 5

    # ==========================================================
    # EXPERIENCE SCORE
    # ==========================================================

    if experience_years >= 5:
        score += 25

    elif experience_years >= 2:
        score += 18

    elif experience_years >= 1:
        score += 12

    else:
        score += 5

    # ==========================================================
    # FINAL QUALITY LABEL
    # ==========================================================

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

@router.get(
    "/upload/health",
    status_code=200
)

async def upload_health():

    return {

        "service":
            "Resume Upload Service",

        "status":
            "running",

        "success":
            True
    }


# ==========================================================
# SUPPORTED FILE TYPES
# ==========================================================

@router.get(
    "/upload/supported-formats",
    status_code=200
)

async def supported_formats():

    return {

        "supported_formats": [

            "PDF"
        ],

        "max_file_size_mb": 10,

        "features": [

            "Resume Classification",

            "Skill Extraction",

            "Experience Detection",

            "AI Role Prediction",

            "Semantic Resume Analysis",

            "Confidence Scoring"
        ]
    }
