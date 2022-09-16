import React, { useEffect, useState } from "react";
import { Bars ,Oval } from "react-loading-icons";

import IcVeBank from "../../assets/images/ic_vebank.svg";
import { staking } from "../../assets";
import { shallowEqual, useSelector } from "react-redux";
import { nFormatter } from "../../utils/lib";

import BtnOpenUnstake from "./BtnOpenUnstake";
import BtnCoolDowns from "./BtnCoolDowns";

const BtnCooldownAndUnstakeVETVB = ({addressStaking}) => {

  const { accountStaked, cooldownSeconds , stakersCooldowns , UNSTAKE_WINDOW ,dueTimeEnd, loadingCooldown } = useSelector((state) => state.accountStakedVETVBReducer,shallowEqual);
  
  const showBtnCooldownAndUnstake = (dueTimeEnd)=> {

    const currentTime = parseInt(new Date().getTime() / 1000);

    if(loadingCooldown){
      return(
        <button className="mt-4 px-8 py-3 w-32 flex flex-row rounded bg-[#232E49] font-poppins_semi_bold text-vbDisableText text-base">
          <span className="contents"><Bars stroke="#06bcee" height={"1rem"} /></span>
        </button>
      )
    }

    if( Number(stakersCooldowns) > 0 && accountStaked > 0 && currentTime >= (Number(stakersCooldowns) + Number(UNSTAKE_WINDOW))){
      //console.log("----------------vao 1");
      return  (<BtnCoolDowns addressStaking={addressStaking} accountStaked={accountStaked} />);
    }

    if(Number(stakersCooldowns) > 0 && currentTime >= (Number(stakersCooldowns) + Number(cooldownSeconds)) ){
      //console.log("----------------vao 2");
      return <BtnOpenUnstake addressStaking={addressStaking} />
    }

   if(Number(stakersCooldowns) === 0 && accountStaked > 0){
     // console.log("----------------vao 3");
      return(
        <BtnCoolDowns addressStaking={addressStaking} accountStaked={accountStaked} />
      )
    }else if(Number(stakersCooldowns) === 0){
      //console.log("----------------vao 4");
      return(
        <button className="mt-4 px-8 py-3 rounded bg-[#232E49] font-poppins_semi_bold text-vbDisableText text-base">
          Cooldown to unstake
        </button>
      )
    }
 
    if( 
       Number(stakersCooldowns) > 0 
    && accountStaked > 0 
    && (Number(stakersCooldowns) + Number(cooldownSeconds)  > currentTime)){
     // console.log("----------------vao 5");
      return  (  
        <button className="mt-4 px-8 py-3 rounded bg-[#232E49] font-poppins_semi_bold text-vbDisableText text-base">
          Unstake
        </button>
      );
    }

  }
  
  return (
    <>
      {showBtnCooldownAndUnstake(dueTimeEnd)}
    </>
  );

};

export default BtnCooldownAndUnstakeVETVB;
