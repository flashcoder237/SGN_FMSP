import Api from './api'; 

export const fetchEnseignants = async () => {
    return Api.get('/enseignants/');
};

export const getEnseignant = async (enseignantData: { identifiant: string, departement: number, nom: string, prenom: string, date_naissance: string, photo: File | null | string}) => {
    return Api.post('/enseignants/', enseignantData);
};

export const createEnseignant = async (enseignantData: { identifiant: string, departement: number, nom: string, prenom: string, date_naissance: string, photo: File | null | string}) => {
    const formData = new FormData();
    formData.append('identifiant', enseignantData.identifiant);
    formData.append('departement', enseignantData.departement.toString());
    formData.append('nom', enseignantData.nom);
    formData.append('prenom', enseignantData.prenom);
    formData.append('date_naissance', enseignantData.date_naissance);
    if (enseignantData.photo) {
        formData.append('photo', enseignantData.photo); 
    }
    return Api.post('/enseignants/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
};

export const updateEnseignant = async (id: number, enseignantData: { identifiant: string, departement: number, nom: string, prenom: string, date_naissance: string, photo: File | null | string}) => {
    return Api.put(`/enseignants/${id}/`, enseignantData);
};

export const deleteEnseignant = async (id: number) => {
    return Api.delete(`/enseignants/${id}/`);
};
