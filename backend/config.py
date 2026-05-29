from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # =====================================================
    # FASTAPI
    # =====================================================

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    # =====================================================
    # FRONTEND
    # =====================================================

    frontend_url: str = ""
    frontend_url_2: str = ""

    # =====================================================
    # SECURITY
    # =====================================================

    secret_key: str
    algorithm: str = "HS256"

    access_token_expire_minutes: int = 60

    # =====================================================
    # ML MODELS
    # =====================================================

    embedding_model: str = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    tfidf_max_features: int = 10000

    similarity_threshold: float = 0.65

    max_top_predictions: int = 5

    enable_embedding_cache: bool = True

    # =====================================================
    # FILES
    # =====================================================

    max_file_size_mb: int = 10

    allowed_file_types: str = "pdf"

    upload_dir: str = "uploads"

    # =====================================================
    # LOGGING
    # =====================================================

    log_level: str = "INFO"

    # =====================================================
    # DATABASE
    # =====================================================

    database_url: str = ""

    # =====================================================
    # REDIS
    # =====================================================

    redis_url: str = ""

    # =====================================================
    # SUPABASE
    # =====================================================

    supabase_url: str = ""

    supabase_key: str = ""

    # =====================================================
    # MODEL PATHS
    # =====================================================

    model_dir: str = "models_data"

    tfidf_model: str = "tfidf_model.pkl"

    classifier_model: str = "classifier_model.pkl"

    embeddings_cache: str = "embeddings_cache.json"

    # =====================================================
    # ATS ENGINE
    # =====================================================

    ats_skill_weight: float = 0.45

    ats_semantic_weight: float = 0.40

    ats_experience_weight: float = 0.15

    # =====================================================
    # PDF EXTRACTION
    # =====================================================

    pdf_extract_min_text_length: int = 100

    # =====================================================
    # PERFORMANCE
    # =====================================================

    enable_gpu: bool = False

    batch_size: int = 32

    # =====================================================
    # CORS
    # =====================================================

    cors_origins: str = (
        ""
    )

    # =====================================================
    # PYDANTIC CONFIG
    # =====================================================

    model_config = SettingsConfigDict(
        env_file="backend/.env",
        case_sensitive=False,
        extra="ignore",
        protected_namespaces=()
    )


@lru_cache()
def get_settings():
    return Settings()

