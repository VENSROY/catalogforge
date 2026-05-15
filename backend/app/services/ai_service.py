# from transformers import CLIPProcessor, CLIPModel
# from PIL import Image
# import requests
# import torch
# from typing import List, Dict
# import io

# # CLIP model load (ek baar server start pe)
# model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
# processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# # Furniture categories (expandable)
# CATEGORY_LABELS = [
#     "sofa", "bed", "chair", "table", "dining table", 
#     "wardrobe", "bookshelf", "lamp", "mirror", "rug",
#     "cabinet", "stool", "bench", "recliner", "ottoman"
# ]

# def categorize_image(image_url: str) -> Dict:
#     """Single image ko CLIP se categorize karo"""
#     try:
#         # Image download
#         response = requests.get(image_url)
#         image = Image.open(io.BytesIO(response.content)).convert("RGB")
        
#         # CLIP processing
#         inputs = processor(
#             text=CATEGORY_LABELS,
#             images=image,
#             return_tensors="pt",
#             padding=True
#         )
        
#         outputs = model(**inputs)
#         logits_per_image = outputs.logits_per_image
#         probs = logits_per_image.softmax(dim=1)
        
#         # Best match
#         best_idx = probs.argmax().item()
#         confidence = probs[0][best_idx].item()
        
#         return {
#             "category": CATEGORY_LABELS[best_idx],
#             "confidence": round(confidence, 3),
#             "all_scores": {
#                 label: round(prob.item(), 3) 
#                 for label, prob in zip(CATEGORY_LABELS, probs[0])
#             }
#         }
#     except Exception as e:
#         return {"error": str(e)}

# def batch_categorize(image_urls: List[str]) -> List[Dict]:
#     """Multiple images ek saath"""
#     return [categorize_image(url) for url in image_urls]

# def find_duplicates(images: List[Dict], threshold: float = 0.95) -> List[List[str]]:
#     """Duplicate images detect karo using embeddings"""
#     from sklearn.metrics.pairwise import cosine_similarity
#     import numpy as np
    
#     embeddings = []
#     for img in images:
#         image = Image.open(io.BytesIO(requests.get(img['original_url']).content)).convert("RGB")
#         inputs = processor(images=image, return_tensors="pt")
#         img_features = model.get_image_features(**inputs)
#         embeddings.append(img_features.detach().numpy().flatten())
    
#     embeddings = np.array(embeddings)
#     similarity_matrix = cosine_similarity(embeddings)
    
#     duplicates = []
#     seen = set()
    
#     for i in range(len(images)):
#         if i in seen:
#             continue
#         group = [images[i]['id']]
#         for j in range(i + 1, len(images)):
#             if similarity_matrix[i][j] > threshold:
#                 group.append(images[j]['id'])
#                 seen.add(j)
#         if len(group) > 1:
#             duplicates.append(group)
    
#     return duplicates

# backend/app/services/ai_service.py

from typing import List, Dict

# Temporary AI stub
# Real AI features will be added later

def categorize_image(image_url: str) -> Dict:
    return {
        "category": "unknown",
        "confidence": 0.0,
        "message": "AI temporarily disabled"
    }


def batch_categorize(image_urls: List[str]) -> List[Dict]:
    return [
        categorize_image(url)
        for url in image_urls
    ]


def find_duplicates(
    images: List[Dict],
    threshold: float = 0.95
) -> List[List[str]]:
    return []