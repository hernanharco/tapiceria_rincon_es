"""
Tests para las vistas (ViewSets) de Tapicería Rincón.

Cubre operaciones CRUD, filtros y la acción print_document.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from mi_app.models import Document


# ═══════════════════════════════════════════════════════════════
# DataCompanyViewSet
# ═══════════════════════════════════════════════════════════════

class TestCompanyViewSet:
    def test_list_companies(self, api_client, company):
        """GET /api/companies/ devuelve lista de empresas."""
        url = reverse('datacompany-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_get_company_detail(self, api_client, company):
        """GET /api/companies/{cif}/ devuelve detalle."""
        url = reverse('datacompany-detail', kwargs={'pk': company.cif})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['cif'] == 'B12345678'

    def test_update_company(self, api_client, company):
        """PATCH /api/companies/{cif}/ actualiza campos."""
        url = reverse('datacompany-detail', kwargs={'pk': company.cif})
        response = api_client.patch(url, {'name': 'Nombre Actualizado'}, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Nombre Actualizado'

    def test_delete_company(self, api_client, company):
        """DELETE /api/companies/{cif}/ elimina la empresa."""
        url = reverse('datacompany-detail', kwargs={'pk': company.cif})
        response = api_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_create_company(self, api_client, db):
        """POST /api/companies/ crea una empresa nueva."""
        url = reverse('datacompany-list')
        data = {
            'cif': 'B99999999',
            'name': 'Empresa Test',
            'address': 'Calle Test 1',
            'zip_code': '28001',
            'city': 'Madrid',
            'number': '912345678',
            'email': 'test@test.es',
            'iva_comp': '21',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Empresa Test'


# ═══════════════════════════════════════════════════════════════
# DataClientViewSet
# ═══════════════════════════════════════════════════════════════

class TestClientViewSet:
    def test_list_clients(self, api_client, client_model):
        """GET /api/clients/ devuelve lista de clientes."""
        url = reverse('dataclient-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_client(self, api_client, company):
        """POST /api/clients/ crea cliente con SlugRelatedField."""
        url = reverse('dataclient-list')
        data = {
            'cif': 'A99999999',
            'name': 'Cliente Nuevo',
            'address': 'Dir Cliente',
            'zip_code': '33400',
            'city': 'Avilés',
            'province': 'Asturias',
            'number': '666555444',
            'company': company.cif,
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['cod_client'].startswith('CLI')

    def test_get_client_detail(self, api_client, client_model):
        """GET /api/clients/{cif}/ devuelve detalle."""
        url = reverse('dataclient-detail', kwargs={'pk': client_model.cif})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK


# ═══════════════════════════════════════════════════════════════
# DocumentViewSet
# ═══════════════════════════════════════════════════════════════

class TestDocumentViewSet:
    def test_list_documents(self, api_client, document):
        """GET /api/documents/ devuelve lista."""
        url = reverse('document-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_filter_by_date_range(self, api_client, document, invoice_document):
        """
        GET /api/documents/?start=2026-06-01&end=2026-06-01
        Filtra documentos dentro del rango de fechas.
        """
        url = reverse('document-list')
        response = api_client.get(url, {'start': '2026-06-01', 'end': '2026-06-01'})
        assert response.status_code == status.HTTP_200_OK
        # Solo el documento con fecha 2026-06-01 debería aparecer
        results = response.data
        assert len(results) == 1
        assert results[0]['num_presupuesto'] == 'PRE0001'

    def test_filter_by_date_range_both(self, api_client, document, invoice_document):
        """Ambos documentos están dentro del rango."""
        url = reverse('document-list')
        response = api_client.get(url, {'start': '2026-06-01', 'end': '2026-06-02'})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_filter_by_type_presupuesto(self, api_client, document, invoice_document):
        """GET /api/documents/?type=Presupuesto filtra solo presupuestos."""
        url = reverse('document-list')
        response = api_client.get(url, {'type': 'Presupuesto'})
        assert response.status_code == status.HTTP_200_OK
        presupuestos = [d for d in response.data if d.get('num_presupuesto')]
        assert len(presupuestos) == len(response.data)

    def test_filter_by_type_factura(self, api_client, document, invoice_document):
        """GET /api/documents/?type=Factura filtra solo facturas."""
        url = reverse('document-list')
        response = api_client.get(url, {'type': 'Factura'})
        assert response.status_code == status.HTTP_200_OK
        for doc in response.data:
            assert doc.get('num_factura') is not None

    def test_filter_by_search(self, api_client, document, invoice_document):
        """GET /api/documents/?search=PRE busca por número."""
        url = reverse('document-list')
        response = api_client.get(url, {'search': 'PRE'})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_order_by_date_desc(self, api_client, document, invoice_document):
        """Los documentos se ordenan por fecha descendente."""
        url = reverse('document-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        if len(response.data) >= 2:
            dates = [d['fecha_factura'] for d in response.data]
            assert dates == sorted(dates, reverse=True)

    def test_create_document(self, api_client, client_model):
        """POST /api/documents/ crea un documento."""
        url = reverse('document-list')
        data = {
            'dataclient': client_model.cif,
            'fecha_factura': '2026-07-01',
            'num_presupuesto': 'PRE0500',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['num_presupuesto'] == 'PRE0500'


# ═══════════════════════════════════════════════════════════════
# DocumentViewSet — Print Document Action
# ═══════════════════════════════════════════════════════════════

class TestDocumentPrintAction:
    def test_print_presupuesto(self, api_client, document):
        """
        GET /api/documents/print/PRE0001/
        La acción de impresión devuelve un PDF (Content-Type: application/pdf).
        """
        url = reverse('document-print-document', kwargs={'numero': 'PRE0001'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'application/pdf'
        assert response['Content-Disposition'] == 'inline; filename="presupuesto_PRE0001.pdf"'

    def test_print_factura(self, api_client, invoice_document):
        """GET /api/documents/print/FAC0001/ devuelve PDF de factura."""
        url = reverse('document-print-document', kwargs={'numero': 'FAC0001'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'application/pdf'

    def test_print_albaran(self, api_client, invoice_document):
        """GET /api/documents/print/ALB0001/ devuelve PDF de albarán."""
        url = reverse('document-print-document', kwargs={'numero': 'ALB0001'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'application/pdf'

    def test_print_invalid_prefix(self, api_client):
        """Prefijo no reconocido (XXX) devuelve 400."""
        url = reverse('document-print-document', kwargs={'numero': 'XXX0001'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_print_nonexistent_document(self, api_client, db):
        """Documento inexistente devuelve 404."""
        url = reverse('document-print-document', kwargs={'numero': 'PRE9999'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_print_case_insensitive(self, api_client, document):
        """El prefijo es case-insensitive (pre0001 = PRE0001)."""
        url = reverse('document-print-document', kwargs={'numero': 'pre0001'})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK


# ═══════════════════════════════════════════════════════════════
# DataDocumentViewSet
# ═══════════════════════════════════════════════════════════════

class TestDataDocumentViewSet:
    def test_list_items(self, api_client, document):
        """GET /api/datadocuments/ devuelve items."""
        from mi_app.models import DataDocument
        DataDocument.objects.create(
            documento=document,
            descripcion='Item test',
            cantidad=1, precio=100, dto=0, importe=100,
        )
        url = reverse('datadocument-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK


# ═══════════════════════════════════════════════════════════════
# FooterDocumentViewSet
# ═══════════════════════════════════════════════════════════════

class TestFooterDocumentViewSet:
    def test_filter_by_document_id(self, api_client, document_with_relations):
        """GET /api/footers/?footer_documento={id} filtra por documento."""
        footer = document_with_relations.footer
        url = reverse('footerdocument-list')
        response = api_client.get(url, {'footer_documento': footer.footer_documento_id})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
