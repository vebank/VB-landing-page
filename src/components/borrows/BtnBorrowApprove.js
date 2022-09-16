import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnBorrowApprove = ({ dataToken, rate, pending }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const approveHandler = async () => {
        if (!isPending) {
            setIsPending(true);
            await dispatch(actions.approveBorrow(dataToken, rate)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }
    }


    return (
        <>
            {isPending ? <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> : ""}
            <button onClick={e => { approveHandler(e) }} className={`btn-modal-veb ${pending ? "bg-btn-veb-disabled hidden" : "bg-btn-veb"}`} type="submit">{isPending ? "Approving..." : `Approve ${dataToken.assetsSymbol}`} </button>
        </>

    )
}

export default BtnBorrowApprove;