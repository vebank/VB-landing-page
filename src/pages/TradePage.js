import React, {useState} from 'react';
import TradeChart from "../components/trade/TradeChart";
import TradeSwap from "../components/trade/TradeSwap";
import IcVeBank from "../assets/images/ic_vebank.svg";
import IcVThor from "../assets/images/ic_vtho.svg";
import IcVeUSD from "../assets/images/ic_veusd.svg";
import IcVeChain from "../assets/images/ic_vechain.svg";

const COIN_TYPES = [
    {
        symbol: "VB",
        icon: IcVeBank,
        price: 10,
    },
    {
        symbol: "VTHO",
        icon: IcVThor,
        price: 20,
    },
    {
        symbol: "VEUSD",
        icon: IcVeUSD,
        price: 1,
    },
    {
        symbol: "VET",
        icon: IcVeChain,
        price: 15,
    },
]

const TradePage = () => {

    const [swapToken, setSwapToken] = useState({
        from: {
            symbol: COIN_TYPES[0].symbol,
            icon: COIN_TYPES[0].icon,
            price: COIN_TYPES[0].price
        },
        to: {
            symbol: COIN_TYPES[1].symbol,
            icon: COIN_TYPES[1].icon,
            price: COIN_TYPES[1].price
        }
    });

    return (
        <section className="box-borrows mx-auto bg-cover bg-center">
            <div className="lg:px-4 lg:container xl:px-12 mx-auto px-4 min-h-screen pt-16 pb-24">
                <div className="flex flex-row">
                    <div className="w-2/3 p-2">
                        <div className="rounded-md border border-[#3ee8ff] bg-[#0b1329] h-auto p-2">
                            <TradeChart swapToken={swapToken}/>
                        </div>
                    </div>
                    <div className="w-1/3 p-2">
                        <div className="rounded-md border border-[#3ee8ff] bg-[#0b1329] h-full p-2">
                            <TradeSwap coinType={COIN_TYPES} getSwapToken={(data) => setSwapToken(data)}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradePage;
