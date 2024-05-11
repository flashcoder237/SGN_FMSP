import Api from './api';
import { FiliereFormData } from '../admin/dataTypes/data';

export const fetchFilieres = async () => {
    return Api.get('/filieres/');
};

export const createFiliere = async (FiliereFormData: { nom: string, code: string, duree: number, departement: number }) => {
    return Api.post('/filieres/', FiliereFormData);
};

export const updateFiliere = async (id: number, FiliereFormData: { nom: string, code: string, duree: number, departement: number }) => {
    return Api.put(`/filieres/${id}/`, FiliereFormData);
};

export const deleteFiliere = async (id: number) => {
    return Api.delete(`/filieres/${id}/`);
};
