

import { useEffect, useState } from 'react';

import { useSelector, shallowEqual } from "react-redux";

const BalanceVET = () => {

    const [balanceAccount, setBalanceAccount] = useState(null);
    const balance = useSelector(state => state.contractVET.balanceVET, shallowEqual);

    useEffect(() => {
        setBalanceAccount(balance);
    }, [balance]);

    return (

        <div className="flex flex-row justify-start items-center space-x-2">
            {/* <img className="w-6 h-6" src={IcVB} alt="Coin VeBank" /> */}
            <span className="font-poppins font-medium text-slate-50 text-base">VET {balanceAccount ? balanceAccount : 0}</span>
        </div>
    )
}

export default BalanceVET;