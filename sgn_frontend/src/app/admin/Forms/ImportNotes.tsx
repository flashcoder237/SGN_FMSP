import React, { useState } from 'react';
import Button from '../../../Components/Atoms/Button';
import InputFile from '../../../Components/Atoms/InputFile';
import ImportExcelFile from '../../../Components/Organisms/ImportExcelFile';
import { importStudentsExcelFile } from '../../services/importService';
import FailedModal from '../../../Components/Organisms/FailedModal';
import SucessModal from '../../../Components/Organisms/SucessModal';

const NoteAddWidthCsv: React.FC = () => {

    const [file, setFile] = useState<File|null>();

    const [resultAdd, setResultAdd] = useState(false);
    const [failAdd, setFailAdd] = useState(false);
    const [failedMessage, setFailedMessage] = useState("Oups! Quelque chose à mal tournée"); 

        function handleResultChange(){
          setResultAdd(false);
      }

      function handleResultFailChange(){
        setFailAdd(false);
    }

    


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
        const success = await importStudentsExcelFile("/import_etudiant_template/", formData);
        if (success){
          setResultAdd(true);
        }else{
          console.log(formData);
          setFailAdd(true);
        }
};

    return (
        <div>
            <div className='border-b-4 border-blue-300 mb-2 bg-slate-100 p-4'>
              <h2 className='text-2xl font-bold pb-2 text-blue-700'>Importez les notes</h2>
              <span>Rassurez vous de bien entrer les infortions de la classe</span>
            </div>
               <div>
                 <form encType="multipart/form-data" onSubmit={handleSubmitFile}>
               
                  <InputFile
                    type="file"
                    name="photo"
                    fileType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    description='xls.. (MAX. 10Mo)'
                    labelName="Fichier csv contenant les notes"
                    required={true}
                    onInputFileChange={handleFileChange}
                  />
                  <Button color="blue" name='Soumettre le fichier' type='submit'/>
                 </form>
                <div className='mt-3'>
                  <ImportExcelFile 
                    label="Télécharger le modèle Excel" 
                    fileName="Liste_notes_Template.xlsx" 
                    linked="/download_notes_template/"
                    title="Télécharger le modèle Excel pour enregistrer les notes" />
                </div>
                <div className={`${resultAdd ? 'block transition-all ease-in duration-150':'hidden'}`}>
                  <SucessModal title='Etudiant ajouté avec succès!' onResultChange={handleResultChange} message='Vous pouvez à présent ajouter des notes pour cette étudiant' />
                </div>
                <div className={`${failAdd ? 'block':'hidden'}`}>
                 <FailedModal title="Erreur lors de l'ajout de l'étudiant!" onResultChange={handleResultFailChange} message={failedMessage} />
                </div>
               </div>
                
   
        </div>
    );
};

export default NoteAddWidthCsv;
