from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):

    # =====================================================
    # FASTAPI
    # =====================================================

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    # =====================================================
    # FRONTEND
    # =====================================================

    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URL_2: str = "http://127.0.0.1:5173"

    # =====================================================
    # SECURITY
    # =====================================================

    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # =====================================================
    # ML MODELS
    # =====================================================

    EMBEDDING_MODEL: str = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    TFIDF_MAX_FEATURES: int = 10000

    SIMILARITY_THRESHOLD: float = 0.65

    MAX_TOP_PREDICTIONS: int = 5

    ENABLE_EMBEDDING_CACHE: bool = True

    # =====================================================
    # FILES
    # =====================================================

    MAX_FILE_SIZE_MB: int = 10

    ALLOWED_FILE_TYPES: str = "pdf"

    UPLOAD_DIR: str = "uploads"

    # =====================================================
    # LOGGING
    # =====================================================

    LOG_LEVEL: str = "INFO"

    # =====================================================
    # DATABASE
    # =====================================================

    DATABASE_URL: str = ""

    # =====================================================
    # REDIS
    # =====================================================

    REDIS_URL: str = ""

    # =====================================================
    # SUPABASE
    # =====================================================

    SUPABASE_URL: str = ""

    SUPABASE_KEY: str = ""

    # =====================================================
    # MODEL PATHS
    # =====================================================

    MODEL_DIR: str = "models_data"

    TFIDF_MODEL: str = "tfidf_model.pkl"

    CLASSIFIER_MODEL: str = "classifier_model.pkl"

    EMBEDDINGS_CACHE: str = "embeddings_cache.json"

    # =====================================================
    # ATS ENGINE
    # =====================================================

    ATS_SKILL_WEIGHT: float = 0.45

    ATS_SEMANTIC_WEIGHT: float = 0.40

    ATS_EXPERIENCE_WEIGHT: float = 0.15

    # =====================================================
    # PDF EXTRACTION
    # =====================================================

    PDF_EXTRACT_MIN_TEXT_LENGTH: int = 100

    # =====================================================
    # PERFORMANCE
    # =====================================================

    ENABLE_GPU: bool = False

    BATCH_SIZE: int = 32

    # =====================================================
    # CORS
    # =====================================================

    CORS_ORIGINS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    class Config:

        env_file = ".env"

        case_sensitive = True


@lru_cache()
def get_settings():

    return Settings()

