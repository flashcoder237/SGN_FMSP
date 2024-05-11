import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Atoms/Input';
import { FiliereFormData, DepartmentFormData } from '../dataTypes/data';
import { fetchDepartments } from '../../services/departmentService';
import Select from '../../../Components/Atoms/Select';
import { Description } from '@headlessui/react/dist/components/description/description';
import { ChangeEvent } from 'react';
import { FormEvent } from 'react';
import Button from '../../../Components/Atoms/Button';
import { createFiliere } from '../../services/filiereService';
import Modal from '../../../Components/Organisms/SucessModal';

const FiliereForm: React.FC = () => {
    const [formData, setFormData] = useState<FiliereFormData>({nom: '', code:'', duree:3, departement: 0 });
    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<string>('');
    const [resultAdd, setResultAdd] = useState(false);

    function handleResultChange(){
        setResultAdd(false);
    }

    const handleInputChange = (value: string, nom: string) => {
        setFormData(prev => ({
            ...prev,
            [nom]: value
        }));
    };

    const handleInputIntChange = (value: string, nom: string) => {
        setFormData(prev => ({
            ...prev,
            [nom]: value
        }));
    };

    const handleSelectChange = (event: string) => {
        const selectedNom = event;
        const departement = departements.find(d => d.nom === selectedNom);
        if (departement) {
            setDefaultSelectDepartements(departement?.nom);
            setFormData(prev => ({
                ...prev,
                departement: typeof departement.id === "number" ?  departement.id : -1,
            }));
        } else {
            // Gérer le cas où le département n'est pas trouvé
            console.error('Département sélectionné non trouvé');
            // Optionnel : définir une valeur par défaut ou gérer l'erreur
            setFormData(prev => ({
                ...prev,
                departement: -1  // Ou une autre valeur appropriée
            }));
        }
    };
    
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const response = await createFiliere(formData);
            setResultAdd(true);
            alert('Département ajouté avec succès!');
            setFormData({nom: '', code:'', duree:3, departement: 0}); // Reset form data
        } catch (error) {
            setResultAdd(false)
            console.error('Erreur lors de l\'ajout du département:', error);
            alert('Erreur lors de l\'ajout du département');
        }
        console.log('Filiere Name:', formData.nom, 'departement ID:', formData.departement);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const response = await fetchDepartments();
                const responseMap = response.data.map((dept:DepartmentFormData) => ({
                    id: dept.id,
                    nom: dept.nom,
                    description: dept.description,
                  }));
                setDepartements(responseMap);
        
                if (responseMap.length > 0) {
                    setDefaultSelectDepartements(departements[0].nom);
                    setFormData(prev => ({
                        ...prev,
                        departement: typeof departements[0].id === "number" ?  departements[0].id : -1,
                    }))
                }
            } catch (error) {
                console.error('Error loading Departements:', error);
            }
        };
        loadInitialData();
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <h2 className='text-2xl font-semibold mb-5'>Nouvelle Filière</h2>
            <Select 
                listItem={departements.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Sélectionner le département"
                value={defaultSelectDepartements}
                required={true}
                onSelectChange={handleSelectChange}
            />

            <Input
                type="text"
                name="nom"
                placeholder="Ex: Médecine générale..."
                labelName="Nom de la filière"
                value={formData.nom}
                onInputChange={handleInputChange}
            />

            <Input
                type="text"
                name="code"
                placeholder="Ex: Médecine générale..."
                labelName="Code de la filière"
                value={formData.code}
                onInputChange={handleInputChange}
            />

            <Input
                type="text"
                name="duree"
                placeholder="Ex: 4..."
                labelName="Durée de la filière(ans)"
                value={String(formData.duree)}
                onInputChange={handleInputIntChange}
            />

        <Button name='Ajouter' type='submit'/>
        </form>
        <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
        
        <Modal title='Département ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent ajouter des filières pour ce département' />
      </div>
        </div>
    );
};

export default FiliereForm;
