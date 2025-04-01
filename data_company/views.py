from rest_framework import viewsets
from .serializers import DataCompanySerializer, DataDocumentSerializer, DocumentSerializer
from .models import Data_Company, Data_document, Document

# Create your views here.
class Data_Company_view(viewsets.ModelViewSet):
    serializer_class = DataCompanySerializer     
    queryset = Data_Company.objects.all()

class Data_Document_view(viewsets.ModelViewSet):
    serializer_class = DataDocumentSerializer
    queryset = Data_document.objects.all()

class Document_view(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()


