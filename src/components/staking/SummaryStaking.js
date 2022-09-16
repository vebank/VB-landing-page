

import IcVeBank from "../../assets/images/ic_vebank.svg";
import { staking } from "../../assets";

const SummaryStaking= () => {

    return(
        <div className="flex flex-col fade-in-box">

            <div className="flex flex-row items-center space-x-3">
                <img className="h-8 w-8 rounded-full" src={IcVeBank} alt="" />
                <span className="font-poppins_semi_bold text-3xl text-vbLine">
                    Staking
                </span>
            </div>

            <p className="text-base text-white mt-6 w-3/4">
            VeBank holders can stake their VeBank in the Safety Module to add more security to the protocol to earn 30% from protocol revenue sharing and earn Safety Incentives. In the case of a shortfall event, up to 30% of your stake can be slashed to cover the deficit, providing an additional layer of protection for the protocol.
            </p>

            <div className="flex flex-row space-x-12 mt-8">
                <div className="flex flex-row space-x-6">
                    <div className="flex p-3 justify-end items-center bg-[#273E65] rounded-lg">
                    <img
                        className="h-8 w-8 rounded-full"
                        src={staking.IcSafety}
                        alt=""
                    />
                    </div>
                    <div className="flex flex-col space-y-1">
                    <span className="text-base text-[#BFBFBF]">
                        Funds in the Safety Module
                    </span>
                    <span className="font-poppins_semi_bold text-xl text-white">
                        $ 10,000,000
                    </span>
                    </div>
                </div>
                <div className="flex flex-row space-x-6">
                    <div className="flex p-3 justify-end items-center bg-[#273E65] rounded-lg">
                    <img
                        className="h-8 w-8 rounded-full"
                        src={staking.IcEmission}
                        alt=""
                    />
                    </div>
                    <div className="flex flex-col space-y-1">
                    <span className="text-base text-[#BFBFBF]">
                        Total emission per day
                    </span>
                    <span className="font-poppins_semi_bold text-xl text-white">
                        -
                    </span>
                    </div>
                </div>
            </div>
            
        </div>
    )

}

export default SummaryStaking;