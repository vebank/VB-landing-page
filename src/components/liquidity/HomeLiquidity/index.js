import React, { useState } from "react";
import "../styles.scss";

import IcSettingWhite from "../../../assets/images/buttons/ic_setting_white.svg";
import IcHistoryWhite from "../../../assets/images/buttons/ic_history_white.svg";
import IcLoading from "../../../assets/images/loading_swap.svg";

import useLiquidityFacade from "./hook";
import SecondaryButton from "../../partials/SecondaryButton";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../constants/partial.constants";
import LiquidityExcerpt from "./LiquidityExcerpt";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import GradientBorderSVG from "../../partials/GradientBorderSVG";
import { getTimeStamp } from "../../../utils/lib";
const gradientBorderLpBtnConfig = {
  class: "liquid-lp-btn-border",
  id: "gradLiquidLpBtnBorder",
  x1: "0",
  x2: "1",
  y1: "0.5",
  y2: "0.5",
  transform: "rotate(360)",
  stop: [
    { offset: "0%", stopColor: "#0FE3E3" },
    { offset: "100%", stopColor: "#02A4FF" },
  ],
  rx: "8",
  ry: "8",
  stroke: "url('#gradLiquidLpBtnBorder')",
  boder_id: getTimeStamp(),
};
const Liquidity = () => {
  const {
    poolAddresses,
    userPoolAddresses,
    isLoadingPools,
    addLiquidity,
    onFindOtherLPClicked,
  } = useLiquidityFacade();

  const [poolSelect, setPoolSelect] = useState("")
  const setSelectPool = (poolAddress) => {
    setPoolSelect(poolAddress);
  }
  return (
    <div className="w-full lg:w-[500px] rounded-2xl p-10 bg-[#0D1522] mx-auto relative z-0">
      {/*Header*/}
      <GradientStrokeWrapper borderRadius="1rem" className="-z-10" />

      <div className="flex flex-row flex-1">
        {/* <button className="btn-modal-back" onClick={closeModal} /> */}
        <div className="flex flex-col items-start w-full">
          <div className="flex flex-row w-full items-center justify-between">
            <span className="text-white text-xl font-poppins_bold">
              Your Liquidity
            </span>
            {isLoadingPools ? (
              <div className="loading__exchange__rate" />
            ) : (
              <button>
                <img src={IcLoading} alt="Refresh" />
              </button>
            )}
          </div>
          
          {!(userPoolAddresses.length > 0) && <span className="text-grey-1 text-sm font-poppins_light mt-[6px]">
              Remove liquidity to receive tokens back
          </span>}
          {/* <div className="flex flex-col space-y-4">
            <span className="text-white text-2xl font-poppins_medium">
              Your Liquidity
            </span>
            <span className="text-grey-1 text-base font-poppins_light">
              Remove liquidity to receive tokens back
            </span>
          </div> */}
        </div>
        {/* <div className="flex flex-row space-x-8">
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
        </div> */}
      </div>

      <div className="content-modal mt-8">
        <div className={`flex flex-col justify-center`}>
          {userPoolAddresses.length > 0 ? (
            <div className="py-6 col-y-center gap-4">
              {/* <TransitionGroup className="gap-4"> */}
              {userPoolAddresses.map((address) => (
                <CSSTransition key={address} timeout={500}>
                  <LiquidityExcerpt key={address} poolAddress={address} poolSelect={poolSelect} setPoolSelect={setPoolSelect} />
                </CSSTransition>
              ))}
              {/* </TransitionGroup> */}
            </div>
          ) : (
            <p className="self-center text-base text-[#678BCA]">
              No liquidity found.
            </p>
          )}
          <div className={`flex flex-col items-center ${poolAddresses.length > 0 ? "" : "hidden"}`}>
            <p className="mt-8 self-center text-base text-[#678BCA]">
              Don’t see a pool you joined?
            </p>
            {/* <SecondaryButton
              label="Find other LP tokens"
              labelColor="#0CD2EC"
              className="mt-4 w-48 h-11 rounded-lg btn-modal-secondary self-center"
              labelClassName="text-base"
              borderRadius="8px"
              onClick={onFindOtherLPClicked}
            /> */}
            <div className="relative w-1/2 mt-4 py-[10px] px-4">
              <GradientBorderSVG data={gradientBorderLpBtnConfig} />
              <button
                className={`relative w-full h-full text-[#0CD2EC]`}
                onClick={onFindOtherLPClicked}
              >
                Find other LP tokens
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-modal row gap-4 mt-8">
        <button
          onClick={addLiquidity}
          className={"btn-modal-veb w-full bg-btn-veb"}
        >
          + Add Liquidity
        </button>
      </div>
    </div>
  );
};

export default Liquidity;
