
import React from 'react';
import Select from '../../../../Components/Atoms/Select';
import { OptionFormData } from '../../dataTypes/data';

interface Step2Props {
    options: OptionFormData[];
    niveaux: number[];
    defaultSelectOptions: OptionFormData | undefined;
    defaultSelectNiveau: number;
    handleSelectOptionChange: (event: string) => void;
    handleSelectNiveauChange: (event: string) => void;
}

const Step2: React.FC<Step2Props> = ({
    options,
    niveaux,
    defaultSelectOptions,
    defaultSelectNiveau,
    handleSelectOptionChange,
    handleSelectNiveauChange
}) => {
    return (
        <div>
            <Select
                listItem={options.map(e => ({ value: (typeof e.id === "number" ? e.id : 0), label: e.nom }))}
                labelSelect="Sélectionner l'option"
                value={defaultSelectOptions ? defaultSelectOptions.nom : ""}
                required={true}
                onSelectChange={handleSelectOptionChange}
            />
            <Select
                listItem={niveaux.map(e => ({ value: (typeof e === "number" ? e : 0), label: e.toString() }))}
                labelSelect="Sélectionner le niveau"
                value={defaultSelectNiveau.toString()}
                required={true}
                onSelectChange={handleSelectNiveauChange}
            />
        </div>
    );
};

export default Step2;

