import logging
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO

logger = logging.getLogger(__name__)

def generate_pdf(template_src, context_dict=None):
    if context_dict is None:
        context_dict = {}
    html = render_to_string(template_src, context_dict)
    try:
        pdf_bytes = HTML(string=html).write_pdf()
        return pdf_bytes
    except Exception as e:
        logger.error(f"Error generando PDF: {e}")
        return None
