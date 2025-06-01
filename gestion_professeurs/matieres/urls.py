from django.urls import path
from .views import MatiereListCreateView, MatiereDetailView, matiere_pdf

urlpatterns = [
    path('', MatiereListCreateView.as_view(), name='matiere-list-create'),
    path('<int:pk>/', MatiereDetailView.as_view(), name='matiere-detail'),
    path('pdf/', matiere_pdf, name='matiere-pdf'),
]