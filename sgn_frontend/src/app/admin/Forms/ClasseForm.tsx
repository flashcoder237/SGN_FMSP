import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Select from '../../../Components/Atoms/Select';
import Button from '../../../Components/Atoms/Button';
import { FiliereFormData, DepartmentFormData, AnneeAcademiqueFormData, ClasseFormData, OptionFormData, StudentFormData } from '../dataTypes/data';
import { fetchDepartments } from '../../services/departmentService';
import { fetchFilieres } from '../../services/filiereService';
import { fetchAnneAcademiques } from '../../services/AnneeAcademiqueService';
import { fetchOptions } from '../../services/optionService';
import { getClasse } from '../../services/classeService';

interface SearchFormProps {
    onSubmit: (classe: ClasseFormData) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [filieres, setFilieres] = useState<FiliereFormData[]>([]);
    const [options, setOptions] = useState<OptionFormData[]>([]);
    const [niveaux, setNiveaux] = useState<number[]>([])
    const [anneeActive, setAnneeActive] = useState<string>();
    const [anneeAcademique, setAnneeAcademique] = useState<AnneeAcademiqueFormData>();
    const [searchClasse, setSearchClasse] = useState<ClasseFormData>();

    const [currentEtudiants, setCurrentEtudiants] = useState<StudentFormData[]>([]);
    const [filterCurrentEtudiants, setFilterCurrentEtudiants] = useState<StudentFormData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [filtersFilieres, setFiltersFilieres] = useState<FiliereFormData[]>([]);
    const [filtersOptions, setFiltersOptions] = useState<OptionFormData[]>([]);

    
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<DepartmentFormData>();
    const [defaultSelectOptions, setDefaultSelectOptions] = useState<OptionFormData>();
    const [defaultSelectFilieres, setDefaultSelectFilieres] = useState<FiliereFormData>();
    const [defaultSelectNiveau, SetDefaultSelectNiveau] = useState<number>(1)

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

        setFiltersOptions(options.filter((o) => o.filiere === filiere?.id));
        setDefaultSelectOptions(filtersOptions[0]);
        const niv = listeDeUnAN(filiere?.duree || 1);
        setNiveaux(niv);
        SetDefaultSelectNiveau(1);
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

    const listeDeUnAN = (n: number): number[] => {
        const liste: number[] = [];
        for (let i = 1; i <= n; i++) {
            liste.push(i);
        }
        return liste;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            if (defaultSelectOptions && anneeAcademique) {
                const classe = await getClasse(
                    defaultSelectOptions.id ? defaultSelectOptions.id : -1,
                    anneeAcademique.id ? anneeAcademique.id : -1,
                    defaultSelectNiveau
                );
                const mappedClasse = classe.data.map((e: ClasseFormData) => ({
                    id: e.id,
                    niveau: e.niveau,
                    option: e.option,
                    annee_academique: e.annee_academique,
                }));
                if (mappedClasse.length > 0 && mappedClasse[0]) {
                    onSubmit(mappedClasse[0]);
                }
            } else {
                
            }
        } catch (error: any) {
            console.error("Une erreur s'est produite:", error);
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
                setAnneeAcademique(activeYear);
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
            } else {
                setDefaultSelectFilieres(undefined);
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
        } else {
            setDefaultSelectOptions(undefined);
            setFiltersOptions([]);
            setNiveaux([]);
        }
    }, [defaultSelectFilieres, options]);

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className='mt-0 mb-6 border-b-4 border-blue-300 bg-slate-100 p-4'>
            <h2 className='text-2xl font-bold mb-1 text-blue-950'>Visualiser les etudiants</h2>
            {anneeAcademique &&
                <h5 className='mb-4 italic text-sm text-gray-500'>
                    Les etudiants affichés sont ceux de l'année active {new Date(anneeAcademique.date_debut).getFullYear()}/{new Date(anneeAcademique.date_fin).getFullYear()}
                </h5>
            }
            {!anneeAcademique &&
                <h5 className='mb-4'>Aucune année académique n'est active pour le moment </h5>
            }
            <div className='grid grid-cols-4 gap-3 md:grid-cols-1 lg:grid-cols-2'>
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
                <Select
                    listItem={filtersOptions.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                    labelSelect="Sélectionner l'option"
                    value={defaultSelectOptions ? defaultSelectOptions.nom : ""}
                    required={true}
                    onSelectChange={handleSelectOptionChange}
                />
                <Select
                    listItem={niveaux.map(e => ({ value: (typeof e === "number" ? e : 0), label: e.toString() }))}
                    labelSelect="Sélectionner le niveau "
                    value={defaultSelectNiveau.toString()}
                    required={true}
                    onSelectChange={handleSelectNiveauChange}
                />
            </div>

            <Button color="blue" name='Rechercher' type='submit' />
        </form>
    );
};

export default SearchForm;
