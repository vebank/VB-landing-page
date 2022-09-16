import React from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { swapConstants } from "../../../../constants";
import { selectBalanceById } from "../../../../reducers/accountBalance.reducer";
import { selectAssetByAddress } from "../../../../reducers/assetsMarket.reducer";
import { compareString, formatBalanceString } from "../../../../utils/lib";

const AssetExcerpt = ({
  id,
  onTokenSelected,
  nameToken,
  sourceToken,
  desireToken,
}) => {
  const balance = useSelector((state) => selectBalanceById(state, id));
  const assetInfo = useSelector((state) => selectAssetByAddress(state, id));

  const checkSelectToken = () => {
    if (nameToken === swapConstants.FIRST_TOKEN) {
      if (compareString(sourceToken, assetInfo.assetsAddress)) {
        return true;
      }
    } else {
      if (compareString(desireToken, assetInfo.assetsAddress)) {
        return true;
      }
    }
    return false;
  };
  return (
    <CSSTransition
      key={assetInfo?.assetsAddress}
      timeout={500}
      classNames="item_asset"
    >
      <div
        className={`${
          checkSelectToken() ? "bg-[#232E49]" : "transparent"
        } flex flex-row justify-between items-center my-1 cursor-pointer rounded-lg p-4`}
        // className="flex flex-row justify-between items-center mt-8 first:mt-3 cursor-pointer"
        onClick={(_) => onTokenSelected(id)}
      >
        <div className="flex flex-row items-center space-x-4">
          <img src={assetInfo?.icon} alt="" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="font-poppins_semi_bold text-base text-white">
              {assetInfo?.assetsSymbol}
            </p>
            <p className="text-sm font-poppins_light text-assetNetwork">
              {assetInfo?.assetName}
            </p>
          </div>
        </div>
        <p className="text-base font-poppins_semi_bold text-white">
          {formatBalanceString(balance) || 0}
        </p>
      </div>
    </CSSTransition>
  );
};

export default React.memo(AssetExcerpt);
