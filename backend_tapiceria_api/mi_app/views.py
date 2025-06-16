
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago
from .serializers import (
    DataCompanySerializer,
    DataClientSerializer,
    DocumentSerializer,
    DataDocumentSerializer,
    FooterDocumentSerializer,
    PagoSerializer
)

class DataCompanyViewSet(viewsets.ModelViewSet):
    queryset = DataCompany.objects.all()
    serializer_class = DataCompanySerializer


class DataClientViewSet(viewsets.ModelViewSet):
    queryset = DataClient.objects.all()
    serializer_class = DataClientSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)  # 👈 LOG
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


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