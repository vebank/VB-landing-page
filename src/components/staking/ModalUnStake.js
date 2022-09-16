import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { stakeConstants } from "../../constants";
import { selectUnStakeReducer } from "../../reducers/unstake.reducer";

import IcVeBank from "../../assets/images/ic_vebank.svg";
import IcWarningCircle from "../../assets/images/ic-warning-circle.svg";

import SecondaryButton from "../partials/SecondaryButton";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";
import useAutoFocus from "../common/hooks/useAutoFocus";
import BtnUnStaking from "./BtnUnStaking";

import * as actions from "../../actions";
import { checkLengthDecimalPoint, numberWithCommas } from "../../utils/lib";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    border: "none",
    borderRadius: "1rem",
    padding: 0,
    width: "450px",
  },
};

const ModalUnStake = () => {
  
  const [amount, setAmount] = useState(0);

  const {
    dataToken,
    accountBalance,
    addressStaking,
    errorCode,
    message,
    transaction,
    pending,
    isOpen,
  } = useSelector(selectUnStakeReducer, shallowEqual);

  const dispatch = useDispatch();
  const amountInputRef = useAutoFocus();

  useEffect(() => {
    resetFrm();
  }, [isOpen]);

  const resetFrm = () => {
    setAmount('');
  };

  const closeModal = (e) => {
    dispatch({
      type: stakeConstants.MODAL_CLOSE_UNSTAKE,
    });
    if (transaction) {
      //dispatch(actions.reloadAccountAssets());
    }
  };

  const onChangeAmount = (e) => {

    const { value } = e.target;

    // Giá trị rỗng
    if (e.target.value === "") {
      setAmount(value);
    }

    // Lớn hơn giá trị cho phép
    if (Number(value) > Number(accountBalance)) {
      return;
    }

    if(checkLengthDecimalPoint(value,18)) {
      return;
    }

    // kiêm tra input number
    let pattern = /^\d+\.?\d*$/;
    if (pattern.test(value)) {
      setAmount(value);
    }

  };

  const showCheckStepContinue = () => {
    if (amount !== 0 && amount > 0) return true;
  };

  const showBtnView = () => {
    let btn = "";
    if (addressStaking && Number(accountBalance) > 0) {
      btn = (
        <BtnUnStaking showCheckStepContinue={showCheckStepContinue} addressStaking={addressStaking} pending={pending} amount={amount} />
      );
    }
    return btn;
  };

  return (
    <Modal
      // isOpen={Object.keys(data).length > 0 ? true : false}
      isOpen={isOpen}
      ariaHideApp={false}
      style={customStyles}
      onRequestClose={closeModal}
      portalClassName="modal-veb"
      overlayClassName="overlay-lur"
    >

      <GradientStrokeWrapper className="-z-50" borderRadius="1rem" />

      <div className="header-modal">
        <h2>UnStake</h2>
        <button className="btn-modal-close" onClick={closeModal}></button>
      </div>

      <div className="content-modal">
        <div>

          <div className="flex justify-between px-8 mt-6 text-lg font-poppins">
            <div className="flex items-center space-x-2">
              <p className="text-grey-2">Staked</p>
              <img
                src={IcWarningCircle}
                alt=""
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div>
              <span className="font-poppins font-bold">{numberWithCommas(accountBalance)}</span>
              <span className="text-[#BFBFBF] pl-2">
                {dataToken ? dataToken?.assetsSymbol : ""}
              </span>
            </div>
          </div>

          <div className="bg-gradient-search rounded-lg flex flex-row mt-2 mx-8 py-4 px-4 justify-between">
            <img
              className="w-12 h-8 pr-3"
              src={IcVeBank}
              alt="Token VEBank"
            />

            <input
              ref={amountInputRef}
              value={amount}
              onChange={onChangeAmount}
              className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
              type="text"
              placeholder={"Amount"}
            />

            <span
              onClick={(e) => {
                setAmount(accountBalance)
              }}
              className="font-poppins font-bold text-[#A0D911] text-[16px] cursor-pointer"
            >
              Max
            </span>
          </div>

        </div>
      </div>

      <div className="footer-modal mt-4 px-8 py-12">
       
        <div className="flex flex-row btn-modal-2nd flex-1 justify-end items-center space-x-11">
   
          <button  onClick={closeModal} type="button" class="w-full inline-flex items-center justify-center px-6 py-[14px] border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-2 rounded-lg text-gray-100 text-lg font-pointer">Cancel</button>

          {showBtnView()}

        </div>
      </div>
    </Modal>
  );
};

export default ModalUnStake;
