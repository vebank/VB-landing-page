import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnStaking = ({ addressStaking, amount, pending ,showCheckStepContinue }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {

        if (isPending === false && addressStaking && amount) {
            setIsPending(true);
            await dispatch(actions.stakingVeBank(addressStaking, amount)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }

    }

    return (<>

        <button onClick={e => { handlerSubmit(e) }} disabled={isPending} className={`w-full btn-modal-veb fade-in-box ${pending || !showCheckStepContinue() ? "bg-btn-veb-disabled hidden" : "bg-btn-veb"}`} type="submit">
            {isPending ? "Pending..." : "Confirm"}
        </button>

    </>)
}

export default BtnStaking;