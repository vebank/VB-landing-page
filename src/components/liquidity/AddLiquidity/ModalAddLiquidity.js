import React from "react";
import Modal from "react-modal";
import "./styles.scss";

import { numberWithCommas } from "../../../utils/lib";
import IcCloseWhite from "../../../assets/images/buttons/ic_close.svg";
import IcWarningCircle from "../../../assets/images/ic-warning-circle.svg";
import IcBackWhite from "../../../assets/images/buttons/ic_back_white.svg";
import IcSettingWhite from "../../../assets/images/buttons/ic_setting_white.svg";
import IcHistoryWhite from "../../../assets/images/buttons/ic_history_white.svg";
import IcPlusGradient from "../../../assets/images/buttons/ic_plus_gradient.svg";
import IcSandClock from "../../../assets/images/img_sand_clock.svg";
import IcCollapse from "../../../assets/images/buttons/ic_collapse.svg";
import IcQuestionCircle from "../../../assets/images/buttons/ic_question_outline.svg";

import Assets from "./Asset";
import useAddLiquidFacade from "./hook";
import LiquidPairIcon from "../../partials/LiquidPairIcon";
import SecondaryButton from "../../partials/SecondaryButton";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../constants/partial.constants";

const customStyles = {
  content: {
    top: "31%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderRadius: "1rem",
    borderWidth: "0px",
    // borderColor: "#3EE8FF",
    padding: "2.5rem",
    position: "relative",
    width: "32%",
    // width: "460px",
  },
};

const ModalAddLiquidity = () => {
  const {
    step,
    firstToken,
    secondToken,
    firstTokenVolume,
    continueAvailable,
    secondTokenVolume,
    primaryButtonLabel,
    isAddLiquidModalOpen,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    closeModalAndDashboard,
    handlerStepToStep,
    handleAddLiquidity,
    removeLiquidity,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  } = useAddLiquidFacade();

  // useEffect(() => {
  //   const firstTokenVolumeValue = firstTokenVolume?.current?.value ?? 0;
  //   const secondTokenVolumeValue = secondTokenVolume?.current?.value ?? 0;
  //   if (firstTokenVolumeValue > 0 && secondTokenVolumeValue > 0) {

  //   }
  // }, [firstTokenVolume?.current?.value, secondTokenVolume?.current?.value])

  return (
    <Modal
      isOpen={isAddLiquidModalOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay"
    >
      {/*Header*/}
      <GradientStrokeWrapper
        colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
        borderRadius="1rem"
        className="-z-50"
      />
      {step !== 1 && step !== 4 ? (
        <div className="flex flex-row flex-1 items-center justify-between">
          <p className="font-poppins_medium text-white text-3xl">
            You will receive
          </p>
          <img
            src={IcCloseWhite}
            alt=""
            className="cursor-pointer"
            onClick={closeModalAndDashboard}
          />
        </div>
      ) : (
        <div className="flex flex-row flex-1 items-center justify-between">
          {/* <button className="btn-modal-back" onClick={closeModal} /> */}
          <div className="flex flex-row items-center space-x-6">
            {step === 1 && (
              <img
                src={IcBackWhite}
                alt="Back"
                className="cursor-pointer w-12 h-12"
                onClick={closeModalAndDashboard}
              />
            )}
            <div className="flex flex-col space-y-4">
              <span className="text-white text-2xl font-poppins_medium">
                Add Liquidity
              </span>
              <div className="flex flex-row items-center space-x-1">
                {step !== 4 && (
                  <img
                    src={IcQuestionCircle}
                    alt=""
                    className="w-4 h-4 cursor-pointer"
                  />
                )}
                <span className="text-white text-base font-poppins_light">
                  {step !== 4 ? "Add liquidity to receive LP tokens" : "Remove liquidity to receive tokens back"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-8">
            <img
              src={IcSettingWhite}
              alt="Setting"
              className="w-8 h-8 cursor-pointer"
              // onClick={closeModal}
            />
            <img
              src={IcHistoryWhite}
              alt="History"
              className="w-8 h-8 cursor-pointer"
              // onClick={closeModal}
            />
          </div>
        </div>
      )}

      <div className="content-modal mt-8">
        {/* STEP 1 */}
        <div
          className={`${
            step === 1 ? "" : "hidden"
          } flex flex-1 flex-col justify-center`}
        >
          <Assets
            assetAddress={firstToken}
            volume={firstTokenVolume}
            onVolumeChange={onChangeFirstTokenAmount}
            onClickSelectCurrency={onSelectFirstCurrency}
          />
          <img
            src={IcPlusGradient}
            alt="Add"
            className="w-8 h-8 mt-4 self-center"
          />
          <Assets
            assetAddress={secondToken}
            volume={secondTokenVolume}
            onVolumeChange={onChangeSecondTokenAmount}
            onClickSelectCurrency={onSelectSecondCurrency}
            className="mt-8"
          />

          {firstToken && secondToken && (
            <div className="flex flex-1 flex-col mt-8">
              <p className="text-xl text-grey-2">Price and pool share</p>
              <div className="flex flex-1 flex-row justify-between items-center mt-4 px-2 py-5 liquid-wrapper">
                <div className="price-pool-item">
                  <p className="value">323.366</p>
                  <p className="label">VEUSB per VET</p>
                </div>
                <div className="price-pool-item">
                  <p className="value">0.0686648</p>
                  <p className="label">VET per VEUSD</p>
                </div>
                <div className="price-pool-item">
                  <p className="value">{"<0,01%"}</p>
                  <p className="label">Share of Pool</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className={`${step === 2 ? "" : "hidden"} flex flex-col`}>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row items-center">
              <p className=" text-4xl font-poppins_medium mr-8">0,0390929</p>
              <div className="flex flex-row space-x-3">
                <img src={firstToken?.icon} alt="" className="w-8 h-8" />
                <img src={secondToken?.icon} alt="" className="w-8 h-8" />
              </div>
            </div>
            <p className="text-xl">VET/VEUSD Pool Tokens</p>
            <p className="text-base text-justify font-poppins_light">
              Output is estimated. If the price changes by more than 0.5% your
              transaction will revert.
            </p>
          </div>
          <p className="mt-8 font-poppins text-xl">Price and pool share</p>
          <div className="flex flex-col mt-4 px-4 py-6 space-y-[1.75rem] liquid-wrapper">
            <div className="price-pool-share-row">
              <p className="font-poppins_light">VET Deposited</p>
              <div className="flex flex-row items-center space-x-4">
                <img src={firstToken?.icon} alt="" className="w-8 h-8" />
                <span className="font-poppins_semi_bold text-2xl">
                  {numberWithCommas(firstTokenVolume)}
                </span>
              </div>
            </div>
            <div className="price-pool-share-row">
              <p className="font-poppins_light">VEUSD Deposited</p>
              <div className="flex flex-row items-center space-x-4">
                <img src={secondToken?.icon} alt="" className="w-8 h-8" />
                <span className="font-poppins_semi_bold text-2xl">
                  {numberWithCommas(secondTokenVolume)}
                </span>
              </div>
            </div>
            <div className="price-pool-share-row items-start">
              <p className="self-start font-poppins_light">Rates</p>
              <div className="flex flex-col justify-end">
                <p className="text-right">1 VET = 565 VEUSD</p>
                <p className="text-right">1 VEUSD = 0.0234 VET</p>
              </div>
            </div>
            <div className="price-pool-share-row">
              <p>Share a Pool</p>
              <p>0.00005958%</p>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div
          className={`${
            step === 3 ? "" : "hidden"
          } flex flex-col justify-center -mt-8`}
        >
          <img
            src={IcSandClock}
            alt=""
            className="transition delay-500 animate-[spin_1.5s_ease-in-out_infinite] w-55 h-55 self-center my-12"
          />
          <div className="flex flex-col space-y-4">
            <p className="text-4xl text-center">Waiting For Confirmation</p>
            <p className="text-lg text-center">
              Supplying 5,000 VET and 9,000 VEUSD
            </p>
            <p className="text-lg text-center text-[#678BCA] cursor-pointer">
              Confirm this transaction in your wallet
            </p>
          </div>
        </div>

        {/* STEP 4 */}
        <div
          className={`${
            step === 4 ? "" : "hidden"
          } flex flex-col justify-center`}
        >
          <div className="liquid-wrapper px-4 py-6 col-y-center">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-4">
                  <LiquidPairIcon
                    iconAsset1={firstToken?.icon}
                    iconAsset2={secondToken?.icon}
                    iconSize="8"
                  />
                  <p className="font-poppins_semi_bold text-xl">{`${firstToken?.assetsSymbol}/${secondToken?.assetsSymbol}`}</p>
                </div>
                <p className="w-2/3 text-xl text-grey-2 font-poppins_light">0.03908</p>
              </div>
              <img src={IcCollapse} alt="" className="w-11 h-11" />
            </div>
            <div className="col mt-10 space-y-6">
              <div className="full-row-between-center space-x-4">
                <img src={firstToken?.icon} alt="" className="w-8 h-8" />
                <p className="flex-grow font-poppins_semi_bold text-xl">{`Pooled ${firstToken?.assetsSymbol}`}</p>
                <p className="text-xl font-poppins_light">
                  {numberWithCommas(firstTokenVolume)}
                </p>
              </div>
              <div className="full-row-between-center space-x-4">
                <img src={secondToken?.icon} alt="" className="w-8 h-8" />
                <p className="flex-grow font-poppins_semi_bold text-xl">{`Pooled ${secondToken?.assetsSymbol}`}</p>
                <p className="text-xl font-poppins_light">
                  {numberWithCommas(secondTokenVolume)}
                </p>
              </div>
              <div className="full-row-between-center">
                <p className="text-vbLine text-xl font-poppins_light">
                  Share a Pool
                </p>
                <p className="text-vbLine text-xl font-poppins_light">
                  {"<0.01%"}
                </p>
              </div>
            </div>
            <button
              onClick={removeLiquidity}
              className="btn-modal-veb w-full h-16.5 mt-10 text-lg font-poppins_medium bg-btn-veb"
            >
              Remove
            </button>
            <p
              onClick={handleAddLiquidity}
              className="flex flex-1 self-center text-[#22D4EC] mt-6 text-lg font-poppins_medium text-center cursor-pointer"
            >
              + Add liquidity instead
            </p>
          </div>
          <p className="mt-8 self-center text-xl font-poppins_light text-[#678BCA]">
            Don’t see a pool you joined?
          </p>
          {/* <button className="text-base text-[#0CD2EC] bor"></button> */}
          <SecondaryButton
            label="Find other LP tokens"
            labelColor="#0CD2EC"
            className="mt-4 w-48 h-11 rounded-lg btn-modal-secondary self-center"
            labelClassName="text-base"
            borderRadius="0.5rem"
          />
        </div>
      </div>

      {step === 1 || step === 2 || step === 4 ? (
        <div className="footer-modal mt-8">
          <button
            onClick={(e) => {
              handlerStepToStep(e);
            }}
            className={`btn-modal-veb w-full ${
              continueAvailable ? "bg-btn-veb" : ""
            }`}
            disabled={!continueAvailable}
          >
            {primaryButtonLabel}
          </button>
        </div>
      ) : (
        ""
      )}
    </Modal>
  );
};

export default ModalAddLiquidity;
