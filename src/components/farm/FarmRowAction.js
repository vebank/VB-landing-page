import React, { useState } from "react";
import BtnOpenAddLiquidity from "../farm/BtnOpenAddLiquidity";
import BtnOpenStartFarming from "./BtnOpenStartFarming";
import BtnOpenHarvest from "./BtnOpenHarvest";
import ModalFarming from "./ModalFarming";
import BtnOpenUnFarm from "./BtnOpenUnFarm";

const FarmRowAction = ({ openRowAssets, item }) => {
  if (openRowAssets.indexOf(item.assetsPoolAddress) === -1) {
    return <></>;
  }

  return (
    <>
      <div className="bg-[#182844] mt-2 fade-in-box flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 pr-2">
          <div className="bg-[#26355A] p-4 rounded flex justify-between rounded space-x-4">
            <div>
              <label className="font-poppins text-[14px] text-[#678BCA]">
                Pending Rewards
              </label>
              <div className="font-poppins text-[16px] text-[#3EE8FF]">
                0 VB
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <BtnOpenHarvest item={item} />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 pl-2">
          <div className="bg-[#26355A] p-4 rounded flex justify-between rounded space-x-4">
            <div>
              <label className="font-poppins text-[14px] text-[#678BCA]">
                Available LP
              </label>
              <div className="font-poppins text-[16px] text-[#3EE8FF]">
                0 LB
              </div>
            </div>
            <div className="flex flex-row justify-end items-center w-2/3 space-x-2">
              <BtnOpenUnFarm item={item} />
              <BtnOpenStartFarming item={item} />
              <BtnOpenAddLiquidity item={item} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmRowAction;
