from .views import ProfesseurExportView, ProfesseurListCreateView, ProfesseurDetailView
from django.urls import path

urlpatterns = [
    path('', ProfesseurListCreateView.as_view(), name='professeur-list-create'),
    path('<int:pk>/', ProfesseurDetailView.as_view(), name='professeur-detail'),
    path('export/', ProfesseurExportView.as_view(), name='professeur-export'),
]