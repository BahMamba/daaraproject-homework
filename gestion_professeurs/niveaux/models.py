from django.db import models

class Niveau(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.nom}"