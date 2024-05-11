import Api from './api'; 

export const fetchEtudiants = async () => {
    return Api.get('/etudiants/');
};

export const getEtudiant = async (etudiantData: { matricule: string, classe: number, nom: string, prenom: string, date_naissance: string, photo: File | null}) => {
    return Api.post('/etudiants/', etudiantData);
};

export const createEtudiant = async (etudiantData: { matricule: string, classe: number, nom: string, prenom: string, date_naissance: string, photo: File | null}) => {
    const formData = new FormData(); // Créez un objet FormData pour envoyer des données multipart/form-data
    
    // Ajoutez les champs de données à FormData
    formData.append('matricule', etudiantData.matricule);
    formData.append('classe', etudiantData.classe.toString());
    formData.append('nom', etudiantData.nom);
    formData.append('prenom', etudiantData.prenom);
    formData.append('date_naissance', etudiantData.date_naissance);
    if (etudiantData.photo) {
        formData.append('photo', etudiantData.photo); // Ajoutez le fichier photo s'il est défini
    }
    
    // Effectuez l'appel réseau en utilisant Axios ou toute autre bibliothèque de votre choix
    return Api.post('/etudiants/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Définissez le type de contenu sur multipart/form-data
        }
    });
};

export const updateEtudiant = async (id: number, etudiantData: { matricule: string, classe: number, nom: string, prenom: string, date_naissance: string, photo: File | null}) => {
    return Api.put(`/etudiants/${id}/`, etudiantData);
};

export const deleteEtudiant = async (id: number) => {
    return Api.delete(`/etudiants/${id}/`);
};
