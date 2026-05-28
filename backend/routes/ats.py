from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from time import perf_counter
import traceback

from backend.schemas import ATSRequest, ATSResponse
from backend.services.ats_service import ats_service

router = APIRouter()


# ==========================================
# ATS ANALYSIS ROUTE
# ==========================================

@router.post(
    "/ats",
    response_model=ATSResponse,
    status_code=status.HTTP_200_OK,
    summary="Advanced ATS Resume Analysis",
    description="""
    Analyze resume against a job description using:
    
    - Semantic similarity
    - Skill matching
    - Experience scoring
    - Role alignment
    - ATS optimization checks
    """,
)

async def analyze_ats(request: ATSRequest):

    """
    Production-grade ATS analysis endpoint
    """

    start_time = perf_counter()

    try:

        # ==========================================
        # INPUT VALIDATION
        # ==========================================

        if not request.resume_text:
            raise HTTPException(
                status_code=400,
                detail="Resume text is required"
            )

        if not request.job_description:
            raise HTTPException(
                status_code=400,
                detail="Job description is required"
            )

        resume_text = request.resume_text.strip()
        job_description = request.job_description.strip()

        # ==========================================
        # MINIMUM CONTENT VALIDATION
        # ==========================================

        if len(resume_text) < 100:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Resume content too short. "
                    "Please upload a proper resume."
                )
            )

        if len(job_description) < 50:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Job description too short."
                )
            )

        # ==========================================
        # ATS ANALYSIS
        # ==========================================

        result = (
            ats_service.calculate_ats_score(
                resume_text=resume_text,
                job_description=job_description
            )
        )

        # ==========================================
        # RESPONSE TIME
        # ==========================================

        processing_time = round(
            perf_counter() - start_time,
            3
        )

        # ==========================================
        # ENHANCED RESPONSE
        # ==========================================

        response_data = {

            **result,

            "processing_time":
                processing_time,

            "success":
                True
        }

        return ATSResponse(
            **response_data
        )

    # ==========================================
    # FASTAPI VALIDATION ERRORS
    # ==========================================

    except HTTPException:
        raise

    # ==========================================
    # CUSTOM VALUE ERRORS
    # ==========================================

    except ValueError as e:

        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    # ==========================================
    # UNEXPECTED ERRORS
    # ==========================================

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail={
                "message":
                    "ATS analysis failed",

                "error":
                    str(e),

                "success":
                    False
            }
        )


# ==========================================
# HEALTH CHECK
# ==========================================

@router.get(
    "/ats/health",
    status_code=200
)

async def ats_health_check():

    """
    ATS service health check
    """

    return {

        "service":
            "ATS Analysis Service",

        "status":
            "running",

        "success":
            True
    }


# ==========================================
# ATS VERSION INFO
# ==========================================

@router.get(
    "/ats/version",
    status_code=200
)

async def ats_version():

    """
    ATS engine version
    """

    return {

        "engine":
            "Advanced AI ATS Engine",

        "version":
            "2.0.0",

        "features": [

            "Semantic Similarity",

            "Skill Extraction",

            "Role Prediction",

            "Experience Scoring",

            "ATS Optimization",

            "Resume Feedback",

            "Missing Skills Detection"
        ]
    }
