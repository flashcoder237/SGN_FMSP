from rest_framework import serializers
from .models import *

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'

class CoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cours
        fields = '__all__'

        
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'
        
class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = '__all__'

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'

class ElementConstitutifSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementConstitutif
        fields = '__all__'

class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classe
        fields = '__all__'
        
class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'

class UniteEnseignementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniteEnseignement
        fields = '__all__'
        
class AnneeAcademiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnneeAcademique
        fields = '__all__'
        
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscription
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'
        
class NoteReadSerializer(serializers.ModelSerializer):
    etudiant = EtudiantSerializer()
    evaluation = EvaluationSerializer()
    session = SessionSerializer()

    class Meta:
        model = Note
        fields = ['id', 'etudiant', 'evaluation', 'note', 'session', 'saisie']

class NoteWriteSerializer(serializers.ModelSerializer):
    etudiant = serializers.PrimaryKeyRelatedField(queryset=Etudiant.objects.all())
    evaluation = serializers.PrimaryKeyRelatedField(queryset=Evaluation.objects.all())
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())

    class Meta:
        model = Note
        fields = ['id', 'etudiant', 'evaluation', 'note', 'session', 'saisie']

    def update(self, instance, validated_data):
        instance.etudiant = validated_data.get('etudiant', instance.etudiant)
        instance.evaluation = validated_data.get('evaluation', instance.evaluation)
        instance.session = validated_data.get('session', instance.session)
        instance.note = validated_data.get('note', instance.note)
        instance.saisie = validated_data.get('saisie', instance.saisie)
        instance.save()
        return instance

    def create(self, validated_data):
        return Note.objects.create(**validated_data)
