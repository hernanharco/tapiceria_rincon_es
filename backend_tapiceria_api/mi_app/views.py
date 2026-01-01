
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


class titleDescripcionViewSet(viewsets.ModelViewSet):
    serializer_class = titleDescripcionSerializer
    queryset = titleDescripcion.objects.all()

    # Esta forma solo sirve para listar informacion
    @extend_schema(
        description="Filtra registros de 'titleDescripcion' cuyo campo 'titledoc' coincida con el ID del Document dado.",
        parameters=[
            OpenApiParameter(
                name='get_titleDocuments',
                type=str,
                location='query',
                description='titledoc del documento para filtrar las descripciones asociadas'
            )
        ]
    )
    @action(detail=False, url_path='title', methods=['get'])
    def get_titleDocuments(self, request):
        doc_id = request.query_params.get('titledocument')

        if doc_id:
            try:
                # Filtramos los titleDescripcion cuyo "titledoc" sea igual al Document con id=doc_id
                queryset = self.queryset.filter(titledoc__id=doc_id)
            except ValueError:
                return Response({"error": "El valor proporcionado no es un ID válido."}, status=400)
        else:
            queryset = self.get_queryset()

        # Serializamos los resultados
        serializer = self.get_serializer(queryset, many=True)
        return Response({"results": serializer.data})


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
