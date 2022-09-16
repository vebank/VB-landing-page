
import { thorify } from "thorify";
import Web3 from 'web3';

// import Web3 from 'web3/dist/web3.min.js';

const getWeb3 = async () => {
    let web3 = thorify(new Web3(), process.env.REACT_APP_CHAIN_NETWORK);
    return web3;
};

export default getWeb3;