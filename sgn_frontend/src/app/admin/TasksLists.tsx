
import TaskCard from "../../Components/Atoms/taskcard";
import CIcon from "@coreui/icons-react";
import { cilCaretRight } from "@coreui/icons";
import { Link } from "react-router-dom";


interface adminTaskProps {
    task: string;
    subtasks: string[],
}

function TasksLists() {
    const adminTasks = [
        {
            task: "Gestion des Departements et Filières",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Gerer les départements",
                "Gerer les filières",
                "Gerer les niveaux par filières",
            ]
        },
        {
            task: "Gestion des Utilisateurs",
            link: "/administration/utilisateurs",
            subtasks: [
                "Création de comptes",
                "Attribution de rôles",
                "Maintenance des comptes",
                "Suppression de comptes"
            ]
        },
        {
            task: "Gestion des Cours et des Programmes",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Création et mise à jour des cours",
                "Association des enseignants",
                "Structuration des programmes"
            ]
        },
        {
            task: "Gestion des Notes",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Importation de notes",
                "Vérification des données",
                "Modification des notes",
                "Génération de rapports"
            ]
        },
        {
            task: "Maintenance du Système",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Mises à jour logicielles",
                "Sauvegarde et restauration",
                "Surveillance du système"
            ]
        },
        {
            task: "Sécurité des Données",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Gestion des accès",
                "Audits de sécurité",
                "Formation à la sécurité"
            ]
        },
        {
            task: "Support Technique",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Assistance utilisateur",
                "Résolution de problèmes"
            ]
        },
        {
            task: "Communication et Formation",
            link: "/administration/depart_et_fil",
            subtasks: [
                "Sessions de formation",
                "Communication des mises à jour"
            ]
        }
    ];
    
    console.log(adminTasks);
    
    return(
        <div>
            <h1 className='text-x mb-5'> <CIcon icon={cilCaretRight} width={15} className='inline-block' color='blue'></CIcon> <Link to="/administration" className='hover:underline'>Administration </Link>
            </h1>
            <div className="grid grid-cols-4grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {adminTasks.map((item, index) => (
                    <Link to={item.link}>
                         <div key={index}>
                            <TaskCard task={item.task} subtasks={item.subtasks}  />
                        </div>
                    </Link>
                    
                ))}
            </div>
        </div>
    );
}

export default TasksLists;