"""
Tests para los modelos de Tapicería Rincón.
"""
import pytest
from mi_app.models import DataClient, Document, DataDocument, FooterDocument


# ═══════════════════════════════════════════════════════════════
# DataCompany
# ═══════════════════════════════════════════════════════════════

class TestDataCompany:
    def test_create_company(self, company):
        """Verifica creación básica de una empresa."""
        assert company.cif == 'B12345678'
        assert company.name == 'Tapicería Rincón S.L.'
        assert str(company) == 'Tapicería Rincón S.L. (B12345678)'

    def test_company_iva_string(self, company):
        """El IVA se almacena como CharField (string)."""
        assert company.iva_comp == '21'


# ═══════════════════════════════════════════════════════════════
# DataClient
# ═══════════════════════════════════════════════════════════════

class TestDataClient:
    def test_create_client(self, client_model, company):
        """Verifica creación básica de un cliente."""
        assert client_model.cif == 'A11111111'
        assert client_model.name == 'Juan Pérez'
        assert client_model.company == company
        assert client_model.province == 'Asturias'

    def test_client_auto_generates_cod_client(self, client_model):
        """El código de cliente se genera automáticamente con formato CLIXXXX."""
        assert client_model.cod_client.startswith('CLI')
        assert len(client_model.cod_client) == 7  # CLI + 4 dígitos

    def test_client_cod_client_increments(self, db, company):
        """Los códigos de cliente se incrementan secuencialmente."""
        c1 = DataClient.objects.create(
            cif='A33333333', name='Cliente 1', address='Dir 1',
            zip_code='33400', city='Avilés', province='Asturias',
            number='111', company=company,
        )
        c2 = DataClient.objects.create(
            cif='A44444444', name='Cliente 2', address='Dir 2',
            zip_code='33400', city='Avilés', province='Asturias',
            number='222', company=company,
        )
        assert c1.cod_client == 'CLI0001'
        assert c2.cod_client == 'CLI0002'

    def test_client_str_representation(self, client_model):
        """El método __str__ incluye nombre, CIF y código."""
        expected = f"{client_model.name} || {client_model.cif} || {client_model.cod_client}"
        assert str(client_model) == expected

    def test_client_cascade_delete(self, db, company, client_model):
        """Eliminar empresa elimina sus clientes."""
        company.delete()
        assert DataClient.objects.filter(cif='A11111111').count() == 0


# ═══════════════════════════════════════════════════════════════
# Document
# ═══════════════════════════════════════════════════════════════

class TestDocument:
    def test_create_document(self, document, client_model):
        """Verifica creación básica de un documento."""
        assert document.num_presupuesto == 'PRE0001'
        assert document.dataclient == client_model
        assert str(document) == f"Presupuesto PRE0001 - Cliente {client_model.name}"

    def test_document_with_invoice_and_delivery_note(self, invoice_document):
        """Un documento puede tener presupuesto + factura + albarán."""
        assert invoice_document.num_presupuesto == 'PRE0002'
        assert invoice_document.num_factura == 'FAC0001'
        assert invoice_document.num_albaran == 'ALB0001'

    def test_document_optional_fields(self, db, client_model):
        """Factura y albarán son opcionales."""
        doc = Document.objects.create(
            dataclient=client_model,
            fecha_factura='2026-06-01',
            num_presupuesto='PRE0003',
        )
        assert doc.num_factura is None
        assert doc.num_albaran is None

    def test_document_cascade_delete(self, db, client_model, document):
        """Eliminar cliente elimina sus documentos."""
        client_model.delete()
        assert Document.objects.count() == 0


# ═══════════════════════════════════════════════════════════════
# DataDocument (Items)
# ═══════════════════════════════════════════════════════════════

class TestDataDocument:
    def test_create_item(self, document):
        """Verifica creación de un item dentro de un documento."""
        item = DataDocument.objects.create(
            documento=document,
            referencia='REF001',
            descripcion='Tapizado sillón',
            cantidad=2,
            precio=200.00,
            dto=0,
            importe=400.00,
        )
        assert item.descripcion.startswith('Tapizado')
        assert float(item.importe) == 400.00

    def test_item_defaults(self, document):
        """Los items tienen valores por defecto (0, line=True)."""
        item = DataDocument.objects.create(
            documento=document,
            descripcion='Item sin ref',
            cantidad=1,
            precio=0,
            dto=0,
            importe=0,
        )
        assert item.line is True
        assert item.referencia is None


# ═══════════════════════════════════════════════════════════════
# FooterDocument
# ═══════════════════════════════════════════════════════════════

class TestFooterDocument:
    def test_create_footer(self, document):
        """Verifica creación del footer de un documento."""
        footer = FooterDocument.objects.create(
            footer_documento=document,
            subtotal=500.00,
            base_imponible=500.00,
            iva=21.00,
            total=605.00,
        )
        assert float(footer.total) == 605.00

    def test_footer_one_to_one(self, document_with_relations):
        """Cada documento tiene UN solo footer (OneToOne)."""
        footer = document_with_relations.footer
        assert footer is not None
        assert float(footer.total) == 544.50


# ═══════════════════════════════════════════════════════════════
# Pago
# ═══════════════════════════════════════════════════════════════

class TestPago:
    def test_create_payment(self, payment, company):
        """Verifica creación de forma de pago."""
        assert payment.forma_pago == 'Transferencia bancaria'
        assert payment.empresa == company

    def test_payment_str(self, payment):
        """__str__ devuelve la forma de pago."""
        assert str(payment) == 'Transferencia bancaria'
