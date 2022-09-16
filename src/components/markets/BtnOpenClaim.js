import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';

const BtnOpenClaim = () => {

    const dispatch = useDispatch();

    const [disabledRule, setDisabledRule] = useState(false);

    const { totalUserUnclaimedRewards } = useSelector(state => state.accountOverviewReducer, shallowEqual);

    useEffect(() => {
        if (totalUserUnclaimedRewards) {
            checkRuleBtn(totalUserUnclaimedRewards);
        }
    }, [totalUserUnclaimedRewards]);

    // Rule không dc borrow token đã supply
    const checkRuleBtn = (totalUserUnclaimedRewards) => {
        if (Number(totalUserUnclaimedRewards) === 0) {
            setDisabledRule(true)
        }else{
            setDisabledRule(false)
        }
    }

    const handlerOpenModal = async () => {
        if (disabledRule === false) {
            dispatch(actions.loadModalClaim());
        }
    }

    return (<>
        {
            disabledRule ? <button className="btn-veb ml-2 h-8 bg-btn-veb-disabled border-[1px] border-[#4B5C86] !px-[5px] !py-[2px]" disabled={disabledRule} type="submit">Claim </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb ml-2 h-8 !px-[5px] !py-[2px]" type="submit">Claim </button>
        }

    </>)
}

export default BtnOpenClaim;