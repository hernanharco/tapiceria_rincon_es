import base64
import requests
import logging
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from django.db.models import Q

# Importación de modelos (ajusta 'core.models' al nombre real de tu app)
# from core.models import Pago, DataCompany, DataClient, Document

logger = logging.getLogger(__name__)

class PDFService:
    @staticmethod
    def get_image_base64(url):
        """
        Convierte una imagen de URL (Cloudinary) a Base64 para evitar 
        problemas de carga en el renderizado de PDF en Linux/Docker.
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
        Incluye validación de formas de pago por consola.
        """
        try:            
            client = document.dataclient
            company = client.company            
            footer = getattr(document, 'footer', None)

            # --- 1. LÓGICA DE DETECCIÓN DE TIPO POR PREFIJO ---
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
            tipo_final = tipo_label if tipo_label else mapeo_tipos.get(prefix, 'DOCUMENTO')

            # --- 2. OBTENER FORMAS DE PAGO (Ajustado a tu modelo Pago) ---
            formas_pago = []
            try:
                # Import dinámico para evitar colisiones
                from mi_app.models import Pago                
                formas_pago = Pago.objects.filter(empresa=company)
                
                # 🔍 DEBUG DE CONSOLA PARA DOCKER
                print("\n" + "═"*60)
                print(f"DEBUG PDF: Generando para {tipo_final} - {codigo_actual}")
                print(f"Empresa: {company.name} (CIF: {company.cif})")
                
                if formas_pago.exists():
                    print(f"✅ Formas de pago encontradas ({formas_pago.count()}):")
                    for p in formas_pago:
                        print(f"  - ID {p.id}: {p.forma_pago}") # Campo exacto de tu modelo
                else:
                    print(f"⚠️ Alerta: No hay formas de pago registradas para esta empresa.")
                print("═"*60 + "\n")
                
            except (ImportError, Exception) as e:
                logger.error(f"Error cargando pagos: {e}")
                print(f"❌ Error crítico cargando pagos: {e}")

            # --- 3. LÓGICA DE EMPAREJAMIENTO (Título + Items) ---
            content = []
            all_titles = list(document.titles.all().order_by('id'))
            all_items = list(document.items.all().order_by('id'))
            
            item_index = 0
            for title in all_titles:
                content.append({
                    'type': 'title',
                    'value': title.titdescripcion
                })
                
                # Lógica de bloques: asocia items al título actual
                # (Ajustar esta lógica si tu relación items-títulos es distinta)
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

            # Procesar items restantes sin título
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

            # --- 4. PROCESAMIENTO DE LOGO ---
            logo_base64 = None
            if company.logo:
                logo_base64 = PDFService.get_image_base64(company.logo.url)

            # --- 5. CONTEXTO Y RENDERIZADO ---
            context = {
                'doc': document,
                'tipo': tipo_final,
                'prefix': prefix,
                'codigo_completo': codigo_actual,
                'company': company,
                'client': client,
                'content': content,
                'footer': footer,
                'logo_url': logo_base64,  
                'pagos': formas_pago # Pasamos el QuerySet con los campos 'forma_pago'
            }

            html_string = render_to_string('pdf/document_v1.html', context)
            
            pdf_bytes = HTML(string=html_string).write_pdf()
            return pdf_bytes
            
        except Exception as e:
            logger.error(f"Error crítico en PDFService: {str(e)}")
            raise