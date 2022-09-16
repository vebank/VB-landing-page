import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnUnStaking = ({ addressStaking, amount, pending ,showCheckStepContinue }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {
        if (isPending === false && addressStaking && amount) {
            setIsPending(true);
            await dispatch(actions.unStakeVeBank(addressStaking, amount)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }
    }

    return (<>
        <button onClick={e => { handlerSubmit(e) }} disabled={isPending} className={`w-full h-12 btn-modal-veb fade-in-box ${pending || !showCheckStepContinue() ? "bg-btn-veb-disabled hidden" : "bg-btn-veb h-12"}`} type="submit">
            {isPending ? "Pending..." : "Confirm"}
        </button>
    </>)
}

export default BtnUnStaking;