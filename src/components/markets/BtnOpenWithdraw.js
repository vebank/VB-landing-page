import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';
import { selectUserAssets } from "../../reducers/accountAssets.reducer";

const BtnOpenWithdraw = ({ item }) => {

    const [disabledRule, setDisabledRule] = useState(false);
    const accountPool = useSelector((state) =>
        selectUserAssets(state, item.assetsAddress)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        checkRuleBtn(accountPool);
    }, [accountPool]);

    // Rule : có supply thì mới dc withdraw
    const checkRuleBtn = (accountPool) => {

        if (accountPool &&accountPool.totalSupplied > 0) {
            setDisabledRule(false);
        } else {
            setDisabledRule(true);
        }

    }

const handlerOpenModal = async () => {
        if (item && item.assetsAddress && disabledRule === false) {
            dispatch(actions.loadModalWithdraw(item));
        }
    }

    return (<>
        {
            disabledRule ? <button className="btn-veb h-10 bg-btn-veb-disabled border-[1px] border-[#4B5C86]" disabled={disabledRule} type="submit">Withdraw </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">Withdraw </button>
        }
    </>)
}

export default BtnOpenWithdraw;