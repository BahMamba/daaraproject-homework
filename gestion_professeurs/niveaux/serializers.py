from rest_framework.serializers import ModelSerializer

from .models import Niveau

class NiveauSerializer(ModelSerializer):
    class Meta:
        model = Niveau
        fields = '__all__'
        read_only_fields = ['id']