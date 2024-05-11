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
