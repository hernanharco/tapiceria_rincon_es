import logging
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO

logger = logging.getLogger(__name__)

def link_callback(uri, rel):
    """
    Convierte rutas HTML en rutas absolutas para que xhtml2pdf encuentre imágenes/css
    """
    return uri # Retornamos la uri tal cual para imágenes en base64

def generate_pdf(template_src, context_dict={}):
    html = render_to_string(template_src, context_dict)
    result = BytesIO()
    
    # Esta es la función que realmente "dibuja"
    pdf = pisa.pisaDocument(
        BytesIO(html.encode("UTF-8")), 
        result, 
        encoding='UTF-8',
        link_callback=link_callback
    )
    
    if not pdf.err:
        return result.getvalue()
    
    logger.error(f"Error en xhtml2pdf: {pdf.err}")
    return None