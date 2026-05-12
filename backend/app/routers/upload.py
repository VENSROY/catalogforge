from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
import uuid
from app.database import supabase
from app.config import settings

router = APIRouter()

@router.post("/")
async def upload_images(
    files: List[UploadFile] = File(..., description="Image files to upload"),
    project_id: str = Form(..., description="Project ID")
):
    """
    Upload multiple images to a project.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    uploaded_images = []
    
    for file in files:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400, 
                detail=f"File {file.filename} is not an image"
            )
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_name = f"{project_id}/{uuid.uuid4()}.{file_ext}"
        
        try:
            # Read file content
            file_content = await file.read()
            
            # Upload to Supabase Storage
            result = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
                path=unique_name,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            
            # Get public URL
            file_url = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).get_public_url(unique_name)
            
            # Save to DB
            image_data = {
                "project_id": project_id,
                "filename": file.filename,
                "original_url": file_url,
                "mime_type": file.content_type,
                "size_bytes": len(file_content)
            }
            
            db_result = supabase.table("images").insert(image_data).execute()
            uploaded_images.append({
                "filename": file.filename,
                "url": file_url,
                "size": len(file_content)
            })
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload {file.filename}: {str(e)}")
    
    return {
        "message": f"{len(uploaded_images)} images uploaded successfully",
        "images": uploaded_images
    }