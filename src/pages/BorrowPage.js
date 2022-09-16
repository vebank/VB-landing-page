import React from "react";

// import { useDispatch, useSelector } from "react-redux";

import ModalBorrow from "../components/borrows/ModalBorrow";

import NetMarket from "../components/partials/NetMarket";
import TabMarket from "../components/partials/TabMarket";

const BorrowPage = () => {

  return (

    <section className="box-borrows mx-auto bg-cover bg-center" >

      <div className="lg:container mx-auto lg:px-6 px-4 min-h-screen pt-16 pb-24">

        <div className="flex flex-row">

          <NetMarket />

          <TabMarket />

        </div>

      </div>

      <ModalBorrow />

    </section>

  );
};
export default BorrowPage;
