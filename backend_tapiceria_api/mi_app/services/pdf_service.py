import base64
import requests
import logging
from django.template.loader import render_to_string
from xhtml2pdf import pisa  
from io import BytesIO
from django.db.models import Q

# Asegúrate de que la ruta de importación de Pago sea la correcta en tu proyecto
# from mi_app.models import Pago 

logger = logging.getLogger(__name__)

class PDFService:
    @staticmethod
    def get_image_base64(url):
        """
        Convierte una imagen de URL (Cloudinary/S3) a Base64 para evitar 
        problemas de permisos en sistemas Linux.
        """
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                bg_64 = base64.b64encode(response.content).decode('utf-8')
                mime_type = response.headers.get('Content-Type', 'image/png')
                return f"data:{mime_type};base64,{bg_64}"
        except Exception as e:
            logger.error(f"Error cargando logo en Base64: {e}")
        return None

    @staticmethod
    def generate_document_pdf(document, tipo_label=None):
        """
        Genera el PDF procesando títulos, items, lógica de prefijos y logos.
        """
        try:            
            client = document.dataclient
            company = client.company            
            footer = getattr(document, 'footer', None)

            # --- 1. LÓGICA DE DETECCIÓN DE TIPO POR PREFIJO ---
            # Intentamos obtener el código de cualquier campo disponible
            codigo_actual = (
                document.num_presupuesto or 
                document.num_factura or 
                document.num_albaran or 
                ""
            ).upper()
            
            prefix = codigo_actual[:3]

            mapeo_tipos = {
                'PRE': 'PRESUPUESTO',
                'FAC': 'FACTURA',
                'ALB': 'ALBARÁN',
            }

            # Prioridad: 1. El label que venga de la vista, 2. El detectado por prefijo, 3. "DOCUMENTO"
            tipo_final = tipo_label if tipo_label else mapeo_tipos.get(prefix, 'DOCUMENTO')

            # --- 2. OBTENER FORMAS DE PAGO (OPCIONAL) ---
            # Si tienes el modelo Pago relacionado a la empresa
            formas_pago = []
            try:
                from core.models import Pago # Ajusta el import a tu modelo
                formas_pago = Pago.objects.filter(empresa=company)
            except ImportError:
                logger.warning("Modelo Pago no encontrado para PDF.")

            # --- 3. LÓGICA DE EMPAREJAMIENTO (Título + Items) ---
            content = []
            all_titles = list(document.titles.all().order_by('id'))
            all_items = list(document.items.all().order_by('id'))
            
            item_index = 0
            for title in all_titles:
                # Agregamos el Título de la sección
                content.append({
                    'type': 'title',
                    'value': title.titdescripcion
                })
                
                # Agregamos los items correspondientes (basado en tu lógica de bloques)
                # Si un título siempre lleva los siguientes 2 items:
                for _ in range(2):
                    if item_index < len(all_items):
                        item = all_items[item_index]
                        content.append({
                            'type': 'product',
                            'value': {
                                'descripcion': item.descripcion,
                                'cantidad': f"{item.cantidad:.2f}",
                                'precio': f"{item.precio:.2f}",
                                'importe': f"{item.importe:.2f}"
                            }
                        })
                        item_index += 1

            # 4. Procesar items huérfanos (si sobran items sin título)
            while item_index < len(all_items):
                item = all_items[item_index]
                content.append({
                    'type': 'product',
                    'value': {
                        'descripcion': item.descripcion,
                        'cantidad': f"{item.cantidad:.2f}",
                        'precio': f"{item.precio:.2f}",
                        'importe': f"{item.importe:.2f}"
                    }
                })
                item_index += 1

            # --- 5. PROCESAMIENTO DE LOGO ---
            logo_base64 = None
            if hasattr(company, 'logo') and company.logo:
                logo_base64 = PDFService.get_image_base64(company.logo.url)

            # --- 6. CONTEXTO PARA EL HTML ---
            context = {
                'doc': document,
                'tipo': tipo_final,      # Ejemplo: "FACTURA"
                'prefix': prefix,        # Ejemplo: "FAC"
                'codigo_completo': codigo_actual,
                'company': company,
                'client': client,
                'content': content,
                'footer': footer,
                'logo_url': logo_base64,  
                'pagos': formas_pago
            }

            # 7. Renderizar el HTML
            html_string = render_to_string('pdf/document_v1.html', context)
            
            # 8. Crear el PDF usando xhtml2pdf
            pdf_buffer = BytesIO()
            pisa_status = pisa.CreatePDF(
                src=html_string, 
                dest=pdf_buffer,
                encoding='UTF-8'
            )
            
            if pisa_status.err:
                logger.error("Error en xhtml2pdf: %s", pisa_status.err)
                raise Exception("Error interno al generar el PDF")
            
            pdf_bytes = pdf_buffer.getvalue()
            pdf_buffer.close()
            
            return pdf_bytes
            
        except Exception as e:
            logger.error(f"Error crítico en PDFService: {str(e)}")
            raise