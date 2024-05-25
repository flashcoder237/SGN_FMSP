import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Atoms/Input';
import { FiliereFormData, DepartmentFormData, AnneeAcademiqueFormData } from '../dataTypes/data';
import { fetchDepartments } from '../../services/departmentService';
import Select from '../../../Components/Atoms/Select';
import { EnseignantFormData } from '../dataTypes/data';
import Button from '../../../Components/Atoms/Button';
import Modal from '../../../Components/Organisms/SucessModal';
import { createEnseignant } from '../../services/enseignantService';
import InputFile from '../../../Components/Atoms/InputFile';
import FailedModal from '../../../Components/Organisms/FailedModal';




const EnseignantForm: React.FC = () => {
    const [formData, setFormData] = useState<EnseignantFormData>({
        identifiant: '',
        nom: '',
        prenom: '',
        departement: -1,
        date_naissance: '',
        photo: null
    });

    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<DepartmentFormData>();

    

    function listeDeUnAN(n: number): number[] {
        const liste: number[] = [];
        for (let i = 1; i <= n; i++) {
            liste.push(i);
        }
        return liste;
    }

    const handleInputChange = (value: string, name: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);
    const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée"); 


    function handleResultChange(){
        setResultAdd(false);
    }

    function handleResultFailChange(){
      setFailAdd(false);
  }

    const handleSelectDepartmentChange = (event: string) => {
        const selectedNom = event;
        const departement_f = departements.find((d) => d.nom === selectedNom);
        if(departement_f){
            setDefaultSelectDepartements(departement_f)
            setFormData(prevState => ({
                ...prevState,
                departement: departement_f.id ? departement_f.id : -1
            }));
        }     
      };
    
    

      const handleFileChange = (file : File | null) => {
        setFormData(prevState => ({
            ...prevState,
            photo: file || null
        }));
    };  


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const response = await createEnseignant(formData);
            console.log('Étudiant ajouté avec succès:', response);
            setResultAdd(true);
            setFormData({
                identifiant: '',
                nom: '',
                prenom: '',
                departement: 0,
                date_naissance: '',
                photo: null
            });
        } catch (error: any) {
     
            if (error.request) {
              const errorData = JSON.parse(error.request.response);
              if (errorData && typeof errorData === 'object') {
                const errorMessages = Object.values(errorData).flat();
                console.error('Erreurs retournées par le serveur:', errorMessages);
                console.log(typeof errorMessages)
                setFailedMessage(""+errorMessages);
            }
            
            } else {
              setFailedMessage('Erreur lors de l\'ajout de l\'étudiant: Une erreur inconnue s\'est produite');
            }
              setFailAdd(true)
              console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
           }
    };

    useEffect(() => {
        const loadInitialData = async () => {
          try {
            const [departementsResponse] = await Promise.all([
              fetchDepartments(),
             
            ]);
            const mappedDepartments = departementsResponse.data.map((dept: DepartmentFormData) => ({
              id: dept.id,
              nom: dept.nom,
              description: dept.description,
            }));
    
           
            setDepartements(mappedDepartments);
          
            if (mappedDepartments.length > 0) {
              setDefaultSelectDepartements(mappedDepartments[0]);
              setFormData(prevState => ({
                ...prevState,
                departement: mappedDepartments[0].id ? mappedDepartments[0].id : -1
            }));
            }
    
          } catch (error) {
            console.error('Erreur de chargements des données:', error);
          }
        };
        loadInitialData();
      }, []);
      

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className='mt-4'>
            <h2 className='text-2xl font-bold mb-1 text-blue-950'>Nouvel Enseignant</h2>
            <Select 
                listItem={departements.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Sélectionner le département"
                value={defaultSelectDepartements ? defaultSelectDepartements.nom : ""} 
                required={true}
                onSelectChange={handleSelectDepartmentChange}
            />

            <Input
                type="text"
                name="identifiant"
                placeholder="Identifiant..."
                labelName="Identifiant"
                required={true}
                value={formData.identifiant}
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

        <Button color="blue" name='Ajouter' type='submit'/>
        </form>
        <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
        <Modal title='Enseignant ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent attribuer des cours à cette enseignant' />
      </div>
      <div className={`${failAdd ? 'block':'hidden'}`}>
       <FailedModal title="Erreur lors de l'ajout de l'enseignants!" onResultChange={handleResultFailChange} message={failedMessage} />
       </div>
        </div>
    );
};

export default EnseignantForm;
