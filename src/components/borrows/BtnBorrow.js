import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnBorrow = ({ dataToken, amount, pending, rate }) => {

    const [isPending, setIsPending] = useState(false);

    const dispatch = useDispatch();

    const handlerSubmit = async () => {

        if (isPending === false && dataToken && amount) {
            setIsPending(true);
            if (dataToken.assetsSymbol === "VET") {
                await dispatch(actions.borrowETHMarket(dataToken, amount, rate)).then(() => {
                    setIsPending(false);
                }).catch((e) => {
                    setIsPending(false);
                });
            } else {

                await dispatch(actions.borrowMarket(dataToken, amount, rate)).then(() => {
                    setIsPending(false);
                }).catch((e) => {
                    setIsPending(false);
                });

            }
        }
    }

    return (<>

        {/* {isPending ? <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> : ""} */}
        <button onClick={e => { handlerSubmit(e) }} disabled={pending} className={`btn-modal-veb fade-in-box ${pending ? "bg-btn-veb-disabled hidden" : "bg-btn-veb"}`} type="submit">
            {isPending ? "Pending..." : "Borrow"}
        </button>

    </>)
}

export default BtnBorrow;