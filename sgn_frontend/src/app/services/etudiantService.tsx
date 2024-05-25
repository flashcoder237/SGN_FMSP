import Api from './api'; 
import { InscriptionFormData } from '../admin/dataTypes/data';
export const fetchEtudiants = async () => {
    return Api.get('/etudiants/');
};



export const getEtudiantByClasse = async (classe: number) => {
    try{
        const inscriptions = await Api.get(`/inscriptions/?classe=${classe}`);
        const etudiants = [];
        console.log(inscriptions.data);
        const mappedIncriptions = inscriptions.data.map((
            (e:InscriptionFormData) => ({
              id: e?.id,
              classe: e.classe,          
              etudiant: e.etudiant,
            })
          ));
        for (const inscription of mappedIncriptions) {
            const etudiantId = inscription.etudiant;
            const response = await Api.get(`/etudiants/${etudiantId}`);
            etudiants.push(response.data);
        }
        return etudiants;
    }catch(error : any){
        console.error('Erreur lors de la récupération des étudiants par classe :', error);
        throw error;
    }
};

export const createEtudiant = async (etudiantData: { matricule: string, nom: string, prenom: string, date_naissance: string, photo: File | null}, classe: {id: number}) => {
    const formData = new FormData();
    formData.append('matricule', etudiantData.matricule);
    formData.append('classe', classe.id.toString());
    formData.append('nom', etudiantData.nom);
    formData.append('prenom', etudiantData.prenom);
    formData.append('date_naissance', etudiantData.date_naissance);
    if (etudiantData.photo) {
        formData.append('photo', etudiantData.photo); 
    }
    return Api.post('/etudiants/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
};

export const updateEtudiant = async (id: number, etudiantData: { matricule: string, classe: number, nom: string, prenom: string, date_naissance: string, photo: File | null}) => {
    return Api.put(`/etudiants/${id}/`, etudiantData);
};

export const deleteEtudiant = async (id: number) => {
    return Api.delete(`/etudiants/${id}/`);
};
