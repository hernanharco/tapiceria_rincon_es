
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter


from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago

from .serializers import (
    DataCompanySerializer,
    DataClientSerializer,
    DocumentSerializer,
    DataDocumentSerializer,
    FooterDocumentSerializer,
    PagoSerializer,
    
)

class DataCompanyViewSet(viewsets.ModelViewSet):
    queryset = DataCompany.objects.all()
    serializer_class = DataCompanySerializer


class DataClientViewSet(viewsets.ModelViewSet):
    queryset = DataClient.objects.all()
    serializer_class = DataClientSerializer 

class DocumentViewSet(viewsets.ModelViewSet):
    
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    # Esta forma solo sirve para listar informacion
    @extend_schema(
        parameters=[
            OpenApiParameter(name='dataclient', type=str, location='query', description='CIF del cliente'),
        ]
    )
    @action(detail=False, url_path='dataclient', methods=['get'])
    def get_dataclient(self, request):
        doc = request.query_params.get('dataclient')
        if doc:
            queryset = Document.objects.filter(dataclient__cif=doc)
        else:
            queryset = self.get_queryset()
        # Puedes usar un serializer si lo necesitas
        return Response({"results": list(queryset.values())})
    
    # @action(detail=False, url_path='dataclient/(?P<doc_id>[^/.]+)', methods=['get'])
    # def get_queryset(self):
    #     doc = self.request.query_params.get('dataclient')
    #     if doc:
    #         # Asegúrate de usar el campo correcto de DataClient, ej: cif
    #         return Document.objects.filter(dataclient__cif=doc)
    #     return super().get_queryset()

class DataDocumentViewSet(viewsets.ModelViewSet):
    queryset = DataDocument.objects.all()
    serializer_class = DataDocumentSerializer    

class FooterDocumentViewSet(viewsets.ModelViewSet):    
    serializer_class = FooterDocumentSerializer

    # 👇 Añade esta línea:
    queryset = FooterDocument.objects.none()  # o FooterDocument.objects.all() si quieres que también sirva para listar todos

    def get_queryset(self):
        footer_documento_id = self.request.query_params.get('footer_documento')
        
        if footer_documento_id:
            try:
                # Convertir a entero antes de filtrar
                footer_documento_id = int(footer_documento_id)
                return FooterDocument.objects.filter(footer_documento_id=footer_documento_id)
            except ValueError:
                # Si el ID no es un número válido, devolver lista vacía
                return FooterDocument.objects.none()

        # Devolver todos los registros si no hay filtro
        return FooterDocument.objects.all()


class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer

# 👇 Añade esta línea:
    queryset = Pago.objects.none()  # o Pago.objects.all() si quieres que también sirva para listar todos

    def get_queryset(self):
        pago_id = self.request.query_params.get('empresa')
        
        if pago_id:
            try:
                # Convertir a entero antes de filtrar
                pago_id = int(pago_id)
                return Pago.objects.filter(pago_id=pago_id)
            except ValueError:
                # Si el ID no es un número válido, devolver lista vacía
                return Pago.objects.none()

        # Devolver todos los registros si no hay filtro
        return Pago.objects.all()