import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Atoms/Input';
import { FiliereFormData, DepartmentFormData, AnneeAcademiqueFormData, ClasseFormData } from '../dataTypes/data';
import { fetchDepartments } from '../../services/departmentService';
import Select from '../../../Components/Atoms/Select';
import { Description } from '@headlessui/react/dist/components/description/description';
import { ChangeEvent } from 'react';
import { FormEvent } from 'react';
import Button from '../../../Components/Atoms/Button';
import { createFiliere } from '../../services/filiereService';
import Modal from '../../../Components/Organisms/SucessModal';
import { StudentFormData } from '../dataTypes/data';
import { createEtudiant } from '../../services/etudiantService';
import { fetchFilieres } from '../../services/filiereService';
import { fetchAnneAcademiques } from '../../services/AnneeAcademiqueService';
import { fetchOptions } from '../../services/optionService';
import { OptionFormData } from './../dataTypes/data';
import { getClasse } from '../../services/classeService';
import InputImage from '../../../Components/Atoms/InputImage';
import FailedModal from '../../../Components/Organisms/FailedModal';



const EtudiantForm: React.FC = () => {
    const [formData, setFormData] = useState<StudentFormData>({
        matricule: '',
        classe: -1,
        nom: '',
        prenom: '',
        date_naissance: '',
        photo: null
    });

    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [filieres, setFilieres] = useState<FiliereFormData[]>([]);
    const [options, setOptions] = useState<OptionFormData[]>([]);
    const [niveaux, setNiveaux] = useState<number[]>([])
    const [anneeActive, setAnneeActive] = useState<string>();
    const [anneeAcademique, setAnneeAcademique] = useState<AnneeAcademiqueFormData>();

    const [filtersFilieres, setFiltersFilieres] = useState<FiliereFormData[]>([]);
    const [filtersOptions, setFiltersOptions] = useState<OptionFormData[]>([]);

    
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<DepartmentFormData>();
    const [defaultSelectOptions, setDefaultSelectOptions] = useState<OptionFormData>();
    const [defaultSelectFilieres, setDefaultSelectFilieres] = useState<FiliereFormData>();
    const [defaultSelectNiveau, SetDefaultSelectNiveau] = useState<number>(1)
    

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
        const departement = departements.find((d) => d.nom === selectedNom);
        setDefaultSelectDepartements(departement);
        setFiltersFilieres(filieres.filter((f) => f.departement === departement?.id));
      };
    
      const handleSelectFiliereChange = (event: string) => {
        const selectedNom = event;
        const filiere = filieres.find((d) => d.nom === selectedNom);
        setDefaultSelectFilieres(filiere);
        
        setFiltersOptions(options.filter((o) => o.filiere === filiere?.id))
        setDefaultSelectOptions(filtersOptions[0])
        const niv = listeDeUnAN(filiere?.duree || 1);
        setNiveaux(niv);
        SetDefaultSelectNiveau(0);
      };
    
      const handleSelectOptionChange = (event: string) => {
        const selectedNom = event;
        const option = options.find((o) => o.nom === selectedNom);
        setDefaultSelectOptions(option);
      };

      const handleSelectNiveauChange = (event: string) => {
        const selectedNiveau = event;
        SetDefaultSelectNiveau(Number(selectedNiveau));
      };

      const handlePhotoChange = (file : File | null) => {
        setFormData(prevState => ({
            ...prevState,
            photo: file || null
        }));
    };  


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            if (defaultSelectOptions && anneeAcademique) {
                const classe = await getClasse((defaultSelectOptions.id ? defaultSelectOptions.id : -1), (anneeAcademique.id ? anneeAcademique.id : -1), defaultSelectNiveau)
                const mappedClasse = classe.data.map((
                  (e:ClasseFormData) => ({
                    id: e?.id,
                    niveau: e.niveau,          
                    option: e.option,
                    annee_academique: e.annee_academique,
                  })
                ));
                console.log(mappedClasse[0])
                if(mappedClasse.length > 0 && mappedClasse[0]){
                    setFormData((prev) => ({
                        ...prev,
                        classe: Number(mappedClasse[0].id), 
                    }));
                    console.log(formData.classe)
            }
            console.log(formData)
            const response = await createEtudiant(formData);
            console.log('Étudiant ajouté avec succès:', response);
            setResultAdd(true);
            setFormData({
                classe: 0,
                matricule: '',
                nom: '',
                prenom: '',
                date_naissance: '',
                photo: null
            });
            }
            // Reset form or show success message
        } catch (error: any) {
     
            if (error.request) {
              const errorData = JSON.parse(error.request.response);
              if (errorData && typeof errorData === 'object') {
                const errorMessages = Object.values(errorData).flat();
                console.error('Erreurs retournées par le serveur:', errorMessages);
                // Mettez à jour l'état pour afficher les messages d'erreur à l'utilisateur
                // Par exemple, vous pouvez utiliser un état pour stocker les messages d'erreur
                // et les afficher dans votre composant React.
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
            const [filieresResponse, departementsResponse, anneeAcademiquesResponse, optionResponse] = await Promise.all([
              fetchFilieres(),
              fetchDepartments(),
              fetchAnneAcademiques(),
              fetchOptions(),
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
    
            const mappedOptions = optionResponse.data.map((option: OptionFormData) => ({
              id: option.id,
              nom: option.nom,
              filiere: option.filiere,
            }));
    
            const activeYear = anneeAcademiquesResponse.data.find((a: AnneeAcademiqueFormData) => a.est_active);
            setAnneeAcademique(activeYear)
            if (activeYear) {
              const startDate = new Date(activeYear.date_debut);
              const endDate = new Date(activeYear.date_fin);
              setAnneeActive(`${startDate.getFullYear()}/${endDate.getFullYear()}`);
            } else {
              console.error("Aucune année académique active trouvée");
            }
    
            setDepartements(mappedDepartments);
            setFilieres(mappedFilieres);
            setOptions(mappedOptions);
    
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
          }
        }
      }, [defaultSelectDepartements, filieres]);

      useEffect(() => {
        if (defaultSelectFilieres) {
          const filteredOptions = options.filter((o) => o.filiere === defaultSelectFilieres.id);
          setFiltersOptions(filteredOptions);
          if (filteredOptions.length > 0) {
            setDefaultSelectOptions(filteredOptions[0]);
            setNiveaux(listeDeUnAN(defaultSelectFilieres.duree));
          }
        }
      }, [defaultSelectFilieres, options]);

      

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className='text-2xl font-semibold mb-5'>Nouvel Etudiant</h2>
            { anneeActive &&
                <h5 className='mb-4'>Les etudiants ajoutés sont celle de l'année active {anneeActive} </h5>
            } 
            { !anneeActive &&
                <h5 className='mb-4'>Aucune année académque n'est active pour le moment </h5>
            } 

            <Select 
                listItem={departements.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Sélectionner le département"
                value={defaultSelectDepartements ? defaultSelectDepartements.nom : ""} 
                required={true}
                onSelectChange={handleSelectDepartmentChange}
            />

            <Select 
                listItem={filtersFilieres.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Sélectionner la filière"
                value={defaultSelectFilieres ? defaultSelectFilieres.nom : ""} 
                required={true}
                onSelectChange={handleSelectFiliereChange}
            />    
            <Select 
                listItem={filtersOptions.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Sélectionner l'option"
                value={defaultSelectOptions ? defaultSelectOptions.nom : ""} 
                required={true}
                onSelectChange={handleSelectOptionChange}
            /> 
            <Select 
                listItem={niveaux.map(e => ({value : (typeof e === "number" ?  e: 0), label: e.toString()}))}
                labelSelect="Sélectionner le niveau "
                value={defaultSelectNiveau.toString()} 
                required={true}
                onSelectChange={handleSelectNiveauChange}
            /> 
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
            <InputImage
                type="file"
                name="photo"
                labelName="Photo (4x4) de l'étudiant"
                onInputImageChange={handlePhotoChange}
            />

        <Button name='Ajouter' type='submit'/>
        </form>
        <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
        <Modal title='Etudiant ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent ajouter des notes pour cette étudiant' />
      </div>
      <div className={`${failAdd ? 'block':'hidden'}`}>
       <FailedModal title="Erreur lors de l'ajout de l'étudiant!" onResultChange={handleResultFailChange} message={failedMessage} />
       </div>
        </div>
    );
};

export default EtudiantForm;
