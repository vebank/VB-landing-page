import React from 'react';
import IcExchange from "../../assets/images/ic_exchange.svg";
import IcExpand from "../../assets/images/ic_expand.svg";
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
    {
        name: '01:00',
        uv: 1000,
    },
    {
        name: '01:15',
        uv: 1200,
    },
    {
        name: '01: 30',
        uv: 1100,
    },
    {
        name: '01:45',
        uv: 1250,
    },
    {
        name: '02:00',
        uv: 1890,
    },
    {
        name: '02:15',
        uv: 1930,
    },
    {
        name: '02:30',
        uv: 2300,
    },
    {
        name: '02:45',
        uv: 2359,
    },
    {
        name: '03:00',
        uv: 2550,
    },
    {
        name: '03:15',
        uv: 3490,
    },
    {
        name: '03:30',
        uv: 2500,
    },
];

const TradeChart = ({swapToken}) => {

    const dateTimeOption = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    return (
        <div className="flex flex-col p-2 space-y-4">
            <div className="flex justify-between">
                <div className="flex justify-between items-center space-x-2">
                    <img className="w-6" src={swapToken.from.icon} alt=""/>
                    <img className="w-6" src={swapToken.to.icon} alt=""/>
                    <p className="text-lg text-white font-bold">{swapToken.from.symbol} / {swapToken.to.symbol}</p>
                    <img className="w-10" src={IcExchange} alt=""/>
                    <p className="text-lg text-white font-bold">BASIC</p>
                </div>
                <img className="w-6 cursor-pointer" src={IcExpand} alt=""/>
            </div>
            <div className="flex items-center space-x-4">
                <p className="text-4xl font-bold text-[#a0d911]">52.81</p>
                <p className="text-lg text-white font-bold">{swapToken.from.symbol} / {swapToken.to.symbol}</p>
                <p className="text-lg text-[#3ee8ff] font-bold">+ 2.251 (4.45%)</p>
            </div>
            <div>{(new Date()).toLocaleDateString("en-US", dateTimeOption)}</div>

            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 30,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3ee8ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3ee8ff" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <Area type="monotone" dataKey="uv" stroke="#3ee8ff" fill="url(#colorUv)"/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TradeChart;
