import React from "react";
import AssetsStaking from "../components/staking/AssetsStaking";
import ModalStake from "../components/staking/ModalStake";
import ModalUnStake from "../components/staking/ModalUnStake";
import ModalClaimStaked from "../components/staking/ModalClaimStaked";
import SummaryStaking from "../components/staking/SummaryStaking";

const StakingPage = () => {

  return (
    <section className="box-borrows mx-auto bg-cover bg-center">
      <div className="container mx-auto min-h-screen pt-20 pb-24 bg-content">
        <SummaryStaking />
        <AssetsStaking />
        <ModalStake />
        <ModalUnStake />
        <ModalClaimStaked />
      </div>
    </section>
  );
  
};

export default StakingPage;
