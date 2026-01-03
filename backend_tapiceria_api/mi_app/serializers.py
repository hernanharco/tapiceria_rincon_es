from rest_framework import serializers
from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago, titleDescripcion

class DataCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataCompany
        fields = '__all__'


class DataClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataClient
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    
    # Esto le dice a Django: "Busca en la tabla DataClient el registro que 
    # tenga este CIF". Si no lo encuentra, devolverá un error 400 (limpio) 
    # en lugar de un 500 (colapso).
    dataclient = serializers.SlugRelatedField(
        queryset=DataClient.objects.all(),
        slug_field='cif'
    )

    class Meta:
        model = Document
        fields = '__all__'

class titleDescripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = titleDescripcion
        fields = ['id', 'dataclient', 'titles', ...]

class DataDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataDocument
        fields = '__all__'


class FooterDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterDocument
        fields = '__all__'


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'