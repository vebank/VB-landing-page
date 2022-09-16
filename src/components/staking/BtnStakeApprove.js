import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnStakeApprove = ({ addressStaking, pending }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const approveHandler = async () => {

        if (!isPending) {
            setIsPending(true);
            await dispatch(actions.approveStaking(addressStaking)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }

    }

    return (
        <>
            {isPending ? <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> : ""}
            <button onClick={e => { approveHandler(e) }} disabled={pending} className={`w-full btn-modal-veb ${pending ? "bg-btn-veb-disabled hidden" : "bg-btn-veb"}`} type="submit">{isPending ? "Approving..." : `Approve`} </button>
        </>

    )
}

export default BtnStakeApprove;