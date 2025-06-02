from django.db import models

class Professeur(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    specialite = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.nom} - {self.specialite}"