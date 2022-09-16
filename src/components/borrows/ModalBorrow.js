import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Range } from "react-range";
import { TailSpin } from "react-loading-icons";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { checkLengthDecimalPoint, formatLocaleString, nFormatter, numberWithCommas, truncate } from "../../utils/lib";

import debounce from 'lodash.debounce';

import { marketplaceConstants } from "../../constants";

import IcNext1 from "../../assets/images/ic_factory.svg";

import BtnBorrow from "./BtnBorrow";
import BtnBorrowApprove from "./BtnBorrowApprove";

import * as actions from "../../actions";
import useAutoFocus from "../common/hooks/useAutoFocus";
import CurrencyAssetsUSD from "../markets/CurrencyAssetsUSD";
import AccountHealthFactor from "../account/AccountHealthFactor";
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

const ModalBorrow = () => {
  const [amount, setAmount] = useState("");
  const [values, setValues] = useState([0]);
  const [newHealthFactor, setNewHealthFactor] = useState(0);
  
  const [step, setStep] = useState(1);
  const [rate, setRate] = useState(2);

  const {
    dataToken,
    accountBalance,
    accountApprove,
    loading,
    assetThreshold,
    errorCode,
    message,
    transaction,
    pending,
    isOpen,
  } = useSelector((state) => state.borrowReducer, shallowEqual);

  const dispatch = useDispatch();
  const amountInputRef = useAutoFocus();

  useEffect(() => {
    resetFrm();
  }, [dataToken]);

  useEffect(() => {
    setStep(1);
    setAmount("");
  }, [isOpen]);

  const resetFrm = () => {
    setAmount("");
    setValues([0]);
    setStep(1);
    setRate(2);
  };

  const closeModal = () => {
    resetFrm();
    dispatch({
      type: marketplaceConstants.MODAL_CLOSE_BORROW_MARKET,
    });
    if (transaction) {
      //dispatch(actions.reloadAccountAssets());
    }
  };

  const closeModalAndDashboard = () => {
    closeModal();
    resetFrm();
  };

  const onChangeRangeAmount = (values) => {
    setValues(values);
    setAmount(values[0]);
    changeDebounceValueNewHF(values[0]);
  };

  const onChangeAmount = (e) => {

    const { value } = e.target;

    if (loading) {
      return;
    }

    // Giá trị rỗng
    if (value === "") {
      setAmount(value);
      setValues([0]);
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
      setValues([Number(value)]);
      changeDebounceValueNewHF(value);
    }

  };

  const handlerStepToStep = (e) => {
    if (step === 1 && amount > 0) {
      setStep(2);
    }

    if (step === 2 && rate > 0) {
      setStep(3);
    }
  };

  const handlerChangeRate = (value) => {
    setRate(value);
  };

  // New health factor 
  const changeDebounceValueNewHF = debounce(value => handlerNewHF(value), 500);
  const  handlerNewHF = async (amount_debt) => {  
    const value = await dispatch(actions.newHealthFactor(dataToken.assetsAddress,amount_debt,0,assetThreshold));
    setNewHealthFactor(value);
  }
  
  const showCheckStepContinue = () => {

    if (step === 1 && amount > 0) {
      return true;
    }

    if (step === 2 && (rate === 1 || rate === 2)) {
      return true;
    }
    
  };

  const showBtnView = () => {
    let btn = "";
    if (dataToken) {
      if (accountApprove === 0) {
        btn = (
          <BtnBorrowApprove
            dataToken={dataToken}
            pending={pending}
            rate={rate}
          />
        );
      } else {
        btn = (
          <BtnBorrow
            dataToken={dataToken}
            pending={pending}
            amount={amount}
            rate={rate}
          />
        );
      }
    }
    return btn;
  };

  if (!dataToken) {
    return <></>;
  }

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      style={customStyles}
      onRequestClose={closeModal}
      portalClassName="modal-veb"
      overlayClassName="overlay-lur"
    >
      
      <GradientStrokeWrapper className="-z-50" borderRadius="1rem"  />
      <div className="header-modal">
        <h2>Borrow {dataToken ? dataToken.assetsSymbol : ""}</h2>
        <button className="btn-modal-close" onClick={closeModal}></button>
      </div>

      <div className="content-modal">
        {/* STEP 1 */}
        <div className={step === 1 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-poppins text-center text-[16px] text-[#A0D911] leading-6">
              How much would you like to borrow?
            </p>
            <p className="w-4/5 font-poppins text-[14px] text-center text-[#D9D9D9] leading-6 m-auto pt-4">
              Please enter an amount you would like to borrow. The maximum
              amount you can borrow is shown below.
            </p>
          </div>

          <div className="flex justify-between px-8 mt-12 text-[14px] font-poppins">
            <div className="text-[#FAFAFA]">Available to borrow</div>
            <div>
              <span className="font-poppins font-bold inline-block">
                {loading === false ? (
                  numberWithCommas(accountBalance,dataToken.assetsDecimals)
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
              value={amount}
              ref={amountInputRef}
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

          <div className="flex justify-between px-8 mt-12 font-poppins text-sm leading-4 text-slate-200">
            <label>Safer</label>
            {amount > 0 ?   
            <div className="font-poppins font-light">
                New health factor <AccountHealthFactor key="borrow-NHF-1"  value={newHealthFactor} />
              </div> : ""}
              <label>Riskier</label>
          </div>

          <div className="px-8">
          
            {isOpen === true && loading === false && Number(accountBalance) > 0 ? (
              <Range
                step={accountBalance < 1? 0.1:1}
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
                    className="w-4 h-4 transform translate-x-10 bg-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                )}
              />
            ) : (
              ""
            )}
          </div>
        </div>

        {/* STEP 2 */}
        <div className={step === 2 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-poppins text-center text-[16px] text-[#A0D911] leading-6">
              Please select your interest rate
            </p>
            <p className="w-4/5 font-poppins text-[14px] text-center text-[#D9D9D9] leading-6 m-auto pt-4">
              Choose either stable or variable APY for your loan. Please click
              on the desired rate type and read the info box for more
              information on each option.
            </p>
          </div>

          <div className="flex flex-row space-x-6 justify-center px-16 my-12 text-lg font-poppins text-[#FAFAFA]">
            {/* <div onClick={e => { handlerChangeRate(1) }} className={`basis-1/2 bg-[#20314E] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${rate === 1 ? "bg-gradient-border" : ""}`}>
                            <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                                <img src={IcNext} alt={"next"} className="w-7 h-7" />
                            </div>
                            <div className='pt-6 text-base'>Stable APY</div>
                            <div className='pt-1 font-bold text-sm'>6.21 %</div>
                        </div> */}
            <div
              onClick={(e) => {
                handlerChangeRate(2);
              }}
              className={`basis-1/2 bg-[#20314E] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${
                rate === 2 ? "bg-gradient-border" : ""
              }`}
            >
              <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                <img src={IcNext1} alt={"next"} className="w-7 h-7" />
              </div>
              <div className="pt-6 text-base">Variable APY</div>
              <div className="pt-1 font-bold text-sm">{dataToken && dataToken.borrowAPY > 0 ? nFormatter(dataToken.borrowAPY,2) :0} %</div>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={step === 3 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-poppins text-center text-[16px] text-[#A0D911] leading-6">
              Borrow overview
            </p>
            <p className="w-4/5 font-poppins text-[14px] text-center text-[#D9D9D9] leading-6 m-auto pt-4">
              These are your transaction details. Make sure to check if this is
              correct before submitting.
            </p>
          </div>

          <div className="border rounded-lg border-solid border-[#4B5C86] mx-8 p-6 mt-10">
            <div className="flex justify-between text-base font-poppins">
              <div className="text-[#FAFAFA] font-light">Amount</div>
              <div className="flex items-center">
                <img
                  className="w-6 h-6"
                  src={dataToken ? dataToken.icon : ""}
                  alt="Token VEBank"
                />
                <span className="font-poppins font-bold pl-2">
                  {numberWithCommas(amount)}
                </span>
                <span className="text-[#BFBFBF] pl-2">
                  {dataToken ? dataToken.assetsSymbol : ""}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base font-poppins">
              <div className="text-[#FAFAFA]"></div>
              <div>
                <span className="font-poppins font-thin text-sm">
                  <CurrencyAssetsUSD
                    currencyBalance={amount}
                    assetsAddress={dataToken.assetsAddress}
                  />
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">Interest (APY)</div>
              <div>
                <span className="font-poppins font-bold">{dataToken && dataToken.borrowAPY > 0 ? nFormatter(dataToken.borrowAPY,2) :""} %</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">
                Interest rate type
              </div>
              <div>
                <span className="font-poppins font-bold">Variable</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">New health factor</div>
              <div className="font-bold">
                <AccountHealthFactor key="borrow-NHF-2" value={newHealthFactor} />
                {/* {newHealthFactor < 5 ?<span className="font-poppins font-bold text-[#FF4D4F]">{newHealthFactor}</span> :<span className="font-poppins font-bold text-[#A0D911]">{newHealthFactor}</span> } */}
              </div>
            </div>
          </div>

          <div className="border rounded-lg border-solid border-[#4B5C86] mx-8 my-12">
            <div className="flex justify-between text-base font-poppins bg-[#0F1B2F] rounded-tl-lg rounded-tr-lg">
              <div
                className={`rounded-tl-lg leading-6 text-[#FAFAFA] text-base text-center font-light  w-1/2 p-1 bg-btn-veb ${
                  pending === true ? "bg-pending" : ""
                } ${transaction ? "bg-success" : ""}`}
              >
                1 Borrow
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
                    <label className="text-[#50e3ab]">2/2 Borrow</label>
                  ) : (
                    <>
                      <label className="text-[#50e3ab]">1/2 Borrow</label>
                      <div className="text-[#FAFAFA] pt-2">
                        Please submit to borrow
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
                  // <BtnBorrow pending={pending} amount={amount} rate={rate} />
                }
              </div>

            </div>

              { transaction || pending === true ? (
              <ExplorerLend name="Borrow" transaction={transaction} />
              ) : ("")}

          </div>
        </div>

    
      </div>

      {step === 1 || step === 2 ? (
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

export default ModalBorrow;
