
import IcNet from '../../assets/images/ic_net.svg';
import IcVeChain from '../../assets/images/ic_vechain.svg';


const NetMarket = () => {

    return (

        <div>

            <div className='flex flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer'>
                <img src={IcVeChain} alt="icon like" />
                <span className="font-poppins text-3xl ">VeBank Market</span>
            </div>

            <div className="flex justify-start">

                <div className="flex justify-start items-center space-x-4 mt-10">
                    <img
                        className="h-12 w-12 object-cover"
                        src={IcNet}
                        alt="icon Net work"
                    />
                    <div className="xs:ml-2 lg:ml-3 font-normal">
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[18px]">Net worth</div>
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[24px] pt-3">$ <span className="text-slate-100">0</span></div>
                    </div>
                </div>

                <div className="flex justify-start items-center space-x-4 mt-10 ml-14">
                    <img
                        className="h-12 w-12 object-cover"
                        src={IcNet}
                        alt="icon Net APY"
                    />
                    <div className="xs:ml-2 lg:ml-3 font-normal">
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[18px]">Net APY</div>
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[24px] pt-3"><span className="text-slate-100">0</span> %</div>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default NetMarket;