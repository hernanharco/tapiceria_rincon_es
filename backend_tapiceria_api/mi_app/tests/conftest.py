"""
Configuración compartida de tests para la API de Tapicería Rincón.
"""
import pytest
from rest_framework.test import APIClient
from mi_app.models import DataCompany, DataClient, Document, DataDocument, FooterDocument, Pago, titleDescripcion


# ═══════════════════════════════════════════════════════════════
# FIXTURES - Empresa
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def company(db):
    """Crea una empresa base para los tests."""
    return DataCompany.objects.create(
        cif='B12345678',
        name='Tapicería Rincón S.L.',
        address='Calle Mayor 15',
        zip_code='33402',
        city='Avilés',
        number='985123456',
        email='info@tapiceria-rincon.es',
        iva_comp='21',
    )


@pytest.fixture
def second_company(db):
    """Segunda empresa para tests de filtrado/relaciones."""
    return DataCompany.objects.create(
        cif='B87654321',
        name='Otra Empresa S.L.',
        address='Calle Secundaria 10',
        zip_code='33001',
        city='Oviedo',
        number='985654321',
        email='info@otra-empresa.es',
        iva_comp='10',
    )


# ═══════════════════════════════════════════════════════════════
# FIXTURES - Cliente
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def client_model(company):
    """Crea un cliente asociado a la empresa."""
    return DataClient.objects.create(
        cif='A11111111',
        name='Juan Pérez',
        address='Calle Ejemplo 5',
        zip_code='33400',
        city='Avilés',
        province='Asturias',
        number='987654321',
        company=company,
    )


@pytest.fixture
def second_client(company):
    """Segundo cliente para tests de filtrado."""
    return DataClient.objects.create(
        cif='A22222222',
        name='María García',
        address='Calle Segunda 20',
        zip_code='33401',
        city='Avilés',
        province='Asturias',
        number='987111222',
        company=company,
    )


# ═══════════════════════════════════════════════════════════════
# FIXTURES - Documentos
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def document(client_model):
    """Crea un presupuesto base."""
    return Document.objects.create(
        dataclient=client_model,
        fecha_factura='2026-06-01',
        num_presupuesto='PRE0001',
        observaciones='Presupuesto de prueba',
    )


@pytest.fixture
def invoice_document(client_model):
    """Crea una factura."""
    return Document.objects.create(
        dataclient=client_model,
        fecha_factura='2026-06-02',
        num_presupuesto='PRE0002',
        num_factura='FAC0001',
        num_albaran='ALB0001',
    )


@pytest.fixture
def document_with_relations(document):
    """Documento con items, títulos y footer completos."""
    title = titleDescripcion.objects.create(
        titledoc=document,
        titdescripcion='Mano de obra',
    )
    item = DataDocument.objects.create(
        documento=document,
        referencia='REF001',
        descripcion='Tapizado sofá 3 plazas',
        cantidad=1,
        precio=450.00,
        dto=0,
        importe=450.00,
        entrega='30 días',
    )
    footer = FooterDocument.objects.create(
        footer_documento=document,
        subtotal=450.00,
        base_imponible=450.00,
        iva=21.00,
        total=544.50,
    )
    return document


# ═══════════════════════════════════════════════════════════════
# FIXTURES - Formas de pago
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def payment(company):
    """Forma de pago asociada a la empresa."""
    return Pago.objects.create(
        empresa=company,
        forma_pago='Transferencia bancaria',
    )


# ═══════════════════════════════════════════════════════════════
# FIXTURES - API Client
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def api_client():
    """Cliente de API REST sin autenticación."""
    return APIClient()
