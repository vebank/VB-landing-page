import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from '../../actions';

const BtnCoolDowns = ({  addressStaking ,accountStaked }) => {
  
  const btnLabel = "Cooldown to unstake";

  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);

  const handlerSubmit = async () => {

    if (isPending === false && addressStaking && accountStaked) {
        setIsPending(true);
        await dispatch(actions.coolDownsStaking(addressStaking)).then(() => {
            setIsPending(false);
        }).catch((e) => {
            setIsPending(false);
        });
    }

  }

  return (
    <div>

      <button onClick={e => { handlerSubmit(e) }} disabled={isPending} className={`mt-4 px-8 py-3 h-10 rounded font-poppins_semi_bold text-base ${isPending ? "bg-[#232E49] text-vbDisableText" : "btn-veb"}`} type="submit">
          {isPending ? "Pending..." : btnLabel}
      </button>

    </div>
  );
};

export default BtnCoolDowns;
