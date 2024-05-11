import React, { useState, useEffect } from 'react';
import Api from '../../app/services/api';
import ItemCards from '../Atoms/ItemCards';

interface Filiere {
    id: number;
    code: string;
    nom: string;
    departement: number;
}

interface Props {
    departementId: number; // Définir explicitement le type de departementId
}

function FiliereList({ departementId }: Props) {
    const [filieres, setFilieres] = useState<Filiere[]>([]);

    useEffect(() => {
        const fetchFilieres = async () => {
            try {
                const token = localStorage.getItem('authToken');
                // console.log('Using auth token:', token);
                // Remplacer 'http://localhost:8000/api/departements' par l'URL de votre API
                const response = await Api.get('/filieres/', {
                   
                });
                if (response.status === 200) {
                    const filteredData = response.data.filter((filiere: Filiere) => filiere.departement === departementId);
                    setFilieres(filteredData);
                    console.log(response.data )
                } else {
                    console.error('Failed to fetch filieres');
                }
            } catch (error) {
                console.error('Error fetching filieres:', error);
            }
        };

        fetchFilieres();
    }, [departementId]);


    return (
        <div>
        { filieres.length > 0 ? (
            <div className='mt-3'>
                <h2 className='text-xl font-medium text-blue-950'>Filières du Département</h2>
            <ul className='mt-2 grid grid-cols-2 gap-2'>
                {filieres.map(filiere => (
                    <li className='inline-block' key={filiere.id}>
                        <ItemCards name={filiere.code + ": " + filiere.nom.substr(0,9) + "..."} />
                    </li>
                ))}
            </ul>
            </div>
        ) : (
            <div>
                <h2 className='italic text-red-400'>Aucune filières n'est disponible pour ce departement</h2>
            </div>
        )}
       
        </div>
    );
}

export default FiliereList;
