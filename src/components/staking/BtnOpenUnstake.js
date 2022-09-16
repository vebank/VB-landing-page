import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { loadModalUnStake } from "../../actions/stake.action";

const btnLabel = "Unstake";

const BtnOpenUnstake = ({ addressStaking }) => {

  const dispatch = useDispatch();

  const [disabledRule, setDisabledRule] = useState(false);

  // const { data, accountSupplyBalance } = useSelector(state => state.accountAssetsReducer, shallowEqual);

  // useEffect(() => {
  //     if (data) {
  //         checkRuleBtn(data);
  //     }
  // }, [data]);

  const handlerOpenModal = async () => {
    dispatch(loadModalUnStake(addressStaking));
  };

  return (
    <>
      {disabledRule ? (
        <button
          onClick={(e) => handlerOpenModal()}
          className="btn-veb bg-btn-veb-disabled border-[1px] border-[#4B5C86]"
          // disabled={disabledRule}
          type="submit"
        >
          {btnLabel}
        </button>
      ) : (
        <button
          onClick={(e) => handlerOpenModal()}
          className="btn-veb h-10 mt-4"
          type="submit"
        >
          {btnLabel}
        </button>
      )}
    </>
  );
};

export default BtnOpenUnstake;
