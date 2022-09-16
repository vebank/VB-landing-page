import { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import IcDropdown from "../../assets/images/ic_down_asset.svg";
import IcCaretDown from "../../assets/images/ic_caret_down-fill.svg";

import PoolRowAction from "./PoolRowAction";

import * as actions from "../../actions";
import LiquidPairIcon from "../partials/LiquidPairIcon";
import { nFormatter } from "../../utils/lib";
import FrmSearchPool from "./FrmSearchPool";
import FrmBaseTime from "./FrmBaseTime";

const AssetsPool = () => {
  const [openRowAssets, setOpenRowAssets] = useState([]);
  const [timeBasis, setTimeBasis] = useState("24H");

  const dispatch = useDispatch();

  const { web3 } = useSelector((state) => state.web3, shallowEqual);
  const { data } = useSelector(
    (state) => state.assetsPoolReducer,
    shallowEqual
  );

  useEffect(() => {
    if (web3) {
      fetchPoolAssets();
    }
  }, [web3, timeBasis]);

  async function fetchPoolAssets() {
     await dispatch(actions.fetchPairs({time_basis:timeBasis}));
  }

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
    return (openRowAssets.indexOf(assetsAddress) === -1);
  };

  const onTimeBasisChange = (value) => {
    setTimeBasis(value);
  };

  const showListAsset = (dataList) => {
    if (dataList && dataList.length > 0) {
      return dataList.map((item, index) => (
        <CSSTransition key={index} timeout={500} classNames="item_asset">
          <div>
            <div
              className="grid grid-cols-12 mt-6 bg-[#182844] justify-items-center content-around font-poppins text-base rounded cursor-pointer"
              onClick={(e) => onClickShowRowAssets(item.assetsPoolAddress)}
            >
              <div className="p-4 col-span-3 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                {/* <div className="flex -space-x-2 overflow-hidden">
                                    <img className="inline-block h-8 w-8 rounded-full " src={item.iconOrigin} />
                                    <img className="inline-block h-8 w-8 rounded-full " src={item.iconAssets} />
                                </div> */}
                <LiquidPairIcon
                  iconAsset1={item.iconOrigin}
                  iconAsset2={item.iconAssets}
                />
                <span className="text-base font-semibold text-left w-28">
                  {item.assetsPoolName}
                </span>
              </div>

              <div className="p-4 col-span-2 flex justify-center items-center font-semibold">
                {`$${nFormatter(item.liquidity_usd) }`}
              </div>

              <div className="p-4 col-span-2 flex flex-col justify-center items-center content-center">
                <div className="font-semibold">{item.volume ? '$'+ nFormatter(item.volume) :'-'}</div>
              </div>

              <div className="p-4 col-span-2 flex justify-center items-center font-semibold">
                {item.fees ? '$'+ nFormatter(item.fees) :'-'}
              </div>

              <div className="p-4 col-span-2 flex flex-col justify-center items-center content-center">
                <div className="font-semibold">{ nFormatter(item.apr,2)} %</div>
              </div>

              <div className="p-4 col-span-1 flex justify-center items-center cursor-pointer">
                <img
                  alt="sort row"
                  className={`w-4 h-4 transition-transform delay-350 ${
                    checkShowDown(item.assetsPoolAddress) ? "" : "rotate-180"
                  }`}
                  src={IcDropdown}
                />
              </div>
            </div>

            {!checkShowDown(item.assetsPoolAddress) && (
              <PoolRowAction
                key={item.assetsPoolAddress + "_act"}
                item={item}
                assetsPoolAddress={item.assetsPoolAddress}
              />
            )}
          </div>
        </CSSTransition>
      ));
    }
  };

  return (
    <div className="w-full min-h-max rounded-lg bg-[#0b1329] mt-10 p-10 fade-in-box">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h4 className="font-poppins_semi_bold text-xl text-vbLine">
            Liquidity Pools 
          </h4>
          <span className="font-poppins text-base text-[#E8E8E8]">
            Earn both $VB and a share of trading fees by providing liquidity
          </span>
        </div>
        <div className="flex flex-row justify-end space-x-12">
          <div className="relative flex justify-end">
            <div className="absolute top-0">
              <FrmBaseTime timeBasis={timeBasis} onTimeBasisChange={onTimeBasisChange} />
            </div>
          </div>
          <FrmSearchPool />
        </div>
      </div>
      
      <div className="tbl-veb mt-8">
        <div className="grid grid-cols-12 justify-items-center content-around font-poppins text-[14px]">
          <div className="px-2 py-2 col-span-3 flex">
            <span>Assets</span>
            <img className="ml-1 w-4" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          <div className="px-2 py-2 col-span-2 flex">
            <span>Liquidity</span>
            <img className="ml-1 w-4" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          <div className="px-2 py-2 col-span-2 flex">
            <span>Volume {timeBasis}</span>
            <img className="ml-1 w-4" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          <div className="px-2 py-2 col-span-2 flex">
            <span>Fees {timeBasis}</span>
            <img className="ml-1 w-4" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          <div className="px-2 py-2 col-span-2 flex">
            <span>APR {timeBasis}</span>
            <img className="ml-1 w-4" src={IcCaretDown} alt={IcCaretDown} />
          </div>
          <div className="col-span-1"></div>
        </div>

        <TransitionGroup>{showListAsset(data)}</TransitionGroup>
      </div>
    </div>
  );
};

export default AssetsPool;
