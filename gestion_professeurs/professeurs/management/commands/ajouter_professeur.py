from django.core.management.base import BaseCommand
from faker import Faker
from professeurs.models import Professeur

class Command(BaseCommand):
    help = 'Adds a fake professor to the database (max 50 professors)'

    def handle(self, *args, **kwargs):
        fake = Faker('en_UK')  # English (UK) localization
        try:
            # Check total number of professors
            if Professeur.objects.count() >= 50:
                self.stdout.write(self.style.WARNING('Limit of 50 professors reached. No professor added.'))
                return

            professeur = Professeur.objects.create(
                nom=fake.name(),
                email=fake.unique.email(),
                specialite=fake.job(),
                telephone=fake.phone_number()
            )
            self.stdout.write(self.style.SUCCESS(f'Professor added: {professeur.nom}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {str(e)}'))