import React, { useEffect, useState } from "react";
import { Puff } from "react-loading-icons";

import IcVeBank from "../../assets/images/ic_vebank.svg";
import { staking } from "../../assets";
import { shallowEqual, useSelector } from "react-redux";
import { nFormatter } from "../../utils/lib";

import BtnOpenStake from "./BtnOpenStake";
import CooldownPeriodVETVB from "./CooldownPeriodVETVB";
import BtnCooldownAndUnstakeVETVB from "./BtnCooldownAndUnstakeVETVB";
import BtnOpenClaimStaked from "./BtnOpenClaim";

import CurrencyAssetsUSD from "../markets/CurrencyAssetsUSD";

const StakingVETVB = ({ loadStakingAccount, addressStaking}) => {

  const tokenStaking = process.env.REACT_APP_ADDRESS_PAIR_VETVB;
  
  const { accountStaked, accountRewards, stakedAPR, perMonth, loading 
  } = useSelector((state) => state.accountStakedVETVBReducer, shallowEqual);
  
  return (
    <div className="flex flex-col w-1/2 space-y-8 p-8 bg-[#171C29] rounded">
      <div className="font-poppins_semi_bold text-3xl text-vbLine relative">
          Stake VB-VET LP Token
        {loading ? <div className="absolute top-[0px] right-[0px]">
          <Puff stroke="#06bcee" fillOpacity={1} strokeWidth={2} strokeOpacity={1} speed={1} height={"1em"}  />
          </div> :""}
      </div>
      <div className="flex flex-col space-y-[6px]">
        <div className="flex flex-row justify-between px-6 py-8 bg-[#182844] rounded-md">
          <div className="flex flex-row items-center space-x-[14px]">
            <img className="" src={IcVeBank} alt="" />
            <span className="font-poppins_bold text-base text-white">
              VB-VET LP
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white">Staking APR</span>
            <span className="font-poppins_semi_bold text-base text-white">
              {stakedAPR} %
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white">Max slashing</span>
            <span className="font-poppins_semi_bold text-base text-white">
              30.00 %
            </span>
          </div>
          <BtnOpenStake addressStaking={addressStaking} tokenStaking={tokenStaking} />
        </div>
        <div className="flex flex-row space-x-[6px]">
          <div className="flex flex-col w-1/2 p-6 items-center justify-center bg-[#182844] rounded-md">
            <span className="font-poppins_medium text-base text-white">
            Staked VB-VET LP
            </span>
            <span className="font-poppins_semi_bold text-2xl text-white mt-1">
              {nFormatter(accountStaked,2)}
            </span>
            <span className="text-sm text-vbLine">
                <CurrencyAssetsUSD
                  currencyBalance={accountStaked}
                  assetsAddress={tokenStaking}
                  digits={2}
                />
            </span>
            
            <BtnCooldownAndUnstakeVETVB addressStaking={addressStaking} />
           
            <div className="flex flex-row w-full items-center justify-between mt-4">
              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm text-[#F5F5F5]">
                  Cooldown period
                </span>
                <img src={staking.IcTip} alt="" />
              </div>
              <CooldownPeriodVETVB loadStakingAccount={loadStakingAccount}  />
            </div>
          </div>
          <div className="flex flex-col w-1/2 p-6 items-center justify-center bg-[#182844] rounded-md">
            <span className="font-poppins_medium text-base text-white">
              Claimable VB
            </span>
            <span className="font-poppins_semi_bold text-2xl text-white mt-1">
              { nFormatter(accountRewards,2)}
            </span>
            <span className="text-sm text-vbLine">
                <CurrencyAssetsUSD
                    currencyBalance={accountRewards}
                    assetsAddress={tokenStaking}
                    digits={2}
                  />
            </span>

            <BtnOpenClaimStaked amount={accountRewards} addressStaking={addressStaking} />

            <div className="flex flex-row w-full items-center justify-between mt-4">
              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm text-[#F5F5F5]">
                  VB per month
                </span>
              </div>
              <span className="text-sm text-hint">{ nFormatter(perMonth,2) }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default StakingVETVB;
