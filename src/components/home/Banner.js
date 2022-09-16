import React from "react";

import bgHomeRound from '../../assets/images/home/bg_round.png';

const Banner = ({ handleClickExplore }) => {

    return (

        // mt-[-12rem]  lg:mt-[-16rem] 2xl:mt-[-24rem]
        <div className="w-auto md:w-screen h-[550px] md:h-screen flex justify-center items-center relative mx-auto mt-[-2rem] lg:mt-[-3rem] 2xl:mt-[-5rem]">

            <div className="hidden md:block w-full h-fit">
                <img src={bgHomeRound} className="xoayvong w-full object-center object-cover blend-dodge fade-in-box ease-in-out" />
            </div>

            <div className="md:hidden absolute top-[-50px] w-[200%] ">
                <img src={bgHomeRound} className="xoayvong w-full object-center object-cover blend-dodge fade-in-box ease-in-out" />
            </div>

            <div className="text-[#19FFFF] absolute w-full h-full flex flex-col justify-center items-center">
                <p className="font-nebula text-[16px] lg:text-[26px] xl:text-[26px] 2xl:text-[36px] leading-10 animatedFadeInUp animated-fadeInDown fadeInDown">VeBank Protocol</p>
                <p className="font-blank_space text-[16px] lg:text-[26px] xl:text-[26px] 2xl:text-[36px] leading-11 text-center animatedFadeInUp animated-fadeInDown fadeInDown">One-stop DeFi Platform</p>
                <p className="font-nebula text-[16px] lg:text-[26px] xl:text-[26px] 2xl:text-[36px] leading-10 animatedFadeInUp animated-fadeInDown fadeInDown">on vechain</p>
                <button onClick={handleClickExplore} className="bg-[#19FFFF] text-[#0B2D60] font-nebula leading-6 px-10 py-4 rounded-full mt-4 animated fadeInUp">EXPLORE</button>
            </div>

        </div>
    );
};
export default Banner;
