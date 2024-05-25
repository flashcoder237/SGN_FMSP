import React from 'react';
import Select from '../../../../Components/Atoms/Select';
import { DepartmentFormData, FiliereFormData } from '../../dataTypes/data';

interface Step1Props {
    departements: DepartmentFormData[];
    filieres: FiliereFormData[];
    filtersFilieres: FiliereFormData[];
    defaultSelectDepartements: DepartmentFormData | undefined;
    defaultSelectFilieres: FiliereFormData | undefined;
    handleSelectDepartmentChange: (event: string) => void;
    handleSelectFiliereChange: (event: string) => void;
}

const Step1: React.FC<Step1Props> = ({
    departements,
    filieres,
    filtersFilieres,
    defaultSelectDepartements,
    defaultSelectFilieres,
    handleSelectDepartmentChange,
    handleSelectFiliereChange
}) => {
    return (
        <div>
            <Select
                listItem={departements.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                labelSelect="Sélectionner le département"
                value={defaultSelectDepartements ? defaultSelectDepartements.nom : ""}
                required={true}
                onSelectChange={handleSelectDepartmentChange}
            />

            <Select
                listItem={filtersFilieres.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                labelSelect="Sélectionner la filière"
                value={defaultSelectFilieres ? defaultSelectFilieres.nom : ""}
                required={true}
                onSelectChange={handleSelectFiliereChange}
            />
        </div>
    );
};

export default Step1;

