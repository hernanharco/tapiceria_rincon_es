from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from data_company import views

# api versioning
router = routers.DefaultRouter()
router.register(r'data_comp', views.Data_Company_view, 'data_compa')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title="doc_data_company API"))
]