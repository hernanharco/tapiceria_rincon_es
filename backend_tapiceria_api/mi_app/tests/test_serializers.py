"""
Tests para los serializers de Tapicería Rincón.

Cubre casos borde de limpieza de datos, especialmente el manejo
del logo en DataCompanySerializer (que tiene lógica anti-fragilidad).
"""
import pytest
from rest_framework import serializers
from mi_app.serializers import (
    DataCompanySerializer,
    DataClientSerializer,
    DocumentSerializer,
    DataDocumentSerializer,
    FooterDocumentSerializer,
)


# ═══════════════════════════════════════════════════════════════
# DataCompanySerializer
# ═══════════════════════════════════════════════════════════════

class TestDataCompanySerializer:
    def test_serialize_company(self, company):
        """Serializar una empresa devuelve los campos esperados."""
        serializer = DataCompanySerializer(company)
        data = serializer.data
        assert data['cif'] == 'B12345678'
        assert data['name'] == 'Tapicería Rincón S.L.'
        assert data['iva_comp'] == '21'
        assert 'logo_url' in data
        assert data['logo_url'] is None

    @pytest.mark.django_db
    def test_deserialize_valid_data(self):
        """Deserializar datos válidos crea una instancia."""
        data = {
            'cif': 'B99999999',
            'name': 'Nueva Empresa',
            'address': 'Calle Nueva 1',
            'zip_code': '28001',
            'city': 'Madrid',
            'number': '912345678',
            'email': 'nueva@empresa.es',
            'iva_comp': '21',
        }
        serializer = DataCompanySerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"
        company = serializer.save()
        assert company.cif == 'B99999999'

    @pytest.mark.django_db
    def test_deserialize_logo_empty_string(self):
        """
        Caso borde: React envía logo como string vacío "".
        El serializer debe limpiarlo (no fallar con 400).
        """
        data = {
            'cif': 'B88888888',
            'name': 'Empresa Test',
            'address': 'Calle Test 1',
            'zip_code': '28001',
            'city': 'Madrid',
            'number': '912345678',
            'email': 'test@test.es',
            'iva_comp': '21',
            'logo': '',
        }
        serializer = DataCompanySerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"

    @pytest.mark.django_db
    def test_deserialize_logo_null_string(self):
        """
        Caso borde: React envía logo como "null" (string literal).
        El serializer debe limpiarlo.
        """
        data = {
            'cif': 'B77777777',
            'name': 'Empresa Test 2',
            'address': 'Calle Test 2',
            'zip_code': '28001',
            'city': 'Madrid',
            'number': '912345678',
            'email': 'test2@test.es',
            'iva_comp': '21',
            'logo': 'null',
        }
        serializer = DataCompanySerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"

    @pytest.mark.django_db
    def test_deserialize_logo_url_string(self):
        """
        Caso borde: React envía la URL actual del logo como string.
        Django no puede validar un string como archivo, el serializer debe omitirlo.
        """
        data = {
            'cif': 'B66666666',
            'name': 'Empresa Test 3',
            'address': 'Calle Test 3',
            'zip_code': '28001',
            'city': 'Madrid',
            'number': '912345678',
            'email': 'test3@test.es',
            'iva_comp': '21',
            'logo': 'https://res.cloudinary.com/demo/image/upload/v1/logo.png',
        }
        serializer = DataCompanySerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"

    @pytest.mark.django_db
    def test_deserialize_missing_optional_fields(self):
        """Campos opcionales pueden faltar sin error."""
        data = {
            'cif': 'B55555555',
            'name': 'Empresa Mínima',
            'address': 'Dir',
            'zip_code': '00000',
            'city': 'City',
            'number': '000',
            'email': 'min@emp.es',
            'iva_comp': '10',
        }
        serializer = DataCompanySerializer(data=data)
        assert serializer.is_valid()


# ═══════════════════════════════════════════════════════════════
# DataClientSerializer
# ═══════════════════════════════════════════════════════════════

class TestDataClientSerializer:
    def test_serialize_client(self, client_model):
        """Serializar un cliente devuelve los datos esperados."""
        serializer = DataClientSerializer(client_model)
        assert serializer.data['cif'] == 'A11111111'
        assert serializer.data['name'] == 'Juan Pérez'

    def test_deserialize_client(self, company):
        """Crear un cliente desde datos serializados."""
        data = {
            'cif': 'A55555555',
            'name': 'Nuevo Cliente',
            'address': 'Dir Cliente',
            'zip_code': '33400',
            'city': 'Avilés',
            'province': 'Asturias',
            'number': '999888777',
            'company': company.cif,
        }
        serializer = DataClientSerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"
        client = serializer.save()
        assert client.cod_client.startswith('CLI')


# ═══════════════════════════════════════════════════════════════
# DocumentSerializer
# ═══════════════════════════════════════════════════════════════

class TestDocumentSerializer:
    def test_serialize_document(self, document):
        """Serializar un documento."""
        serializer = DocumentSerializer(document)
        assert serializer.data['num_presupuesto'] == 'PRE0001'

    def test_deserialize_document(self, client_model):
        """Crear documento con PrimaryKeyRelatedField (id del cliente)."""
        data = {
            'dataclient': client_model.id,
            'fecha_factura': '2026-06-15',
            'num_presupuesto': 'PRE0100',
        }
        serializer = DocumentSerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"

    def test_document_id_read_only(self, document):
        """El campo 'id' es read-only."""
        serializer = DocumentSerializer(document)
        assert 'id' in serializer.data

    @pytest.mark.django_db
    def test_deserialize_invalid_date(self, client_model):
        """Fecha inválida debe fallar."""
        data = {
            'dataclient': client_model.id,
            'fecha_factura': 'no-es-una-fecha',
            'num_presupuesto': 'PRE9999',
        }
        serializer = DocumentSerializer(data=data)
        assert not serializer.is_valid()
        assert 'fecha_factura' in serializer.errors


# ═══════════════════════════════════════════════════════════════
# DataDocumentSerializer
# ═══════════════════════════════════════════════════════════════

class TestDataDocumentSerializer:
    def test_serialize_item(self, document):
        """Serializar un item de documento."""
        from mi_app.models import DataDocument
        item = DataDocument.objects.create(
            documento=document,
            descripcion='Producto test',
            cantidad=1,
            precio=100,
            dto=0,
            importe=100,
        )
        serializer = DataDocumentSerializer(item)
        assert serializer.data['descripcion'] == 'Producto test'
        assert serializer.data['line'] is True

    def test_deserialize_item(self, document):
        """Crear item desde datos serializados."""
        data = {
            'documento': document.id,
            'referencia': 'REF-TEST',
            'descripcion': 'Artículo de prueba',
            'cantidad': '2.00',
            'precio': '150.00',
            'dto': '10.00',
            'importe': '270.00',
            'entrega': '15 días',
        }
        serializer = DataDocumentSerializer(data=data)
        assert serializer.is_valid(), f"Errors: {serializer.errors}"


# ═══════════════════════════════════════════════════════════════
# FooterDocumentSerializer
# ═══════════════════════════════════════════════════════════════

class TestFooterDocumentSerializer:
    def test_serialize_footer(self, document_with_relations):
        """Serializar footer."""
        footer = document_with_relations.footer
        serializer = FooterDocumentSerializer(footer)
        assert float(serializer.data['total']) == 544.50
        assert float(serializer.data['iva']) == 21.00
