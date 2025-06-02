from rest_framework import generics
from rest_framework import permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination

from .serializers import ProfesseurSerializer
from .models import Professeur

import pandas as pd

from django.http import HttpResponse

class PaginatorPage(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20

class ProfesseurListCreateView(generics.ListCreateAPIView):
    queryset = Professeur.objects.all()
    serializer_class = ProfesseurSerializer
    search_fields = ['nom', 'specialite']
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginatorPage
    ordering_fields = ['nom', 'specialite']

class ProfesseurDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Professeur.objects.all()
    serializer_class = ProfesseurSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class ProfesseurExportView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = Professeur.objects.all()
        data = [{
            'Nom': prof.nom,
            'Email': prof.email,
            'Spécialité': prof.specialite,
            'Téléphone': prof.telephone or '-'
        } for prof in queryset]
        df = pd.DataFrame(data)
        
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="professeurs.xlsx"'
        
        df.to_excel(response, index=False, engine='openpyxl')
        return response