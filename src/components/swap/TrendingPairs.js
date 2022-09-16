import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IcArrow from "../../assets/images/ic_arrow_right.svg";
import * as actions from "../../actions";
import { selectSymbolPairs } from "../../reducers/swap.reducer";

const TrendingPairs = () => {
 
  const dispatch = useDispatch();

  const { web3 } = useSelector((state) => state.web3, shallowEqual);

  useEffect(() => {
    if (web3) {
      getSymbolPairs();
    }
  }, [web3]);

  async function getSymbolPairs() {
    await dispatch(actions.getAllPairs());
  }
  const data = useSelector(selectSymbolPairs);

  return (
    <div className="flex flex-col w-full space-y-6">
      <span className="font-poppins font-[700] text-xl text-white">
        Trending pairs
      </span>
      <div className="h-[1px] bg-[#4B5C86]"></div>
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-x-[6px] gap-y-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-row w-full justify-center bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px] mr-[6px]"
            >
              <span className="font-poppins font-[600] text-sm text-white">
                {item.symbolTokenA}
              </span>
              <img className="cursor-pointer" src={IcArrow} alt="Transfer" />
              <span className="font-poppins font-[600] text-sm text-white">
                {item.symbolTokenB}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPairs;
