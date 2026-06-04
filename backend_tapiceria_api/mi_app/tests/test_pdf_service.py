"""
Tests para el servicio de generación de PDF (PDFService).

Nota: Estos tests verifican la lógica del servicio sin depender de
xhtml2pdf real (se mockea). La generación real de PDF se prueba
en test_views.py a través del endpoint print_document.
"""
import pytest
from unittest.mock import patch, MagicMock
from io import BytesIO
from mi_app.services.pdf_service import PDFService


def _mock_pisa_result(*args, **kwargs):
    """Side effect helper: escribe al buffer y devuelve un objeto con err=None."""
    dest = kwargs.get('dest') or args[1]
    dest.write(b'%PDF-1.4 fake content')
    return MagicMock(err=None)


class TestPDFServiceGetImageBase64:
    """Tests para get_image_base64 (conversión de URL a Base64)."""

    @patch('mi_app.services.pdf_service.requests.get')
    def test_get_image_base64_success(self, mock_get):
        """URL válida devuelve string Base64 con data URI."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = b'imagen-data'
        mock_response.headers = {'Content-Type': 'image/png'}
        mock_get.return_value = mock_response

        result = PDFService.get_image_base64('https://res.cloudinary.com/demo/logo.png')
        assert result.startswith('data:image/png;base64,')
        assert 'aW1hZ2VuLWRhdGE' in result or 'aW1hZ2VuLWRhdGE=' in result

    @patch('mi_app.services.pdf_service.requests.get')
    def test_get_image_base64_returns_none_on_http_error(self, mock_get):
        """Error HTTP devuelve None."""
        mock_get.side_effect = Exception('Connection error')
        result = PDFService.get_image_base64('https://ejemplo.com/logo.png')
        assert result is None

    @patch('mi_app.services.pdf_service.requests.get')
    def test_get_image_base64_returns_none_on_non_200(self, mock_get):
        """Respuesta no-200 devuelve None."""
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response
        result = PDFService.get_image_base64('https://ejemplo.com/no-existe.png')
        assert result is None

    def test_get_image_base64_empty_url(self):
        """URL vacía devuelve None (no hace request)."""
        result = PDFService.get_image_base64('')
        assert result is None


class TestPDFServiceGenerateDocument:
    """Tests para generate_document_pdf (lógica de generación)."""

    @patch('mi_app.services.pdf_service.render_to_string')
    @patch('mi_app.services.pdf_service.pisa.CreatePDF')
    def test_generate_document_pdf_creates_pdf(
        self, mock_pisa_create, mock_render, document_with_relations
    ):
        """Generate pasa el contexto correcto a la plantilla."""
        mock_render.return_value = '<html>PDF</html>'
        mock_pisa_create.side_effect = _mock_pisa_result

        result = PDFService.generate_document_pdf(document_with_relations, 'PRESUPUESTO')

        assert result is not None
        assert result.startswith(b'%PDF-1.4')

    @patch('mi_app.services.pdf_service.render_to_string')
    @patch('mi_app.services.pdf_service.pisa.CreatePDF')
    def test_generate_pdf_detects_prefix(
        self, mock_pisa_create, mock_render, document_with_relations
    ):
        """El tipo de documento se pasa a la plantilla."""
        mock_render.return_value = '<html>PDF</html>'
        mock_pisa_create.side_effect = _mock_pisa_result

        PDFService.generate_document_pdf(document_with_relations, 'PRESUPUESTO')
        call_context = mock_render.call_args[0][1]
        assert call_context['tipo'] == 'PRESUPUESTO'
        assert call_context['prefix'] == 'PRE'

    @patch('mi_app.services.pdf_service.render_to_string')
    @patch('mi_app.services.pdf_service.pisa.CreatePDF')
    def test_generate_pdf_detects_invoice(
        self, mock_pisa_create, mock_render, document_with_relations
    ):
        """Factura - se pasa el label FACTURA."""
        doc = document_with_relations
        doc.num_presupuesto = None
        doc.num_factura = 'FAC0001'

        mock_render.return_value = '<html>PDF</html>'
        mock_pisa_create.side_effect = _mock_pisa_result

        PDFService.generate_document_pdf(doc, 'FACTURA')
        call_context = mock_render.call_args[0][1]
        assert call_context['tipo'] == 'FACTURA'
        assert call_context['prefix'] == 'FAC'

    @patch('mi_app.services.pdf_service.render_to_string')
    @patch('mi_app.services.pdf_service.pisa.CreatePDF')
    def test_generate_pdf_includes_company_and_client(
        self, mock_pisa_create, mock_render, document_with_relations
    ):
        """El contexto incluye empresa y cliente."""
        mock_render.return_value = '<html>PDF</html>'
        mock_pisa_create.side_effect = _mock_pisa_result

        PDFService.generate_document_pdf(document_with_relations, 'PRESUPUESTO')
        context = mock_render.call_args[0][1]
        assert context['company'] is not None
        assert context['client'] is not None
        assert context['doc'] is not None

    @patch('mi_app.services.pdf_service.render_to_string')
    @patch('mi_app.services.pdf_service.pisa.CreatePDF')
    def test_generate_pdf_includes_content_list(
        self, mock_pisa_create, mock_render, document_with_relations
    ):
        """El contexto incluye la lista de contenido (títulos + items)."""
        mock_render.return_value = '<html>PDF</html>'
        mock_pisa_create.side_effect = _mock_pisa_result

        PDFService.generate_document_pdf(document_with_relations, 'PRESUPUESTO')
        context = mock_render.call_args[0][1]
        assert 'content' in context
        assert len(context['content']) > 0
        assert context['content'][0]['type'] == 'title'
