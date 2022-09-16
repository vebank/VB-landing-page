import React from "react";
import { CSSTransition } from "react-transition-group";

const AssetAdd = ({ tokenAdd, onImportToken }) => {
  return (
    <CSSTransition
      key={tokenAdd?.assetsAddress}
      timeout={500}
      classNames="item_asset"
    >
      <div
        className={`flex flex-row justify-between items-center my-1 rounded-lg p-4`}
      >
        <div className="flex flex-row items-center relative">
          <img src={tokenAdd?.icon} alt="" className="w-8 h-8" />
          <div className="flex flex-col ml-4">
            <p className="font-poppins_semi_bold text-base text-white">
              {tokenAdd?.assetsSymbol}
            </p>
            <p className="text-sm font-poppins_light text-assetNetwork">
              {tokenAdd?.assetName}
            </p>
          </div>
          <div className="absolute left-0 top-0 flex flex-row items-start w-full h-full bg-color-modal-wallet/[.6]"/>
        </div>
        <button
          className={`flex-2 btn-veb-add-token px-2 py-1`}
          onClick={onImportToken}
        >
          Import
        </button>
      </div>
    </CSSTransition>
  );
};

export default React.memo(AssetAdd);
