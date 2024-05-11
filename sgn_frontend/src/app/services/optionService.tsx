import Api from './api';  // Assurez-vous que le chemin est correct

export const fetchOptions = async () => {
    return Api.get('/options/');
};

export const createOption = async (optionData: { nom: string }) => {
    return Api.post('/options/', optionData);
};

export const updateOption = async (id: number, optionData: { nom: string }) => {
    return Api.put(`/options/${id}/`, optionData);
};

export const deleteOption = async (id: number) => {
    return Api.delete(`/options/${id}/`);
};
