import VeBankABI from "./assets/VB.json";
import VeUSDABI from "./assets/VEUSD.json";
import VThoABI from "./assets/VTHO.json";
import WVetABI from "./assets/WVET.json";


const assetAbi = {
    [process.env.REACT_APP_TOKEN_VEBANK]: VeBankABI,
    [process.env.REACT_APP_TOKEN_VTHO]: VThoABI,
    [process.env.REACT_APP_TOKEN_VEUSD]: VeUSDABI,
    [process.env.REACT_APP_TOKEN_WVET]: WVetABI,
}

export default assetAbi;