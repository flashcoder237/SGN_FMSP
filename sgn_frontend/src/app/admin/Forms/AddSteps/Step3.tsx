// Step3.tsx
import React from 'react';
import Input from '../../../../Components/Atoms/Input';
import InputFile from '../../../../Components/Atoms/InputFile';
import { StudentFormData } from '../../dataTypes/data';

interface Step3Props {
    formData: StudentFormData;
    handleInputChange: (value: string, name: string) => void;
    handleFileChange: (file: File | null) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, handleInputChange, handleFileChange }) => {
    return (
        <div>
            <Input
                type="text"
                name="matricule"
                placeholder="Matricule..."
                labelName="Matricule"
                required={true}
                value={formData.matricule}
                onInputChange={handleInputChange}
            />
            <Input
                type="text"
                name="nom"
                placeholder="Nom..."
                labelName="Nom"
                required={true}
                value={formData.nom}
                onInputChange={handleInputChange}
            />
            <Input
                type="text"
                name="prenom"
                placeholder="Prénom..."
                labelName="Prénom"
                required={true}
                value={formData.prenom}
                onInputChange={handleInputChange}
            />
            <Input
                type="date"
                name="date_naissance"
                placeholder="Date de naissance..."
                labelName="Date de naissance"
                required={true}
                value={formData.date_naissance}
                onInputChange={handleInputChange}
            />
            <InputFile
                type="file"
                name="photo"
                fileType="image/*"
                labelName="Photo (4x4) de l'étudiant"
                description="SVG, PNG, JPG or GIF (MAX. 400x400px)"
                onInputFileChange={handleFileChange}
            />
        </div>
    );
};

export default Step3;
