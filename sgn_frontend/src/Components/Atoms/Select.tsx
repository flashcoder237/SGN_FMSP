import React from "react";

interface SelectProps {
    listItem: { value: number; label: string }[];
    labelSelect: string;
    value: string;
    required: boolean;
    onSelectChange: (value: string) => void;
}
const Select = ({labelSelect, listItem, onSelectChange, value}:SelectProps) => {

  const handleSelectChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onSelectChange(selectedValue);
  };

    return (
    <div className="mb-3">
      <div
        className="pb-1 text-md"
      >
        {labelSelect}
      </div>
      
      <select
        id="departement"
        value={value}
        onChange={handleSelectChange}
        className="pt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        
        {listItem.map(item => (
                <option key={item.value} value={item.label}>{item.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
