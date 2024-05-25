from django.shortcuts import render

from rest_framework import viewsets
from .models import *
from .serializers import *
from django_filters import rest_framework as filters
import pandas as pd
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action

from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

from django.conf import settings
import os


class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer
    
    def create(self, request):
        data = request.data.copy() 
        classe_id = data.pop('classe', None)

        serializer = EtudiantSerializer(data=data)
        if serializer.is_valid():
                matricule = serializer.validated_data.get('matricule')
                try:
                    if classe_id is not None:
                        classe = Classe.objects.get(id=int(classe_id[0]))
                        if Inscription.objects.filter(etudiant__matricule=matricule, classe=classe).exists():
                            return JsonResponse({'success': False, 'message': 'L\'étudiant est déjà inscrit à cette classe.'}, status=status.HTTP_400_BAD_REQUEST)

                        etudiant = serializer.save()
                        Inscription.objects.create(etudiant=etudiant, classe=classe)
                        
                    return JsonResponse({'success': True, 'message': 'L\'étudiant a été créé avec succès.'}, status=status.HTTP_201_CREATED)
                except Classe.DoesNotExist:
                    return JsonResponse({'success': False, 'message': 'La classe spécifiée n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'success': False, 'message': 'Un étudiant est déjà inscrit avec ce matricule ou des données invalides ont été fournies.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class EnseignantViewSet(viewsets.ModelViewSet):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer

class CoursViewSet(viewsets.ModelViewSet):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer
    
class UniteEnseignementViewSet(viewsets.ModelViewSet):
    queryset = UniteEnseignement.objects.all()
    serializer_class = UniteEnseignementSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['classe']
    
class ElementConstitutifViewSet(viewsets.ModelViewSet):
    queryset = ElementConstitutif.objects.all()
    serializer_class = ElementConstitutifSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['ue']
    
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['ec', 'classe']
    

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['evaluation']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return NoteReadSerializer
        return NoteWriteSerializer
    

    @action(detail=False, methods=['get'])
    def notes_with_students(self, request):
        notes = Note.objects.all()
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()
    serializer_class = ClasseSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['option', 'annee_academique','niveau']

class DepartementViewSet(viewsets.ModelViewSet):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer

class AnneeAcademiqueViewSet(viewsets.ModelViewSet):
    queryset = AnneeAcademique.objects.all()
    serializer_class = AnneeAcademiqueSerializer
    
class InscriptionViewSet(viewsets.ModelViewSet):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['classe']
    
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['AnneeAcademique']

def download_etudiant_template(request):
    template_path = os.path.join(settings.MEDIA_ROOT, 'Templates/Liste_Etudiants_Template.xlsx')
    if os.path.exists(template_path):
        with open(template_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=etudiants_template.xlsx'
            return response
    else:
        return HttpResponse(status=404)

@csrf_exempt
def import_students_from_excel(request):
    def search_text_in_excel(df, text_to_search):
        filtered_df = df[df.apply(lambda row: row.astype(str).str.contains(text_to_search, case=False).any(), axis=1)]
        for index, row in filtered_df.iterrows():
            for col_index, cell_value in enumerate(row):
                if str(cell_value).lower().find(text_to_search.lower()) != -1:
                    return index, col_index
        return None, None
    if request.method == 'POST' and request.FILES.get('file'):
        excel_file = request.FILES['file']
        df = pd.read_excel(excel_file)
        
        report_file = open('media/Rapports/Ajout_Etudiants/execution_report_.txt', 'w')
        report_file.write('Rapport d\'exécution:\n')
    
        infos_academique = {}
        errors = []
        info_coord = {
            'departement': search_text_in_excel(df, "Departement"),
            'filiere': search_text_in_excel(df, "Filière"),
            'option': search_text_in_excel(df, "Option"),
            'niveau': search_text_in_excel(df, "Niveau"),
            'annee_academique': search_text_in_excel(df, "Année Académique")
        }
        
        for key, value in info_coord.items():
            if value is not None :
                if(type(value[0])== int and type(value[1])==int):
                    infos_academique[key] = df.iloc[value[0], value[1]+2]
                else:
                    infos_academique[key] = None
            else:
                info_coord[key] = None
                errors.append("La valeur de '"+key+"' n'est accessible")
        if(len(errors) > 0):
            error_message = '\n'.join(errors)
            return HttpResponse(error_message, status=400)
        try :  
            if infos_academique['annee_academique'] is not None:
                years = infos_academique["annee_academique"].split("/")
                annee_academique_obj= AnneeAcademique.objects.get_by_years(years[0], years[1])
            departement_obj = Departement.objects.get(nom=infos_academique["departement"])
            filiere_obj = Filiere.objects.get(nom=infos_academique["filiere"], departement=departement_obj)
            option_obj = Option.objects.get(nom=infos_academique["option"], filiere=filiere_obj)
            classe_obj = Classe.objects.get(option=option_obj, annee_academique=annee_academique_obj,niveau=infos_academique["niveau"])
        
        except Exception as e:
            error_msg = str(e).split(" ")
            errors.append("la valeur de la clé  '"+ error_msg[0] + ": " + str(infos_academique[error_msg[0].lower()]) + "'  n'existe pas dans la base de données pour les données enregistés. Si vous n'arrivez pas à resoudre ce problème, veuiller contacter l'administrateur")
            error_message = '\n'.join(errors)
            return HttpResponse(error_message, status=400)
        
        position_matricule_titre_x, position_matricule_titre_y = search_text_in_excel(df, "Matricule")
        df.columns = df.iloc[position_matricule_titre_x]
        df =df.reset_index(drop=True).drop(range(0,position_matricule_titre_x+1))
        print(position_matricule_titre_x, position_matricule_titre_y)
        
        if len(errors) == 0:
            for index, row in df.iloc[0:].iterrows():
                try:
                    if Inscription.objects.filter(etudiant__matricule=row['Matricule'], classe=classe_obj.id).exists():
                        error = f"L'étudiant  {row['Nom']} {row['Prénom']} est déjà inscrit à cette classe."
                        errors.append(error)
                        report_file.write(error+'\n')
                    else :
                        etudiant = Etudiant.objects.create(
                            matricule=row['Matricule'],
                            nom=row['Nom'],
                            prenom=row['Prénom'],
                            date_naissance=row['Date de naissance'],
                        )
                        Inscription.objects.create(etudiant=etudiant, classe=classe_obj)
                        
                except Exception as e:
                    error = f"Erreur lors de l'ajout de l'étudiant {row['Nom']} {row['Prénom']} : {str(e)}"
                    errors.append(error)
                    report_file.write(error)
                    continue
        
        report_file.close()
        
        if len(errors) == 0:
            return HttpResponse('Étudiants importés avec succès !', status=200)
        error_message = '\n'.join(errors)
        return HttpResponse("Tout les étudiant n'ont pas été ajoutés, vous pouvez visualiser le rapport d'exécution une fois cette fenêtre fermé", status=400)
    return HttpResponse("quelque chose à mal tourné", status=400)








def etudiants_non_composes(classe, evaluation):
    """
    Récupère la liste des étudiants d'une classe qui n'ont pas composé une évaluation donnée.
    """
    # Récupérer tous les étudiants inscrits dans la classe
    etudiants_classe = Etudiant.objects.filter(inscription__classe=classe)

    # Récupérer les étudiants qui ont composé pour cette évaluation
    etudiants_composes = etudiants_composes(classe, evaluation)

    # Exclure les étudiants qui ont composé
    etudiants_non_composes = etudiants_classe.exclude(id__in=etudiants_composes)

    return etudiants_non_composes

def etudiants_composes(classe, evaluation):
    """
    Récupère la liste des étudiants d'une classe qui ont composé une évaluation donnée.
    """
    # Récupérer tous les étudiants inscrits dans la classe
    etudiants_classe = Etudiant.objects.filter(inscription__classe=classe)

    # Récupérer les étudiants qui ont composé pour cette évaluation
    etudiants_composes = Etudiant.objects.filter(
        inscription__classe=classe,
        note__evaluation=evaluation
    )
    
    return etudiants_composes
    
