import React, { useState } from 'react';

// Définir l'interface pour les props
interface InputProps {
    fileType: string;
    type: string;
    name: string;
    description : string;
    labelName: string;
    onInputFileChange: (value: File | null) => void; 
    required?: boolean;
}

const InputFile: React.FC<InputProps> = ({ type,fileType, name, labelName, onInputFileChange,description, required = false }) => {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [text, setText] = useState<string>();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            const imgUrl = URL.createObjectURL(file);
            setImgUrl(imgUrl);
        } else if (file && file.type.startsWith('application/')) {
            setImgUrl("/Assets/csv.scale-400.png");
            setText(file.name);
        }else{
            setImgUrl(null);
        }
        onInputFileChange(file);
    };

    return (
        <div className="relative z-0 w-full mb-4 group">
            <div className="flex items-center justify-center w-full">
            <label htmlFor={name} className="flex flex-col items-center justify-center w-full h-43 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center p-6">
                        {imgUrl ? (
                            <div className='self-center'>
                                <img src={imgUrl} alt="Preview" className="w-16 mb-4" />
                                {text &&  <p className="text-sm text-gray-900 dark:text-gray-400"><span className="font-semibold">{text}</span></p>}
                            </div>

                        ) : (
                            <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                        )}
                        <p className=" text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{labelName}</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                    <input 
                        id={name} 
                        type="file" 
                        onChange={handleInputChange}
                        accept={fileType} 
                        required={required}
                        className="hidden" 
                    />
                </label>
             </div> 
        </div>
    );
};

export default InputFile;
