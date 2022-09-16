import "./styles.scss";
import React from "react";
import Tooltip from "./Tooltip";
import useSwapFacade from "./hooks";
import { swapConstants } from "../../constants";
import { formatBalanceString } from "../../utils/lib";
import { svgSymbolConfig } from "../../_helpers/param";
import HighlightedAssetIcon from "./HighlightedAssetIcon";

import IcBtnSwap from "../../assets/images/swap_btn.svg";
import IcDown from "../../assets/images/down_fill.svg";
import IcUp from "../../assets/images/up_fill.svg";
import IcDropDown from "../../assets/images/ic_dropdown.svg";
import BtnConnectInPage from "../account/BtnConnectInPage";
import IcSwitch from "../../assets/images/vertical_switch.svg";
import IcQuestionCircleBlue from "../../assets/images/question_circle_blue.svg";
import { ONE_BIPS } from "../../hooks/constants";

const Swap = () => {
  const {
    error,
    account,
    isSwitch,
    namePool,
    loadingFee,
    priceUpdate,
    pricePaidPerA,
    pricePaidPerB,
    userInputRef,
    realizedLPFee,
    inputAmountIn,
    amountOutMin,
    inputAmountOut,
    inputSlippage,
    sourceTokenInfo,
    desireTokenInfo,
    sourceTokenBalance,
    desireTokenBalance,
    vthoBalance,
    onSwapAssetToken,
    onSwapDesireToken,
    priceImpactWithoutFee,
    onShowModalSelectToken,
    onChangeDesireInput,
    onChangeSourceInput,
    accountApprove,
    onApproveToken,
    loadingSwap,
    loadingExchangeRate,
    onShowDetailInfo,
    showDetailInfo,
    emptyAddress,
    loadingApprove,
    onCheckExchangeRatePool,
    onSwitchExchangeRate,
    onChangeSlippage,
    onUpdatePriceChange,
  } = useSwapFacade();

  const errExistedLiquidity = "Not existed liquidity.";

  const renderTitleButton = () => {
    if (error !== "") {
      return error;
    } else {
      if (accountApprove === 0) {
        return (
          <div className="flex flex-row items-center justify-center space-x-2 w-full">
            {loadingApprove && <div className="loading" />}
            <p>{loadingApprove ? "Approving..." : "Approve"}</p>
          </div>
        );
      } else {
        return (
          <div className="flex flex-row items-center justify-center space-x-2 w-full">
            {loadingSwap && <div className="loading" />}
            <p>{loadingSwap ? "Swapping..." : "Swap"}</p>
          </div>
        );
      }
    }
  };

  const renderPriceImpact = () => {
    const priceImpactFixed = priceImpactWithoutFee?.toFixed(2);
    if (priceImpactWithoutFee?.lessThan(ONE_BIPS)) {
      return <p className="text-vbLine">{` <0.01%`}</p>;
    } else if (priceImpactFixed < 1) {
      return <p className="text-vbLine">{priceImpactFixed}%</p>;
    } else if (priceImpactFixed > 1 && priceImpactFixed <= 3) {
      return <p className="text-white"> {priceImpactFixed}% </p>;
    } else if (priceImpactFixed > 3 && priceImpactFixed <= 5) {
      return <p className="text-notiWarning"> {priceImpactFixed}% </p>;
    } else if (priceImpactFixed > 5) {
      return <p className="text-red-600">{priceImpactFixed}%</p>;
    }
  };
  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="flex justify-between w-full">
        <h2 className="font-poppins_semi_bold text-xl">Swap</h2>
        <div className="flex space-x-2 items-center">
          {loadingExchangeRate ? (
            <div className="loading__exchange__rate" />
          ) : (
            <button onClick={onCheckExchangeRatePool}>
              <div className="circle-progress circle-progress--loading">
                <svg>
                  <circle className="track" />
                  <circle className="progress" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* From section */}
      <div className="bg-itemForm rounded-lg p-4 space-y-6 text-hint border-vbDisableText border-[1px] h-[105px]">
        <div className="full-row-between-center">
          <p className="text-sm">From</p>
          <p className="text-sm">
            Balance:{" "}
            {!account
              ? "--"
              : sourceTokenBalance
              ? formatBalanceString(sourceTokenBalance)
              : 0}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row w-fit items-center">
              <button
                className="flex flex-row items-center space-x-2"
                onClick={() =>
                  onShowModalSelectToken(swapConstants.FIRST_TOKEN)
                }
              >
                <HighlightedAssetIcon
                  icon={sourceTokenInfo?.icon}
                  svgConfig={svgSymbolConfig}
                />
                <h1 className="font-bold text-grey-1">
                  {sourceTokenInfo?.assetsSymbol}
                </h1>
                <img className="w-4" src={IcDropDown} alt="" />
              </button>
              <div className="w-[1px] h-[28px] bg-[#7694DE] ml-8"></div>
              <div className="flex flex-row text-[#647BB4] space-x-1 ml-4">
                <button
                  onClick={() =>
                    onChangeSourceInput(sourceTokenBalance.toString())
                  }
                  className={`${
                    !account ? "bg-vbDisabled" : "bg-[#203557]"
                  } sm:w-[40px] w-[36px] h-[28px] bg-[#203557] rounded flex flex-row items-center justify-center text-[12px] leading-4`}
                  disabled={
                    !account ||
                    error === errExistedLiquidity ||
                    loadingExchangeRate ||
                    !sourceTokenBalance
                  }
                >
                  Max
                </button>
                <button
                  onClick={() =>
                    onChangeSourceInput((sourceTokenBalance / 2.0).toString())
                  }
                  className={`${
                    !account ? "bg-vbDisabled" : "bg-[#203557]"
                  } sm:w-[40px] w-[36px] h-[28px] rounded bg-[#203557]" flex flex-row items-center justify-center text-[12px] leading-4`}
                  disabled={
                    !account ||
                    error === errExistedLiquidity ||
                    loadingExchangeRate ||
                    !sourceTokenBalance
                  }
                >
                  Half
                </button>
              </div>
            </div>
            <div className="relative flex flex-col w-full justify-center ml-4 items-end">
              <input
                id="amountInInput"
                autoComplete="off"
                disabled={
                  loadingExchangeRate || error === errExistedLiquidity
                    ? true
                    : false
                }
                className="bg-transparent w-full focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right placeholder:text-white"
                type="text"
                min={1}
                value={inputAmountIn}
                onChange={(event) => onChangeSourceInput(event.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex flex-row items-center justify-center">
        <img
          onClick={onSwapDesireToken}
          className="cursor-pointer w-6 h-6"
          src={IcBtnSwap}
          alt="Swap"
        />
      </div>
      {/* To section */}
      <div className="bg-itemForm rounded-lg p-4 space-y-6 text-hint border-vbDisableText border-[1px] h-[105px]">
        <div className="full-row-between-center">
          <p className="text-sm">To</p>
          <p className="text-sm">
            Balance:{" "}
            {!account
              ? "--"
              : desireTokenBalance
              ? formatBalanceString(desireTokenBalance)
              : 0}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row w-fit items-center">
              <button
                className="flex flex-row items-center space-x-2"
                onClick={() =>
                  onShowModalSelectToken(swapConstants.SECOND_TOKEN)
                }
              >
                <HighlightedAssetIcon
                  icon={desireTokenInfo?.icon}
                  svgConfig={svgSymbolConfig}
                />
                <h1 className="font-bold text-grey-1">
                  {desireTokenInfo?.assetsSymbol}
                </h1>
                <img className="w-4" src={IcDropDown} alt="" />
              </button>
              <div className="w-[1px] h-[28px] bg-[#7694DE] ml-8"></div>
              <div className="flex flex-row text-[#647BB4] space-x-1 ml-4">
                <button
                  onClick={() =>
                    onChangeDesireInput(desireTokenBalance.toString())
                  }
                  className={`${
                    !account ? "bg-vbDisabled" : "bg-[#203557]"
                  } sm:w-[40px] w-[36px] h-[28px] bg-[#203557] rounded flex flex-row items-center justify-center text-[12px] leading-4`}
                  disabled={
                    !account ||
                    error === errExistedLiquidity ||
                    loadingExchangeRate ||
                    !desireTokenBalance
                  }
                >
                  Max
                </button>
                <button
                  onClick={() =>
                    onChangeDesireInput((desireTokenBalance / 2.0).toString())
                  }
                  className={`${
                    !account ? "bg-vbDisabled" : "bg-[#203557]"
                  } sm:w-[40px] w-[36px] h-[28px] rounded bg-[#203557]" flex flex-row items-center justify-center text-[12px] leading-4`}
                  disabled={
                    !account ||
                    error === errExistedLiquidity ||
                    loadingExchangeRate ||
                    !desireTokenBalance
                  }
                >
                  Half
                </button>
              </div>
            </div>
            <div className="relative flex flex-col w-full ml-4 items-end">
              <input
                id="amountOutInput"
                autoComplete="off"
                disabled={
                  loadingExchangeRate || error === errExistedLiquidity
                    ? true
                    : false
                }
                className="w-full bg-transparent focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right placeholder:text-white"
                type="text"
                min={1}
                value={inputAmountOut}
                onChange={(event) => onChangeDesireInput(event.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-x-center justify-center space-y-4">
        <div
          className={`${
            userInputRef.current !== "" &&
            inputAmountIn !== "" &&
            inputAmountOut !== "" &&
            userInputRef.current !== "0" &&
            userInputRef.current !== "0." &&
            inputAmountIn !== "0" &&
            inputAmountIn !== "0."
              ? "more__info__show"
              : "more__info__hidden"
          } flex flex-col h-fit w-full overflow-hidden`}
        >
          <div className="flex flex-col w-full space-y-2 relative">
            <button
              onClick={onShowDetailInfo}
              className="px-4 h-[56px] text-sm w-full rounded-lg bg-transparent border-[1px] border-vbDisableText"
            >
              <div className="flex flex-row justify-end items-center">
                <div className="sm:max-w-[156px] w-fit max-w-[162px] flex flex-row items-center justify-end">
                  <img
                    src={showDetailInfo ? IcUp : IcDown}
                    alt="IcDown"
                    className="w-4 ml-2"
                  />
                </div>
              </div>
            </button>

            <button
              className="absolute flex flex-row items-center left-4 top-0 bottom-0 h-[44px]"
              onClick={onSwitchExchangeRate}
            >
              {loadingExchangeRate ? (
                <div className="loading mr-2" />
              ) : (
                <img src={IcSwitch} alt="Switch" className="w-4" />
              )}
              {loadingExchangeRate ? (
                <p>Fetching price...</p>
              ) : (
                <div className="w-full flex flex-row items-center justify-between">
                  <div className="row-center space-x-2 w-fit group relative">
                    <p className="ml-2">
                      1{" "}
                      {isSwitch
                        ? desireTokenInfo?.assetsSymbol
                        : sourceTokenInfo?.assetsSymbol}{" "}
                      &asymp; {isSwitch ? pricePaidPerB : pricePaidPerA}{" "}
                      {isSwitch
                        ? sourceTokenInfo?.assetsSymbol
                        : desireTokenInfo?.assetsSymbol}
                    </p>
                  </div>
                </div>
              )}
            </button>

            <div
              className={`${
                showDetailInfo ? "more__info__show" : "more__info__hidden"
              } h-fit w-full overflow-hidden`}
            >
              <div className="px-4 py-5 space-y-4 rounded-lg border border-vbDisableText my-2">
                <div className="flex justify-between">
                  <div className="flex space-x-2 flex-row items-center">
                    <p className="text-grey-3">Swapping Through</p>
                    <div className="relative group">
                      <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                      <Tooltip
                        info={
                          "Swapping through these tokens resulted in the best price for your trade."
                        }
                      />
                    </div>
                  </div>
                  <p>{namePool}</p>
                </div>
                <div className="flex justify-between">
                  <div className="flex space-x-2 flex-row items-center">
                    <p className="text-grey-3">Minimum receive</p>
                    <div className="relative group">
                      <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                      <Tooltip
                        info={
                          "The least amount of tokens you will receive on this trade."
                        }
                      />
                    </div>
                  </div>
                  <p>
                    {amountOutMin} {desireTokenInfo?.assetsSymbol}
                  </p>
                </div>

                <div className="flex justify-between">
                  <div className="flex space-x-2 flex-row items-center">
                    <p className="text-grey-3">Price Impact</p>
                    <div className="relative group">
                      <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                      <Tooltip
                        info={
                          "The difference between the market price and estimated price due to trade size."
                        }
                      />
                    </div>
                  </div>
                  {renderPriceImpact()}
                </div>

                <div className="flex justify-between flex-row w-full items-center">
                  <div className="flex space-x-2 flex-row items-center">
                    <p className="text-grey-3 min-w-fit">Slippage tolerance</p>
                    <div className="relative group">
                      <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                      <Tooltip
                        info={
                          "The difference between the market price and estimated price due to trade size."
                        }
                        position="top"
                      />
                    </div>
                  </div>
                  <div className="w-20 flex flex-row justify-evenly items-center bg-itemForm rounded border-vbDisableText border px-2 py-[0.0625rem]">
                    <input
                      className="bg-transparent w-10 rounded focus:outline-none placeholder-vbDisableText font-poppins_medium text-grey-1"
                      type="text"
                      min={0.5}
                      max={50}
                      placeholder="0.5"
                      value={inputSlippage}
                      onChange={(event) => onChangeSlippage(event.target.value)}
                      onBlur={(event) => {
                        if (event.target.value === "") {
                          onChangeSlippage("0.5");
                        }
                      }}
                    />
                    <p className="ml-1">%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 flex-row items-center">
                    <p className="text-grey-3">Swap fee</p>
                    <div className="relative group">
                      <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                      <Tooltip
                        info={`For each trade a 0.3% fee is paid.
                          - 0.25% to liquidity providers.
                          - 0.05% to VB holders and Treasury.`}
                        position="top"
                        width="250px"
                      />
                    </div>
                  </div>
                  {loadingFee ? (
                    <div className="loading" />
                  ) : (
                    <p>
                      {realizedLPFee}{" "}
                      {realizedLPFee && sourceTokenInfo?.assetsSymbol}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {priceUpdate && (
          <div className="w-full bg-itemForm rounded-lg px-4 py-3 flex flex-row items-center justify-between h-[56px]">
            <div className="flex flex-row items-center space-x-2">
              <p className="text-base">Price updated</p>
              <div className="relative group">
                <img src={IcQuestionCircleBlue} alt="" className="w-4" />
                <Tooltip
                  info={"Price has changed since your swap amount was entered."}
                  position="top"
                />
              </div>
            </div>
            <button
              onClick={onUpdatePriceChange}
              className="
                btn-veb"
            >
              Accept
            </button>
          </div>
        )}
        {account && (
          <button
            disabled={
              loadingSwap || loadingApprove || priceUpdate || error !== ""
            }
            onClick={accountApprove === 0 ? onApproveToken : onSwapAssetToken}
            className={`w-full ${
              !loadingSwap && !loadingApprove && !priceUpdate && error === ""
                ? "btn-veb-swap"
                : "bg-btn-veb-disabled rounded-lg"
            } px-2 h-[56px]`}
          >
            {renderTitleButton()}
          </button>
        )}
        {!account && <BtnConnectInPage className="w-full btn-veb h-[56px]" />}

        <div className="flex space-x-2">
          <p className="text-balanceVTHO">
            VTHO balance:{" "}
            {!account
              ? "--"
              : vthoBalance
              ? formatBalanceString(vthoBalance)
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Swap;
