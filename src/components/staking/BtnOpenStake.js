import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadModalStake } from "../../actions";

const BtnOpenStake = ({ addressStaking ,tokenStaking }) => {
  
  const btnLabel = "Stake";

  const dispatch = useDispatch();
  const [disabledRule, setDisabledRule] = useState(false);

  const handlerOpenModal = async () => {
    dispatch(loadModalStake(addressStaking,tokenStaking));
  };

  return (
    <div className="w-[100px]">
      {disabledRule ? (
        <button
          className="px-8 py-3 rounded bg-[#232E49] font-poppins_semi_bold text-vbDisableText text-base"
          disabled={disabledRule}
          type="submit"
        >
          {btnLabel}
        </button>
      ) : (
        <button
          onClick={(e) => handlerOpenModal(e)}
          className="btn-veb h-10"
          type="submit"
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};

export default BtnOpenStake;
