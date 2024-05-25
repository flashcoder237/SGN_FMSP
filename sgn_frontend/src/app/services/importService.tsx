import Api from './api';

export const downloadTemplate = async (linked: string, fileName: string) => {
    try {
        const response = await Api.get(linked);
        const url = window.URL.createObjectURL(new Blob([response.data.url])); // Supposons que le champ 'url' contient l'URL du modèle de template
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error('Erreur lors du téléchargement du modèle de template:', error);
    }
};

export const importStudentsExcelFile = async (linked : string , formData : FormData) => {

        return await Api.post(
            linked,
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    
};

export const importStudentsNotesExcelFile = async (linked : string , formData : FormData) => {

    return await Api.post(
        linked,
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

};
