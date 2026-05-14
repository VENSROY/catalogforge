from fastapi import APIRouter, HTTPException
from app.database import supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CategoryCreate(BaseModel):
    name: str
    sort_order: Optional[int] = 0

@router.post("/project/{project_id}")
async def create_category(project_id: str, category: CategoryCreate):
    result = supabase.table("categories").insert({
        "project_id": project_id,
        "name": category.name,
        "sort_order": category.sort_order
    }).execute()
    return result.data[0] if result.data else {"message": "Category created"}

@router.get("/project/{project_id}")
async def get_categories(project_id: str):
    result = supabase.table("categories").select("*").eq("project_id", project_id).order("sort_order").execute()
    return result.data or []

@router.delete("/{category_id}")
async def delete_category(category_id: str):
    supabase.table("categories").delete().eq("id", category_id).execute()
    return {"message": "Category deleted"}

@router.post("/move-image")
async def move_image_to_category(image_id: str, category_id: Optional[str] = None):
    result = supabase.table("images").update({
        "category_id": category_id
    }).eq("id", image_id).execute()
    return result.data[0] if result.data else {"message": "Image moved"}