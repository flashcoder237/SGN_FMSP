import React, { useEffect, useState } from 'react';
import EnseignantsList from './Lists/EnseignantsList';
import OptionForm from './Forms/OptionForm';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCaretRight } from '@coreui/icons';
import DepartementList from './Lists/DepartementsList';
import EtudiantList from './Lists/EtudiantsList';
import EtudiantAddFormOrCsv from './EtudiantAddFormOrCsv';
import EnseignantForm from './Forms/EnseignantForm';

const GU_DynamicFormComponent: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string>('form');
    const [selectedForm, setSelectedForm] = useState<string>('ajout_etudiant');
    const [selectedView, setSelectedView] = useState<string>('view_etudiants');


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
            <h1 className='text-base font-medium text-gray-500 mb-5'> 
                <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180 inline-block mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                </svg> 
                <Link to="/administration" className='hover:underline'>Administration </Link>
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180 inline-block mr-2 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                    </svg> 
                <Link to="/administration/depart_et_fil" className='hover:underline text-blue-600'>Gérer les utilisateurs </Link>
            </h1>
            <div className='flex flex-row'>
                <div className='text-xl font-medium flex-auto w-16 h-screen bg-blue-600 text-white p-10 rounded-lg'>
                    <div className='flex flex-col justify-items-start'>
                    <div className='text-xl font-bold cursor-pointer'>
                        Gerer les Etudiants
                        <ul className='text-base font-normal pl-4 pb-2 mb-4 border-b-2 border-blue-800'>
                            <li className={`${verify('form', 'ajout_etudiant') ? 'flex flex-row text-gray-50 bg-blue-800 p-2 rounded-lg font-semibold mt-2 transition-all ease-linear duration-400':'none transition-all ease-linear duration-400'}`} onClick={() => handleFormSelection('ajout_etudiant')}>
                                    <span className={`${verify('form', 'ajout_etudiant') ? 'flex flex-col self-center relative h-3 w-3 mx-2':'relative h-3 w-3 hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-50 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-100"></span>
                                    </span>
                                    Ajouter des étudiants
                            </li>
                            <li className={`${verify_view('view', 'view_etudiants') ? 'flex flex-row text-gray-50 bg-blue-800 p-2 rounded-lg font-semibold mt-2 transition-all ease-linear duration-400':'none transition-all ease-linear duration-400'}`} onClick={() => handleViewSelection('view_etudiants')}>
                                    <span className={`${verify_view('view', 'view_etudiants') ? 'flex flex-col self-center relative h-3 w-3 mx-2':'relative h-3 w-3 hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-50 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-100"></span>
                                    </span>
                                Supprimer ou voir la liste des étudiants
                            </li>
                        </ul>
                    </div>
                    <div className='cursor-pointer'>
                        Gerer les Enseignants
                        <ul className='text-base font-normal pl-4 pb-2 mb-4 border-b-2 border-blue-800'>
                        <li className={`${verify('form', 'ajout_enseignant') ? 'flex flex-row text-gray-50 bg-blue-800 p-2 rounded-lg font-semibold mt-2 transition-all ease-linear duration-400':'none transition-all ease-linear duration-400'}`} onClick={() => handleFormSelection('ajout_enseignant')}>
                                    <span className={`${verify('form', 'ajout_enseignant') ? 'flex flex-col self-center relative h-3 w-3 mx-2':'relative h-3 w-3 hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-50 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-100"></span>
                                    </span>
                                    Ajouter des enseignants
                                </li>
                            <li className={`${verify_view('view', 'view_enseignant') ? 'flex flex-row text-gray-50 bg-blue-800 p-2 rounded-lg font-semibold mt-2 transition-all ease-linear duration-400 max-w-[780px]':'none transition-all ease-linear duration-400'}`} onClick={() => handleViewSelection('view_enseignant')}>
                                    <span className={`${verify_view('view', 'view_enseignant') ? 'flex flex-col self-center relative h-3 w-3 mx-2':'relative h-3 w-3 hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-50 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-100"></span>
                                    </span>
                                    Supprimer ou voir la liste des Enseignants</li>
                        </ul>
                    </div>
                  
                    </div>
                </div>

            <div className='flex-auto p-1 dark:bg-gray-900'>
                <div className={`${(selectedType === "view")? `ml-10 items-center bg-gray-50 rounded shadow-lg  shadow-blue-300 justify-center mx-auto p-10 `:`items-center bg-gray-50 w-2/3 rounded shadow-lg  shadow-blue-300 justify-center mx-auto p-10`}`}>
                    {(selectedType === "form") && (
                        (selectedForm === 'ajout_etudiant' && <EtudiantAddFormOrCsv />) ||
                        (selectedForm === 'ajout_enseignant' && <EnseignantForm />) 
                        //|| (selectedForm === 'ajout_classe' && <OptionForm />)
                    )}
                    
                    {(selectedType === "view") && (
                        (selectedView === 'view_etudiants' && <EtudiantList />) ||
                        (selectedView === 'view_enseignant' && <EnseignantsList />) 
                        //|| (selectedForm === 'level' && <OptionForm />)
                    )}
                </div>

            </div>
            </div>
        </div>
    );
};

export default GU_DynamicFormComponent;
