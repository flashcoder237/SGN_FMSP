from django.contrib import admin

from .models import *

admin.site.register(Etudiant, EtudiantAdmin)
admin.site.register(Enseignant)
admin.site.register(Cours)
admin.site.register(UniteEnseignement)
admin.site.register(ElementConstitutif)
admin.site.register(Evaluation)
admin.site.register(Note)
admin.site.register(Filiere)
admin.site.register(Departement, DepartementAdmin)
admin.site.register(Classe, ClasseAdmin)
admin.site.register(AnneeAcademique)
admin.site.register(Session)
admin.site.register(Option)
admin.site.register(Inscription, InscriptionAdmin)



