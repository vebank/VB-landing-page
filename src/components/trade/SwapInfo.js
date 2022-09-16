import React from 'react';
import IcQuestionCircle from "../../assets/images/ic_question_circle.svg";

const SwapInfo = ({swapToken}) => {
    return (
        <div className="flex flex-col rounded-md border border-[#3ee8ff] p-2">
            <div className="flex justify-between">
                <div className="flex space-x-2">
                    <p>Minimum Received</p>
                    <img src={IcQuestionCircle} alt=""/>
                </div>
                <p>99.9 {swapToken.to.symbol}</p>
            </div>
            <div className="flex justify-between">
                <div className="flex space-x-2">
                    <p>Liquidity Provider Fee</p>
                    <img src={IcQuestionCircle} alt=""/>
                </div>
                <p>0.0025 {swapToken.from.symbol}</p>
            </div>
            <div className="flex justify-between">
                <div className="flex space-x-2">
                    <p>Price Impact</p>
                    <img src={IcQuestionCircle} alt=""/>
                </div>
                <p className="text-[#3ee8ff]"> &lt; 0.01% </p>
            </div>
        </div>
    );
};

export default SwapInfo;
