import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';

const BtnOpenClaimStaked = ({amount , addressStaking}) => {

    const dispatch = useDispatch();

    const [disabledRule, setDisabledRule] = useState(false);

    useEffect(() => {
        checkRuleBtn(amount);
    }, [amount]);

    // Rule không dc borrow token đã supply
    const checkRuleBtn = (amount) => {
        if (Number(amount) === 0) {
            setDisabledRule(true)
        }else{
            setDisabledRule(false)
        }
    }

    const handlerOpenModal = async () => {
        if (disabledRule === false) {
            dispatch(actions.loadModalClaimStaked(addressStaking));
        }
    }

    return (<>
        {
            disabledRule ? <button className="mt-4 px-8 py-3 rounded bg-[#232E49] font-poppins_semi_bold text-vbDisableText text-base" disabled={disabledRule} type="submit">Claim </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="mt-4 px-8 py-3  h-10 rounded btn-veb font-poppins_semi_bold text-base" type="submit">Claim </button>
        }
    </>)
}

export default BtnOpenClaimStaked;