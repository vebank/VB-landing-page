import { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import IcNet from "../../assets/images/ic_net.svg";
import IcDropdown from "../../assets/images/ic_dropdown.svg";

import { nFormatter, formatBalanceString } from "../../utils/lib";

import * as actions from "../../actions";
import BtnOpenClaim from "./BtnOpenClaim";

const Overview = () => {
  const dispatch = useDispatch();

  const {
    accountTotalSupplied,
    accountTotalBorrowed,
    healthFactor,
    netAPY,
    totalUserUnclaimedRewards,
  } = useSelector((state) => state.accountOverviewReducer, shallowEqual);
  
  const dataPrice = useSelector(
    (state) => state.assetsPriceReducer.data,
    shallowEqual
  );
  const dataAssets = useSelector(
    (state) => state.accountAssetsReducer.data,
    shallowEqual
  );

  useEffect(() => {

    if (dataAssets && dataAssets.length > 0 && dataPrice) {
      fetchAccountOverview();
    }
  }, [dataAssets, dataPrice]);

  async function fetchAccountOverview() {
    await dispatch(actions.getAccountOverview());
  }

  const showNetAPY = (value) => {
    const netAmount = value.toFixed(2);
    if (Number(netAmount) === 0) {
      return 0;
    }
    return netAmount;
  };

  return (
    <div className="font-poppins">
      <h2 className="text-lg">Overview</h2>
      <div className="bg-overview flex justify-center justify-items-center items-center text-center rounded mt-3 p-4">
        {accountTotalSupplied && accountTotalBorrowed ? (
          <>
            <div className="flex-1">
              <p className="text-xs font-normal text-slate-50">Net APY</p>
              <span className="text-xl font-bold">
                {netAPY ? showNetAPY(netAPY) : 0} %
              </span>
            </div>
            |
          </>
        ) : (
          ""
        )}
        <div className="flex-1">
          <p className="text-xs font-normal text-slate-50">Supply balance</p>
          <span className="text-xl font-bold">
            $ {accountTotalSupplied ? nFormatter(accountTotalSupplied, 2) : 0}
          </span>
        </div>
        |
        <div className="flex-1">
          <p className="text-xs font-normal text-slate-50">Borrow balance</p>
          <span className="text-xl font-bold">
            $ {accountTotalBorrowed ? nFormatter(accountTotalBorrowed, 2) : 0}
          </span>
        </div>
        {accountTotalSupplied && accountTotalBorrowed ? (
          <>
            |
            <div className="flex-1">
              <p className="text-xs font-normal text-slate-50">Health factor</p>
              <span className="text-xl font-bold">
                {healthFactor ? nFormatter(healthFactor, 2) : 0}
              </span>
            </div>{" "}
          </>
        ) : (
          ""
        )}
        {totalUserUnclaimedRewards ? (
          <>
            |
            <div className="flex-1">
              <p className="text-xs font-normal text-slate-50">
                Available rewards
              </p>
              <span className="text-xl font-bold">
                {formatBalanceString(totalUserUnclaimedRewards)} VB
              </span>
              <BtnOpenClaim />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Overview;
