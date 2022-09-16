
import { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from "react-redux";
import { NavLink, useLocation } from 'react-router-dom';

import { nFormatter } from '../../utils/lib';

const CurrencyAssets = ({ currencyBalance, assetsAddress }) => {

    const location = useLocation();
    const [keyHash, setKeyHash] = useState("native");

    const dataPrice = useSelector(state => state.assetsPriceReducer.data, shallowEqual);

    useEffect(() => {
        if (location.hash === "#usd") {
            setKeyHash(location.hash);
        } else if (location.hash === "#native") {
            setKeyHash(location.hash);
        } else {
            setKeyHash("#native");
        }
    }, [location]);

    if (!currencyBalance) {
        return "-"
    }

    return (
        <>
            {keyHash === "#usd" && dataPrice ? <>$ {nFormatter(currencyBalance * dataPrice[assetsAddress])}</> : nFormatter(currencyBalance, 2)}
        </>
    )
}

export default CurrencyAssets;