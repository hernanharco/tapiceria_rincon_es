from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import Q
from rest_framework import viewsets, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from .services.pdf_service import PDFService

from .models import (
    DataCompany, DataClient, Document, DataDocument, 
    FooterDocument, Pago, titleDescripcion
)

from .serializers import (
    DataCompanySerializer, DataClientSerializer, DocumentSerializer, 
    DataDocumentSerializer, FooterDocumentSerializer, PagoSerializer, 
    titleDescripcionSerializer
)

class DataCompanyViewSet(viewsets.ModelViewSet):
    queryset = DataCompany.objects.all()
    serializer_class = DataCompanySerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

class DataClientViewSet(viewsets.ModelViewSet):
    queryset = DataClient.objects.all()
    serializer_class = DataClientSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        queryset = Document.objects.all()
        start_date = self.request.query_params.get('start')
        end_date = self.request.query_params.get('end')
        
        if start_date and end_date:
            queryset = queryset.filter(fecha_factura__gte=start_date, fecha_factura__lte=end_date)
        
        document_type = self.request.query_params.get('type')
        if document_type and document_type != 'Todos':
            if document_type == 'Presupuesto':
                queryset = queryset.filter(num_presupuesto__isnull=False)
            elif document_type == 'Albarán':
                queryset = queryset.filter(num_albaran__isnull=False)
            elif document_type == 'Factura':
                queryset = queryset.filter(num_factura__isnull=False)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(num_presupuesto__icontains=search) |
                Q(num_albaran__icontains=search) |
                Q(num_factura__icontains=search)
            )
        return queryset.order_by('-fecha_factura')

    @action(detail=False, methods=['get'], url_path='print/(?P<numero>[^/.]+)')
    def print_document(self, request, numero=None):
        try:
            # 1. Normalizamos el número (limpieza de barras finales y mayúsculas)
            numero_limpio = numero.strip('/').upper()
            prefix = numero_limpio[:3] # Extrae PRE, FAC o ALB

            # 2. Mapeo para el label y selección del campo de búsqueda
            mapeo = {
                'PRE': {'label': 'PRESUPUESTO', 'campo': 'num_presupuesto'},
                'FAC': {'label': 'FACTURA', 'campo': 'num_factura'},
                'ALB': {'label': 'ALBARÁN', 'campo': 'num_albaran'},
            }

            config = mapeo.get(prefix)
            
            if not config:
                return HttpResponse(f"Error: Prefijo {prefix} no reconocido", status=400)

            # 3. Filtro dinámico según el prefijo detectado
            # Usamos **{config['campo']: numero_limpio} para buscar exactamente en la columna correcta
            document = Document.objects.filter(**{f"{config['campo']}__iexact": numero_limpio}).first()

            if not document:
                return HttpResponse(f"Error: No se encontró el documento {numero_limpio}", status=404)

            # 4. Generamos el PDF pasando el label detectado
            label = config['label']
            pdf_content = PDFService.generate_document_pdf(document, label)

            # --- CONFIGURACIÓN DE RESPUESTA ---
            response = HttpResponse(pdf_content, content_type='application/pdf')
            filename = f"{label.lower()}_{numero_limpio}.pdf"
            
            response['Content-Disposition'] = f'inline; filename="{filename}"'
            return response

        except Exception as e:
            logger.error(f"Error en vista print_document: {str(e)}")
            return HttpResponse(f"Error en el servidor: {str(e)}", status=500)


class TitleDescripcionViewSet(viewsets.ModelViewSet):
    queryset = titleDescripcion.objects.all()
    serializer_class = titleDescripcionSerializer

class DataDocumentViewSet(viewsets.ModelViewSet):
    queryset = DataDocument.objects.all()
    serializer_class = DataDocumentSerializer

class FooterDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = FooterDocumentSerializer
    queryset = FooterDocument.objects.all()
    def get_queryset(self):
        footer_documento_id = self.request.query_params.get('footer_documento')
        if footer_documento_id:
            return FooterDocument.objects.filter(footer_documento_id=footer_documento_id)
        return super().get_queryset()

class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()
    def get_queryset(self):
        pago_id = self.request.query_params.get('empresa')
        if pago_id:
            return Pago.objects.filter(empresa_id=pago_id)
        return super().get_queryset()