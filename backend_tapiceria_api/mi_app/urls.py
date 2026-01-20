from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DataCompanyViewSet,
    DataClientViewSet,
    DocumentViewSet,
    DataDocumentViewSet,
    FooterDocumentViewSet,
    PagoViewSet,   
    TitleDescripcionViewSet,
)

router = DefaultRouter()
router.register(r'companies', DataCompanyViewSet)
router.register(r'clients', DataClientViewSet)
# IMPORTANTE: Aquí se registra 'documents'. 
# Esto hará que la ruta de impresión sea /api/documents/print/...
router.register(r'documents', DocumentViewSet) 
router.register(r'datadocuments', DataDocumentViewSet)
router.register(r'footers', FooterDocumentViewSet)
router.register(r'pagos', PagoViewSet)
router.register(r'titleDescripcion', TitleDescripcionViewSet)

urlpatterns = [
    path('', include(router.urls)), # Quitamos 'api/' de aquí porque lo pondremos en el principal
]