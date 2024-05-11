import React from 'react';

// Définir l'interface pour les props
interface InputProps {
    type: string;
    name: string;
    labelName: string;
    onInputImageChange: (value: File | null) => void;  // Fonction qui prend la valeur et le nom du champ
    required?: boolean;
}

const InputImage: React.FC<InputProps> = ({ type, name, labelName, onInputImageChange, required = false }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        onInputImageChange(file);
    };

    return (
        <div className="relative z-0 w-full mb-4 group">
            <label htmlFor={name} >{labelName}</label>
            <input 
                name={name}
                type={type}
                onChange={handleInputChange}
                accept="image/*"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={required} />
        </div>
    );
};

export default InputImage;
