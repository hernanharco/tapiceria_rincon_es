from rest_framework import serializers
from .models import Data_Company, Data_document, Document

# Serializer para Data_Company
class DataCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Data_Company
        fields = '__all__'

# Serializer para Data_document
class DataDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data_document
        fields = '__all__'

# Serializer para Document
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'