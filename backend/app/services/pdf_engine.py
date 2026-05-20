from fpdf import FPDF
from typing import List

class CatalogPDF(FPDF):
    def __init__(self, company_name=""):
        super().__init__()
        self.company_name = company_name
        
    def header(self):
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, self.company_name or "Product Catalog", ln=True, align="C")
        self.ln(5)
        
    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_catalog_pdf(
    images: List[dict],
    output_path: str,
    template: str = "grid-2",
    company_name: str = "",
    logo_url: str = None
):
    """PDF generation without PIL - images skipped"""
    pdf = CatalogPDF(company_name=company_name)
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Simple text-only PDF for now
    pdf.add_page()
    pdf.set_font("Arial", "B", 20)
    pdf.cell(0, 20, "CatalogForge PDF", ln=True, align="C")
    pdf.ln(10)
    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Total Images: {len(images)}", ln=True)
    pdf.cell(0, 10, f"Template: {template}", ln=True)
    
    for img_data in images:
        pdf.add_page()
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, f"Image: {img_data.get('filename', 'Unknown')}", ln=True)
        pdf.set_font("Arial", "", 10)
        pdf.cell(0, 10, f"URL: {img_data.get('original_url', '')[:50]}...", ln=True)
    
    pdf.output(output_path)
    return output_path