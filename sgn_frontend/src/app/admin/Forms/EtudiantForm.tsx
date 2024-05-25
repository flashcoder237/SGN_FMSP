import React, { useState, useEffect } from 'react';
import Step1 from './AddSteps/Step1';
import Step2 from './AddSteps/Step2';
import Step3 from './AddSteps/Step3';
import Modal from '../../../Components/Organisms/SucessModal';
import FailedModal from '../../../Components/Organisms/FailedModal';
import { fetchFilieres } from '../../services/filiereService';
import { fetchAnneAcademiques } from '../../services/AnneeAcademiqueService';
import { fetchOptions } from '../../services/optionService';
import { getClasse } from '../../services/classeService';
import { createEtudiant } from '../../services/etudiantService';
import { fetchDepartments } from '../../services/departmentService';
import Button from '../../../Components/Atoms/Button';

import { StudentFormData, DepartmentFormData, FiliereFormData, OptionFormData, AnneeAcademiqueFormData, ClasseFormData } from '../dataTypes/data';



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
    const [niveaux, setNiveaux] = useState<number[]>([]);
    const [anneeActive, setAnneeActive] = useState<string>();
    const [anneeAcademique, setAnneeAcademique] = useState<AnneeAcademiqueFormData>();
    const [filtersFilieres, setFiltersFilieres] = useState<FiliereFormData[]>([]);
    const [filtersOptions, setFiltersOptions] = useState<OptionFormData[]>([]);
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<DepartmentFormData>();
    const [defaultSelectOptions, setDefaultSelectOptions] = useState<OptionFormData>();
    const [defaultSelectFilieres, setDefaultSelectFilieres] = useState<FiliereFormData>();
    const [defaultSelectNiveau, setDefaultSelectNiveau] = useState<number>(1);
    const [defaultSelectClasse, setDefaultSelectClasse] = useState<StudentFormData>();
    const [currentStep, setCurrentStep] = useState(1);
    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);
    const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée");

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
        setFiltersOptions(options.filter((o) => o.filiere === filiere?.id));
        setDefaultSelectOptions(filtersOptions[0]);
        const niv = listeDeUnAN(filiere?.duree || 1);
        setNiveaux(niv);
        setDefaultSelectNiveau(0);
    };

    const handleSelectOptionChange = (event: string) => {
        const selectedNom = event;
        const option = options.find((o) => o.nom === selectedNom);
        setDefaultSelectOptions(option);
    };

    const handleSelectNiveauChange = (event: string) => {
        const selectedNiveau = event;
        setDefaultSelectNiveau(Number(selectedNiveau));
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prevState => ({
            ...prevState,
            photo: file || null
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            if (defaultSelectOptions && anneeAcademique) {
                const classe = await getClasse((defaultSelectOptions.id ? defaultSelectOptions.id : -1), (anneeAcademique.id ? anneeAcademique.id : -1), defaultSelectNiveau);
                const mappedClasse = classe.data.map(
                    (e: ClasseFormData) => ({
                        id: e.id,
                        niveau: e.niveau,
                        option: e.option,
                        annee_academique: e.annee_academique,
                    })
                );
                if (mappedClasse.length > 0) {
                    setDefaultSelectClasse(mappedClasse[0]);
                    setFormData(prevState => ({
                        ...prevState,
                        classe: mappedClasse[0].id
                    }));
                }
                const response = await createEtudiant(formData, { id: mappedClasse[0].id });
                console.log(response);
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
        } catch (error: any) {
            if (error.request) {
                const errorData = JSON.parse(error.request.response);
                if (errorData && typeof errorData === 'object') {
                  const errorMessages = Object.values(errorData).flat();
                  console.error('Erreurs retournées par le serveur:', errorMessages);
                  console.log(typeof errorMessages)
                  setFailedMessage(""+errorMessages[1]);
              }
              
              } else {
                setFailedMessage('Erreur lors de l\'ajout de l\'étudiant: Une erreur inconnue s\'est produite');
              }
                setFailAdd(true)
                console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
            setFailAdd(true);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    function handleResultChange(){
      setResultAdd(false);
  }

  function handleResultFailChange(){
    setFailAdd(false);
}

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
                    console.error('Error loading initial data', error);
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
            setDefaultSelectNiveau(niveaux.length > 0 ? niveaux[0] : -1) ;
          }
        }
      }, [defaultSelectFilieres, options]);


    return (
        <div className="rounded bg-white  p-3">
            <ol className="my-4 flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                <li className={`${currentStep >= 1 ? "flex items-center text-blue-600 dark:text-blue-500"
                                    : "flex items-center"}`}>
                    <span className={`${currentStep >= 1 ? "flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500"
                                    : "flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"}`}>
                        1
                    </span>
                    Filière <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                    </svg>
                </li>
                <li className={`${currentStep >= 2 ? "flex items-center text-blue-600 dark:text-blue-500"
                                    : "flex items-center"}`}>
                    <span className={`${currentStep >= 2 ? "flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500"
                                    : "flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"}`}>
                        2
                    </span>
                    Option <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                    </svg>
                </li>
                <li className={`${currentStep >= 3 ? "flex items-center text-blue-600 dark:text-blue-500"
                                    : "flex items-center"}`}>
                    <span className={`${currentStep >= 3 ? "flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500"
                                    : "flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"}`}>
                        3
                    </span>
                    Infos personnelles
                </li>
            </ol>

            <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                    <Step1
                        departements={departements}
                        filieres={filieres}
                        filtersFilieres={filtersFilieres}
                        defaultSelectDepartements={defaultSelectDepartements}
                        defaultSelectFilieres={defaultSelectFilieres}
                        handleSelectDepartmentChange={handleSelectDepartmentChange}
                        handleSelectFiliereChange={handleSelectFiliereChange}
                    />
                )}
                {currentStep === 2 && (
                    <Step2
                        options={options}
                        niveaux={niveaux}
                        defaultSelectOptions={defaultSelectOptions}
                        defaultSelectNiveau={defaultSelectNiveau}
                        handleSelectOptionChange={handleSelectOptionChange}
                        handleSelectNiveauChange={handleSelectNiveauChange}
                    />
                )}
                {currentStep === 3 && (
                    <Step3
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                    />
                )}
                <div className="flex justify-between mt-4">
                    {currentStep > 1 && (
                      <div onClick={handlePrevious}>
                        <Button type='button' name='Précédent' color='blue'/>
                      </div>
                    )}
                    {currentStep < 3 && (
                       <div onClick={handleNext}>
                       <Button type='button' name='Suivant' color='blue'/>
                     </div>
                    )}
                    {currentStep === 3 && (
                        <button type='submit' className="p-2 mx-2 rounded-md text-sm px-4 text-white font-medium bg-green-600 dark:text-blue-500">
                             Soumettre
                        </button>
                    )}
                </div>
            </form>
            {resultAdd && (
                <Modal title='Ajouté avec succès' message="L'étudiant a été ajouté avec succès" onResultChange={handleResultChange}/>
            )}
            {failAdd && (
                <FailedModal title="Erreur d'ajout" message={failedMessage} onResultChange={handleResultFailChange}/>
            )}
        </div>
    );
};

export default EtudiantForm;
