# Generated by Django 5.0.4 on 2024-05-18 06:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SGN', '0002_alter_session_annee_alter_cours_unique_together_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='uniteenseignement',
            name='filiere',
        ),
        migrations.AddField(
            model_name='uniteenseignement',
            name='option',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='SGN.option'),
            preserve_default=False,
        ),
    ]