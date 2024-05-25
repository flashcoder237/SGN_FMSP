import React, { useState, useEffect, ChangeEvent } from 'react';
import { getAllEvaluationsByUc, getAllNotesByEvaluation, getAllUcByUe } from '../../services/classeService';
import { ClasseFormData, EvaluationFormData } from '../dataTypes/data';
import SearchClasseForm from '../Forms/ClasseForm/ClasseForm';
import { NoteFormData } from '../dataTypes/data';
import { getAllUeByClasse } from '../../services/classeService';
import { UE_DataForm } from '../dataTypes/data';
import { cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { EC_DataForm } from '../dataTypes/data';
import { cilPenAlt } from '@coreui/icons';
import { cilEyedropper } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { cilTrash } from '@coreui/icons';
import { deleteNote } from '../../services/classeService';
import { updateNote } from '../../services/classeService';





const NoteList: React.FC = () => {

const [unitesEnseignement, setUnitesEnseignement] = useState<UE_DataForm[]>([]);
const [selectedUniteEnseignement, setSelectedUniteEnseignement] = useState<UE_DataForm>();
const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationFormData>();
const [selectedElementConstitutif, setSelectedElementConstitutif] = useState<EC_DataForm>();
const [haveSearch, setHaveSearch] = useState<boolean>(false)
const [currentStep, setCurrentStep] = useState(1)
const [elements_constitutifs, setElements_constitutifs] = useState<EC_DataForm[]>([]);
const [classe, setClasse] = useState<ClasseFormData>()
const [evaluations, setEvaluations] = useState<EvaluationFormData[]>([]);
const [notes, setNotes] = useState<NoteFormData[]>([]);
const [filterCurrentNotes, setFilterCurrentNotes] = useState<NoteFormData[]>([]);
const [searchTerm, setSearchTerm] = useState<string>('');
const [currentNotes, setCurrentNotes] = useState<NoteFormData[]>([]);
const style = 'mx-2 px-4 w-40 py-4 font-medium relative rounded-lg text-white transition-all ease-in-out duration-150 bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer hover:scale-110'
const style2 = 'mx-2 px-4 py-4 w-40 font-medium relative rounded-lg text-white transition-all ease-in-out duration-150 bg-gradient-to-r from-green-900 to-green-500 cursor-pointer hover:scale-110'
const style2_1 = 'mx-2 px-4 py-4 w-40 font-medium relative rounded-lg text-white transition-all ease-in-out duration-150 bg-gradient-to-r from-gray-900 to-gray-500 cursor-pointer hover:scale-110'
const style3 = "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 cursor-not-allowed"
const style4 = "inline-block p-4 text-gray-400 rounded-t-lg dark:text-gray-500 cursor-pointer"
const style5 = 'mx-2 px-2 font-medium relative rounded-lg text-white transition-all ease-in-out duration-150 bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer'
const style6 = 'mx-2 px-2 font-light italic relative rounded-lg text-gray-600 transition-all ease-in-out duration-150 bg-gray-200 cursor-pointer'


const [resultAdd, setResultDel] = useState(false);
const [failDel, setFailDel] = useState(false);
const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée"); 
const [isChecked, setIsChecked] = useState(false); // Initial state set to true (checked)


const handleToggle = () => {
  setIsChecked(!isChecked);
};



const handleInputChange = (e: ChangeEvent<HTMLInputElement>, studentId: number) => {
    const { value } = e.target;
    setNotes(prevNotes => prevNotes.map(note => 
        note.etudiant.id === studentId ? { ...note, note: parseFloat(value) } : note
    ));
};

const handleInputNoteSubmit = async (studentId: number) => {
    const noteToUpdate = notes.find(note => note.etudiant.id === studentId);
    if (noteToUpdate) {
        try {
            await updateNote(noteToUpdate.id ? noteToUpdate.id : -1 ,{
                "evaluation" : noteToUpdate.evaluation.id ? noteToUpdate.evaluation.id : -1,
                "note" : noteToUpdate.note ? noteToUpdate.note : -1,
                "session" : noteToUpdate.session.id ? noteToUpdate.session.id : -1,
                "etudiant" : noteToUpdate.etudiant.id ? noteToUpdate.etudiant.id : -1,
            }); 
            setNotes(prevNotes => prevNotes.map(note => 
                note.etudiant.id === studentId ? { ...note, note: noteToUpdate.note, saisie : true } : note
            ));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la note:", error);
        }
    }
};


const handleSelectUniteEnseignement = (UE : UE_DataForm) => {
    setSelectedUniteEnseignement(UE);
}

const sortNotes = (notes: NoteFormData[]) => {
    return notes.sort((a, b) => {
        if (a.saisie === b.saisie) {
            return a.etudiant.nom.localeCompare(b.etudiant.nom);
        }
        return a.saisie ? 1 : -1; 
    });
};

const handleSelectEvaluation = async (evaluation : EvaluationFormData) => {
    setNotes([])
    setSelectedEvaluation(evaluation);
    try{
        const getNotes = await getAllNotesByEvaluation(evaluation.id ? evaluation.id : -1)
        if(getNotes.data.length > 0){
            const mappedNotes = getNotes.data.map((note : NoteFormData) =>({
                id : note.id,
                etudiant : note.etudiant,
                evaluation : note.evaluation,
                note : note.note,
                saisie : note.saisie,
                session : note.session

            }))
            const sortedNotes = sortNotes(mappedNotes);
            setNotes(sortedNotes)
            console.log(mappedNotes)
        } else {
            setNotes([]);
        }
    }catch(error: any){

    }
}

const handleSelectElementConstitutif = async (EC : EC_DataForm) => {
    setSelectedElementConstitutif(EC);
    setNotes([])
    setSelectedEvaluation(undefined);
    try{
        if(classe){
            const getEvaluations = await getAllEvaluationsByUc(EC.id ? EC.id : -1, classe.id ? classe.id : -1);
            if(getEvaluations.data.length > 0){
                setEvaluations(getEvaluations.data);
            }else{
                setEvaluations([]);
            }
        }

    }catch(error: any){
        
    }
}

const handleNextClick = async () => {
    try{
        if(selectedUniteEnseignement){
            const ECs = await getAllUcByUe(selectedUniteEnseignement.id ? selectedUniteEnseignement.id : -1)
            const mappedEcs = ECs.data.map((data : EC_DataForm) => 
                ({
                    id: data.id,
                    code: data.code,
                    nom: data.nom,
                    credits: data.credits,
                    ue : data.ue,
                })
            )
            setElements_constitutifs(mappedEcs);
            console.log(mappedEcs)
            if(ECs.data.length > 0){
                setCurrentStep(2);
            }
        }
    }catch(err){

    }
    setCurrentStep(2);
}

const handlebackClick = () => {
    setEvaluations([]);
    setCurrentStep(1);
}
  const handleFormSubmit = async (classe: ClasseFormData) => {
      try {
        if (classe) {
                setClasse(classe)
                const response = await getAllUeByClasse(classe.id ? classe.id : -1);
                const mappedUnitesEnseignement = response.data.map((
                    (e:UE_DataForm) => ({
                        id: e.id,
                        code: e.code,
                        nom: e.nom,
                        classe: e.classe,
                    })
                ));  
        if(mappedUnitesEnseignement){
            setUnitesEnseignement(mappedUnitesEnseignement);
            setHaveSearch(true)
        }else{
            setSelectedUniteEnseignement(undefined)
        }
        
    }else{
        setSelectedUniteEnseignement(undefined)
        console.log("Aucune classe trouvée.");
    }
     
    }catch (error: any) {
     
      console.error("Une erreur s'est produite:", error);
   } 

};

const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
};

  useEffect(() => {
    const filteredNotes = notes.filter((note) =>
        note.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterCurrentNotes(sortNotes(filteredNotes));
}, [searchTerm, notes]);

const handleDelete = async (id: number) => {
    try {
        await deleteNote(id);
        setNotes(notes.filter(note => note.etudiant.id !== id));
        setResultDel(true)
    } catch (error) {
      setFailDel(true)
        console.error("Une erreur s'est produite lors de la suppression de l'étudiant:", error);
    }
};
const itemsPerPage = 2; 
const [currentPage, setCurrentPage] = useState(1);
const [indexOfLastItem, setIndexOfLastItem] = useState(0);
const [indexOfFirstItem, setIndexOfFirstItem] = useState(2);

 
useEffect(() => {
   setCurrentNotes(filterCurrentNotes.slice(indexOfFirstItem, indexOfLastItem))
}, [filterCurrentNotes, indexOfFirstItem]);

useEffect(() => {
    setIndexOfFirstItem( indexOfLastItem - itemsPerPage);
 }, [indexOfLastItem]);

 useEffect(() => {
    setIndexOfLastItem(currentPage * itemsPerPage);
 }, [currentPage]);

  const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
  }

   
    return (
        <div>
           {currentStep === 1 ? 
                <div>
                     <SearchClasseForm onSubmit={handleFormSubmit} title='Selectionner la classe' subtitle="Les notes qui seront affichées sont celles de l'année active"/>
            {unitesEnseignement.length > 0 && (
                <div className='font-medium py-3'>
                    Veuillez selectionner une unité d'enseignement
                </div>
            )}
            <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm font-medium text-center text-gray-500 dark:text-gray-400 pb-4">
                    {unitesEnseignement.length > 0 ? unitesEnseignement.map(UE =>(
                        <div className={`${selectedUniteEnseignement?.nom === UE.nom ? style5+" my-2 py-2" : style6+"  my-2 py-2"}`} onClick={() => handleSelectUniteEnseignement(UE)}>
                            {(UE.code + ": " + UE.nom).substr(0,15)+"..."} 
                        </div>
                    )) : haveSearch ? <div>
                    Aucune unites enseignement n'est disponible pour cette classe
                </div> : <div>Veuillez rechercher une classe</div> }  
            </div>
            {selectedUniteEnseignement && unitesEnseignement.length > 0 && (
                <div onClick={() => handleNextClick()}>
                    <button type='button' className="w-full p-2 mx-2 rounded-md text-sm px-4 text-white font-medium bg-green-600 dark:text-blue-500">
                        suivant
                    </button>
                </div>
            )}

                </div> : 
                <div>
                    <div 
                        onClick={() => handlebackClick()}
                        className='bg-gray-100 p-4 cursor-pointer font-medium text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-all duration-200'>
                        <CIcon icon={cilArrowLeft} width={15} className='inline-block mr-2'/> Sélectionner la classe et l'EU </div>
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px">

                        {elements_constitutifs.length > 0 && elements_constitutifs.map(EC =>(
                            <li className={`${selectedElementConstitutif?.nom === EC.nom ? style3 : style4}`} onClick={() => handleSelectElementConstitutif(EC)} >
                               {EC.code}
                            </li>
                        ))}
                        </ul>
                     </div>
                     <div>
                        {elements_constitutifs.length <= 0 &&
                         <div className="text-sm font font-medium my-4"> Aucun EC n'est disponible pour cette UE</div>
                        }
                        {elements_constitutifs.length>0   && evaluations.length > 0 && 
                            <div className='my-4'>
                              <div className='flex flex-row justify-between'>
                                <div className='flex-1 font-medium text-gray-600 bg-slate-50 rounded p-4'>Veuillez selectionner un élément constitutif et choisir un mode</div>
                                <label className="inline-flex cursor-pointer items-end justify-between">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={isChecked} 
                                        onChange={handleToggle} 
                                    />
                                    <span className="self-end ms-3 text-lg font-medium text-blue-700 italic dark:text-gray-300">
                                        {isChecked ? 'Mode Ecriture' : 'Mode Lecture'}
                                    </span>
                                    <div className="ml-2 relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                                <div className='flex flex-row my-4 font-medium'>
                                {evaluations.map((e: EvaluationFormData) =>(
                                    <div className={`${selectedEvaluation?.id === e.id ? style5 : style6}`} onClick={() => handleSelectEvaluation(e)}>
                                    {e.type_evaluation + " du " + e.date }
                                    </div>
                                 ))}
                            </div>
                            </div>
                        }
                     </div>
                    
                        <div className='min-w-full'>
                            {elements_constitutifs.length > 0 && selectedEvaluation &&  notes.length !== 0 ?
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
                                <tr className='font-bold text-sm'>
                                <th scope="col" className="px-1 py-3">
                                    Photo
                                </th>
                                <th scope="col" className="px-1 py-3">
                                    Nom et Prenom
                                </th>
                                <th scope="col" className="px-1 py-3">
                                    Matricule
                                </th>
                                {!isChecked  &&
                                <th scope="col" className="px-1 py-3">
                                    Note
                                </th>
                                }
                                <th scope="col" className="px-1 py-3">
                                    Action
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNotes && currentNotes.map((note, index) => (
                                    <tr className={`${!note.saisie ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 cursor-pointer dark:hover:bg-gray-600 active:bg-blue-100 w-full " : (isChecked &&  "opacity-50 pointer-events-none cursor-not-allowed bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 active:bg-blue-100 w-full ")}`}>
                                        {/* ... (render Etudiants data) */}
                                    <th scope="row" className="px-6 py-4 font-bold text-xl text-white whitespace-nowrap dark:text-white">
                                        <div className='flex flex-col justify-center text-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 overflow-hidden'>
                                            <div className='rounded-full w-full overflow-hidden'>
                                                {note.etudiant.photo ? 
                                                <img className='overflow-hidden w-full' src={typeof note.etudiant.photo === "string" ? note.etudiant.photo : ""} />
                                            : <div>
                                                {note.etudiant.nom.substr(0,1)}
                                            </div>
                                            }
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold">{note.etudiant.nom} <br /> <span className='italic font-normal capitalize'>{note.etudiant.prenom}</span> <br /> 
                                    </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-base font-semibold">{note.etudiant.matricule}</div>
                                    </td>
                                    {
                                        !isChecked &&
                                        <td className="px-6 py-4">
                                            <div className="text-base font-semibold">{note.note  ? ""+note.note : "NaN"}</div>
                                        </td>
                                    }
                                    <td className="flex flex-row px-6 py-4">
                                        {!isChecked  ? 
                                        <div>
                                            <Link to={`/invoices/${note.etudiant.nom}`}>
                                        <button className="p-2 mx-2 rounded text-white font-medium bg-blue-600 dark:text-blue-500 hover:underline">
                                        <CIcon icon={cilEyedropper} width={15} />
                                        </button>
                                        </Link>
                                        <button
                                        onClick={() => handleDelete(typeof note.etudiant.id === "number" ? note.etudiant.id : -1)} 
                                        className="p-2 mx-2 rounded text-white font-medium bg-red-600 dark:text-blue-500 hover:underline">
                                        <CIcon icon={cilTrash} width={15} />
                                        </button>
                                        <Link to={`/invoices/edit/${note.etudiant.nom}`}>
                                        <button className="p-2 mx-2 rounded text-white font-medium bg-slate-600 dark:text-blue-500 hover:underline">
                                        <CIcon icon={cilPenAlt} width={15} />
                                        </button>
                                        </Link>
                                        </div> : (<div className='flex flex-row'>
                                            <input 
                                            type="number" 
                                            name={`note-${note.etudiant.id}`}
                                            value={note.note ? Number(note.note) : ''}
                                            onChange={(e) => handleInputChange(e, note.etudiant.id ? note.etudiant.id : -1)}
                                            className='ml-1 bg-gray-50 border border-gray-300 w-1/2 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />

                                             <div onClick={() => handleInputNoteSubmit(note.etudiant.id ? note.etudiant.id : -1)}>
                                                <button type='button' className="w-full h-full mx-2 rounded-md text-sm px-4 text-white font-medium bg-green-600 dark:text-blue-500">
                                                    ok
                                                </button>
                                            </div>
                                        </div> ) }
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                            <nav className="flex items-center flex-rows flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Elements <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, notes.length)}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{(notes.length)}</span>
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
                                {Array.from({ length: Math.ceil(notes.length / itemsPerPage) }).map((_, index) => (
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
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === Math.ceil(notes.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() => {
                                    if(currentPage !== Math.ceil(filterCurrentNotes.length / itemsPerPage))
                                    paginate(currentPage + 1)
                                    }}
                                >
                                    Suivant
                                </a>
                                </li>
                            </ul>
                            </nav>
                            <div className='flex flex-cols my-4'>
                                    <div className={style}>Imprimer la liste des etudiants</div>
                                    <div className={style2}>Imprimer la liste des etudiants avec notes</div>
                                    <div className={style2_1}>Imprimer la liste des etudiants sans notes</div>
                            </div>
                            </div> : 
                                <div>
                                    {elements_constitutifs.length > 0 &&
                                        <div className='py-4'> 
                                            Veuiller selectionner une evaluation ou Aucune notes n'existe pour cette evaluation 
                                        </div> 
                                    }
                                </div>
                            }
                        </div>          
                    
                </div>
            }
        </div>
    );
};

export default NoteList;
