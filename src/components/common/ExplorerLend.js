
import { ThreeDots } from "react-loading-icons";
import IcExplorer from "../../assets/images/ic_explorer.svg";
import IcSuccess from "../../assets/images/ic_success.svg";

const ExplorerLend = ({ name, transaction }) => {

return (

    <div className="flex flex-row border-t border-solid border-[#4F92A7] font-poppins text-base fade-in-box">
        <div className="flex-1 w-32 border-r rounded-tl-lg border-solid border-[#4F92A7] indent-3.5 p-2">
            {name}
        </div>
        <div className="flex-1 w-32 border-r border-solid border-[#4F92A7] flex items-center indent-3.5 p-2">
            {transaction ? (
                <>Confirmed<img className="ml-2" src={IcSuccess} alt="icon success" /></>
             ) : (<>Pending<ThreeDots stroke="#d29436"  className="w-6 h-6 ml-2" /></>)}
        </div>

        <div className="flex-1 w-32 indent-3.5 p-2 cursor-pointer">

            { transaction && transaction.txid ?
                <a className="flex items-center w-5" target="_blank" href={`${process.env.REACT_APP_CHECK_TRANSACTION_URL}${transaction.txid}#info`}>
                    Explorer
                    <img className="ml-2" src={IcExplorer} />
                </a>
                :
                <a className="flex items-center w-5">
                    Explorer
                </a>
            }

        </div>
        
    </div>
)
};

export default ExplorerLend;