import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import IcExpand from "../../assets/images/ic_expand.svg";
import IcDot from "../../assets/images/ic_dot.svg";
const PoolChart = () => {
  const data = [
    {
      name: "01:00",
      uv: 1000,
    },
    {
      name: "01:15",
      uv: 1700,
    },
    {
      name: "01: 30",
      uv: 1400,
    },
    {
      name: "01:45",
      uv: 1250,
    },
    {
      name: "02:00",
      uv: 1890,
    },
    {
      name: "02:15",
      uv: 1930,
    },
    {
      name: "02:30",
      uv: 2300,
    },
    {
      name: "02:45",
      uv: 1159,
    },
    {
      name: "03:00",
      uv: 2850,
    },
    {
      name: "03:15",
      uv: 1990,
    },
    {
      name: "03:30",
      uv: 1800,
    },
  ];
  return (
    <div className="relative flex flex-col w-full">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row items-center">
          <span className="font-poppins font-[700] text-xl text-white">
            VET/VB
          </span>
          <img className="cursor-pointer ml-4" src={IcVeBank} alt="Transfer" />
        </div>
        <img className="cursor-pointer" src={IcExpand} alt="Transfer" />
      </div>
      <span className="font-poppins text-base font-[600] text-white mt-[10px]">
        25,000
      </span>
      <span className="font-poppins text-xs text-[#A0D911] mt-1">+0.8%</span>
      <div className="relative">
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#3ee8ff"
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <span className="font-poppins text-xs text-white text-right mt-[10px]">
        1d
      </span>
      <div className="absolute rounded-md py-[6px] px-3 bg-[#171C29] top-[50%] left-[30%]">
        <span className="font-poppins text-xs text-white">
          2022/06/23 03:00
        </span>
        <div className="flex flex-row items-center justify-center">
          <img className="cursor-pointer" src={IcDot} alt="Transfer" />
          <span className="font-poppins text-xs text-white ml-[6px]">
            ETH/DAI <b>0.001</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PoolChart;
