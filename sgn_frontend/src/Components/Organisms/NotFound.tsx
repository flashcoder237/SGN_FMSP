import CIcon from "@coreui/icons-react";
import { cilBug } from "@coreui/icons";
function NotFound() {
    return(
    <div className="flex flex-col text-9xl font-black justify-center text-center text-blue-100 mt-52">
        <div className="justify-center self-center"><CIcon icon={cilBug} width={200}></CIcon></div>
        <div>page introuvable</div>
    </div>
    );
}

export default NotFound;