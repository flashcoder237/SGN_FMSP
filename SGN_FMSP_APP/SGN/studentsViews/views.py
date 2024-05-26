from django.http import HttpResponse
from ..models import Etudiant, Classe, Inscription
from fpdf import FPDF
from pypdf import PdfReader
from django.core.files import File
from django.conf import settings
import os
from fpdf.fonts import FontFace

class PDF(FPDF):
    def __init__(self, classe, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.classe = classe
        
    def header(self):
        self.set_font('Arial', 'B', 15)
        width = self.w / 3.4

        self.set_xy(10, 10)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 5, 'REPUBLIQUE DU CAMEROUN', align='C', ln=2)
        self.set_font("Times", 'I', size=8)
        self.cell(width, 5, 'Paix-Travail-Patrie', align='C', ln=2)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 2, '**************', align='C', ln=2)
        self.cell(width, 5, 'UNIVERSITE DE DOUALA', align='C', ln=2)
        self.cell(width, 2, '**************', align='C', ln=2)
        self.cell(width, 5, 'FACULTE DE MEDECINE ET', align='C', ln=2)
        self.cell(width, 5, 'DES SCIENCES PHARMACEUTIQUES', align='C', ln=2)

        self.set_xy(10 + width, 10)
        self.image('media/Logo/logo_ud.jpg', x= 5 + width + 15, y=15, w=width - 45)
        self.image('media/Logo/logo_fmsp.jpg', x=2 * width - 20, y=15, w=width - 37)

        self.set_xy(10 + 2 * width, 10)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 5, 'REPUBLIC OF CAMEROON', align='C', ln=2)
        self.set_font("Times", 'I', size=7)
        self.cell(width, 5, 'Peace-Work-FatherLand', align='C', ln=2)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 2, '**************', align='C', ln=2)
        self.cell(width, 5, 'UNIVERSITY OF DOUALA', align='C', ln=2)
        self.cell(width, 2, '**************', align='C', ln=2)
        self.cell(width, 5, 'FACULTY OF MEDICINE AND', align='C', ln=2)
        self.cell(width, 5, 'PHARMACEUTICAL SCIENCES', align='C', ln=2)

        self.set_xy(10, 45)
        self.cell(width * 3, 0, '', border=1, ln=False, align='C')
        
        self.set_xy(10, 55)
        self.set_font("Times", 'B', size=12)
        self.cell(width * 3, 4, f"Liste des étudiants", ln=True, align='C')
        self.set_font("Times", 'I', size=10)
        self.cell(width * 3, 4, f"Students list", ln=True, align='C')

        self.set_font("Times", 'B', size=9)
        self.cell(width, 3.2, f'Anné académique : {self.classe.annee_academique}', ln=2)
        self.set_font("Times", 'I', size=8)
        self.cell(width, 3.2, f'Academic Year : {self.classe.annee_academique}', ln=2)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 3.2, f'Département: {self.classe.option.filiere.departement.nom}', ln=2)
        self.set_font("Times", 'I', size=8)
        self.cell(width, 3.2, f'Department: {self.classe.option.filiere.departement.nom}', ln=2)
        
        self.set_xy(30 + 2 * width, 60)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 3.2, f'Filière: {self.classe.option.filiere.nom}', ln=2)
        self.set_font("Times", 'I', size=8)
        self.cell(width, 3.2, f'Discipline: {self.classe.option.filiere.nom}', ln=2)
        self.set_font("Times", 'B', size=9)
        self.cell(width, 3.2, f'Option: {self.classe.option.nom}', ln=2)
        self.set_font("Times", 'I', size=8)
        self.cell(width, 3.2, f'Major: {self.classe.option.nom}', ln=2)
        
        self.set_xy(10, 80)
        
    def footer(self):
        # Position cursor at 1.5 cm from bottom:
        self.set_xy(10, -15)
        # Setting font: helvetica italic 8
        self.set_font("helvetica", "I", 8)
        # Printing page number:
        self.cell(0, 10, f"{self.classe}", align="L")
        
        self.set_x(self.w / 2.5)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}")
        
        self.set_x(self.w / 1.5)
        self.cell(0, 10, f"Document generate by")
        self.image('media/Logo/sgn_logo.png',x="R", h=5)
 

    
def generate_students_pdf(classe_id):
    classe = Classe.objects.get(id=classe_id)
    inscriptions_classe = Inscription.objects.filter(classe=classe)
    
    # Création du PDF
    pdf = PDF(classe)
    pdf.add_page()
    
    
    pdf.set_font("Times", size=11)
    i,j,k = 1,1,1
    table_data_etudiants, table_data_etudiants_AAD, table_data_etudiants_R  = [(
        "No",
        "Matricule",
        "Nom",
        "Prénom",
        "Date de Naissance",
    )],[(
        "No",
        "Matricule",
        "Nom",
        "Prénom",
        "Date de Naissance",
    )],[(
        "No",
        "Matricule",
        "Nom",
        "Prénom",
        "Date de Naissance",
    )]
    for inscription in inscriptions_classe:
            etudiant = Etudiant.objects.filter(id=inscription.etudiant_id).first()
            inscriptions_etudiant = Inscription.objects.filter(etudiant=etudiant)
            for inscription_etudiant in inscriptions_etudiant:
                if(inscription_etudiant.classe.niveau > classe.niveau and inscription_etudiant.classe.option == classe.option):
                    table_data_etudiants_AAD.append(
                   ( str(i),
                    etudiant.matricule,
                    etudiant.nom,
                    etudiant.prenom,
                    str(etudiant.date_naissance))
                    )
                    i += 1
                    
                else : 
                    if(inscription_etudiant.classe.niveau == classe.niveau and inscription_etudiant.classe.annee_academique != classe.annee_academique):
                        table_data_etudiants_R.append(
                        ( str(j),
                            etudiant.matricule,
                            etudiant.nom,
                            etudiant.prenom,
                            str(etudiant.date_naissance))
                        )
                        j += 1
                    else : 
                        table_data_etudiants.append(
                        ( str(k),
                            etudiant.matricule,
                            etudiant.nom,
                            etudiant.prenom,
                            str(etudiant.date_naissance))
                        )
                        k += 1
                    
    white = (255, 255, 255)
    gray = (59, 64, 69)
    headings_style = FontFace(color=white, fill_color=gray)
    # headings_style = FontFace(emphasis="ITALICS", fill_color=gray)
    with pdf.table(text_align=("CENTER", "LEFT", "LEFT", "LEFT", "LEFT"), col_widths=(10, 40,40,40,40),headings_style=headings_style) as table:
        for data_row in table_data_etudiants:
            row = table.row()
            for datum in data_row:
                row.cell(datum,padding=(4, 2, 2, 2))
                
    width = pdf.w / 3.4
    if len(table_data_etudiants_AAD) > 1:
            pdf.set_xy(10, pdf.get_y() + 10)  
            pdf.set_font("Times", 'B', size=12)
            pdf.cell(width*3, 4, f"Liste des étudiants admis avec dette",ln=True, align="C")
            pdf.set_font("Times", 'I', size=10)
            pdf.cell(width * 3, 4, f"List of students admitted with debt", ln=True, align='C')
            pdf.set_xy(10, pdf.get_y()+5) 
            
            pdf.set_font("Times", size=11)
            with pdf.table(text_align=("CENTER", "LEFT", "LEFT", "LEFT", "LEFT"), col_widths=(10, 40,40,40,40),headings_style=headings_style) as table:
                for data_row in table_data_etudiants_AAD:
                    row = table.row()
                    for datum in data_row:
                        row.cell(datum,padding=(4, 2, 2, 2))
    
    if len(table_data_etudiants_R) > 1:
            pdf.set_xy(10, pdf.get_y() + 10)  
            pdf.set_font("Times", 'B', size=12)
            pdf.cell(width*3, 4, f"Liste des étudiants Redoublants",ln=True, align="C")
            pdf.set_font("Times", 'I', size=10)
            pdf.cell(width * 3, 4, f"List of repeating students", ln=True, align='C')
            pdf.set_xy(10, pdf.get_y()+5) 
            
            pdf.set_font("Times", size=11)
            with pdf.table(text_align=("CENTER", "LEFT", "LEFT", "LEFT", "LEFT"), col_widths=(10, 40,40,40,40),headings_style=headings_style) as table:
                for data_row in table_data_etudiants_R:
                    row = table.row()
                    for datum in data_row:
                        row.cell(datum,padding=(4, 2, 2, 2))
         
         
    pdf.output("media/liste_etudiants.pdf")
    path_to_file = os.path.join(settings.MEDIA_ROOT, 'liste_etudiants.pdf')
    f = open(path_to_file, 'rb')
    pdfFile = File(f)

    response = HttpResponse(pdfFile.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="etudiants_classe.pdf"'
    pdfFile.close()
    os.remove("media/liste_etudiants.pdf")
    return response

def download_students_pdf(request, classe_id):
    response = generate_students_pdf(classe_id)
    return response