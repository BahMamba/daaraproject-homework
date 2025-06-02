from rest_framework import serializers
from .models import Professeur

class ProfesseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professeur
        fields = "__all__"