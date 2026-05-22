from fastapi import FastAPI
from fastapi.responses import JSONResponse

from backend.routes import predict, ats, semantic

app = FastAPI()

# ROUTES
app.include_router(predict.router)
app.include_router(ats.router)
app.include_router(semantic.router)


@app.get("/")
def home():
    return {"message": "Backend Running ...."}


# GLOBAL ERROR HANDLER
@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong", "details": str(exc)}
    )