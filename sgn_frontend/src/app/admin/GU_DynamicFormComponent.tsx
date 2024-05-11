import React, { useEffect, useState } from 'react';
import EtudiantForm from './Forms/EtudiantForm';
import FiliereForm from './Forms/FiliereForm';
import LevelForm from './Forms/LevelForm';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCaretRight } from '@coreui/icons';
import DepartementList from './Lists/DepartementsList';
import FiliereList from './Lists/FilieresList';

const GU_DynamicFormComponent: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string>('form');
    const [selectedForm, setSelectedForm] = useState<string>('ajout_etudiant');
    const [selectedView, setSelectedView] = useState<string>('view_departement');


    function verify(type: string, form: string){
        return selectedType === type && selectedForm === form;
    }

    function verify_view(type: string, view: string){
        return selectedType === type && selectedView === view;
    }

    const handleFormSelection = (form: string) => {
        setSelectedType('form');
        setSelectedForm(form);
    };

    const handleViewSelection = (view: string) => {
        setSelectedType('view');
        setSelectedView(view);
    };

    return (
        <div className=''>
            <h1 className='text-x mb-5'> 
                <CIcon icon={cilCaretRight} width={15} className='inline-block' color='black'></CIcon> 
                <Link to="/administration" className='hover:underline'>Administration </Link>
                <CIcon icon={cilCaretRight} width={15} className='inline-block' color='blue'></CIcon> 
                <Link to="/administration/depart_et_fil" className='hover:underline italic'>Gérer les utilisateurs </Link>
            </h1>
            <div className='flex flex-row'>
                <div className='font-medium flex-auto w-20 h-screen bg-blue-50 p-10 rounded-lg'>
                    <div className='flex flex-col justify-items-start'>
                    <div className='cursor-pointer'>
                        Gerer les Etudiants
                        <ul className='text-sm italic font-light pl-4 pb-2 mb-2 border-b-2'>
                            <li className={`${verify('form', 'ajout_etudiant') ? 'flex flex-row text-blue-600':'none'}`} onClick={() => handleFormSelection('ajout_etudiant')}>
                                    <CIcon className={`${verify('form', 'ajout_etudiant') ? 'block':'hidden'}`} icon={cilCaretRight} width={15} color='blue' />
                                    Ajouter des étudiants
                            </li>
                            <li className={`${verify_view('view', 'view_departement') ? 'flex flex-row text-blue-600':'none'}`} onClick={() => handleViewSelection('view_departement')}>
                                    <CIcon className={`${verify_view('view', 'view_departement') ? 'block':'hidden'}`} icon={cilCaretRight} width={15} color='blue' />
                                Supprimer ou voir la liste des departements
                            </li>
                        </ul>
                    </div>
                    <div className='cursor-pointer'>
                        Gerer les Etudiants
                        <ul className='text-sm italic font-light pl-4 pb-2 mb-2 border-b-2'>
                        <li className={`${verify('form', 'ajout_filière') ? 'flex flex-row text-blue-600':'none'}`} onClick={() => handleFormSelection('ajout_filière')}>
                                    <CIcon className={`${verify('form', 'ajout_filière') ? 'block':'hidden'}`} icon={cilCaretRight} width={15} color='blue' />
                                    Ajouter des étudiants
                                </li>
                            <li className={`${verify_view('view', 'view_filière') ? 'flex flex-row text-blue-600':'none'}`} onClick={() => handleViewSelection('view_filière')}>
                                    <CIcon className={`${verify_view('view', 'view_filière') ? 'block':'hidden'}`} icon={cilCaretRight} width={15} color='blue'/>
                                    Supprimer ou voir la liste des filières</li>
                        </ul>
                    </div>
                    <div className='cursor-pointer'>
                        Gerer les niveaux
                        <ul className='text-sm italic font-light pl-4 pb-2 mb-2 border-b-2'>
                        <li className={`${verify('form', 'ajout_classe') ? 'flex flex-row text-blue-600':'none'}`} onClick={() => handleFormSelection('ajout_classe')}>
                                    <CIcon className={`${verify('form', 'ajout_classe') ? 'block':'hidden'}`} icon={cilCaretRight} width={15} color='blue' />
                                    Ajouter un niveau
                                </li>
                            <li>Supprimer ou voir la liste des classes</li>
                        </ul>
                    </div>
                    </div>
                </div>

            <div className='flex-auto p-1 dark:bg-gray-900'>
                <div className={`${(selectedType === "view")? `ml-10 items-center bg-gray-50 rounded shadow-lg  shadow-blue-300 justify-center mx-auto p-10`:`items-center bg-gray-50 w-2/3 rounded shadow-lg  shadow-blue-300 justify-center mx-auto p-10`}`}>
                    {(selectedType === "form") && (
                        (selectedForm === 'ajout_etudiant' && <EtudiantForm />) ||
                        (selectedForm === 'ajout_filière' && <FiliereForm />) ||
                        (selectedForm === 'ajout_classe' && <LevelForm />)
                    )}
                    
                    {(selectedType === "view") && (
                        (selectedView === 'view_departement' && <DepartementList />) ||
                        (selectedView === 'view_filière' && <FiliereList />) ||
                        (selectedForm === 'level' && <LevelForm />)
                    )}
                </div>

            </div>
            </div>
        </div>
    );
};

export default GU_DynamicFormComponent;
