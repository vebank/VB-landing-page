import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';
import { marketplaceConstants } from '../../constants';
import { selectUserAssets } from "../../reducers/accountAssets.reducer";

const BtnOpenRepay = ({ item }) => {

    const [disabledRule, setDisabledRule] = useState(false);

    const accountPool = useSelector((state) =>
        selectUserAssets(state, item.assetsAddress)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        checkRuleBtn(accountPool);
    }, [accountPool]);
    
    const checkRuleBtn = (dataAssets) => {

        if (accountPool && accountPool.totalBorrowed > 0) {
            setDisabledRule(false);
            // if (item && item.totalSupplied === 0) {
            //     setDisabledRule(true);
            // }

            // const provided = dataAssets.find(e => ((e.assetsAddress === item.assetsAddress)));
            // if (!provided) {
            //     setDisabledRule(true);
            // }

            // if (provided && provided.totalBorrowed === 0) {
            //     setDisabledRule(true);
            // }

        } else {
            setDisabledRule(true);
        }

    }

    const handlerOpenModal = async () => {
        if (item && item.assetsAddress && disabledRule === false) {
            dispatch(actions.loadModalRepay(item));
        }
    }

    return (<>
        {
            disabledRule ? <button className="btn-veb h-10 bg-btn-veb-disabled border-[1px] border-[#4B5C86]" disabled={disabledRule} type="submit">Repay </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">Repay </button>
        }
    </>)
}

export default BtnOpenRepay;