import React from 'react';
import mylaunch_title from "../assets/images/launchpad/mylaunch_title.svg";
import mylaunch_title_mb from "../assets/images/launchpad/mylaunch_title_mb.svg";

import mylaunch_rocket from "../assets/images/launchpad/mylaunch_rocket.svg";
import right_arrow from "../assets/images/launchpad/right_arrow.svg";


const MyLaunches = () => {
    return (
        <section className="box-borrows mx-auto bg-cover bg-center mylaunchpad-wrapper" >
            <div className="mylaunchpad">
                <div className="md:flex flex-row items-center  min-h-screen ">
                    <div className="md:w-3/7 h-auto md:mx-0 mx-auto md:pt-0 pt-[123px] md:block flex flex-col items-center justify-center">
                        <img className="lg:pl-40 md:pl-20 pb-12 w-full md:block hidden" src={mylaunch_title} />
                        <img className="lg:pl-40 md:pl-20 pb-12 w-full md:hidden block" src={mylaunch_title_mb} />
                        <div className="md:mylaunch-btn-wapper">
                        <div className="lg:pl-40 md:pl-20  w-fit relative flex md:px-0">
                            <a href="https://forms.gle/xe4vvHpeXU3jweGc9" target="_blank" className="md:text-[20px] text-[16px] w-max flex font-semibold leading-[28px] apply-btn">Apply for Partnership
                                <div className="arrowbtn-wraper"><img className="h-full" src={right_arrow} /></div>
                            </a>
                        </div>
                        </div>
                    </div>
                    <div className="md:w-4/7 w-full md:h-auto h-[50vh] md:mx-0 md:mt-[67px] mt-0 mx-auto relative md:min-h-screen flex justify-center rocket-container">
                        <div className="rocket-bg md:min-h-screen "></div>
                        <div className="flex justify-center">
                            <img className="rocket w-4/5" src={mylaunch_rocket} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyLaunches;

