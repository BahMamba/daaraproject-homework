Gestion des Professeurs, Matières et Niveaux - Backend
Ce projet est le back-end d'une application de gestion des professeurs, matières et niveaux, développé avec Django et Django REST Framework (DRF) dans le cadre d’un devoir universitaire. Il implémente un CRUD complet pour trois modèles, une authentification JWT, un système d’automatisation pour ajouter des professeurs fictifs, ainsi que des fonctionnalités d’import/export.
Fonctionnalités

Modélisation des données :
Professeur : Nom, email (unique), spécialité, téléphone.
Matière : Nom, professeur (ForeignKey), niveaux (ManyToMany).
Niveau : Nom (unique).


CRUD complet :
Endpoints API pour lister, créer, modifier, supprimer professeurs, matières et niveaux.
Pagination, recherche (par nom), et tri.


Authentification :
Sécurisation des endpoints avec JWT (JSON Web Token).
Accessible uniquement aux utilisateurs authentifiés.


Automatisation :
Ajout automatique d’un professeur fictif toutes les 5 minutes via Faker.
Utilisation de simulateur_cron.py pour Windows (en remplacement de django-crontab).


Export/Import :
Impression PDF : Liste des matières avec professeur et niveaux.
Import Excel : Importation de niveaux depuis un fichier Excel.


Base de données : MySQL.

Prérequis

Python 3.8+
MySQL (configuré avec une base de données)
pip (pour installer les dépendances)

Dépendances
Installez les packages suivants :
pip install django djangorestframework django-crontab Faker reportlab openpyxl djangorestframework-simplejwt mysqlclient

Installation

Cloner le dépôt :
git clone <url-du-dépôt>
cd gestion_professeurs


Configurer l’environnement virtuel :
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows


Installer les dépendances :
pip install -r requirements.txt


Configurer la base de données :

Créez une base MySQL :CREATE DATABASE gestion_professeurs;


Mettez à jour gestion_professeurs/settings.py :DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gestion_professeurs',
        'USER': 'votre_utilisateur',
        'PASSWORD': 'votre_mot_de_passe',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}




Appliquer les migrations :
python manage.py makemigrations
python manage.py migrate


Créer un superutilisateur (pour l’admin) :
python manage.py createsuperuser



Utilisation

Lancer le serveur :
python manage.py runserver


Accédez à l’admin : http://localhost:8000/admin/
API : http://localhost:8000/api/


Simulateur Cron (Windows) :

Pour simuler l’ajout automatique de professeurs toutes les 5 minutes :python simulateur_cron.py


Vérifiez les ajouts dans MySQL :SELECT * FROM professeurs_professeur;




Obtenir un token JWT :

Requête : POST http://localhost:8000/api/token/
Body :{
    "username": "votre_utilisateur",
    "password": "votre_mot_de_passe"
}


Utilisez le access token dans les headers (Authorization: Bearer <token>).


Tester les endpoints :

Utilisez Postman ou cURL (voir la section Endpoints API).



Structure du projet
gestion_professeurs/
├── gestion_professeurs/
│   ├── settings.py        # Configuration (JWT, Cron, apps)
│   ├── urls.py            # Routes principales
├── professeurs/
│   ├── management/
│   │   ├── commands/
│   │   │   ├── ajouter_professeur.py  # Commande pour ajouter un professeur
│   ├── models.py          # Modèles Professeur, Matière
│   ├── serializers.py     # Sérialiseurs
│   ├── views.py           # Vues (CRUD, PDF)
│   ├── urls.py            # Routes API
├── niveaux/
│   ├── models.py          # Modèle Niveau
│   ├── serializers.py     # Sérialiseurs
│   ├── views.py           # Vues (CRUD, import Excel)
│   ├── urls.py            # Routes API
├── simulateur_cron.py     # Script pour simuler Cron sur Windows
├── requirements.txt       # Dépendances
├── manage.py              # Gestion du projet

Endpoints API
Tous les endpoints nécessitent un token JWT (Authorization: Bearer <token>).
Professeurs

GET /api/professeurs/ : Lister (pagination, recherche, tri)
POST /api/professeurs/ : Créer
GET /api/professeurs/<id>/ : Récupérer
PUT /api/professeurs/<id>/ : Mettre à jour
DELETE /api/professeurs/<id>/ : Supprimer

Matières

GET /api/matieres/ : Lister (pagination, recherche, tri)
POST /api/matieres/ : Créer
GET /api/matieres/<id>/ : Récupérer
PUT /api/matieres/<id>/ : Mettre à jour
DELETE /api/matieres/<id>/ : Supprimer
GET /api/matieres/pdf/ : Télécharger la liste en PDF

Niveaux

GET /api/niveaux/ : Lister (pagination, recherche, tri)
POST /api/niveaux/ : Créer
GET /api/niveaux/<id>/ : Récupérer
PUT /api/niveaux/<id>/ : Mettre à jour
DELETE /api/niveaux/<id>/ : Supprimer
POST /api/niveaux/import/ : Importer depuis Excel (form-data, clé: file)

Notes

CronTab : django-crontab ne fonctionne pas sur Windows. Utilisez simulateur_cron.py pour tester l’ajout automatique de professeurs. Sur Linux/Unix, configurez CRONJOBS dans settings.py et exécutez :python manage.py crontab add


Base de données : MySQL est requis. Assurez-vous que mysqlclient est installé.
Tests : Utilisez Postman pour tester les endpoints avec un token JWT.

Contributeur: BAH IBRAHIMA <Mamba>


Projet soumis dans le cadre du devoir de M. Mamadou Dara Sow
.
