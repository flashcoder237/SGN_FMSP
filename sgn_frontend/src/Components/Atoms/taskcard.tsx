import CIcon from "@coreui/icons-react";
import { cilCaretRight } from '@coreui/icons';

interface TaskProps {
    task: string;
    subtasks: string[],
}

const TaskCard = ({task, subtasks}: TaskProps) => {
    return(
    <div className="relative p-10  rounded-lg text-white font-bold text-2xl transition-all ease-in-out duration-150 bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer">
       <div className="rounded-lg flex flex-col  p-10  opacity-0 hover:opacity-100 transition duration-700 absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-blue-900 cursor-pointer">
       <div className="pb-4">{task}</div>
       {subtasks.map((subtask, subIndex) => (
            <div className="text-sm font-light hover:translate-x-2 duration-75 delay-75" key={subIndex}><CIcon icon={cilCaretRight} width={10} className='inline-block mr-1' color='white'></CIcon>{subtask}</div>
        ))}
       </div>
       <div className="pb-4">{task}</div>
       {subtasks.map((subtask, subIndex) => (
            <div className="text-sm font-light hover:translate-x-2 transition duration-75 delay-75" key={subIndex}><CIcon icon={cilCaretRight} width={10} className='inline-block mr-1' color='white'></CIcon>{subtask}</div>
        ))}
    </div>
    );
}

export default TaskCard;