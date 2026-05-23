from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    debug: bool = True
    
    database_url: str = "postgresql://user:password@localhost:5432/resumai_db"
    supabase_url: str = "https://your-project.supabase.co"
    supabase_key: str = "your-anon-key"
    
    embedding_model: str = "all-MiniLM-L6-v2"
    tfidf_max_features: int = 5000
    
    redis_url: str = "redis://localhost:6379"
    
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

