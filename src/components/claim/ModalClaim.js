import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Range } from "react-range";
import { TailSpin } from "react-loading-icons";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import IcCloseWhite from "../../assets/images/buttons/ic_close.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import IcClaim from "../../assets/images/ic_claim.svg";
import IcClaimQuestion from "../../assets/images/ic_claim_question.svg";

import * as actions from "../../actions";
import { formatBalanceString } from "../../utils/lib";
import Tooltip from "../swap/Tooltip";

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

const ModalClaim = () => {
  const { isOpen, accountBalance } = useSelector(
    (state) => state.claimRewardsReducer,
    shallowEqual
  );
  const [showTip, setShowTip] = useState(false);
  const [claimAvailable, setClaimAvailable] = useState(false);
  const [amoutClaim, setAmountClaim] = useState("0");
  const dispatch = useDispatch();
  const onChangeAmountClaimValue = (value) => {
    if (value.isMatch?.(/^\d*\.?\d*$/)) {
      if (Number(value) === 0) {
        setClaimAvailable(false);
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
        if (Number(value) > 0) {
          setClaimAvailable(true);
        }
      } else {
        setClaimAvailable(false);
        setAmountClaim(value);
      }
    }
  };
  const claimReward = () => {
    if (amoutClaim <= 0) {
      return;
    }
    dispatch(actions.claimReward(amoutClaim));
  };
  const closeModal = () => {
    setAmountClaim("0");
    dispatch(actions.closeModalClaim());
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
              Balance: {formatBalanceString(accountBalance)}
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
        {/* <div className="flex flex-row space-x-2">
          <img
            alt=""
            src={IcClaim}
            className="cursor-pointer"
            onClick={closeModal}
          />
          <span className="text-white text-sm">$0.04</span>
          <div className="relative group flex items-center cursor-pointer">
            <img
              alt=""
              src={IcClaimQuestion}
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            />
            {showTip && <Tooltip info={"Amount of ..."} position={"top"} />}
          </div>
        </div> */}
        <button
          // className="font-poppins_semi_bold text-white w-full py-4 rounded-lg bg-gradient-to-r from-[#0FE3E3] to-[#02A4FF]"
          className={`btn-modal-veb w-full ${
            claimAvailable ? "bg-btn-veb" : ""
          }`}
          onClick={claimReward}
          disabled={!claimAvailable}
        >
          Claim VeBank
        </button>
      </div>
    </Modal>
  );
};

export default ModalClaim;
