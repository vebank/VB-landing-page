import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/partials/Header";
import Footer from "../components/partials/Footer";
import ModalRemoveLiquidity from "../components/liquidity/RemoveLiquidity/ModalRemoveLiquidity";
import ModalNotify from "../components/partials/ModalNotify";

const MainLayout = () => {
  
  useEffect(() => {
    console.info(
      `${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`
    );
  }, []);

  // if (spinner) {
  //     return "..loading";
  // }

  return (
    <main className="bg-layout-vb text-white leading-loose">
      <Header />
      <Outlet />
      <ModalRemoveLiquidity />
      <ModalNotify />
    </main>
  );
};

export default MainLayout;
