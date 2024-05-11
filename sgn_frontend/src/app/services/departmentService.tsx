import Api from './api';  // Assurez-vous que le chemin est correct

export const fetchDepartments = async () => {
    return Api.get('/departements/');
};

export const createDepartment = async (departmentData: { nom: string }) => {
    return Api.post('/departements/', departmentData);
};

export const updateDepartment = async (id: number, departmentData: { nom: string }) => {
    return Api.put(`/departements/${id}/`, departmentData);
};

export const deleteDepartment = async (id: number) => {
    return Api.delete(`/departements/${id}/`);
};

