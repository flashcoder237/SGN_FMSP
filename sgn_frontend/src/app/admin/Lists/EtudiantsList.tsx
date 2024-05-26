import React, { useState, useEffect } from 'react';
import { ClasseFormData, StudentFormData } from '../dataTypes/data';
import { ChangeEvent } from 'react';
import { cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { cilPenAlt } from '@coreui/icons';
import { cilEyedropper } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { getEtudiantByClasse } from '../../services/etudiantService';
import { deleteEtudiant } from '../../services/etudiantService';
import SucessModal from '../../../Components/Organisms/SucessModal';
import FailedModal from '../../../Components/Organisms/FailedModal';
import SearchClasseForm from '../Forms/ClasseForm/ClasseForm';
import { getPdfEtudiantByClasse } from '../../services/etudiantService';


const EtudiantList: React.FC = () => {

  const handleFormSubmit = async (classe: ClasseFormData) => {
      try {
        if (classe) {
                const response = await getEtudiantByClasse(classe.id ? classe.id : -1);
                const mappedEtudiants = response.map((
                    (e:StudentFormData) => ({
                        id: e.id,
                        matricule: e.matricule,
                        classe: e.classe,
                        nom: e.nom,
                        prenom: e.prenom,
                        date_naissance: e.date_naissance,
                        photo: e.photo 
                    })
                ));
            setCurrentEtudiants(mappedEtudiants)
        
    }else{
        setCurrentEtudiants([])
        console.log("Aucune classe trouvée.");
    }
     
    }catch (error: any) {
      setCurrentEtudiants([]);
      console.error("Une erreur s'est produite:", error);
   } 

};



    const [currentEtudiants, setCurrentEtudiants] = useState<StudentFormData[]>([]);
    const [filterCurrentEtudiants, setFilterCurrentEtudiants] = useState<StudentFormData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchPageTerm, setSearchPageTerm] = useState<string>('');
    const [classe , setClasse] = useState<number>(-1);
    

    
    const [resultAdd, setResultDel] = useState(false);
    const [failDel, setFailDel] = useState(false);
    const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée"); 

    const handleGetPdfClick = async () => {
        try {
            const response = await getPdfEtudiantByClasse(52);
            
        } catch (error) {
            console.error('Erreur lors du téléchargement du modèle de template:', error);
        }
    };

    function handleResultChange(){
      setResultDel(false);
  }

      function handleResultFailChange(){
        setFailDel(false);
    }

    
    const handleDelete = async (id: number) => {
      try {
          await deleteEtudiant(id);
          setCurrentEtudiants(currentEtudiants.filter(etudiant => etudiant.id !== id));
          setResultDel(true)
      } catch (error) {
        setFailDel(true)
          console.error("Une erreur s'est produite lors de la suppression de l'étudiant:", error);
      }
  };
  
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        paginate(1)
        setSearchTerm(e.target.value);
    };

    const handleSearchPageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchPageTerm(e.target.value);
    };

    const handleChangePageSubmit = () => {
        if( Number(searchPageTerm) > 0 && Number(searchPageTerm) <= Math.ceil(CurrentSearchFilterEtudiants.length / itemsPerPage)){
            paginate(Number(searchPageTerm))
        }
    }



 

   

      useEffect(() => {
        const filteredEtudiants = currentEtudiants.filter((etudiant) =>
            etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentSearchFilterEtudiants(filteredEtudiants)
        setFilterCurrentEtudiants(filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem));
        setClasse(currentEtudiants[0] ? currentEtudiants[0].classe : -1)
    }, [searchTerm, currentEtudiants]);

   

      const itemsPerPage = 2;
      const [currentPage, setCurrentPage] = useState(1);
      const [CurrentFilterEtudiants, setCurrentFilterEtudiants] = useState<StudentFormData[]>([]);
      const [CurrentSearchFilterEtudiants, setCurrentSearchFilterEtudiants] = useState<StudentFormData[]>([]);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 
      useEffect(() => {
        const filteredEnseignants = currentEtudiants.filter((enseignant) =>
            enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterCurrentEtudiants(filteredEnseignants.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage]);
    
      const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        setFilterCurrentEtudiants(CurrentSearchFilterEtudiants.slice(indexOfFirstItem, indexOfLastItem))
      };

    return (
        <div>
  
        <SearchClasseForm onSubmit={handleFormSubmit} title='Visualiser les etudiants' subtitle=" Les etudiants affichés sont ceux de l'année active"/>
        { currentEtudiants.length !== 0 ?
            <div className="relative overflow-x-auto sm:rounded-lg">
            <div className="flex items-center justify-between flex-rows flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">Rechercher</label>
            <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input
                type="text"
                className="block p-2 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-slate-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Rechercher un etudiants"
                value={searchTerm}
                onChange={handleSearchChange}
            />

            </div>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className='font-medium text-sm'>
                <th scope="col" className="px-1 py-3">
                    Photo
                </th>
                <th scope="col" className="px-1 py-3">
                    Nom et Prenom
                </th>
                <th scope="col" className="px-1 py-3">
                    Matricule
                </th>
                <th scope="col" className="px-1 py-3">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
                {filterCurrentEtudiants && filterCurrentEtudiants   .map((etudiants) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={etudiants?.id}>
                    <td scope="row" className="px-6 py-4 font-bold text-xl text-white whitespace-nowrap dark:text-white">
                        <div className='flex flex-col justify-center text-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 overflow-hidden'>
                            <div className='rounded-full w-full overflow-hidden'>
                                {etudiants.photo ?
                                <img className='overflow-hidden w-full' src={typeof etudiants.photo === "string" ? etudiants.photo : ""} /> : <div className='font-bold text-xl'>{etudiants.nom.substr(0,1)} </div> }
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm font-semibold">{etudiants.nom} <br /> {etudiants.prenom} <br /> 
                    </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-base font-semibold">{etudiants.matricule}</div>
                    </td>
                    <td className="px-6 py-4">
                    <Link to={`/invoices/${etudiants.nom}`}>
                    <button className="p-2 mx-2 rounded text-white font-medium bg-blue-600 dark:text-blue-500 hover:underline">
                    <CIcon icon={cilEyedropper} width={15} />
                    </button>
                    </Link>
                    <button
                    onClick={() => handleDelete(typeof etudiants.id === "number" ? etudiants.id : -1)} 
                    className="p-2 mx-2 rounded text-white font-medium bg-red-600 dark:text-blue-500 hover:underline">
                    <CIcon icon={cilTrash} width={15} />
                    </button>
                    <Link to={`/invoices/edit/${etudiants.nom}`}>
                    <button className="p-2 mx-2 rounded text-white font-medium bg-slate-600 dark:text-blue-500 hover:underline">
                    <CIcon icon={cilPenAlt} width={15} />
                    </button>
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            <nav className="flex items-center flex-rows flex-wrap md:flex-row justify-between pt-4 border-b-2 pb-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Elements <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem}-{Math.min(indexOfLastItem, CurrentSearchFilterEtudiants.length)}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{CurrentSearchFilterEtudiants.length}</span>
            </span>
            <div>
                <div>
                <span> Aller à la page : <input
                    type="number"
                    className="inline-block p-2  ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-20 bg-slate-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={String(currentPage)}
                    value={searchPageTerm}
                    onChange={handleSearchPageChange}
                /></span>
                <div onClick={() => handleChangePageSubmit()} className='inline-block w-20 p-2 h-full mx-2 rounded-md text-sm ps-2 text-white font-medium bg-green-600 dark:text-blue-500 justify-center items-center text-center hover:bg-green-700 hover:scale-110 active:bg-green-800 transition-all ease-linear duration-150 cursor-pointer'>
                    <button type='button' className='self-center h-full w-full'>
                        ok
                    </button>
                </div>
            </div>
            <div className={`text-sm italic text-red-700 ${(searchPageTerm === '' ||  Number(searchPageTerm) > 0 && Number(searchPageTerm) <= Math.ceil(CurrentSearchFilterEtudiants.length / itemsPerPage) ? 'hidden' : 'block')}`}>Veuillez entrer un nombre compris entre {"[0" + " et " + Math.ceil(CurrentSearchFilterEtudiants.length / itemsPerPage)+"]"} </div>
            </div>

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
                <li>
                <a
                    href="#"
                    className={'flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white bg-blue-50 text-blue-600'}
                    >
                    {currentPage + "/" + Math.ceil(CurrentSearchFilterEtudiants.length / itemsPerPage) }
                    </a> 
                </li>
                {/* {Array.from({ length: Math.ceil(CurrentSearchFilterEtudiants.length / itemsPerPage) }).map((_, index) => (
                <li key={index}>
                    <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
                    onClick={() => paginate(index + 1)}
                    >
                    {index + 1}
                    </a>
                </li>
                ))} */}
                <li>
                <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === Math.ceil(currentEtudiants.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => {
                    if(currentPage !== Math.ceil(currentEtudiants.length / itemsPerPage))
                    paginate(currentPage + 1)
                    }}
                >
                    Suivant
                </a>
                </li>
            </ul>
            </nav>
            <div 
                onClick={handleGetPdfClick}
                className='mt-4 mb-4 ml-4 px-4 w-60 py-4 font-medium relative rounded-lg text-white transition-all ease-in-out duration-150 bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer hover:scale-110'>
                Imprimer la liste des etudiants de cette classe
            </div>
        </div> : <div> Veuiller remplir les champs ou Aucun etudiants n'existe pour les champs défini </div> 
        }
        <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
        <SucessModal title='Etudiant supprimé avec succès!' onResultChange={handleResultChange} message='cette etudiant est désormais supprimé' />
      </div>
      <div className={`${failDel ? 'block':'hidden'}`}>
       <FailedModal title="Erreur lors de la suppression de l'étudiant!" onResultChange={handleResultFailChange} message={failedMessage} />
       </div>
        </div>
    );
};

export default EtudiantList;
