import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import FarmRowAction from "./FarmRowAction";
import IcDropdown from "../../assets/images/ic_down_asset.svg";
import IcCaretDown from "../../assets/images/ic_caret_down-fill.svg";
import IcInfoCircle from "../../assets/images/ic-warning-circle.svg";
import IcVeChain from "../../assets/images/ic_vechain.svg";
import IcVeUSD from "../../assets/images/ic_veusd.svg";
import IcVtho from "../../assets/images/ic_vtho.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import LiquidPairIcon from "../partials/LiquidPairIcon";
import FormSearchFarm from "./FormSearchFarm";

const ASSETS_FARM_HEADER = [
  {
    text: "Pending Reward",
    key: "pending_reward",
    additionalInfo: {
      isHaveInfo: false,
      info: "",
    },
  },
  {
    text: "Total APY",
    key: "total_apy",
    additionalInfo: {
      isHaveInfo: true,
      info: "",
    },
  },
  {
    text: "Total APR",
    key: "total_apr",
    additionalInfo: {
      isHaveInfo: true,
      info: "",
    },
  },
  {
    text: "TVL",
    key: "tvl",
    additionalInfo: {
      isHaveInfo: true,
      info: "",
    },
  },
];

const DATA_SAMPLE = [
  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeUSD,
    assetsPoolName: "VET-VEUSD",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VEUSD,
    assetsDecimals: 18,
    pendingReward: "0",
    totalAPY: "86.53",
    totalAPR: "59.35",
    tvl: "32,062",
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVtho,
    assetsPoolName: "VET-VTHO",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VTHO,
    assetsDecimals: 18,
    pendingReward: "0",
    totalAPY: "86.53",
    totalAPR: "59.35",
    tvl: "32,062",
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeBank,
    assetsPoolName: "VET-VB",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VEBANK,
    assetsDecimals: 18,
    pendingReward: "0",
    totalAPY: "86.53",
    totalAPR: "59.35",
    tvl: "32,062",
  },

  {
    iconOrigin: IcVeBank,
    iconAssets: IcVtho,
    assetsPoolName: "VB-VTHO",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_WVET,
    assetsDecimals: 18,
    pendingReward: "0",
    totalAPY: "86.53",
    totalAPR: "59.35",
    tvl: "32,062",
  },
];

const AssetsFarm = () => {
  const [openRowAssets, setOpenRowAssets] = useState([]);

  const dispatch = useDispatch();

  const { web3 } = useSelector((state) => state.web3, shallowEqual);
  const { data } = useSelector(
    (state) => state.assetsPoolReducer,
    shallowEqual
  );

  useEffect(() => {
    if (web3) {
      // fetchMarketAssets();
    }
  }, [web3]);

  const onClickShowRowAssets = (assetsAddress) => {
    const listShowChecked = [...openRowAssets];
    const indexShow = openRowAssets.indexOf(assetsAddress);

    if (indexShow === -1) {
      listShowChecked.push(assetsAddress);
    } else {
      listShowChecked.splice(indexShow, 1);
    }

    setOpenRowAssets(listShowChecked);
  };

  const checkShowDown = (assetsAddress) => {
    return !(openRowAssets.indexOf(assetsAddress) === -1);
  };

  const showListAsset = (dataList) => {
    if (dataList && dataList.length > 0) {
      return dataList.map((item) => (
        <CSSTransition
          key={item.assetsAddress}
          timeout={500}
          classNames="item_asset"
        >
          <div>
            <div
              className="grid grid-cols-12 mt-6 bg-[#182844] justify-items-center content-around font-poppins text-base rounded cursor-pointer"
              onClick={(e) => onClickShowRowAssets(item.assetsPoolAddress)}
            >
              <div className="p-4 col-span-3 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                {/* <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full"
                    src={item.iconOrigin}
                    alt=""
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full"
                    src={item.iconAssets}
                    alt=""
                  />
                </div> */}
                <LiquidPairIcon
                  iconAsset1={item.iconOrigin}
                  iconAsset2={item.iconAssets}
                />
                <span className="text-lg font-semibold text-left w-28">
                  {item.assetsPoolName}
                </span>
              </div>

              <div className="p-4 col-span-2 flex justify-center items-center font-semibold">
                {item.pendingReward} VB
              </div>

              <div className="p-4 col-span-2 flex flex-col justify-center items-center content-center">
                <div className="font-semibold">{item.totalAPY}%</div>
              </div>

              <div className="p-4 col-span-2 flex justify-center items-center font-semibold">
                {item.totalAPR}%
              </div>

              <div className="p-4 col-span-2 flex flex-col justify-center items-center content-center">
                <div className="font-semibold">~${item.tvl}</div>
              </div>

              <div className="p-4 col-span-1 flex justify-center items-center cursor-pointer">
                <img
                  className={`w-4 h-4 transition-transform delay-350 ${
                    checkShowDown(item.assetsPoolAddress) ? "rotate-180" : ""
                  }`}
                  src={IcDropdown}
                  alt=""
                />
              </div>
            </div>

            <FarmRowAction
              key={item.assetsPoolAddress + "_act"}
              openRowAssets={openRowAssets}
              item={item}
            />
          </div>
        </CSSTransition>
      ));
    }
  };

  return (
    <div className="w-full min-h-max rounded-lg bg-[#0b1329] mt-10 p-10 fade-in-box">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col w-1/2">
          <h4 className="font-poppins text-xl font-[600] text-[#3EE8FF]">
            All Farms
          </h4>
          <span className="font-poppins text-base text-[#E8E8E8] pt-1">
            Stake your LP tokens and earn token rewwards
          </span>
        </div>
        <FormSearchFarm />
      </div>

      <div className="tbl-veb mt-8">
        <div className="grid grid-cols-12 justify-items-center content-around font-poppins text-[14px]">
          <div className="items-center px-2 py-2 col-span-3 flex">
            <span>Farm</span>
            <img className="ml-1 w-3" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          {ASSETS_FARM_HEADER.map((item) => (
            <div
              className="px-2 py-2 col-span-2 flex items-center"
              key={item.key}
            >
              <span>{item.text}</span>
              {item.additionalInfo.isHaveInfo && (
                <img
                  className="ml-2 w-3 h-3"
                  src={IcInfoCircle}
                  alt={IcInfoCircle}
                />
              )}
              <img className="ml-1 w-3" src={IcCaretDown} alt={IcCaretDown} />
            </div>
          ))}
          <div className="col-span-1" />
        </div>

        <TransitionGroup>{showListAsset(DATA_SAMPLE)}</TransitionGroup>
      </div>
    </div>
  );
};

export default AssetsFarm;
