from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.services.ai_service import categorize_image, batch_categorize, find_duplicates

router = APIRouter()

@router.post("/categorize/{project_id}")
async def ai_categorize_project(project_id: str):
    """Project ki saari images ko auto-categorize karo"""
    images = supabase.table("images").select("*").eq("project_id", project_id).execute()
    
    if not images.data:
        raise HTTPException(status_code=400, detail="No images found")
    
    results = []
    for img in images.data:
        prediction = categorize_image(img['original_url'])
        
        if "error" not in prediction:
            # Find matching category in DB
            categories = supabase.table("categories").select("*").eq("project_id", project_id).execute()
            matched_cat = None
            
            for cat in categories.data:
                if prediction['category'].lower() in cat['name'].lower():
                    matched_cat = cat['id']
                    break
            
            # Update image with AI suggestion
            supabase.table("images").update({
                "ai_suggested_category": prediction['category'],
                "ai_confidence": prediction['confidence'],
                "category_id": matched_cat if matched_cat else img.get('category_id')
            }).eq("id", img['id']).execute()
            
            results.append({
                "image_id": img['id'],
                "suggestion": prediction['category'],
                "confidence": prediction['confidence'],
                "applied_category": matched_cat is not None
            })
    
    return {"processed": len(results), "results": results}

@router.post("/detect-duplicates/{project_id}")
async def detect_duplicates(project_id: str):
    """Duplicate images detect karo"""
    images = supabase.table("images").select("*").eq("project_id", project_id).execute()
    
    if not images.data or len(images.data) < 2:
        return {"duplicates": []}
    
    duplicate_groups = find_duplicates(images.data)
    
    # Mark duplicates in DB
    for group in duplicate_groups:
        for img_id in group[1:]:  # First ko original maano
            supabase.table("images").update({
                "is_duplicate": True,
                "duplicate_of": group[0]
            }).eq("id", img_id).execute()
    
    return {"duplicates": duplicate_groups}

@router.get("/suggest-categories/{project_id}")
async def suggest_categories(project_id: str):
    """Naye categories suggest karo based on images"""
    images = supabase.table("images").select("*").eq("project_id", project_id).execute()
    
    suggestions = {}
    for img in images.data:
        pred = categorize_image(img['original_url'])
        if "error" not in pred:
            cat = pred['category']
            suggestions[cat] = suggestions.get(cat, 0) + 1
    
    # Top suggestions return karo
    sorted_suggestions = sorted(suggestions.items(), key=lambda x: x[1], reverse=True)
    return {"suggestions": [{"name": name, "count": count} for name, count in sorted_suggestions[:5]]}