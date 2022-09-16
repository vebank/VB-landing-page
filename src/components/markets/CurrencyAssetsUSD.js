
import { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from "react-redux";

import { nFormatter } from '../../utils/lib';

const CurrencyAssetsUSD = ({ currencyBalance, assetsAddress, digits}) => {

    const dataPrice = useSelector(state => state.assetsPriceReducer.data, shallowEqual);

    if (!currencyBalance || !assetsAddress) {
        return "-"
    }

    if(!dataPrice[assetsAddress]){
        return "0 $";
    }

    return (
        <>
            {dataPrice ? <>$ {nFormatter(currencyBalance * dataPrice[assetsAddress],digits ? digits: 2)}</> : nFormatter(currencyBalance, digits ? digits: 2)}
        </>
    )
    
}

export default CurrencyAssetsUSD;