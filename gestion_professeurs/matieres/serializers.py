from rest_framework import serializers
from niveaux.serializers import NiveauSerializer
from professeurs.serializers import ProfesseurSerializer
from niveaux.models import Niveau
from professeurs.models import Professeur
from .models import Matiere

class MatiereSerializer(serializers.ModelSerializer):
    professeur = ProfesseurSerializer(read_only=True)
    professeur_nom = serializers.CharField(write_only=True)
    niveaux = NiveauSerializer(many=True, read_only=True)
    niveaux_noms = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Matiere
        fields = ['id', 'nom', 'description', 'professeur', 'professeur_nom', 'niveaux', 'niveaux_noms']

    def validate(self, data):
        professeur_nom = data.get('professeur_nom')
        niveaux_noms = data.get('niveaux_noms', [])

        if professeur_nom and not Professeur.objects.filter(nom=professeur_nom).exists():
            raise serializers.ValidationError({"professeur_nom": f"Professeur '{professeur_nom}' n'existe pas."})

        for nom in niveaux_noms:
            if not Niveau.objects.filter(nom=nom).exists():
                raise serializers.ValidationError({"niveaux_noms": f"Niveau '{nom}' n'existe pas."})

        return data

    def create(self, validated_data):
        professeur_nom = validated_data.pop('professeur_nom')
        niveaux_noms = validated_data.pop('niveaux_noms', [])
        professeur = Professeur.objects.get(nom=professeur_nom)
        matiere = Matiere.objects.create(professeur=professeur, **validated_data)
        if niveaux_noms:
            matiere.niveaux.set(Niveau.objects.filter(nom__in=niveaux_noms))
        return matiere

    def update(self, instance, validated_data):
        professeur_nom = validated_data.pop('professeur_nom', None)
        niveaux_noms = validated_data.pop('niveaux_noms', None)
        if professeur_nom:
            instance.professeur = Professeur.objects.get(nom=professeur_nom)
        if niveaux_noms is not None:
            instance.niveaux.set(Niveau.objects.filter(nom__in=niveaux_noms))
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance