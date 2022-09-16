import React from 'react';
import LaunchPadheadimg from "../../assets/images/launchpad/launchpad_head.jpg";
import LaunchPadheadimg_mb from "../../assets/images/launchpad/launchpad_head_mb.jpg";
import LaunchPad_vebank from "../../assets/images/launchpad/vebank_head.png";
import LaunchPad_fb from "../../assets/images/launchpad/facebook.svg";
import LaunchPad_twitter from "../../assets/images/launchpad/twitter.svg";
import LaunchPad_youtube from "../../assets/images/launchpad/youtube.svg";
import LaunchPad_tele from "../../assets/images/launchpad/tele.svg";

const LaunchPadHead = () => {
    return (
        <div className="head-img pb-8">
            <div className="w-full relative md:flex items-center justify-center">
                <img className="w-full launchimg-img" src={LaunchPadheadimg} />
                <div className="md:absolute md:w-[75%] w-full md:items-start items-center flex flex-col md:py-0 py-[139px] md:top-[36%] align-middle md:bg-transparent bg-[#00192F]">
                    <img className="w-full max-w-[30%] md:min-w-[207px] min-w-[307px]  xl:pb-12 pb-9 "  src={LaunchPad_vebank} />
                    <p className="text-[24px] md:text-[20px] pb-9 lg:text-[24px] xl:text-[24px] 2xl:text-[40px] leading-8 md:text-right text-center">One-stop DeFi Platform on VeChain</p>
                    <div className="grid-cols-4 gap-8 flex">
                        <a href="https://t.me/vebankcommunity" target="_blank"><img className='w-[32px] h-[32px] rounded' src={LaunchPad_tele}/></a>
                        <a href="https://twitter.com/vebankprotocol" target="_blank"> <img className='w-[32px] h-[32px] rounded' src={LaunchPad_twitter}/></a>
                        <a href="https://www.facebook.com/vebankprotocol " target="_blank"><img className='w-[32px] h-[32px] rounded' src={LaunchPad_fb}/></a>
                        <a > <img className='w-[32px] h-[32px] rounded' src={LaunchPad_youtube}/></a>
                       
                    </div>
                </div>
                <img className="w-full launchimg-img-mb" src={LaunchPadheadimg_mb} />

            </div>

        </div>
    );
};

export default LaunchPadHead;
