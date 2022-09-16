import React from "react";
import { useNavigate } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";

import IcBorrow from "../../assets/images/home/ic_trade.svg";
import IcLend from "../../assets/images/home/ic_money.svg";
import IcLaunchpad from "../../assets/images/home/ic_launchpad.svg";
import IcPool from "../../assets/images/home/ic_cream.svg";
import IcFarm from "../../assets/images/home/ic_farm.svg";
import IcStake from "../../assets/images/home/ic_piggy.svg";

const Group = () => {
  let navigate = useNavigate();

  const handleRouteClick = (route) => {
    navigate(route);
  };

  return (
    <section className="container pt-28 pb-24 mx-auto">
      <div className="lg:px-6 px-4">
        <h3 className="font-bold text-center mb-20 text-2xl lg:text-4xl font-poppins text-[#19FFFF]">
          Money market on Vechain
        </h3>

        <div className="flex flex-wrap 2xl:px-28">
          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/trade")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#734BE4] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img
                    src={IcBorrow}
                    alt={"IcBorrow"}
                    className="object-center"
                  />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Trade
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Seamlessly trade multiple tokens at the best rates with our AMM
              </p>
            </div>
          </div>

          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/markets")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#7AC550] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img src={IcLend} alt={"IcLend"} className="object-center" />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Lend/Borrow
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Earn interest by depositing tokens, and borrow at low risk from
                VeBank
              </p>
            </div>
          </div>

          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/pool")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#23BCE4] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img src={IcPool} alt={"IcPool"} className="object-center" />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Pool
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Earn rewards by providing liquidity for seamless token trading
              </p>
            </div>
          </div>

          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/stake")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#D643BE] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img
                    src={IcStake}
                    alt={"IcStake"}
                    className="object-center"
                  />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Stake
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Earn new tokens by staking $VB
                <br />
                <br />
              </p>
            </div>
          </div>

          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/farm")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#FFC951] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img src={IcFarm} alt={"IcFarm"} className="object-center" />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Farm
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Maximize rewards when participate in token farming opportunities
              </p>
            </div>
          </div>

          <div
            className="pb-8 px-8 w-full lg:w-1/3 h-56 my-12"
            onClick={() => handleRouteClick("/launchpad")}
          >
            <div className="box-border-gr rounded-xl flex flex-col items-object justify-center h-full relative cursor-pointer">
              <div className="absolute top-[-35px] w-full flex justify-center ">
                <div className="bg-[#96C5FD] bg-light-shadow w-16 h-16 p-3 rounded-full flex justify-center items-center">
                  <img
                    src={IcLaunchpad}
                    alt={"IcLaunchpad"}
                    className="object-center"
                  />
                </div>
              </div>
              <div className="mt-2 bottom-4 w-full text-center text-[22px] font-bold font-poppins text-[#19FFFF] mt-3">
                Launchpad
              </div>
              <p className="px-4 font-poppins text-[16px] text-[#FAFAFA] text-center font-normal leading-7 mt-2">
                Raise funds and increase adoption for projects launched on
                VeChain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Group;
