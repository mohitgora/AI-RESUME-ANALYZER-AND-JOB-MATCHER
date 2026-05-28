from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool

from backend.config import get_settings

# =========================================================
# LOAD SETTINGS
# =========================================================

settings = get_settings()

# =========================================================
# DATABASE URL
# =========================================================

DATABASE_URL = settings.DATABASE_URL

# =========================================================
# SQLITE SUPPORT
# =========================================================

connect_args = {}

if DATABASE_URL.startswith("sqlite"):

    connect_args = {
        "check_same_thread": False
    }

# =========================================================
# SQLALCHEMY ENGINE
# =========================================================

engine = create_engine(

    DATABASE_URL,

    connect_args=connect_args,

    poolclass=QueuePool,

    pool_size=10,

    max_overflow=20,

    pool_pre_ping=True,

    echo=settings.DEBUG
)

# =========================================================
# SESSION FACTORY
# =========================================================

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine
)

# =========================================================
# BASE MODEL
# =========================================================

Base = declarative_base()

# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()

# =========================================================
# DATABASE HEALTH CHECK
# =========================================================

def check_database_connection():

    try:

        with engine.connect() as connection:

            return {
                "status": "connected",
                "database": DATABASE_URL
            }

    except Exception as e:

        return {
            "status": "failed",
            "error": str(e)
        }

# =========================================================
# CREATE TABLES
# =========================================================

def init_database():

    try:

        Base.metadata.create_all(
            bind=engine
        )

        print(
            "Database initialized successfully"
        )

    except Exception as e:

        print(
            f"Database initialization failed: {e}"
        )

# =========================================================
# DATABASE INFO
# =========================================================

def get_database_info():

    return {

        "database_url":
            DATABASE_URL,

        "pool_size":
            10,

        "max_overflow":
            20,

        "debug":
            settings.DEBUG
    }
