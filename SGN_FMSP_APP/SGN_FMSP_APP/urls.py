"""
URL configuration for SGN_FMSP_APP project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from SGN.views import *
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Créer un routeur et enregistrer nos viewsets
router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'enseignants', EnseignantViewSet)
router.register(r'cours', CoursViewSet)
router.register(r'unites_enseignement', UniteEnseignementViewSet)
router.register(r'elements_constitutifs', ElementConstitutifViewSet)
router.register(r'evaluations', EvaluationViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'filieres', FiliereViewSet)
router.register(r'classes', ClasseViewSet)
router.register(r'departements', DepartementViewSet)
router.register(r'annee_academiques', AnneeAcademiqueViewSet)
router.register(r'options', OptionViewSet)
router.register(r'inscriptions', InscriptionViewSet)
router.register(r'sessions', SessionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    
    path('download_etudiant_template/', download_etudiant_template, name='download_etudiant_template'),
    path('import_etudiant_template/', import_students_from_excel, name='download_etudiant_template'),
    
    # JWT Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
