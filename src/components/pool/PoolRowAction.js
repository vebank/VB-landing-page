import { memo } from "react";
import { useSelector } from "react-redux";
import { selectPoolInfoByAddress } from "../../reducers/assetsPool.reducer";
import {
  selectUserAmountAByPoolAddress,
  selectUserAmountBByPoolAddress,
  selectUserLiquidityPoolByPoolAddress,
} from "../../reducers/userAssetPools.reducer";
import { nFormatter } from "../../utils/lib";
import BtnOpenAddLiquidity from "./BtnOpenAddLiquidity";
import BtnOpenRemoveLiquidity from "./BtnOpenRemoveLiquidity";

const PoolRowAction = ({ assetsPoolAddress = "", item }) => {
  
  const amountTokenA = useSelector((state) =>
    selectUserAmountAByPoolAddress(state, assetsPoolAddress ?? "")
  );
  const amountTokenB = useSelector((state) =>
    selectUserAmountBByPoolAddress(state, assetsPoolAddress ?? "")
  );
  const poolInfo = useSelector((state) =>
    selectPoolInfoByAddress(state, assetsPoolAddress)
  );

  const showYourShare =(data)=>{
    if(data.percentYour){
      return data.percentYour;
    }
    if(item.percentYour){
      return item.percentYour;
    }
    return 0;
  }

  return (
    <div className="bg-[#182844] p-6 mt-2 fade-in-box">
      <div className="bg-[#26355A] p-6 rounded flex flex-row justify-between rounded space-x-4">
        <div>
          <label className="font-poppins text-[14px] text-[#678BCA]">
            Your Liquidity
          </label>
          <div className="font-poppins text-[16px] text-[#3EE8FF]">
            ${nFormatter(poolInfo.yourLiquidityUSD, 7)}
          </div>
        </div>

        <div>
          <label className="text-[#678BCA] font-poppins text-[14px]">
            Assets Pooled
          </label>
          <div className="font-poppins text-[16px] text-[#3EE8FF]">
            {amountTokenA || 0} {poolInfo.assetsSymbolA}
          </div>
          <div className="font-poppins text-[16px] text-[#3EE8FF]">
            {amountTokenB || 0} {poolInfo.assetsSymbolB}
          </div>
        </div>

        <div>
          <label className="text-[#678BCA] font-poppins text-[14px]">
            Your Share
          </label>
          <div className="font-poppins text-[16px] text-[#3EE8FF]">
            {showYourShare(poolInfo)} %
          </div>
        </div>

        <div className="flex flex-row space-x-6 justify-center items-center">
          <BtnOpenRemoveLiquidity assetsPoolAddress={assetsPoolAddress} />
          <BtnOpenAddLiquidity assetsPoolAddress={assetsPoolAddress} />
        </div>
      </div>
    </div>
  );
};

export default PoolRowAction;
