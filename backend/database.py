from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import get_settings

settings = get_settings()

# Optional: Use Bolt Database PostgreSQL
# DATABASE_URL = settings.database_url
# engine = create_engine(DATABASE_URL)

# For local testing (SQLite)
engine = create_engine("sqlite:///./resumai.db")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
