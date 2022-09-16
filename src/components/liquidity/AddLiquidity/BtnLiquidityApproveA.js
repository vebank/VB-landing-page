import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Beforeunload } from "react-beforeunload";

import * as actions from "../../../actions";
import { selectApproveState, selectCheckApprovalState } from "../../../reducers/liquid.reducer";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";

const BtnLiquidityApproveA = ({ tokenAddress }) => {
  const dispatch = useDispatch();
  const isApproving = useSelector(selectApproveState);
  const isCheckingApproval = useSelector(selectCheckApprovalState)
  const tokenInfo = useSelector((state) =>
    selectAssetByAddress(state, tokenAddress)
  );

  const approveHandler = async () => {
    if (!isApproving) {
      dispatch(actions.approveFirstTokenAddLiquidity(tokenAddress));
    }
  };

  return (
    <>
      {isApproving ? (
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
      ) : (
        ""
      )}
      <button
        onClick={(e) => {
          approveHandler(e);
        }}
        className={`btn-modal-veb w-full ${
          isCheckingApproval || isApproving ? "bg-btn-veb-disabled" : "bg-btn-veb"
        }`}
        type="submit"
        disabled={isCheckingApproval || isApproving}
      >
        {isCheckingApproval ? "Checking..." : isApproving ? "Approving..." : `Approve ${tokenInfo?.assetsSymbol}`}{" "}
      </button>
    </>
  );
};

export default BtnLiquidityApproveA;
