import Api from './api';  // Assurez-vous que le chemin est correct

export const fetchAnneAcademiques = async () => {
    return Api.get('/annee_academiques/');
};


