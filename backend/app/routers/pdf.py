from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.services.pdf_engine import generate_catalog_pdf
from app.config import settings
import uuid
import os

router = APIRouter()

@router.post("/project/{project_id}")
async def generate_pdf(project_id: str, template: str = "grid-2"):
    # Fetch project
    project = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Fetch images
    images = supabase.table("images").select("*").eq("project_id", project_id).execute()
    if not images.data:
        raise HTTPException(status_code=400, detail="No images in project")
    
    # Generate PDF
    pdf_name = f"catalog_{project_id}_{uuid.uuid4()}.pdf"
    pdf_path = f"/tmp/{pdf_name}"
    
    try:
        generate_catalog_pdf(
            images=images.data,
            output_path=pdf_path,
            template=template,
            company_name=project.data.get('company_name', ''),
            logo_url=project.data.get('logo_url')
        )
        
        # Upload to Supabase Storage
        with open(pdf_path, 'rb') as f:
            pdf_bytes = f.read()
        
        storage_path = f"pdfs/{pdf_name}"
        supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
            path=storage_path,
            file=pdf_bytes,
            file_options={"content-type": "application/pdf"}
        )
        
        pdf_url = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).get_public_url(storage_path)
        
        # Save to DB
        pdf_data = {
            "project_id": project_id,
            "name": pdf_name,
            "url": pdf_url,
            "page_count": len(images.data),  # Approximate
            "size_bytes": len(pdf_bytes),
            "status": "ready"
        }
        
        result = supabase.table("pdfs").insert(pdf_data).execute()
        
        # Cleanup temp file
        os.remove(pdf_path)
        
        return {
            "message": "PDF generated successfully",
            "pdf_url": pdf_url,
            "pdf_id": result.data[0]['id'] if result.data else None
        }
        
    except Exception as e:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/project/{project_id}")
async def get_project_pdfs(project_id: str):
    result = supabase.table("pdfs").select("*").eq("project_id", project_id).order("created_at", desc=True).execute()
    return result.data or []