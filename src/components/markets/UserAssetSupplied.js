import { useEffect, useState } from 'react';

import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { nFormatter, truncate } from '../../utils/lib';
import { selectUserAssets } from "../../reducers/accountAssets.reducer";


const UserAssetSupplied = ({ item, assetsAddress }) => {

    const accountPool = useSelector((state) =>
        selectUserAssets(state, assetsAddress)
    );

    const [available, setAvailable] = useState('');

    useEffect(() => {

        if(item.totalUserCollateralPool && accountPool){

            let totalSupplied = accountPool.totalSupplied;
            if(totalSupplied){
                totalSupplied = truncate(accountPool.totalSupplied || 0,8)
            }

            let totalUserCollateralPool = 0;
            if(item  && item.totalUserCollateralPool > 0){
                totalUserCollateralPool = truncate(item.totalUserCollateralPool  || 0,8);
            }

            if(totalUserCollateralPool < totalSupplied){
                totalSupplied  = totalUserCollateralPool;
            }

            setAvailable( nFormatter(totalSupplied || 0,2));

        }else{
            setAvailable(0);
        }
    }, [accountPool]);

    if (!assetsAddress) {
        return <></>;
    }

    return (

        <input
            className="bg-transparent rounded focus:outline-none placeholder-slate-300 appearance-none text-base w-full mr-4"
            type="text"
            placeholder={"0"}
            disabled={true}
            value={ available &&  available > 0 ? Number(available) :available}
        />
    )


}

export default UserAssetSupplied;