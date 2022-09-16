import React, { useCallback, useRef, useState } from "react";
import "./styles.scss";

import { nFormatter } from "../../../utils/lib";
import IcBackWhite from "../../../assets/images/buttons/ic_back_white.svg";
import IcPlusGradient from "../../../assets/images/buttons/ic_plus_gradient.svg";
import IcSandClock from "../../../assets/images/img_sand_clock.svg";
import IcTransfer from "../../../assets/images/ic_transfer.svg";
import IcDown from "../../../assets/images/down_fill.svg";

import Asset from "./Asset";
import useAddLiquidFacade from "./useAddLiquidFacade";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";

import BtnLiquidityApproveA from "./BtnLiquidityApproveA";
import BtnLiquidityApproveB from "./BtnLiquidityApproveB";
import { useSelector } from "react-redux";
import {
  selectReserveA,
  selectReserveB,
} from "../../../reducers/liquid.reducer";
import { formatBalanceString } from "../../../utils/lib";
import { constants } from "buffer";

const FormAddLiquidity = () => {
  const {
    step,
    firstToken,
    secondToken,
    shareAPool,
    firstTokenVolume,
    continueAvailable,
    secondTokenVolume,
    primaryButtonLabel,
    approveFirstToken,
    approveSecondToken,
    firstTokenInfo,
    secondTokenInfo,
    firstPerSecondTokenExchangeRate,
    secondPerFirstTokenExchangeRate,
    slippage,
    refInputToken,
    onChangeSlippage,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    closeModalAndDashboard,
    handlerStepToStep,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  } = useAddLiquidFacade();

  // const refInputFirstToken = useRef();
  // const refInputSecondToken = useRef();
  const { refInputFirstToken, refInputSecondToken } = refInputToken;
  const [expand, setExpand] = useState(true);
  const [swapExchangeRate, setSwapExchangeRate] = useState(false);
  const reserveA = useSelector(selectReserveA);
  const reserveB = useSelector(selectReserveB);

  const onChangeExchangeRate = (swapExchangeRateFlag) => {
    if (!swapExchangeRateFlag) {
      return `1 ${
        secondTokenInfo?.assetsSymbol
      } ≈ ${secondPerFirstTokenExchangeRate.toString()} ${
        firstTokenInfo?.assetsSymbol
      }`;
    } else {
      return `1 ${
        firstTokenInfo?.assetsSymbol
      } ≈ ${firstPerSecondTokenExchangeRate.toString()} ${
        secondTokenInfo?.assetsSymbol
      }`;
    }
  };

  const showMaxAmount = () => {
    return formatBalanceString(
      Number(secondTokenVolume) + Number(secondTokenVolume) * (slippage / 100)
    );
  };
  const showConfirmButton = useCallback(() => {
    if (step === 1) {
      if (approveFirstToken < firstTokenVolume) {
        return <BtnLiquidityApproveA tokenAddress={firstToken} />;
      } else if (approveSecondToken < secondTokenVolume) {
        return <BtnLiquidityApproveB tokenAddress={secondToken} />;
      }
    }

    return (
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
    );
  }, [
    step,
    continueAvailable,
    primaryButtonLabel,
    approveFirstToken,
    firstTokenVolume,
    approveSecondToken,
    secondTokenVolume,
    firstToken,
    secondToken,
    handlerStepToStep,
  ]);
  return (
    <div className="w-[550px] rounded-2xl p-10 bg-[#182233] mx-auto relative z-0">
      {/*Header*/}
      <GradientStrokeWrapper borderRadius="1rem" className="-z-10" />
      <div className="flex flex-row flex-1 items-center justify-between">
        <div className="flex flex-row items-center space-x-6">
          {step === 1 && (
            <img
              src={IcBackWhite}
              alt="Back"
              className="cursor-pointer w-12 h-12"
              onClick={closeModalAndDashboard}
            />
          )}
          <div className="flex flex-col">
            <span className="text-white text-2xl font-poppins_medium">
              Add Liquidity
            </span>
          </div>
        </div>
      </div>

      <div className="content-modal mt-8 z-50">
        {/* STEP 1 */}
        <div
          className={`${
            step === 1 || step === 3 ? "" : "hidden"
          } flex flex-1 flex-col justify-center`}
        >
          <Asset
            refInput={refInputFirstToken}
            assetAddress={firstToken}
            volume={firstTokenVolume}
            onVolumeChange={onChangeFirstTokenAmount}
            onClickSelectCurrency={onSelectFirstCurrency}
          />
          <img
            src={IcPlusGradient}
            alt="Add"
            className="w-7 h-7 mt-4 self-center"
          />
          <Asset
            refInput={refInputSecondToken}
            assetAddress={secondToken}
            volume={secondTokenVolume}
            onVolumeChange={onChangeSecondTokenAmount}
            onClickSelectCurrency={onSelectSecondCurrency}
            className="mt-8"
          />

          {firstToken &&
          secondToken &&
          firstTokenVolume > 0 &&
          secondTokenVolume > 0 &&
          firstPerSecondTokenExchangeRate &&
          secondPerFirstTokenExchangeRate ? (
            <div className="flex flex-col">
              <div className="flex flex-row justify-between px-3 py-4 border border-vbDisableText rounded-lg mt-6">
                <div className="flex flex-row item-center">
                  <img
                    className="w-4 h-4 my-auto cursor-pointer"
                    src={IcTransfer}
                    alt=""
                    onClick={() => setSwapExchangeRate(!swapExchangeRate)}
                  />
                  <div className="flex flex-row items-center ml-3">
                    {/* <span className="font-poppins text-[14px] text-white">{`1 ${firstTokenInfo?.assetsSymbol} ≈ ${firstPerSecondTokenExchangeRate.toString()} ${secondTokenInfo?.assetsSymbol}`}</span> */}
                    <span className="font-poppins text-[14px] text-white">
                      {onChangeExchangeRate(!swapExchangeRate)}
                    </span>
                  </div>
                </div>
                <img
                  className={`${
                    expand ? "rotate-180" : ""
                  } transition-transform delay-350 w-4 cursor-pointer`}
                  src={IcDown}
                  alt=""
                  onClick={() => setExpand(!expand)}
                />
              </div>
              {expand && (
                <div className="fade-in-box flex flex-col px-3 py-4 border border-vbDisableText rounded-lg mt-6 space-y-3">
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white">Base</span>
                    <span className="font-poppins_medium text-[14px] text-white">
                      {firstTokenInfo?.assetsSymbol}
                    </span>
                  </div>
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white">Max Amount</span>
                    <span className="font-poppins_medium text-[14px] text-white">
                      {showMaxAmount()} {secondTokenInfo?.assetsSymbol}
                    </span>
                  </div>
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white">
                      Pool liquidity ({firstTokenInfo?.assetsSymbol})
                    </span>
                    <span className="font-poppins_medium text-[14px] text-white">{`${formatBalanceString(
                      reserveA
                    )} ${firstTokenInfo?.assetsSymbol}`}</span>
                  </div>
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white">
                      Pool liquidity ({secondTokenInfo?.assetsSymbol})
                    </span>
                    <span className="font-poppins_medium text-[14px] text-white">{`${reserveB} ${secondTokenInfo?.assetsSymbol}`}</span>
                  </div>
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white">
                      Share of pool
                    </span>
                    <span className="font-poppins_medium text-[14px] text-white">
                      {shareAPool < 0.01 ? "<0,01" : nFormatter(shareAPool, 8)}%
                    </span>
                  </div>
                  <div className="flex flex-row item-center justify-between py-1">
                    <span className="text-[14px] text-white my-auto">
                      Slippage Tolerance
                    </span>
                    <div className="flex flex-row item-center border border-vbDisableText rounded px-2 py-1">
                      <input
                        placeholder="0.5"
                        value={slippage}
                        onChange={(e) => onChangeSlippage(e.target.value)}
                        onBlur={(event) => {
                          if (event.target.value === "") {
                            onChangeSlippage("0.5");
                          }
                        }}
                        className="font-poppins_medium text-[14px] text-white text-right bg-transparent focus:outline-none w-[50px] placeholder-vbDisableText"
                        type="text"
                      />
                      <span className="font-poppins_medium text-[14px] text-white ml-[2px]">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        {/* STEP 3 */}
        <div
          className={`${
            step === 2 ? "" : "hidden"
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
              Supplying {firstTokenVolume} {firstTokenInfo?.assetsSymbol} and{" "}
              {secondTokenVolume} {secondTokenInfo?.assetsSymbol}
            </p>
            <p className="text-lg text-center text-[#678BCA] cursor-pointer">
              Confirm this transaction in your wallet
            </p>
          </div>
        </div>
      </div>
      {step !== 2 && (
        <div className="footer-modal mt-8">{showConfirmButton()}</div>
      )}
    </div>
  );
};

export default FormAddLiquidity;
