import React, { useState } from "react";
import Modal from "react-modal";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import IcWarningCircle from "../../assets/images/ic-warning-circle.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import { farmConstants } from "../../constants";
import { selectUnFarmReducer } from "../../reducers/unfarm.reducer";
import SecondaryButton from "../partials/SecondaryButton";

import * as actions from "../../actions";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    border: "none",
    borderRadius: "8px",
    padding: 0,
    width: "640px",
  },
};

const ModalUnFarm = () => {
  const dispatch = useDispatch();
  const {
    dataToken,
    accountBalance,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    errorCode,
    message,
    transaction,
    pending,
    isOpen,
  } = useSelector(selectUnFarmReducer, shallowEqual);

  const [amount, setAmount] = useState("0");

  const onMaxClicked = (e) => {
    //TODO: Handle click max button
  };

  const closeModal = async (e) => {
    dispatch({
      type: farmConstants.MODAL_CLOSE_UNFARM,
    });
    clearValue();
    if (transaction) {
      dispatch(actions.reloadAccountAssets());
    }
  };

  const clearValue = () => {
    setAmount("0");
  };

  const onConfirmClicked = (e) => {
    if (parseFloat(amount) <= 0.0) {
      return;
    }
    // TODO: Farm the entered value
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay-lur"
    >
      <div className="header-modal">
        <h2>Unfarm</h2>
        <button className="btn-modal-close" onClick={closeModal} />
      </div>

      <div className="content-modal px-6 space-y-4 pb-4">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <p>Staked</p>
            <img
              src={IcWarningCircle}
              alt=""
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          <p>5,000 LP</p>
        </div>
        <div className="bg-gradient-search rounded-lg flex flex-row p-4 justify-between">
          {/* <img
            className="w-12 h-8 pr-3"
            src={dataToken.iconOringin}
            alt="Token VEBank"
          /> */}
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-8 w-8 rounded-full z-10"
              src={dataToken?.iconOrigin}
              alt=""
            />
            <img
              className="inline-block h-8 w-8 rounded-full"
              src={dataToken?.iconAssets}
              alt=""
            />
          </div>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base flex flex-1 ml-4"
            type="number"
            placeholder={"Amount"}
          />
          <span
            onClick={onMaxClicked}
            className="font-poppins font-bold text-[#A0D911] text-[16px] cursor-pointer"
          >
            Max
          </span>
        </div>
        <div className="flex flex-1 justify-between space-x-11 pt-5">
          {/* <button onClick={closeModal} className="flex flex-1 btn-modal-veb">
            Cancel
          </button> */}
          <SecondaryButton
            label="Cancel"
            onClick={closeModal}
            className="w-full btn-modal-secondary h-11"
          />
          <button
            onClick={onConfirmClicked}
            className={`w-full btn-modal-veb ${
              parseFloat(amount) > 0 ? "bg-btn-veb" : ""
            }`}
            disabled={parseFloat(amount) <= 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUnFarm;
