import React, { useEffect, useState, useRef } from 'react';
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import LazyloadImage from './LaunchPad_carousel';

import launchpad_overview1 from "../../assets/images/launchpad/launchpad_overview1.jpg";
import launchpad_overview2 from "../../assets/images/launchpad/launchpad_overview2.jpg";
import launchpad_overview4 from "../../assets/images/launchpad/launchpad_overview4.jpg";
import launchpad_overview5 from "../../assets/images/launchpad/launchpad_overview5.jpg";
import launchpad_overview6 from "../../assets/images/launchpad/launchpad_overview6.jpg";
import launchpad_overview5_mb from "../../assets/images/launchpad/launchpad-mb/roadmap.svg";
//mpblie img
import whybuildvechain1 from "../../assets/images/launchpad/launchpad-mb/whybuildvechain1.jpg";
import whybuildvechain2 from "../../assets/images/launchpad/launchpad-mb/whybuildvechain2.jpg";
import Overview from "../../assets/images/launchpad/launchpad-mb/vebank-product.png";
import Overview1 from "../../assets/images/launchpad/launchpad-mb/vebank-product-1.png";
import Overview2 from "../../assets/images/launchpad/launchpad-mb/vebank-product-2.png";
import Overview3 from "../../assets/images/launchpad/launchpad-mb/vebank-product-3.png";
import Overview4 from "../../assets/images/launchpad/launchpad-mb/vebank-product-4.png";
import Overview5 from "../../assets/images/launchpad/launchpad-mb/vebank-product-5.png";
import Overview6 from "../../assets/images/launchpad/launchpad-mb/vebank-product-6.png";
import Overview7 from "../../assets/images/launchpad/launchpad-mb/vebank-product-7.png";
import protocol1 from "../../assets/images/launchpad/launchpad-mb/protocol-1.svg";
import protocol2 from "../../assets/images/launchpad/launchpad-mb/protocol-2.svg";
import protocol3 from "../../assets/images/launchpad/launchpad-mb/protocol-3.svg";
SwiperCore.use([EffectCoverflow, Pagination, Autoplay]);

const LaunchPadoverview = () => {


    const [isActive, setisActive] = useState("menu1");
    const scollToRef = useRef();
    const scollToRef1 = useRef();
    const scollToRef2 = useRef();
    const scollToRef3 = useRef();
    const scollToRef4 = useRef();

    const slide_img = [
        Overview,
        Overview1,
        Overview2,
        Overview3,
        Overview4,
        Overview5,
        Overview6,
        Overview7
    ];
    const slide_img_1 = [
        protocol1,
        protocol2,
        protocol3,

    ];
    useEffect(() => {
        window.addEventListener("scroll", () => {
            var menu1 = document.getElementById("menu1")?.offsetTop;
            var menu2 = document.getElementById("menu2")?.offsetTop;
            var menu3 = document.getElementById("menu3")?.offsetTop;
            var menu4 = document.getElementById("menu4")?.offsetTop;

            if ((window.innerHeight + window.scrollY)+1 >= document.body.offsetHeight ) {
                setisActive("menu4")
            }
            else if (window.scrollY >= menu3 - 101 && window.scrollY < menu4) {
                setisActive("menu3")
            }
            else if (window.scrollY >= menu2 - 101 && window.scrollY < menu3) {
                setisActive("menu2")
            }
            else if (window.scrollY >= menu1 && window.scrollY < menu2) {
                setisActive("menu1")
            }
        });
    }, []);

    return (
        <div className="flex w-full pb-40 px-4">
            <div className="launchpad-content-1 md:block hidden ">
                <div className=" sticky top-1/4">
                    <a className={(isActive === "menu1" ? 'launchpad-contend-menu ' : 'inactive')} onClick={() => { scollToRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>What is VeBank?</p>
                    </a>
                    <a className={(isActive === "menu2" ? 'launchpad-contend-menu ' : 'inactive')} onClick={() => { scollToRef1.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>Why build on VeChain?</p>
                    </a>
                    <a className={(isActive === "menu3" ? 'launchpad-contend-menu ' : 'inactive')} onClick={() => { scollToRef2.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>VeBank Product</p>
                    </a>
                    <a className={(isActive === "menu4" ? 'launchpad-contend-menu ' : 'inactive')} onClick={() => { scollToRef3.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>Roadmap</p>
                    </a>

                </div>

            </div>
            <div className="launchpad-content-2 md:pl-12 px-4">
                <div id="menu1" ref={scollToRef} className="scrollmargin"><p className="launchpad-content-title pb-6">What is VeBank?</p></div>
                <div className="pb-6"><span className="launchpad-content-text blue-text">VeBank is a one-stop DeFi protocol built on the VeChainThor (VeChain) <span className="launchpad-content-text">blockchain which provides fundamental finance functionalities, such as DEX, lending/borrowing, staking, farming, and launchpad, on this chain. VeBank targets to become the leading application on VeChain's ecosystem, building the most essential DeFi solutions, and being the gateway for all financial transactions on VeChain's global trading system.</span></span></div>
                <img className="w-full mb-6 rounded-3xl" src={launchpad_overview1} />
                <div className="pb-16"><span className="launchpad-content-text blue-text">VeBank  <span className="launchpad-content-text">provides a unique solution for DeFi that no other protocols could build for VeChain - an Oracle (SEER). VeBank's Oracle provides real-time feeds of over 10 asset values: BTC, ETH, VET, VTHO, VeUSD,… and ensures that every dApp built on VeChain can easily access truthful data.
                    Beside, in order to make it more convenient and easier in transferring crypto assets, tokens or data from one blockchain to another, VeBank plans to build a bridge which will bring assets from top blockchain platforms such as Ethereum, Binance, Avalanche, and so forth, to VeChain, increasing transaction and total value locked on this chain.</span></span></div>
                <div id="menu2" ref={scollToRef1} className="scrollmargin"><p className="launchpad-content-title pb-6">Why build on VeChain?</p></div>
                <img className="w-full mb-6 rounded-3xl" src={launchpad_overview2} />
                <div className="pb-6"><span className="launchpad-content-text blue-text">VeChainThor (VeChain)<span className="launchpad-content-text">, according to CoinMarketcap, is among top 40 layer-1 blockchain (#31) in terms of market capitalization. VeChain has over 2.3 million holders (VET + VTHO) and over 1.8 million wallet addresses. In addition, VeChain has a loyal community with more than 400k followers on twitter, 40k telegram members and 200k reddit members.</span></span></div>
                <div className="md:flex flex-row py-12 px-7 mylaunch-contentbg md:mb-4 mb-6">
                    <img className="md:w-1/2 w-full rounded-2xl " src={whybuildvechain1} />
                    <img className="md:w-1/2 w-full rounded-2xl md:pl-[13px] md:mt-0 mt-4" src={whybuildvechain2} />

                </div>

                <div className="pb-16"><span className="launchpad-content-text blue-text">VeChain <span className="launchpad-content-text">VeChain is the world's leading blockchain platform providing technology solutions for businesses. More than 30 of the major US enterprises (500 Fortune) including Walmart, BMW, LVMH, Renault and PwC all have solutions running directly on VeChain, with 250+ clients currently being onboarded <span className="launchpad-content-text blue-text"><a href="https://vechaininsider.com/introduction/" target="_blank">Vechaininsider’s Introduction</a></span>. Most recently, VeChain announced a $100M partnership with UFC, becoming the first official layer-1 blockchain partner providing carbon-neutral marketing services for this prestigious global tournament. VeChain also partnered with Alchemy Pay to enhance the utility of VET tokens - this action makes VET tokens accepted in over 2 million stores based in 70 different countries. In March 2022, VeChain launched the stable coin VeUSD - the first step to build a DeFi ecosystem. VeChain promises to become a fertile ground for DeFi ecosystems to expand and grow.
                </span></span> <span className="launchpad-content-text blue-text"><a href="https://vechainstats.com/" target="_blank">Vechainstats</a></span></div>

                <div id="menu3" ref={scollToRef2}  className="scrollmargin"><p className="launchpad-content-title pb-6">VeBank Product</p></div>
                <div className="md:hidden block z-[0] relative">
                    <LazyloadImage val={slide_img} />
                </div>
                <img className="w-full mb-6 rounded-3xl md:block hidden" src={launchpad_overview4} />
                <div id="menu4" ref={scollToRef3} className="scrollmargin" ><p className="launchpad-content-title pb-6">Roadmap</p></div>
                <img className="w-full mb-6 rounded-3xl md:block hidden" src={launchpad_overview5} />
                <img className="w-full mb-6 rounded-xl md:hidden block" src={launchpad_overview5_mb} />
                {/* <div id="menu5" className="scrollmargin" ref={scollToRef4}><p className="launchpad-content-title pb-6">VB Protocol Tokens</p></div>
                <img className="w-full rounded-3xl md:block hidden" src={launchpad_overview6} />
                <div className="md:hidden block z-[0] relative">
                    <LazyloadImage val={slide_img_1} />
                </div> */}
            </div>
        </div >
    );
};

export default LaunchPadoverview;