import React, { useState } from 'react';
import Input from '../../../Components/Atoms/Input';
import { createDepartment } from '../../services/departmentService';
import { DepartmentFormData } from '../dataTypes/data';
import Button from '../../../Components/Atoms/Button';
import SucessModal from '../../../Components/Organisms/SucessModal';
import FailedModal from '../../../Components/Organisms/FailedModal';

const DepartmentForm: React.FC = () => {
    const [formData, setFormData] = useState<DepartmentFormData>({ nom: '', description: '' });
    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);

    function handleResultChange(){
        setResultAdd(false);
    }

    function handleResultFailChange(){
        setFailAdd(false);
    }

    const handleInputChange = (value: string , nom: string) => {
        setFormData(prev => ({
            ...prev,
            [nom]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const response = await createDepartment(formData);
            setResultAdd(true);
            // alert('Département ajouté avec succès!');
            setFormData({ nom: '', description: '' }); // Reset form data
        } catch (error) {
            setResultAdd(false)
            setFailAdd(true)
            // alert('Erreur lors de l\'ajout du département');
        }
    };

    return (
      <div>
          <form onSubmit={handleSubmit}>
            <h2 className='text-2xl font-semibold mb-5'>Nouveau département</h2>
            <Input
                type="text"
                name="nom"
                placeholder="Ex: Médecine générale..."
                labelName="Nom du département"
                value={formData.nom}
                onInputChange={(value: string) => handleInputChange(value, 'nom')}
            />
            <Input
                type="text"
                name="description"
                placeholder="Description du département..."
                labelName="Description du département"
                value={formData.description}
                onInputChange={(value: string) => handleInputChange(value, 'description')}
            />
        
            <Button name='Ajouter' type='submit'/>
        </form>
        <div className={`${resultAdd ? 'block':'hidden'}`}>
        
        <SucessModal title='Département ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent ajouter des filières pour ce département' />
      </div>
       <div className={`${failAdd ? 'block':'hidden'}`}>
       <FailedModal title="Erreur lors de l'ajout du département!" onResultChange={handleResultFailChange} message="Quelque chose s'est mal passée, le département n'as pas été ajouté" />
       </div>

      </div>
    );
};

export default DepartmentForm;
