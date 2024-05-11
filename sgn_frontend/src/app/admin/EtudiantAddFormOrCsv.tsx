import React, { useState } from 'react';
import EtudiantForm from './Forms/EtudiantForm';
import Button from '../../Components/Atoms/Button';
import InputFile from '../../Components/Atoms/InputFile';

const EtudiantAddFormOrCsv: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [file, setFile] = useState<File|null>();

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };


    const handleFileChange = (file : File | null) => {
      setFile(file);
  };  

    return (
        <div>
            <div className='border-b-4 border-blue-300 mb-2 bg-slate-100 p-4'>
              <h2 className='text-xl font-semibold pb-2 text-blue-950'>Veuillez sélectionner une méthode d'ajout des étudiants</h2>
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
                 <form action="">
                  <InputFile
                    type="file"
                    name="photo"
                    fileType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    description='xls.. (MAX. 10Mo)'
                    labelName="Fichier csv contenant les étudiants"
                    onInputFileChange={handleFileChange}
                  />
                  <Button color="blue" name='Soumettre le fichier' type='submit'/>
                </form>
                <div className='mt-3'>
                <h1 className='text-xl font-semibold pb-2 text-blue-950'>Télécharger le modèle Excel pour enregistrer les étudiants</h1>
                <a href="{% url 'download_template' %}">
                  <Button  color="slate" name='Télécharger le modèle Excel' type='button'/>
                </a>
                </div>
               </div>
                
            )}
        </div>
    );
};

export default EtudiantAddFormOrCsv;
