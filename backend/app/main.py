from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.upload import router as upload_router
from app.routers.projects import router as projects_router

app = FastAPI(title="CatalogForge API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(projects_router, prefix="/api/v1/projects", tags=["projects"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "CatalogForge API is running!"}