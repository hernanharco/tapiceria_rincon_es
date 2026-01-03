
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
    """
    ViewSet para manejar los títulos / descripciones asociados a un documento.

    Endpoints disponibles:
    - GET  /api/titleDescripcion/
        → Devuelve todos los registros

    - GET  /api/titleDescripcion/?titledocument=ID
        → Devuelve solo los registros asociados al documento indicado

    - POST /api/titleDescripcion/
        → Crea un nuevo registro
    """

    # Serializer que convierte el modelo a JSON y viceversa
    serializer_class = titleDescripcionSerializer

    # Queryset base (todos los registros)
    queryset = titleDescripcion.objects.all()

    def get_queryset(self):
        """
        Permite filtrar por documento usando un parámetro en la URL.

        Ejemplo:
        /api/titleDescripcion/?titledocument=66
        """
        # Obtenemos el queryset base
        queryset = super().get_queryset()

        # Leemos el parámetro 'titledocument' desde la URL
        doc_id = self.request.query_params.get("titledocument")

        # Si el parámetro existe, filtramos por el ID del documento
        # Django devuelve una lista vacía si el ID no existe (no lanza error)
        if doc_id:
            queryset = queryset.filter(titledoc_id=doc_id)

        # Retornamos el queryset final
        return queryset



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
