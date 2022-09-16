import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import StakingVB from "./StakingVB";
import StakingVETVB from "./StakingVETVB";

import * as actions from "../../actions";

const stakingVeBank = process.env.REACT_APP_STAKING_VEBANK;
const stakingVETVB = process.env.REACT_APP_STAKING_VETVB;

const AssetsStaking = () => {
  
  const dispatch = useDispatch();

  const { account } = useSelector((state) => state.web3, shallowEqual);

  useEffect(() => {

    if (account) {
       fetchAccountStakedVB(stakingVeBank);
       fetchAccountStakedVETVB(stakingVETVB);
    }
  }, [account]);

  async function fetchAccountStakedVB(addressStaking) {
    await loadAccountStakedVB(addressStaking);
  }
  
  async function loadAccountStakedVB(addressStaking) {
    await dispatch(actions.loadAccountStakedVB(addressStaking));
    await dispatch(actions.listenEventStakeVB(addressStaking));
  }

  async function fetchAccountStakedVETVB(addressStaking) {
    await loadAccountStakedVETVB(addressStaking);
  }
  
  async function loadAccountStakedVETVB(addressStaking) {
    await dispatch(actions.loadAccountStakedVB(addressStaking));
    await dispatch(actions.listenEventStakeVETVB(addressStaking));
  }

  
  return (

    <div className="tbl-veb mt-14">
      <div className="flex flex-row w-full justify-between space-x-4">
        <StakingVB loadStakingAccount={loadAccountStakedVB} addressStaking={stakingVeBank} />
        <StakingVETVB  loadStakingAccount={loadAccountStakedVB} addressStaking={stakingVETVB}  />
      </div>
    </div>

  );
};

export default AssetsStaking;
