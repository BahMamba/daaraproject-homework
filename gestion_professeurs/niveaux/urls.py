from django.urls import path
from .views import NiveauListCreateView, NiveauDetailView, niveau_import_excel

urlpatterns = [
    path('', NiveauListCreateView.as_view(), name='niveau-list-create'),
    path('<int:pk>/', NiveauDetailView.as_view(), name='niveau-detail'),
    path('excel/', niveau_import_excel, name='niveau-import-excel'),
]