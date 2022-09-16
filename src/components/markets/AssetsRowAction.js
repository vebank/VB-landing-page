import { useSelector, useDispatch, shallowEqual } from "react-redux";

import BtnOpenBorrow from "./BtnOpenBorrow";
import BtnOpenWithdraw from "./BtnOpenWithdraw";
import BtnOpenSupply from "./BtnOpenSupply";
import BtnOpenRepay from "./BtnOpenRepay";
import UserAssetSupplied from "./UserAssetSupplied";
import UserAssetBorrowed from "./UserAssetBorrowed";
import UserAssetSupply from "./UserAssetSupply";
import UserAssetAvailableBorrow from "./UserAssetAvailableBorrow";

const AssetsRowAction = ({ openRowAssets, item }) => {
  
  if (openRowAssets.indexOf(item.assetsAddress) === -1) {
    return <></>;
  }

  return (
    <div className="bg-[#293A55] rounded-b-lg p-6 mt-2 flex flex-row justify-between space-x-6 fade-in-box">
      <div className="bg-[#182233] p-4 rounded-lg font-poppins">
        <h4 className="text-[#778CC0] text-sm">Available</h4>
        <div className="flex flex-row mt-3">
          <UserAssetSupplied item={item} assetsAddress={item.assetsAddress} />
          <BtnOpenWithdraw item={item} />
        </div>
      </div>

      <div className="bg-[#182233] p-4 rounded-lg font-poppins">
        <h4 className="text-[#778CC0] text-sm">Balance</h4>
        <div className="flex flex-row mt-3">
          <UserAssetSupply assetsAddress={item.assetsAddress} />
          <BtnOpenSupply item={item} />
        </div>
      </div>

      <div className="bg-[#182233] p-4 rounded-lg font-poppins">
        <h4 className="text-[#778CC0] text-sm">Debt</h4>
        <div className="flex flex-row mt-3">
          <UserAssetBorrowed assetsAddress={item.assetsAddress} />
          <BtnOpenRepay item={item} />
        </div>
      </div>

      <div className="bg-[#182233] p-4 rounded-lg">
        <h4 className="text-[#778CC0] text-sm font-poppins">Available</h4>
        <div className="flex flex-row mt-3">
          <UserAssetAvailableBorrow item={item} assetsAddress={item.assetsAddress} />
          <BtnOpenBorrow item={item} />
        </div>
      </div>
    </div>
  );
};

export default AssetsRowAction;
