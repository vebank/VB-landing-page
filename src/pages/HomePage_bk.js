import React from "react";
// import { useDispatch, useSelector } from "react-redux";

import IcBorrow from "../assets/images/ic_borrow.png";
import IcPool from "../assets/images/ic_pool.png";
import IcLend from "../assets/images/ic_lend.png";
import IcStake from "../assets/images/ic_stake.svg";
import IcLaunchpad from "../assets/images/ic_launchpad.jpeg";
import IcTrade from "../assets/images/ic_trade.png";
import Footer from "../components/partials/Footer";

const HomePage = () => {
  return (
    <div>
      <section className="container pt-5 pb-24 mx-auto">
        <div className="lg:px-6 px-4">
          <h3 className="font-bold text-center  my-10 lg:my-24 text-2xl lg:text-4xl font-poppins">
            Money market on Vechain
          </h3>

          <div className="flex flex-wrap 2xl:px-28">
            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-[#FFC951] rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
                <img
                  src={IcBorrow}
                  alt={"IcBorrow"}
                  className="w-64 object-contain object-center img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Borrow
                </div>
              </div>
            </div>

            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-gradient-lend rounded-xl flex flex-row items-center justify-center h-full relative cursor-pointer">
                <img
                  src={IcLend}
                  alt={"Iclend"}
                  className="w-42 object-cover object-center img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Lend
                </div>
              </div>
            </div>

            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-[#5654B2] rounded-xl flex flex-row items-center justify-center h-full relative cursor-pointer">
                <img
                  src={IcTrade}
                  alt={"IcTrade"}
                  className="w-64 object-cover object-center img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Trade
                </div>
              </div>
            </div>

            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-[#F6BECF] rounded-xl flex flex-row items-start justify-center h-full relative cursor-pointer">
                <img
                  src={IcStake}
                  alt={"IcPool"}
                  className="w-64 object-cover object-center mt-4 img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Stake
                </div>
              </div>
            </div>

            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-[#96C5FD] rounded-xl flex flex-row items-center justify-center h-full relative cursor-pointer">
                <img
                  src={IcLaunchpad}
                  alt={"Ic Launch pad"}
                  className="w-64 object-cover object-center img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Launch pad
                </div>
              </div>
            </div>

            <div className="pb-8 px-4 w-full lg:w-1/3 h-80 my-4 lg:my-0 fade-in-box">
              <div className="bg-[#23BCE4] rounded-xl flex flex-row items-center justify-center h-full relative cursor-pointer">
                <img
                  src={IcPool}
                  alt={"IcPool"}
                  className="w-64 w-auto h-auto object-cover object-center img-scale-1-1"
                />
                <div className="mt-2 absolute bottom-4 w-full text-center text-base font-poppins">
                  Pool
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default HomePage;
