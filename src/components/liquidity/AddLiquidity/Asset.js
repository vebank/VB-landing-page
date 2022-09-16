import "./styles.scss";
import React, { useMemo } from "react";
import IcDropDown from "../../../assets/images/ic_dropdown.svg";
import IcDefaultSymbol from "../../../assets/images/ic_default_symbol.svg";
import { useSelector } from "react-redux";
import { selectLoadLiquidityDetail } from "../../../reducers/liquid.reducer";
import { selectBalanceById } from "../../../reducers/accountBalance.reducer";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";
import HighlightedAssetIcon from "../../swap/HighlightedAssetIcon";
import { svgSymbolConfig } from "../../../_helpers/param";
import { formatBalanceString } from "../../../utils/lib";

const Asset = ({
  refInput,
  assetAddress,
  volume = "",
  className = "",
  onClickSelectCurrency = () => {},
  onVolumeChange = () => {},
}) => {
  const isLoadingLiquidityDetail = useSelector(selectLoadLiquidityDetail);

  const assetBalance = useSelector((state) =>
    selectBalanceById(state, assetAddress)
  );
  const assetInfo = useSelector((state) =>
    selectAssetByAddress(state, assetAddress)
  );

  const onClickMaxButton = () => {
    onVolumeChange(assetBalance.toString());
  };

  const onClickHalfButton = () => {
    onVolumeChange((assetBalance / 2).toString());
  };

  const isBalanceAvailable = useMemo(
    () => assetBalance || assetBalance === 0,
    [assetBalance]
  );

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-col border border-solid border-vbDisableText rounded-lg bg-[#0E1B31] py-4 px-6">
        <div className="flex items-center justify-end">
          {isBalanceAvailable && (
            <span className="text-hint font-poppins text-xs">
              Balance:{" "}
              {isBalanceAvailable && !isLoadingLiquidityDetail && assetBalance
                ? formatBalanceString(assetBalance)
                : "--"}
            </span>
          )}
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex flex-row w-[55%] items-center">
            <button
              className="flex flex-row w-full items-center space-x-[10px]"
              onClick={() => onClickSelectCurrency(refInput)}
            >
              <HighlightedAssetIcon
                icon={assetInfo?.icon || IcDefaultSymbol}
                svgConfig={svgSymbolConfig}
              />
              <span className="font-poppins_bold text-base text-grey-1">
                {assetInfo?.assetsSymbol || "SELECT"}
              </span>
              <img className="w-[10px] h-[8px]" src={IcDropDown} alt="" />
            </button>

            <div className="flex text-[#647BB4] space-x-1 ml-3">
              {assetInfo && (
                <div className="flex flex-row w-full items-center space-x-1">
                  <div className="w-[1px] h-8 bg-hint mr-2"></div>
                  <button
                    className="sm:w-[40px] w-[36px] h-[28px] rounded flex flex-row items-center justify-center text-[12px] leading-4 bg-[#203557]"
                    onClick={onClickMaxButton}
                  >
                    Max
                  </button>
                  <button
                    className="sm:w-[40px] w-[36px] h-[28px] rounded flex flex-row items-center justify-center text-[12px] leading-4 bg-[#203557]"
                    onClick={onClickHalfButton}
                  >
                    Half
                  </button>
                </div>
              )}
            </div>
          </div>
          <input
            ref={refInput}
            autoFocus
            placeholder="0.0"
            min={0}
            value={volume}
            pattern="^[0-9]*\.?[0-9]*$"
            onChange={(e) => onVolumeChange(e.target.value)}
            className="w-[45%] pl-4 py-1 focus:outline-none font-poppins_medium text-base text-right rounded-lg bg-transparent placeholder-vbDisableText"
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Asset);
