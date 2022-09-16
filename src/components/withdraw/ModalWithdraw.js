import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Range } from "react-range";
import { TailSpin } from "react-loading-icons";
import debounce from 'lodash.debounce';

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  checkLengthDecimalPoint,
  formatLocaleString,
  nFormatter,
  numberWithCommas,
} from "../../utils/lib";

import { marketplaceConstants } from "../../constants";
import * as actions from "../../actions";

import BtnWithdraw from "./BtnWithdraw";
import BtnWithdrawApprove from "./BtnWithdrawApprove";
import useAutoFocus from "../common/hooks/useAutoFocus";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";
import ExplorerLend from "../common/ExplorerLend";

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
    width: "540px",
  },
};

const ModalWithdraw = () => {
  const [amount, setAmount] = useState("");
  const [values, setValues] = useState([0]);
  const [step, setStep] = useState(1);
  const [newHealthFactor, setNewHealthFactor] = useState(0);

  const {
    dataToken,
    accountBalance,
    accountApprove,
    assetThreshold,
    loading,
    errorCode,
    message,
    transaction,
    pending,
    isOpen,
  } = useSelector((state) => state.withdrawReducer, shallowEqual);

  const dispatch = useDispatch();
  const amountInputRef = useAutoFocus();

  useEffect(() => {
    resetFrm();
  }, [dataToken]);

  useEffect(() => {
    resetFrm();
    if (isOpen) {
      setAmount("");
    }
  }, [isOpen]);

  const resetFrm = () => {
    setAmount("");
    setValues([0]);
    setStep(1);
  };

  const closeModal = () => {
    resetFrm();
    dispatch({
      type: marketplaceConstants.MODAL_CLOSE_WITHDRAW_MARKET,
    });

    if (transaction) {
     // dispatch(actions.reloadAccountAssets());
    }
  };

  const closeModalAndDashboard = () => {
    closeModal();
    resetFrm();
  };

  const onChangeRangeAmount = (values) => {
    setValues(values);
    setAmount(values[0]);
    changeDebounceValueNewHF(values[0])
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;

    // Giá trị rỗng
    if (e.target.value === "") {
      setAmount(value);
      setValues([0]);
      changeDebounceValueNewHF(0)
    }

    // Lớn hơn giá trị cho phép
    if (Number(value) > Number(accountBalance)) {
      return;
    }

    if(checkLengthDecimalPoint(value,dataToken.assetsDecimals)) {
      return;
    }

    // kiêm tra input number
    let pattern = /^\d+\.?\d*$/;
    if (pattern.test(value)) {
      setAmount(value);
      setValues([value]);
      changeDebounceValueNewHF(value)
    }
  };


  // New health factor 
  const changeDebounceValueNewHF = debounce(value => handlerNewHF(value), 500);
  const  handlerNewHF = async (amount_collaterral) => {  
    const value = await dispatch(actions.newHealthFactor(dataToken.assetsAddress,0,-amount_collaterral,assetThreshold));
    setNewHealthFactor(value);
  }

  const handlerStepToStep = (e) => {
    if (step === 1 && amount > 0) {
      setStep(2);
    }
  };

  const showCheckStepContinue = () => {
    if (step === 1 && amount > 0) {
      return true;
    }
  };

  const showBtnView = () => {
    let btn = "";
    if (dataToken) {
      //btn = <BtnWithdraw dataToken={dataToken} pending={pending} amount={amount} />

      if (accountApprove === 0) {
        btn = <BtnWithdrawApprove dataToken={dataToken} pending={pending} />;
      } else {
        btn = (
          <BtnWithdraw
            dataToken={dataToken}
            pending={pending}
            amount={amount}
          />
        );
      }
    }

    return btn;
  };

  return (
    <Modal
      // isOpen={Object.keys(data).length > 0 ? true : false}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay-lur"
    >
      <GradientStrokeWrapper className="-z-50" borderRadius="1rem"  />
      
      <div className="header-modal">
        <h2>Withdraw {dataToken ? dataToken.assetsSymbol : ""}</h2>
        <button className="btn-modal-close" onClick={closeModal}></button>
      </div>

      <div className="content-modal">
        {/* STEP 1 */}
        <div className={step === 1 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-poppins text-center text-[16px] text-[#A0D911] leading-6">
              Withdraw
            </p>
            <p className="w-4/5 font-poppins text-[14px] text-center text-[#D9D9D9] leading-6 m-auto pt-4">
              How much do you want to withdraw?
            </p>
          </div>

          <div className="flex justify-between px-8 mt-12 text-[14px] font-poppins">
            <div className="text-[#FAFAFA]">Available to withdraw</div>
            <div>
              <span className="font-poppins font-bold inline-block">
                {loading === false && dataToken ? (
                  numberWithCommas(accountBalance, dataToken.assetsDecimals)
                ) : (
                  <TailSpin className="w-4 h-4 mr-2" />
                )}
              </span>
              <span className="text-[#BFBFBF] pl-2">
                {dataToken ? dataToken.assetsSymbol : ""}
              </span>
            </div>
          </div>

          <div className="border-input-modal rounded-lg flex flex-row mt-2 mx-8 py-4 px-4 justify-between">
            <img
              className="w-12 h-8 pr-3"
              src={dataToken ? dataToken.icon : ""}
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
                onChangeRangeAmount([accountBalance]);
              }}
              className="font-poppins font-bold text-[#A0D911] text-[16px] cursor-pointer"
            >
              Max
            </span>
          </div>

          {/* <div className="flex justify-between px-8 mt-12 font-poppins text-sm leading-4 text-slate-200">

            <label>Safer</label>

            {amount > 0 ? <div>New health factor <AccountHealthFactor key="withdraw-NHF-1" value={newHealthFactor} /></div>:""}

            <label>Riskier</label>
          </div>

          <div className="px-8">
            {loading === false && Number(accountBalance) > 0 ? (
              <Range
                step={1}
                min={0}
                max={accountBalance}
                values={values}
                onChange={(values) => {
                  onChangeRangeAmount(values);
                }}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-3 pr-2 my-4 bg-gradient-range-amount rounded-md"
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-3 h-3 transform translate-x-10 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                )}
              />
            ) : (
              ""
            )}
          </div>
           */}
        </div>

        {/* STEP 2 */}
        <div className={step === 2 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-poppins text-center text-[16px] text-[#A0D911] leading-6">
              Withdraw overview
            </p>
            <p className="w-4/5 font-poppins text-[14spx] text-center text-[#D9D9D9] leading-6 m-auto pt-4">
              These are your transaction details. Make sure to check if this is
              correct before submitting
            </p>
          </div>

          <div className="border rounded-lg border-solid border-[#4F92A7] mx-8 p-6 mt-10">
            <div className="flex justify-between text-base font-poppins">
              <div className="text-[#FAFAFA] font-light">Amount</div>
              <div className="flex items-center">
                <img
                  className="w-6 h-6"
                  src={dataToken ? dataToken.icon : ""}
                  alt="Token VEBank"
                />
                <span className="font-poppins font-bold pl-2">{numberWithCommas(amount)}</span>
                <span className="text-[#BFBFBF] pl-2">
                  {dataToken ? dataToken.assetsSymbol : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg border-solid border-[#4F92A7] mx-8 my-12">

            <div className="flex justify-between text-base font-poppins bg-[#0F1B2F] rounded-tl-lg rounded-tr-lg">
              <div
                className={`rounded-tl-lg leading-6 text-[#FAFAFA] text-base text-center font-light  w-1/2 p-1 bg-btn-veb ${
                  pending === true ? "bg-pending" : ""
                } ${transaction ? "bg-success" : ""}`}
              >
                1 Withdraw
              </div>
              <div className="w-[1px] h-full bg-[#1D1A3F]"></div>
              <div
                className={`rounded-tr-lg leading-6 text-[#FAFAFA] text-base text-center font-light w-1/2 p-1 ${
                  pending === true ? "bg-pending" : ""
                } ${transaction ? "bg-success" : ""}`}
              >
                2 {pending ? "Pending" : "Finished"}
              </div>
            </div>

            <div className="flex justify-between text-base font-poppins p-6">
              <div>
                <div className="font-light text-base">
                  {transaction ? (
                    <label className="text-[#50e3ab]">2/2 Withdraw</label>
                  ) : (
                    <>
                      <label className="text-[#50e3ab]">1/2 Withdraw</label>
                      <div className="text-[#FAFAFA] pt-2">
                        Please submit to Withdraw
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="pt-1 flex flex-row">
                {pending ? <TailSpin className="w-6 h-6 m-4" /> : ""}

                {
                  transaction ? (
                    <button
                      onClick={(e) => {
                        closeModalAndDashboard(e);
                      }}
                      className={`btn-modal-veb bg-btn-veb`}
                      type="submit"
                    >
                      Dashboard
                    </button>
                  ) : (
                    showBtnView()
                  )
                  // <BtnWithdraw pending={pending} amount={amount} rate={rate} />
                }
              </div>
            </div>

            {transaction || pending === true ? (
                <ExplorerLend name="Withdraw" transaction={transaction} />
                ) : (
                  ""
                )}

          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="footer-modal px-8 py-12">
          <button
            onClick={(e) => {
              handlerStepToStep(e);
            }}
            className={`btn-modal-veb w-full ${
              showCheckStepContinue() ? "bg-btn-veb" : ""
            } `}
          >
            Continue
          </button>
        </div>
      ) : (
        ""
      )}
    </Modal>
  );
};

export default ModalWithdraw;
