import React from "react";
// import { useDispatch, useSelector } from "react-redux";

import AssetsSupply from "../components/supply/AssetsSupply";

import NetMarket from "../components/partials/NetMarket";
import TabMarket from "../components/partials/TabMarket";
import ModalSupply from "../components/supply/ModalSupply";

const SupplyPage = () => {

  return (

    <section className="box-borrows mx-auto bg-cover bg-center" >

      <div className="lg:container mx-auto lg:px-6 px-4 min-h-screen pt-16 pb-24">

        <div className="flex flex-row">

          <NetMarket />

          <TabMarket />

        </div>

        <AssetsSupply />

      </div>

      <ModalSupply />

    </section>

  );
};
export default SupplyPage;
