interface btnProps {
    name: string;
    type: "submit" | "reset" | "button";
    color?: string;
}

const Button = ({color ,name, type}: btnProps) => {
    return(
    <button 
    type={type}
    className={`w-full text-white bg-${color}-600 hover:bg-${color}-700 focus:ring-4 focus:outline-none focus:ring-${color}-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`} >
        {name}
    </button>
    );
}

export default Button;