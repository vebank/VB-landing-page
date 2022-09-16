import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnClaimStaked = ({ addressStaking, amount, pending }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {

        if (isPending === false && addressStaking && amount) {
            setIsPending(true);
            await dispatch(actions.claimRewardStaked(addressStaking, amount)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }

    }

    return (<>

        <button onClick={e => { handlerSubmit(e) }} disabled={isPending || pending} className={`w-full btn-modal-veb fade-in-box ${isPending || (Number(amount) === 0 ) ? "bg-btn-veb-disabled" : "bg-btn-veb"}`} type="submit">
            {isPending ? "Pending..." : "Claim VeBank"}
        </button>

    </>)
}

export default BtnClaimStaked;