import Api from './api';  

export const fetchLevels = async () => {
    return Api.get('/classes/');
};

export const getClasse = async (option: number, annee_academique:number, niveau: number) => {
    return Api.get(`/classes/?option=${option}&annee_academique=${annee_academique}&niveau=${niveau}`);
};

export const createLevel = async (classeData: { niveau: number, filiere: number, annee_academique:number }) => {
    return Api.post('/classes/', classeData);
};

export const updateLevel = async (id: number, classeData: { niveau: number, filiere: number, annee_academique:number }) => {
    return Api.put(`/classes/${id}/`, classeData);
};

export const deleteLevel = async (id: number) => {
    return Api.delete(`/classes/${id}/`);
};

export const getAllUeByClasse = async (classe: number) => {
    return Api.get(`/unites_enseignement/?classe=${classe}`);
};

export const getAllUcByUe = async (Ue: number) => {
    return Api.get(`/elements_constitutifs/?ue=${Ue}`);
};

export const getAllEvaluationsByUc = async (Ec: number, classe: number) => {
    return Api.get(`/evaluations/?ec=${Ec}&classe=${classe}`);
};

export const getAllNotesByEvaluation = async (evaluation : number) => {
    return Api.get(`/notes/?evaluation=${evaluation}`);
};

export const updateNote = async (id: number, NoteData: { evaluation: number, note: number, session: number, etudiant: number }) => {
    return Api.put(`/notes/${id}/`, NoteData);
};


export const deleteNote = async (id: number) => {
    return Api.delete(`/notes/${id}/`);
};

