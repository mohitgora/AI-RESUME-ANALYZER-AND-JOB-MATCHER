from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routes import predict, ats, semantic, upload
from config import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting FastAPI server...")
    yield
    print("Shutting down...")

app = FastAPI(
    title="ResumAI Backend",
    description="AI Resume Analysis Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(predict.router, prefix="/api", tags=["Resume"])
app.include_router(ats.router, prefix="/api", tags=["ATS"])
app.include_router(semantic.router, prefix="/api", tags=["Semantic"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

@app.get("/")
async def root():
    return {"message": "ResumAI Backend API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
