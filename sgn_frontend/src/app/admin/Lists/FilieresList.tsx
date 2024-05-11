import React, { useEffect, useState } from 'react';
import { fetchFilieres } from '../../services/filiereService';
import { Link } from 'react-router-dom';
import { FiliereFormData, DepartmentFormData } from '../dataTypes/data';
import { ChangeEvent } from 'react';
import Select from '../../../Components/Atoms/Select';
import { fetchDepartments } from '../../services/departmentService';
import { cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { cilPenAlt } from '@coreui/icons';
import { cilEyedropper } from '@coreui/icons';

const FiliereList = () => {
    const [filieres, setFilieres] = useState<FiliereFormData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentFilieres, setCurrentFilieres] = useState<FiliereFormData[]>([]);
    const [filterCurrentFilieres, setFilterCurrentFilieres] = useState<FiliereFormData[]>([]);
    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [defaultSelectDepartements, setDefaultSelectDepartements] = useState<string>('');

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectChange = (event: string) => {
        const selectedNom = event;
        const departement = departements.filter(d => d.nom === selectedNom);
        setDefaultSelectDepartements(departement[0].nom)
        if (departement) {
            setCurrentFilieres(filieres.filter(d => d.departement === departement[0].id));
        } else {
            console.error('Aucune filières pour ce département pour le moment');
        }
    };

    useEffect(() => {
        const filteredFilieres = currentFilieres.filter((filiere) =>
            filiere.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterCurrentFilieres(filteredFilieres);
    }, [searchTerm, currentFilieres]);

    useEffect(() => {
        const loadFilieres = async () => {
            try {
                const response = await fetchFilieres();
                setFilieres(response.data); // Assuming fetchFilieres returns the data correctly typed
            } catch (error) {
                console.error('Error loading Filieres:', error);
            }
        };
        loadFilieres();
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const filieresResponse = await fetchFilieres();
                const departementsResponse = await fetchDepartments();
    
                const mappedDepartments = departementsResponse.data.map((dept:DepartmentFormData) => ({
                    id: dept.id,
                    nom: dept.nom,
                    description : dept.description
                }));
    
                setDepartements(mappedDepartments);
                setFilieres(filieresResponse.data);
                setCurrentFilieres(filieresResponse.data); 
    
                if (mappedDepartments.length > 0) {
                    setDefaultSelectDepartements(mappedDepartments[0].nom);
                    setCurrentFilieres(filieresResponse.data.filter((f:FiliereFormData) => f.departement === mappedDepartments[0].id));
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };
    
        loadInitialData();
    }, []);

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
        <div className="py-4 flex flex-col justify-center">     
            {/* <div className="text-base font-semibold">Veuillez selectionner un département </div> */}
            <Select 
                listItem={departements.map(e => ({value : (typeof e.id === "number" ?  e.id: 0), label: e.nom}))}
                labelSelect="Veuillez selectionner un département"
                value={defaultSelectDepartements}
                required={true}
                onSelectChange={handleSelectChange}
            />
        </div>
        
        { currentFilieres.length !== 0 ?
            <div className="relative overflow-x-auto sm:rounded-lg">
            <div className="flex items-center justify-between flex-rows flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input
                type="text"
                className="block p-2 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-slate-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Rechercher une filière"
                value={searchTerm}
                onChange={handleSearchChange}
            />


            </div>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="px-1 py-3">
                    Code
                </th>
                <th scope="col" className="px-1 py-3">
                    Filière
                </th>
                <th scope="col" className="px-1 py-3">
                    Durée
                </th>
                <th scope="col" className="px-1 py-3">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
                {filterCurrentFilieres && filterCurrentFilieres.map((filiere) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {/* ... (render filieres data) */}
                    
                <th scope="row" className="px-6 py-4 font-bold text-xl text-white whitespace-nowrap dark:text-white">
                    <div className='flex flex-col justify-center text-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-slate-500'>
                        <div className='text-sm'>
                        {filiere.code}
                        </div>
                    </div>
                </th>
                <td className="px-6 py-4">
                    <div className="text-base font-semibold">{filiere.nom}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-base font-semibold">{filiere.duree} ans</div>
                </td>
                <td className="px-6 py-4">
                <Link to={`/invoices/${filiere.nom}`}>
                <button className="p-2 mx-2 rounded text-white font-medium bg-blue-600 dark:text-blue-500 hover:underline">
                <CIcon icon={cilEyedropper} width={15} />
                </button>
                </Link>
                <button
                // onClick={() => handleDelete(filiere.nom)} 
                className="p-2 mx-2 rounded text-white font-medium bg-red-600 dark:text-blue-500 hover:underline">
                   <CIcon icon={cilTrash} width={15} />
                </button>
                <Link to={`/invoices/edit/${filiere.nom}`}>
                <button className="p-2 mx-2 rounded text-white font-medium bg-slate-600 dark:text-blue-500 hover:underline">
                <CIcon icon={cilPenAlt} width={15} />
                </button>
                </Link>
                </td>
                </tr>
                ))}
            </tbody>
            </table>
            <nav className="flex items-center flex-rows flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Page <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, currentFilieres.length)-1}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{currentFilieres.length - 1}</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'cursor-not-allowed opacity-50 z-0' : ''}`}
                    onClick={() => {
                    if(currentPage!==1)
                    paginate(currentPage - 1)}}
                >
                    Précédant
                </a>
                </li>
                {Array.from({ length: Math.ceil(currentFilieres.length / itemsPerPage) }).map((_, index) => (
                <li key={index}>
                    <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
                    onClick={() => paginate(index + 1)}
                    >
                    {index + 1}
                    </a>
                </li>
                ))}
                <li>
                <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === Math.ceil(currentFilieres.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => {
                    if(currentPage !== Math.ceil(currentFilieres.length / itemsPerPage))
                    paginate(currentPage + 1)
                    }}
                >
                    Suivant
                </a>
                </li>
            </ul>
            </nav>
        </div> : <div> Aucune filière n'exite pour le département selectionné </div> 
        }
    </div>
      
  );
};

export default FiliereList;
