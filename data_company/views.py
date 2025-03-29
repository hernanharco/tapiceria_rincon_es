from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Data_Company

# Create your views here.
class Data_Company_view(viewsets.ModelViewSet):
    serializer_class = TaskSerializer 
    
    queryset = Data_Company.objects.all()
