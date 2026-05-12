from fastapi import APIRouter, HTTPException
from app.database import supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    market_id: Optional[int] = 1

@router.post("/")
async def create_project(project: ProjectCreate):
    # Get current user from auth
    # For MVP, we'll use a simple approach
    result = supabase.table("projects").insert({
        "name": project.name,
        "market_id": project.market_id,
        "status": "draft"
    }).execute()
    
    return result.data[0] if result.data else {"message": "Project created"}

@router.get("/")
async def get_projects():
    result = supabase.table("projects").select("*").order("created_at", desc=True).execute()
    return result.data or []

@router.get("/{project_id}")
async def get_project(project_id: str):
    result = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data