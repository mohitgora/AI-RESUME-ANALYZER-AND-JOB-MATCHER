from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from loguru import logger
import time

# =========================================
# ROUTES
# =========================================
from backend.routes import (
    predict,
    ats,
    semantic,
    upload
)

# =========================================
# CONFIG
# =========================================
from backend.config import get_settings

settings = get_settings()


# =========================================
# APP LIFECYCLE
# =========================================
@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("====================================")
    logger.info("Starting ResumAI Backend Server...")
    logger.info(f"Environment: {'DEBUG' if settings.debug else 'PRODUCTION'}")
    logger.info(f"Host: {settings.api_host}")
    logger.info(f"Port: {settings.api_port}")
    logger.info("====================================")

    # MODEL WARMUP
    try:
        from backend.services.ml_service import ml_service

        logger.info("Loading ML models...")
        _ = ml_service.categories

        logger.success("ML models loaded successfully")

    except Exception as e:
        logger.error(f"Model loading failed: {str(e)}")

    yield

    logger.warning("Shutting down ResumAI Backend...")


# =========================================
# FASTAPI APP
# =========================================
app = FastAPI(
    title="ResumAI Backend API",
    description="""
    Production-grade AI Resume Analysis Platform

    Features:
    - Resume Classification
    - ATS Scoring
    - Semantic Matching
    - Skill Extraction
    - PDF Resume Parsing
    - AI-powered Recommendations
    """,
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)


# =========================================
# CORS CONFIG
# =========================================
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ADD FRONTEND URL FROM ENV
if hasattr(settings, "frontend_url") and settings.frontend_url:
    allowed_origins.append(settings.frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if settings.debug else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# REQUEST TIMER MIDDLEWARE
# =========================================
@app.middleware("http")
async def add_process_time_header(request, call_next):

    start_time = time.time()

    response = await call_next(request)

    process_time = round(time.time() - start_time, 4)

    response.headers["X-Process-Time"] = str(process_time)

    logger.info(
        f"{request.method} {request.url.path} "
        f"- {response.status_code} "
        f"- {process_time}s"
    )

    return response


# =========================================
# GLOBAL EXCEPTION HANDLERS
# =========================================
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):

    logger.error(f"HTTP Error: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):

    logger.error(f"Validation Error: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation Error",
            "details": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    logger.exception("Unhandled Server Error")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "detail": str(exc)
        }
    )


# =========================================
# ROUTES
# =========================================
app.include_router(
    predict.router,
    prefix="/api",
    tags=["Resume Prediction"]
)

app.include_router(
    ats.router,
    prefix="/api",
    tags=["ATS Analysis"]
)

app.include_router(
    semantic.router,
    prefix="/api",
    tags=["Semantic Matching"]
)

app.include_router(
    upload.router,
    prefix="/api",
    tags=["Resume Upload"]
)


# =========================================
# ROOT ROUTE
# =========================================
@app.get("/")
async def root():

    return {
        "success": True,
        "message": "ResumAI Backend API Running",
        "version": "2.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


# =========================================
# HEALTH CHECK
# =========================================
@app.get("/health")
async def health_check():

    return {
        "success": True,
        "status": "healthy",
        "api": "running",
        "environment": "debug" if settings.debug else "production"
    }


# =========================================
# API INFO
# =========================================
@app.get("/api/info")
async def api_info():

    return {
        "name": "ResumAI Backend",
        "version": "2.0.0",
        "features": [
            "Resume Classification",
            "ATS Analysis",
            "Semantic Similarity",
            "Skill Extraction",
            "PDF Parsing",
            "AI Recommendations"
        ]
    }


# =========================================
# RUN SERVER (OPTIONAL)
# =========================================
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )