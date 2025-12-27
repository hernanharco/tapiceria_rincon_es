
# No es tan recomendado pero si queremos que se busque con un campo que no sea id
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DataClient, NumDocument
from .serializers import NumDocumentSerializer

class NumDocumentCreate(APIView):
    def post(self, request, *args, **kwargs):
        cif = request.data.get('client')  # CIF del cliente
        num_presupuesto = request.data.get('num_presupuesto')
        num_documento = request.data.get('num_documento')

        try:
            client_instance = DataClient.objects.get(cif=cif)
        except DataClient.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        document_data = {
            'client': client_instance.id,
            'num_presupuesto': num_presupuesto,
            'num_documento': num_documento or None
        }

        serializer = NumDocumentSerializer(data=document_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)