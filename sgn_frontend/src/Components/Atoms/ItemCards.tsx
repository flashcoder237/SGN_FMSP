interface nameProps {
    name: string;
}

const ItemCards = ({name}: nameProps) => {
    return(
    <div className="justify-center text-sm text-wrap text-clip px-4 py-2 text-white font-semibold transition-all duration-200 bg-blue-500 border border-transparent rounded-md tems-center hover:bg-blue-700 focus:bg-blue-700">
        {name}
    </div>
    );
}

export default ItemCards;