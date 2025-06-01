from django.db import models

from niveaux.models import Niveau
from professeurs.models import Professeur

class Matiere(models.Model):
    nom = models.CharField(max_length=100)
    professeur = models.ForeignKey(
        Professeur, 
        on_delete=models.CASCADE, 
        related_name='matieres'
    )
    niveaux = models.ManyToManyField(Niveau, related_name='matieres')
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.nom} - {self.professeur.nom}"