import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { nFormatter } from '../../utils/lib';
import { selectUserAssets ,selectAccountAvailableBorrowsBase } from "../../reducers/accountAssets.reducer";

const UserAssetAvailableBorrow = ({ item, assetsAddress }) => {

    const dataPrice = useSelector(state => state.assetsPriceReducer.data, shallowEqual);
    const accountPool = useSelector((state) =>selectUserAssets(state, assetsAddress) );
    const accountAvailableBorrows = useSelector((state) =>selectAccountAvailableBorrowsBase(state) );
    
    const [available, setAvailable] = useState('');

    useEffect(() => {

        if(dataPrice && accountAvailableBorrows){

           let totalUserCollateralPool= item.totalUserCollateralPool;

           if(totalUserCollateralPool <0){
            totalUserCollateralPool = 0
           }

            const availableBorrowsBase = accountAvailableBorrows / dataPrice[assetsAddress];

            setAvailable( Math.min(totalUserCollateralPool, availableBorrowsBase));

        }else{
            setAvailable(0);
        }
    }, [dataPrice,accountAvailableBorrows,accountPool]);

    if (!assetsAddress) {
        return <></>;
    }

    return (

        <input
            className="bg-transparent rounded focus:outline-none placeholder-slate-300 appearance-none text-base w-full mr-4"
            type="text"
            placeholder={"0"}
            disabled={true}
            value={nFormatter(available || 0,2)}
        />
    )


}

export default UserAssetAvailableBorrow;