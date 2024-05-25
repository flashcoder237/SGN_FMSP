import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Atoms/Input';
import { DepartmentFormData } from '../dataTypes/data';
import Button from '../../../Components/Atoms/Button';
import SucessModal from '../../../Components/Organisms/SucessModal';
import FailedModal from '../../../Components/Organisms/FailedModal';
import { FiliereFormData } from '../dataTypes/data';
import { OptionFormData } from '../dataTypes/data';
import { AnneeAcademiqueFormData } from '../dataTypes/data';
import { createOption } from '../../services/optionService';
import Select from '../../../Components/Atoms/Select';
import { fetchFilieres } from '../../services/filiereService';
import { fetchDepartments } from '../../services/departmentService';
import { fetchAnneAcademiques } from '../../services/AnneeAcademiqueService';

const OptionForm: React.FC = () => {
    const [formData, setFormData] = useState<OptionFormData>({nom: '', filiere:-1, description: '' }); 
    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);

    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [filieres, setFilieres] = useState<FiliereFormData[]>([]);
    const [anneeAcademique, setAnneeAcademique] = useState<AnneeAcademiqueFormData>();

    const [filtersFilieres, setFiltersFilieres] = useState<FiliereFormData[]>([]);

    
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<DepartmentFormData>();
    const [defaultSelectFilieres, setDefaultSelectFilieres] = useState<FiliereFormData>();
  

    const handleSelectDepartmentChange = (event: string) => {
        const selectedNom = event;
        const departement = departements.find((d) => d.nom === selectedNom);
        setDefaultSelectDepartements(departement);
        setFiltersFilieres(filieres.filter((f) => f.departement === departement?.id));
        if (filtersFilieres.length > 0) {
            setDefaultSelectFilieres(filtersFilieres[0]);
        } else {
            setDefaultSelectFilieres(undefined);
        }
    };

    const handleSelectFiliereChange = (event: string) => {
        const selectedNom = event;
        const filiere = filieres.find((d) => d.nom === selectedNom);
        setDefaultSelectFilieres(filiere);
    };

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
            const response = await createOption(formData);
            setResultAdd(true);
            setFormData(prev => ({
                ...prev,
                'nom': '',
                'description': '',
            }));
        } catch (error) {
            setResultAdd(false)
            setFailAdd(true)
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [filieresResponse, departementsResponse, anneeAcademiquesResponse] = await Promise.all([
                    fetchFilieres(),
                    fetchDepartments(),
                    fetchAnneAcademiques(),
                ]);
                const mappedDepartments = departementsResponse.data.map((dept: DepartmentFormData) => ({
                    id: dept.id,
                    nom: dept.nom,
                    description: dept.description,
                }));

                const mappedFilieres = filieresResponse.data.map((filiere: FiliereFormData) => ({
                    id: filiere.id,
                    nom: filiere.nom,
                    departement: filiere.departement,
                    code: filiere.code,
                    duree: filiere.duree,
                }));

                

                const activeYear = anneeAcademiquesResponse.data.find((a: AnneeAcademiqueFormData) => a.est_active);
                setAnneeAcademique(activeYear);
                setDepartements(mappedDepartments);
                setFilieres(mappedFilieres);


                if (mappedDepartments.length > 0) {
                    setDefaultSelectDepartements(mappedDepartments[0]);
                }

            } catch (error) {
                console.error('Erreur de chargements des données:', error);
            }
        };
        loadInitialData();
    }, []);


    useEffect(() => {
        if (defaultSelectDepartements) {
            const filteredFilieres = filieres.filter((f) => f.departement === defaultSelectDepartements.id);
            setFiltersFilieres(filteredFilieres);
            if (filteredFilieres.length > 0) {
                setDefaultSelectFilieres(filteredFilieres[0]);
                setFormData(prev => ({
                    ...prev,
                    "filiere": filteredFilieres[0].id  ? filteredFilieres[0].id :-1,
                    
                }));
            } else {
                setDefaultSelectFilieres(undefined);
            }
        }
    }, [defaultSelectDepartements, filieres]);


    return (
      <div>
          <form onSubmit={handleSubmit}>
            <h2 className='text-2xl font-bold text-blue-700 mb-5'>Nouvelle option</h2>
            <Select
                    listItem={departements.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                    labelSelect="Sélectionner le département"
                    value={defaultSelectDepartements ? defaultSelectDepartements.nom : ""}
                    required={true}
                    onSelectChange={handleSelectDepartmentChange}
                />

                <Select
                    listItem={filtersFilieres.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                    labelSelect="Sélectionner la filière"
                    value={defaultSelectFilieres ? defaultSelectFilieres.nom : ""}
                    required={true}
                    onSelectChange={handleSelectFiliereChange}
                />
            <Input
                type="text"
                name="nom"
                placeholder="Ex: Médecine générale..."
                labelName="Nom de l'option"
                value={formData.nom}
                onInputChange={(value: string) => handleInputChange(value, 'nom')}
            />
            <Input
                type="text"
                name="description"
                placeholder="Description de l'option..."
                labelName="Description de l'option"
                value={formData.description}
                onInputChange={(value: string) => handleInputChange(value, 'description')}
            />
        
            <Button color="blue" name='Ajouter' type='submit'/>
        </form>
        <div className={`${resultAdd ? 'block':'hidden'}`}>
        
        <SucessModal title='Option ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent acceder aux classes pour cette option' />
      </div>
       <div className={`${failAdd ? 'block':'hidden'}`}>
       <FailedModal title="Erreur lors de l'ajout de l'option!" onResultChange={handleResultFailChange} message="Quelque chose s'est mal passée, l'option n'as pas été ajouté" />
       </div>

      </div>
    );
};

export default OptionForm;
