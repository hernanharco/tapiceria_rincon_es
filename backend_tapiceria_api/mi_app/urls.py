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
router.register(r'documents', DocumentViewSet)
router.register(r'datadocuments', DataDocumentViewSet)
router.register(r'footers', FooterDocumentViewSet)
router.register(r'pagos', PagoViewSet)
router.register(r'titleDescripcion', TitleDescripcionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
