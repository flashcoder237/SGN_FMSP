import React, { useState, useEffect } from 'react';
import FiliereList from './FiliereList';
import Api ,{setAuthToken} from '../../app/services/api';  // Assurez-vous que cette importation correspond à votre configuration API
import { cilCaretRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom';
interface Departement {
    id: number;
    nom: string;
}

function DepartementList() {
    const [departements, setDepartements] = useState<Departement[]>([]);
    // const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);

    useEffect(() => {
        const fetchDepartements = async () => {
            try {
                const token = localStorage.getItem('authToken');
                // console.log('Using auth token:', token);
                // Remplacer 'http://localhost:8000/api/departements' par l'URL de votre API
                const response = await Api.get('/departements/', {
                   
                });
                if (response.status === 200) {
                    setDepartements(response.data); // Assurez-vous que la réponse est dans le format attendu
                    console.log(response.data )
                } else {
                    console.error('Failed to fetch departements');
                }
            } catch (error) {
                console.error('Error fetching departements:', error);
            }
        };

        fetchDepartements();
    }, []);

    // const handleDepartementClick = (departement: Departement) => {
    //     setSelectedDepartement(departement);
    // };

    return (
        <div className='container'>
            <h1 className='text-x'> <CIcon icon={cilCaretRight} width={15} className='inline-block' color='blue'></CIcon> <Link to="/" className='hover:underline'>Liste des Départements </Link>
            </h1>
            <ul className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4'>
                {departements.map(departement => (
                    <li className='bg-white shadow-blue-300 m-4 p-6  rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 pb-2 mt-4 hover:scale-105 cursor-pointer transition ease-in-out delay-10' key={departement.id} 
                    // onClick={() => handleDepartementClick(departement)}
                    >
                        <div className=''>
                        <h2 className='text-2xl font-semibold pb-2 text-dark-powder-blue flex-1 border-b-2 border-blue-700 mb-1'>{departement.nom}</h2> 
                        </div>
                        {/* {selectedDepartement && selectedDepartement.id === departement.id && ( */}
                        
                        <FiliereList departementId={departement.id} />
                    
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DepartementList;
