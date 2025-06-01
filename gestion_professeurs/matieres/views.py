# professeurs/views.py
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from io import BytesIO

from professeurs.views import PaginatorPage
from .models import Matiere
from .serializers import MatiereSerializer


class MatiereListCreateView(generics.ListCreateAPIView):
    queryset = Matiere.objects.select_related('professeur').prefetch_related('niveaux')
    serializer_class = MatiereSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PaginatorPage
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['nom']
    ordering_fields = ['nom']

class MatiereDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Matiere.objects.select_related('professeur').prefetch_related('niveaux')
    serializer_class = MatiereSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def matiere_pdf(request):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(2*cm, height - 2*cm, "List of Subjects")

    p.setFont("Helvetica", 12)
    y = height - 4*cm
    matieres = Matiere.objects.select_related('professeur').prefetch_related('niveaux')
    
    for matiere in matieres:
        niveaux = ", ".join(niveau.nom for niveau in matiere.niveaux.all())
        text = f"{matiere.nom} - {matiere.professeur.nom} - {niveaux}"
        p.drawString(2*cm, y, text)
        y -= 0.5*cm
        if y < 2*cm:
            p.showPage()
            p.setFont("Helvetica", 12)
            y = height - 2*cm

    p.showPage()
    p.save()
    buffer.seek(0)
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="subjects.pdf"'
    response.write(buffer.getvalue())
    buffer.close()
    return response