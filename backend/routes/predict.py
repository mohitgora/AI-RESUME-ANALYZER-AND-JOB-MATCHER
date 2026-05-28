from fastapi import APIRouter, HTTPException, status
from time import perf_counter
import traceback

from backend.schemas import (
    PredictRequest,
    PredictResponse
)

from backend.services.ml_service import ml_service

router = APIRouter()


# ==========================================
# RESUME ROLE PREDICTION
# ==========================================

@router.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Resume Role Prediction",
    description="""
    Predict resume category using advanced AI analysis.
    
    Features:
    - Role prediction
    - Confidence scoring
    - Skill extraction
    - Experience estimation
    - Resume strength analysis
    - Semantic intelligence
    """
)

async def predict_resume(
    request: PredictRequest
):

    """
    Production-grade resume prediction API
    """

    start_time = perf_counter()

    try:

        # ==========================================
        # VALIDATION
        # ==========================================

        if not request.resume_text:

            raise HTTPException(
                status_code=400,
                detail="Resume text is required"
            )

        resume_text = (
            request.resume_text.strip()
        )

        # ==========================================
        # MINIMUM CONTENT VALIDATION
        # ==========================================

        if len(resume_text) < 80:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Resume content too short. "
                    "Please upload a proper resume."
                )
            )

        # ==========================================
        # ROLE PREDICTION
        # ==========================================

        prediction_result = (
            ml_service.predict_category(
                resume_text
            )
        )

        # ==========================================
        # EXTRACT EXTRA INSIGHTS
        # ==========================================

        extracted_skills = (
            ml_service.extract_skills(
                resume_text
            )
        )

        experience_years = (
            ml_service.estimate_experience_years(
                resume_text
            )
        )

        # ==========================================
        # RESUME STRENGTH
        # ==========================================

        resume_strength = (
            _calculate_resume_strength(
                prediction_result["confidence"],
                len(extracted_skills),
                experience_years
            )
        )

        # ==========================================
        # PROCESSING TIME
        # ==========================================

        processing_time = round(
            perf_counter() - start_time,
            3
        )

        # ==========================================
        # FINAL RESPONSE
        # ==========================================

        response_data = {

            "predicted_role": prediction_result["predicted_role"],

            "confidence":
                prediction_result["confidence"],

            "top_predictions":
                prediction_result["top_predictions"],

            "skills":
                extracted_skills,

            "experience_years":
                experience_years,

            "resume_strength":
                resume_strength,

            "processing_time":
                processing_time,

            "success":
                True
        }

        return PredictResponse(
            **response_data
        )

    # ==========================================
    # HTTP ERRORS
    # ==========================================

    except HTTPException:
        raise

    # ==========================================
    # VALUE ERRORS
    # ==========================================

    except ValueError as e:

        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    # ==========================================
    # UNKNOWN ERRORS
    # ==========================================

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail={

                "message":
                    "Resume prediction failed",

                "error":
                    str(e),

                "success":
                    False
            }
        )


# ==========================================
# RESUME STRENGTH CALCULATION
# ==========================================

def _calculate_resume_strength(
    confidence: float,
    skill_count: int,
    experience_years: int
) -> str:

    score = 0

    # ==========================================
    # CONFIDENCE SCORE
    # ==========================================

    if confidence >= 90:
        score += 40

    elif confidence >= 75:
        score += 30

    elif confidence >= 60:
        score += 20

    else:
        score += 10

    # ==========================================
    # SKILLS SCORE
    # ==========================================

    if skill_count >= 15:
        score += 35

    elif skill_count >= 10:
        score += 25

    elif skill_count >= 5:
        score += 15

    else:
        score += 5

    # ==========================================
    # EXPERIENCE SCORE
    # ==========================================

    if experience_years >= 5:
        score += 25

    elif experience_years >= 2:
        score += 18

    elif experience_years >= 1:
        score += 12

    else:
        score += 5

    # ==========================================
    # FINAL LABEL
    # ==========================================

    if score >= 85:
        return "EXCELLENT"

    elif score >= 70:
        return "STRONG"

    elif score >= 50:
        return "GOOD"

    elif score >= 35:
        return "AVERAGE"

    return "WEAK"


# ==========================================
# HEALTH CHECK
# ==========================================

@router.get(
    "/predict/health",
    status_code=200
)

async def predict_health():

    return {

        "service":
            "Resume Prediction Service",

        "status":
            "running",

        "success":
            True
    }


# ==========================================
# MODEL INFO
# ==========================================

@router.get(
    "/predict/model-info",
    status_code=200
)

async def model_info():

    return {

        "model":
            "Advanced Resume Intelligence Engine",

        "embedding_model":
            "SentenceTransformer",

        "classification_engine":
            "Hybrid AI Classifier",

        "supported_roles": [

            "Software Engineer",

            "AI Engineer",

            "ML Engineer",

            "Frontend Developer",

            "Backend Developer",

            "Data Scientist",

            "DevOps Engineer",

            "Cloud Architect",

            "Security Engineer",

            "Product Manager"
        ],

        "features": [

            "Role Prediction",

            "Confidence Scoring",

            "Skill Extraction",

            "Semantic Intelligence",

            "Resume Analysis",

            "Experience Detection"
        ]
    }
