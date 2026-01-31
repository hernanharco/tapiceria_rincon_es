from rest_framework import serializers
from .models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago, titleDescripcion

class DataCompanySerializer(serializers.ModelSerializer):
    # Campo para devolver la URL limpia al frontend
    logo_url = serializers.SerializerMethodField()
    # Usamos FileField para permitir la carga de archivos binarios (imágenes)
    logo = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = DataCompany
        fields = '__all__'

    def to_internal_value(self, data):
        """
        Lógica de limpieza 'a prueba de balas' para evitar errores 400.
        Limpia strings vacíos y evita que las URLs de Cloudinary se validen como archivos.
        """
        print("DEBUG - Data recibida:", data)
        # 1. Convertimos a diccionario mutable (soporta QueryDict y dicts normales)
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = data.copy()

        # 2. Limpieza de campos: React a veces envía "" o "null" como strings
        for key, value in data.items():
            if value == "" or value == "null" or value == "undefined":
                data[key] = None

        # 3. Tratamiento especial del campo Logo
        if 'logo' in data:
            val = data.get('logo')
            
            # Caso A: Si es un String (es la URL actual), lo quitamos.
            # Django no puede validar un string como un archivo binario.
            if isinstance(val, str):
                data.pop('logo')
            
            # Caso B: Si viene como una lista (común en envíos de formularios)
            elif isinstance(val, list) and len(val) > 0:
                # Si el primer elemento es un string (URL), eliminamos el campo
                if isinstance(val[0], str):
                    data.pop('logo')
                else:
                    # Si es un archivo real, extraemos el primer elemento
                    data['logo'] = val[0]
            
            # Caso C: Si el valor es nulo o vacío
            elif val is None:
                data.pop('logo')

        return super().to_internal_value(data)

    def get_logo_url(self, obj):
        """
        Retorna la URL del logo de forma segura.
        """
        if obj.logo:
            try:
                # Intentamos obtener la URL generada por el storage de Cloudinary
                return obj.logo.url
            except Exception:
                # Si falla, devolvemos el valor como string
                return str(obj.logo)
        return None

# --- Resto de Serializadores (Mantienen su lógica funcional) ---

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