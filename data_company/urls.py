from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from data_company import views

# api versioning
router = routers.DefaultRouter()
router.register(r'data_comp', views.Data_Company_view, 'data_compa')
router_company = routers.DefaultRouter()
router_company.register(r'data_comp', views.Data_Document_view, 'data_compa')
router_document = routers.DefaultRouter()
router_document.register(r'data_docum', views.Document_view, 'data_document')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api_com/v1/', include(router_company.urls)),    
    path('api_docs/v1/', include(router_document.urls)),
    path('docs/', include_docs_urls(title="doc_data_company API"))
]