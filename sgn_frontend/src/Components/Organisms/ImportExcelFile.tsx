import React from 'react';
import axios from 'axios';
import Button from '../Atoms/Button';
import { downloadTemplate } from '../../app/services/importService';

interface ImportFileData {
    fileName: string;
    title: string;
    label: string;
    linked: string;
}
const ImportExcelFile = ({fileName,title, label, linked}:ImportFileData) => {
    const downloadFile = async () => {
        try {
            const response = await downloadTemplate(linked, fileName);
            
        } catch (error) {
            console.error('Erreur lors du téléchargement du modèle de template:', error);
        }
    };

    return (
        <div onClick={downloadFile}>
            <h1 className='text-xl font-semibold pb-2 text-blue-950'>{title}</h1>
            <Button  color="slate" name={label} type='button'/>
        </div>
    );
};

export default ImportExcelFile;
// 'http://votre-api.com/download_template/' ''