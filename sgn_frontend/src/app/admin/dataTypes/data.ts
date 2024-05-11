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

export interface LevelFormData {
    nom: string;
    filiereId: number;
}

export interface StudentFormData {
    matricule: string;
    classe: number;  
    nom: string;
    prenom: string;
    date_naissance: string;
    photo: File | null;  
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