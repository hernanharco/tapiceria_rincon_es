from rest_framework import serializers
from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago, titleDescripcion

class DataCompanySerializer(serializers.ModelSerializer):
    # Añadimos este campo para que el frontend reciba la URL directa de la imagen
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = DataCompany
        fields = '__all__'

    def get_logo_url(self, obj):
        if obj.logo:
            return obj.logo.url
        return None

class DataClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataClient
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    
    dataclient = serializers.SlugRelatedField(
        queryset=DataClient.objects.all(),
        slug_field='cif'
    )

    class Meta:
        model = Document
        fields = '__all__'

class titleDescripcionSerializer(serializers.ModelSerializer):
    titledoc = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all())

    class Meta:
        model = titleDescripcion
        fields = '__all__'

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