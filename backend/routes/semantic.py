from fastapi import APIRouter, HTTPException, status
from time import perf_counter
import traceback

from backend.schemas import (
    SemanticRequest,
    SemanticResponse
)

from backend.services.semantic_service import (
    semantic_service
)

router = APIRouter()


# =====================================================
# SEMANTIC MATCH API
# =====================================================

@router.post(
    "/semantic",
    response_model=SemanticResponse,
    status_code=status.HTTP_200_OK,
    summary="Advanced Semantic Resume Matching",
    description="""
    AI-powered semantic similarity analysis
    between resume and job description.

    Features:
    - Semantic understanding
    - Embedding similarity
    - Keyword overlap
    - Context matching
    - Intelligent scoring
    - Match explanation
    """
)

async def semantic_match(
    request: SemanticRequest
):

    start_time = perf_counter()

    try:

        # =====================================================
        # VALIDATION
        # =====================================================

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

        # =====================================================
        # LENGTH VALIDATION
        # =====================================================

        if len(resume_text) < 100:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Resume content too short. "
                    "Please upload a proper resume."
                )
            )

        if len(job_description) < 100:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Job description too short. "
                    "Please provide a detailed JD."
                )
            )

        # =====================================================
        # SEMANTIC ANALYSIS
        # =====================================================

        semantic_result = (
            semantic_service.calculate_semantic_similarity(
                resume_text,
                job_description
            )
        )

        # =====================================================
        # PROCESSING TIME
        # =====================================================

        processing_time = round(
            perf_counter() - start_time,
            3
        )

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        response_data = {

            "similarity_score":
                semantic_result["similarity_score"],

            "semantic_score":
                semantic_result["semantic_score"],

            "keyword_score":
                semantic_result["keyword_score"],

            "matched_skills":
                semantic_result["matched_skills"],

            "missing_skills":
                semantic_result["missing_skills"],

            "match_level":
                semantic_result["match_level"],

            "recommendation":
                semantic_result["recommendation"],

            "processing_time":
                processing_time,

            "success":
                True
        }

        return SemanticResponse(
            **response_data
        )

    # =====================================================
    # HTTP ERRORS
    # =====================================================

    except HTTPException:
        raise

    # =====================================================
    # VALUE ERRORS
    # =====================================================

    except ValueError as e:

        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    # =====================================================
    # UNKNOWN ERRORS
    # =====================================================

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail={

                "message":
                    "Semantic analysis failed",

                "error":
                    str(e),

                "success":
                    False
            }
        )


# =====================================================
# HEALTH CHECK
# =====================================================

@router.get(
    "/semantic/health",
    status_code=200
)

async def semantic_health():

    return {

        "service":
            "Semantic Matching Service",

        "status":
            "running",

        "success":
            True
    }


# =====================================================
# MATCH LEVEL EXPLANATION
# =====================================================

@router.get(
    "/semantic/match-levels",
    status_code=200
)

async def semantic_match_levels():

    return {

        "levels": {

            "EXCELLENT": {
                "range": "90-100",
                "meaning": (
                    "Outstanding resume-job alignment"
                )
            },

            "STRONG": {
                "range": "75-89",
                "meaning": (
                    "Very good match with strong compatibility"
                )
            },

            "GOOD": {
                "range": "60-74",
                "meaning": (
                    "Decent alignment but improvements possible"
                )
            },

            "AVERAGE": {
                "range": "40-59",
                "meaning": (
                    "Partial match with noticeable gaps"
                )
            },

            "WEAK": {
                "range": "0-39",
                "meaning": (
                    "Poor alignment with major missing skills"
                )
            }
        }
    }


# =====================================================
# API INFO
# =====================================================

@router.get(
    "/semantic/info",
    status_code=200
)

async def semantic_info():

    return {

        "engine":
            "Advanced Semantic Intelligence Engine",

        "features": [

            "Sentence Embeddings",

            "Cosine Similarity",

            "Keyword Intelligence",

            "Skill Gap Detection",

            "AI Resume Matching",

            "Semantic Context Analysis"
        ],

        "supported_analysis": [

            "Resume vs Job Description",

            "ATS Matching",

            "Skill Comparison",

            "Semantic Understanding",

            "Contextual Similarity"
        ]
    }
