from rest_framework import serializers
from .models import Data_Company

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data_Company
        
        fields = '__all__'