import React, { useState } from 'react';
import EtudiantForm from './Forms/EtudiantForm';
import Button from '../../Components/Atoms/Button';
import InputFile from '../../Components/Atoms/InputFile';
import ImportExcelFile from '../../Components/Organisms/ImportExcelFile';
import { importStudentsExcelFile } from '../services/importService';
import FailedModal from '../../Components/Organisms/FailedModal';
import SucessModal from '../../Components/Organisms/SucessModal';

const EtudiantAddFormOrCsv: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [file, setFile] = useState<File|null>();

    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);
    const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée, une fois cette fenetre fermé vous pourriez visualiser le rapport d'exécution"); 

        function handleResultChange(){
          setResultAdd(false);
      }

      function handleResultFailChange(){
        setFailAdd(false);
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };


    const handleFileChange = (file : File | null) => {
      setFile(file);
  };  

  const handleSubmitFile = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
        if (!file) {
            console.error('Aucun fichier sélectionné.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try{
          const success = await importStudentsExcelFile("/import_etudiant_template/", formData);
          setResultAdd(true);
        } catch (err : any) {
          setFailAdd(true);
          setFailedMessage(err.response.data)
          console.log(err);
        }
};

    return (
        <div>
            <div className='border-b-4 border-blue-300 mb-2 bg-slate-100 p-4'>
              <h2 className='text-2xl font-bold pb-2 text-blue-700'>Veuillez sélectionner une méthode d'ajout des étudiants</h2>
              <input 
                  type="radio" 
                  id="manuel_choice" 
                  name="choix" 
                  value="Formulaire" 
                  onChange={handleOptionChange}
              />
              <label htmlFor="formulaire" className='ml-2'>A l'aide d'un formulaire</label><br/>

              <input 
                  type="radio" 
                  id="csv_choice" 
                  name="choix" 
                  value="fichier_csv" 
                  onChange={handleOptionChange}
              />
              <label htmlFor="fichier_csv" className='ml-2'>A partir d'un fichier csv</label><br/>
            </div>

            {selectedOption === 'Formulaire' && (
              <EtudiantForm/>
            )}

            {selectedOption === 'fichier_csv' && (
               <div>
                 <form encType="multipart/form-data" onSubmit={handleSubmitFile}>
               
                  <InputFile
                    type="file"
                    name="photo"
                    fileType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    description='xls.. (MAX. 10Mo)'
                    labelName="Fichier csv contenant les étudiants"
                    required={true}
                    onInputFileChange={handleFileChange}
                  />
                  <Button color="blue" name='Soumettre le fichier' type='submit'/>
                 </form>
                <div className='mt-3'>
                  <ImportExcelFile 
                    label="Télécharger le modèle Excel" 
                    fileName="Liste_Etudiants_Template.xlsx" 
                    linked="/download_etudiant_template/"
                    title="Télécharger le modèle Excel pour enregistrer les étudiants" />
                </div>
                <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
                  <SucessModal title='Etudiant ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent ajouter des notes pour cette étudiant' />
                </div>
                <div className={`${failAdd ? 'block':'hidden'}`}>
                 <FailedModal title="Erreur lors de l'ajout de l'étudiant!" onResultChange={handleResultFailChange} message={failedMessage} />
                </div>
               </div>
                
            )}
        </div>
    );
};

export default EtudiantAddFormOrCsv;
