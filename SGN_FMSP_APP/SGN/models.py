from django.db import models
from django.core.exceptions import ValidationError
import datetime
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db.models.signals import pre_delete
from django.contrib import admin
from django import forms


class Departement(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom
    
class DepartementAdmin(admin.ModelAdmin):
    list_display = ("nom", "description")
    list_filter = ["nom"]
    search_fields = ['nom']

class Enseignant(models.Model):
    identifiant = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE)

    def __str__(self):
        return self.nom + " " + self.prenom


class AnneeAcademique(models.Model):
    date_debut = models.DateField(default=datetime.date.today)
    date_fin = models.DateField(default=datetime.date.today)
    est_active = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        if self.date_debut < self.date_fin :
            super().save(*args, **kwargs)
        else :
            raise forms.ValidationError({'date_fin':"année de fin doit être supérieur à celle du débuts."})
    
    # def clean(self):
    #     date_fin = self.cleaned_data['date_fin']
    #     if date_fin < self.date_debut :
    #         raise forms.ValidationError({'title': "Not a proper titlecased string"})
        
    def __str__(self):
        return f"{self.date_debut.year}/{self.date_fin.year}"

class Cours(models.Model):
    code = models.CharField(max_length=10, unique=True)
    nom = models.CharField(max_length=200)
    enseignant = models.ForeignKey('Enseignant', on_delete=models.SET_NULL, null=True)
    ec = models.ForeignKey('ElementConstitutif', on_delete=models.CASCADE)

    def __str__(self):
        return self.nom

class Filiere(models.Model):
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE, related_name="filieres")
    nom = models.CharField(max_length=200)
    code = models.CharField(default="EM", max_length=10)
    duree = models.IntegerField(default=3, help_text="Durée standard de la filière en années")

    def __str__(self):
        return f"{self.nom} - {self.departement.nom}"
    
    def save(self, *args, **kwargs):
        if self.pk:
            # Récupérer l'instance existante de l'option
            options = Option.objects.filter(filiere=self)
            old_filiere = Filiere.objects.get(pk=self.pk)
            # Vérifier si la durée de la filière a été modifiée
            if old_filiere.duree > self.duree:
                # Pour chaque option,
                for opt in options :
                    # Supprimer les classes en excès
                    classes_to_delete = Classe.objects.filter(option=opt).order_by('-niveau')[:old_filiere.duree - self.duree]
                    for classe in classes_to_delete:
                        classe.delete()
            else :
                for opt in options :
                    for niveau in range(old_filiere.duree + 1, self.duree + 1):
                        Classe.objects.create(option=opt, niveau=niveau, annee_academique=AnneeAcademique.objects.get(est_active=True))
            super().save(*args, **kwargs)
        super().save(*args, **kwargs)
class Meta:
    unique_together = ['nom', 'code']       
    
class Option(models.Model):
    nom = models.CharField(max_length=200)
    filiere = models.ForeignKey(Filiere,on_delete=models.CASCADE, related_name="filieres")
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.filiere.nom} - {self.nom}"
    
        
    def create_classes(self):
        # Récupérer l'année académique active
        try:
            annee_active = AnneeAcademique.objects.get(est_active=True)
        except AnneeAcademique.DoesNotExist:
            raise ValidationError("Aucune année académique active n'est définie. Veuillez activer une année académique avant de créer des classes.")
        
        # Récupérer la durée de la filière depuis l'instance de l'option
        duree_filiere = self.filiere.duree
        
        # Créer les classes uniquement pour l'année académique active
        for niveau in range(1, duree_filiere + 1):
            Classe.objects.get_or_create(option=self, annee_academique=annee_active, niveau=niveau)

    
    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)
            self.create_classes()
        super().save(*args, **kwargs)
         



class Classe(models.Model):
    option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name="Options")
    annee_academique = models.ForeignKey("AnneeAcademique", on_delete=models.CASCADE, related_name="AnneeAcademiques")
    niveau = models.IntegerField(help_text="Classe dans la filière, ex: 1 pour première année")

    def __str__(self):
        return f"{self.option} : Niveau {self.niveau}"
    

# class ClasseAdmin(admin.ModelAdmin):
#     list_display = ("filiere", "description")
#     list_filter = ["AnneeAcademique"]
#     search_fields = ['filiere']


class Etudiant(models.Model):
    matricule = models.CharField(max_length=20, unique=True)
    classe = models.ForeignKey('Classe', on_delete=models.CASCADE, related_name="etudiants")
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    photo = models.ImageField(upload_to="Etudiants_Profiles",null=True,blank=True)

    def __str__(self):
        return f"{self.matricule} - {self.nom} {self.prenom}"
    ...
    def clean(self):
        # S'assurer que l'âge de l'étudiant est plausible pour un universitaire
        if self.date_naissance.year > (datetime.date.today().year - 15):
            raise ValidationError("Vérifiez la date de naissance, elle semble incorrecte pour un étudiant universitaire.")
    class Meta:
        unique_together = ['matricule', 'nom', 'prenom', 'date_naissance']

class EtudiantAdmin(admin.ModelAdmin):
    list_display = ("matricule", "nom", "date_naissance")
    list_filter = ["classe"]
    search_fields = ['nom']

class UniteEnseignement(models.Model):
    code = models.CharField(max_length=10, unique=True)
    nom = models.CharField(max_length=200)
    filiere = models.ForeignKey('Filiere', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.code} : {self.nom}"

class ElementConstitutif(models.Model):
    code = models.CharField(max_length=10, unique=True)
    nom = models.CharField(max_length=200)
    ue = models.ForeignKey('UniteEnseignement', on_delete=models.CASCADE)
    # classe = models.ForeignKey('Classe', on_delete=models.CASCADE, null=True, blank=True)
    credits = models.IntegerField()

    def __str__(self):
        return self.nom
    
class Evaluation(models.Model):
    TYPE_EVALUATION_CHOICES = [
        ('CC', 'Contrôle Continu'),
        ('TP', 'Travaux Pratiques'),
        ('TPE', 'Travaux Personnels Encadrés'),
        ('EXAM', 'Examen')
    ]

    ec = models.ForeignKey('ElementConstitutif', on_delete=models.CASCADE)
    classe = models.ForeignKey('Classe', on_delete=models.CASCADE, null=True, blank=True)
    type_evaluation = models.CharField(max_length=4, choices=TYPE_EVALUATION_CHOICES)
    date = models.DateField()
    poids = models.DecimalField(max_digits=4, decimal_places=2)  # Poids de l'évaluation dans le calcul de la note finale pour l'EC

    def __str__(self):
        return f"{self.ec.nom} - {self.get_type_evaluation_display()} du {self.date}"



class Note(models.Model):
    etudiant = models.ForeignKey('Etudiant', on_delete=models.CASCADE)
    evaluation = models.ForeignKey('Evaluation', on_delete=models.CASCADE)
    note = models.FloatField()
    session = models.ForeignKey('Session', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant} - {self.evaluation} : {self.note}"



class Session(models.Model):
    annee = models.IntegerField()
    semestre = models.IntegerField()

    def __str__(self):
        return f"Année {self.annee}, Semestre {self.semestre}"

class ClasseAdmin(admin.ModelAdmin):
    list_display = ("option", "annee_academique", "niveau")
    list_filter = ["option", "annee_academique"]
    search_fields = ['option']
    # search_fields = ['a']
    # def get_queryset(self, request):
    #     # Récupérer l'année académique active
    #     annee_active = AnneeAcademique.objects.get(est_active=True)
    #     # Filtrer les classes pour afficher uniquement celles de l'année active
    #     return super().get_queryset(request).filter(annee_academique=annee_active)

