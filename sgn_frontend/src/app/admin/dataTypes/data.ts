// Types.ts
export interface DepartmentFormData {
    id?: number;
    nom: string;
    description: string;
}

export interface FiliereFormData {
    id?: number;
    nom: string;
    code: string;
    duree: number;
    departement: number;
}

export interface OptionFormData {
    id?: number;
    nom: string;
    filiere: number;
    description : string;
}

export interface StudentFormData {
    id?: number;
    matricule: string;
    classe: number;  
    nom: string;
    prenom: string;
    date_naissance: string;
    photo: File | null;  
}

export interface EnseignantFormData {
    identifiant: string;
    nom: string;
    prenom: string;
    departement: number;  
    date_naissance: string;
    photo: File | null | string;  
}

export interface AnneeAcademiqueFormData{
    id?: number;
    date_debut : Date;
    date_fin : Date;
    est_active : Boolean
}

export interface ClasseFormData {
    id?: number;
    niveau : number,
    option : number,
    annee_academique : number
}

export interface OptionFormData {
    id?: number,
    nom : string,
    filiere : number,
    description : string
}

export interface InscriptionFormData {
    id?: number;
    classe: number;
    etudiant: number;
}

export interface NoteFormData {
    id?: number;
    evaluation: EvaluationFormData;
    note: number;
    session: SessionFormData;
    etudiant: StudentFormData;
    saisie : Boolean;
}   

export interface  UE_DataForm {
    id?: number;
    code : string;
    nom : string;
    classe : number;
}

export interface  EC_DataForm {
    id?: number;
    code : string;
    nom : string;
    credits : number;
    ue : number;
}

export interface EvaluationFormData{
    id?: number;
    classe : number;
    type_evaluation : string;
    date: string;
    poids : number;
}

export interface SessionFormData{
    id?: number;
    annee: number;
    semestre : number;
}