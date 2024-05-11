import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../services/departmentService';
import { Link } from 'react-router-dom';
import { DepartmentFormData } from '../dataTypes/data';
import { ChangeEvent } from 'react';
import { cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { cilPenAlt } from '@coreui/icons';

const DepartementList = () => {
    const [departements, setDepartements] = useState<DepartmentFormData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentDepartements, setCurrentDepartements] = useState<DepartmentFormData[]>([]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const filteredDepartements = departements.filter((departement) =>
            departement.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentDepartements(filteredDepartements);
    }, [searchTerm, departements]);

    useEffect(() => {
        const loadDepartements = async () => {
            try {
                const response = await fetchDepartments();
                setDepartements(response.data); // Assuming fetchDepartments returns the data correctly typed
            } catch (error) {
                console.error('Error loading Departements:', error);
            }
        };
        loadDepartements();
    }, []);

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (

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
              placeholder="Rechercher un département"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            
        </div>
    </div>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-1 py-3 font-semibold text-sm">
                  Departement
                </th>
                <th scope="col" className="px-1 py-3 font-semibold text-sm">
                  Nom
                </th>
                <th scope="col" className="px-1 py-3 font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDepartements && currentDepartements.map((departement) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  {/* ... (render departements data) */}
                  
                <th scope="row" className="w-5 px-6 py-4 font-bold text-xl text-white whitespace-nowrap dark:text-white">
                    <div className='flex flex-col justify-center text-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-slate-500'>
                        <div className=''>
                        {departement.nom[0]}
                        </div>
                    </div>
                </th>
                <td className="px-1 py-3 max-w-40 min-w-32">
                
                        <div className="text-base font-semibold">{departement.nom}</div>
                        <div className='italic text-md text-slate-500'>{departement.description.substr(0,150)}...</div>
                
                </td>
                  <td className="px-1 py-3">
                  {/* <Link to={`/invoices/${departement.nom}`}>
                    <button className="p-2 mx-2 rounded text-white font-medium bg-blue-600 dark:text-blue-500 hover:underline">
                      View
                    </button>
                  </Link> */}
                    <button
                    // onClick={() => handleDelete(departement.nom)} 
                    className="p-2 mx-2 rounded text-white font-medium bg-red-600 dark:text-blue-500 hover:underline">
                      <CIcon icon={cilTrash} width={15} />
                    </button>
                    <Link to={`/invoices/edit/${departement.nom}`}>
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
              Page <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, currentDepartements.length)}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{currentDepartements.length}</span>
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
              {Array.from({ length: Math.ceil(currentDepartements.length / itemsPerPage) }).map((_, index) => (
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
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === Math.ceil(currentDepartements.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    if(currentPage !== Math.ceil(currentDepartements.length / itemsPerPage))
                    paginate(currentPage + 1)
                  }}
                >
                  Suivant
                </a>
              </li>
            </ul>
          </nav>
        </div>
      
  );
};

export default DepartementList;
