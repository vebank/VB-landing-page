import { useEffect, useState } from "react";
import Modal from "react-modal";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import IcCloseWhite from "../../assets/images/buttons/ic_close.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";

import * as actions from "../../actions";
import { formatBalanceString, numberWithCommas } from "../../utils/lib";
import { stakeConstants } from "../../constants";
import BtnClaimStaked from "./BtnClaimStaked";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#0D1522",
    borderWidth: "1px",
    borderRadius: "8px",
    borderColor: "#3EE8FF",
    padding: "32px",
    width: "460px",
  },
};

const ModalClaimStaked = () => {
  
  const { isOpen, accountBalance, addressStaking ,pending } = useSelector(
    (state) => state.claimStakedReducer,
    shallowEqual
  );

  const [amoutClaim, setAmountClaim] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    resetFrm();
  }, [isOpen]);

  const resetFrm = () => {
    setAmountClaim('');
  };

  const onChangeAmountClaimValue = (value) => {
    if (value.isMatch?.(/^\d*\.?\d*$/)) {
      if (Number(value) === 0) {
        setAmountClaim(value);
      } else if (value !== "") {
        if (Number(value) > accountBalance) {
          return;
        }
        let temp = value.split(".");
        if (temp[1]) {
          if (temp[1].length > 18) {
            return;
          }
        }
        setAmountClaim(value);
      } else {
        setAmountClaim(value);
      }
    }
  };

  const closeModal = () => {
    setAmountClaim("0");
    dispatch({
      type: stakeConstants.MODAL_CLOSE_CLAIM_STAKED_MARKET,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={customStyles}
      overlayClassName="vb-modal-overlay"
    >
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row justify-between">
          <span className="font-poppins_bold text-white text-lg">
            Claim rewards
          </span>
          <img
            alt=""
            src={IcCloseWhite}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row items-center justify-between">
            <span className="text-white text-sm">Transaction overview</span>
            <span className="text-xs text-[#7694DE]">
              Balance: { accountBalance ? numberWithCommas(accountBalance) : 0}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center p-4 bg-[#0E1B31] border border-[#4B5C86] rounded-lg">
            <span className="text-white text-sm whitespace-nowrap">Amount</span>
            <div className="flex flex-row items-center w-full">
              <input
                placeholder="0.0"
                min={0}
                value={amoutClaim}
                pattern="^[0-9]*\.?[0-9]*$"
                onChange={(e) => onChangeAmountClaimValue(e.target.value)}
                className="w-full pl-4 py-1 focus:outline-none placeholder:text-[#4B5C86] font-poppins_semi_bold text-lg text-white text-right bg-transparent"
                type="text"
              />
              <img alt="" src={IcVeBank} className="ml-4 w-6 h-6" />
            </div>
          </div>
        </div>
        <BtnClaimStaked amount={amoutClaim} addressStaking={addressStaking} pending={pending} />
      </div>
    </Modal>
  );
};

export default ModalClaimStaked;
