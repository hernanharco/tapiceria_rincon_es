
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter


from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago, titleDescripcion

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
            # Esto atrapará el error y te lo mostrará en el Frontend
            # para que sepamos EXACTAMENTE qué falló.
            return Response(
                {"error_servidor": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TitleDescripcionViewSet(viewsets.ModelViewSet):
    queryset = DataDocument.objects.all()
    serializer_class = DataDocumentSerializer

class DataDocumentViewSet(viewsets.ModelViewSet):
    queryset = DataDocument.objects.all()
    serializer_class = DataDocumentSerializer


class FooterDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = FooterDocumentSerializer

    # 👇 Añade esta línea:
    # o FooterDocument.objects.all() si quieres que también sirva para listar todos
    queryset = FooterDocument.objects.none()

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
    # o Pago.objects.all() si quieres que también sirva para listar todos
    queryset = Pago.objects.none()

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
