from fpdf import FPDF
import io
import requests
from typing import List
import uuid
import os

class CatalogPDF(FPDF):
    def __init__(self, company_name="", logo_url=None):
        super().__init__()
        self.company_name = company_name
        self.logo_url = logo_url
        
    def header(self):
        if self.logo_url:
            try:
                self.image(self.logo_url, 10, 8, 30)
            except:
                pass
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, self.company_name or "Product Catalog", ln=True, align="C")
        self.ln(5)
        
    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def download_image(url: str) -> bytes:
    response = requests.get(url)
    return response.content

def convert_to_rgb(img):
    """Lazy import PIL - only when PDF generation is called"""
    from PIL import Image
    if img.mode in ('RGBA', 'LA'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        return background
    elif img.mode == 'P':
        img = img.convert('RGBA')
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        return background
    elif img.mode != 'RGB':
        return img.convert('RGB')
    return img

def resize_for_pdf(img, max_width: int, max_height: int):
    from PIL import Image
    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return img

def generate_catalog_pdf(
    images: List[dict],
    output_path: str,
    template: str = "grid-2",
    company_name: str = "",
    logo_url: str = None
):
    from PIL import Image  # Lazy import - only when PDF generation called
    
    pdf = CatalogPDF(company_name=company_name, logo_url=logo_url)
    pdf.set_auto_page_break(auto=True, margin=15)
    
    if template == "grid-2":
        for i, img_data in enumerate(images):
            if i % 2 == 0:
                pdf.add_page()
            
            img_bytes = download_image(img_data['original_url'])
            img = Image.open(io.BytesIO(img_bytes))
            img = convert_to_rgb(img)
            img = resize_for_pdf(img, 90, 120)
            
            x = 10 if i % 2 == 0 else 105
            y = 30
            
            img_path = f"/tmp/img_{uuid.uuid4()}.jpg"
            img.save(img_path, 'JPEG', quality=95)
            
            pdf.image(img_path, x=x, y=y, w=90)
            os.remove(img_path)
            
    elif template == "grid-4":
        for i, img_data in enumerate(images):
            if i % 4 == 0:
                pdf.add_page()
            
            img_bytes = download_image(img_data['original_url'])
            img = Image.open(io.BytesIO(img_bytes))
            img = convert_to_rgb(img)
            img = resize_for_pdf(img, 90, 110)
            
            positions = [(10, 30), (105, 30), (10, 150), (105, 150)]
            pos = positions[i % 4]
            
            img_path = f"/tmp/img_{uuid.uuid4()}.jpg"
            img.save(img_path, 'JPEG', quality=95)
            
            pdf.image(img_path, x=pos[0], y=pos[1], w=90)
            os.remove(img_path)
            
    else:
        for img_data in images:
            pdf.add_page()
            
            img_bytes = download_image(img_data['original_url'])
            img = Image.open(io.BytesIO(img_bytes))
            img = convert_to_rgb(img)
            img = resize_for_pdf(img, 190, 250)
            
            img_path = f"/tmp/img_{uuid.uuid4()}.jpg"
            img.save(img_path, 'JPEG', quality=95)
            
            pdf.image(img_path, x=10, y=30, w=190)
            os.remove(img_path)
    
    pdf.output(output_path)
    return output_path