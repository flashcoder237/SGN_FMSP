from fpdf import FPDF

class PDF(FPDF):
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
        self.image('logo_ud.png', x=10 + width + 15, y=15, w=width - 45)
        self.image('logo_fmsp.png', x=2 * width - 15, y=15, w=width - 45)

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

        self.set_xy(10, 50)
        self.cell(width * 3, 0, '', border=1, ln=False, align='C')

    