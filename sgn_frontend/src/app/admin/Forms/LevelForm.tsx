import { LevelFormData } from "../dataTypes/data";
import { useState } from "react";

const LevelForm: React.FC = () => {
    const [formData, setFormData] = useState<LevelFormData>({ nom: '', filiereId: 0 });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Level nom:', formData.nom, 'Filiere ID:', formData.filiereId);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nom du niveau:
                <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
            </label>
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default LevelForm;
