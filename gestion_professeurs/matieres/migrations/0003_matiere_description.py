# Generated by Django 5.0.4 on 2025-05-30 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matieres', '0002_matiere_niveaux'),
    ]

    operations = [
        migrations.AddField(
            model_name='matiere',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
