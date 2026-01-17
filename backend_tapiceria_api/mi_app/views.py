from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import (
    DataCompany, 
    DataClient, 
    Document, 
    DataDocument, 
    FooterDocument, 
    Pago, 
    titleDescripcion
)

from .serializers import (
    DataCompanySerializer,
    DataClientSerializer,
    DocumentSerializer,
    DataDocumentSerializer,
    FooterDocumentSerializer,
    PagoSerializer,
    titleDescripcionSerializer,
)

class DataCompanyViewSet(viewsets.ModelViewSet):
    queryset = DataCompany.objects.all()
    serializer_class = DataCompanySerializer
    # Permitimos la subida de archivos (logo) junto con datos JSON
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)


class DataClientViewSet(viewsets.ModelViewSet):
    queryset = DataClient.objects.all()
    serializer_class = DataClientSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            # Captura errores de base de datos o lógica y los envía al Frontend
            return Response(
                {"error_servidor": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
        # Filtro optimizado para buscar el footer por el ID del documento
        footer_documento_id = self.request.query_params.get('footer_documento')

        if footer_documento_id:
            try:
                footer_documento_id = int(footer_documento_id)
                return FooterDocument.objects.filter(footer_documento_id=footer_documento_id)
            except ValueError:
                return FooterDocument.objects.none()

        return super().get_queryset()


class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()

    def get_queryset(self):
        # Filtro para obtener las formas de pago de una empresa específica
        pago_id = self.request.query_params.get('empresa')

        if pago_id:
            try:
                # Nota: El modelo Pago usa el campo 'empresa' (CIF) como FK
                return Pago.objects.filter(empresa_id=pago_id)
            except Exception:
                return Pago.objects.none()

        return super().get_queryset()