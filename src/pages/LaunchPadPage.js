import React, { useState } from 'react';
import LaunchPadSlider from "../components/launchpad/LaunchPadSlider";
import LaunchPadContent from "../components/launchpad/LaunchPadcontent";
import LaunchPadHead from "../components/launchpad/LaunchPadHead";
import partner from "../assets/images/launchpad/partnership.png";
import partner_icon from "../assets/images/launchpad/partner_icon.png";


const LaunchPadPage = () => {
    const [partnerstate, setpartnerstate] = useState(true)
    function changestate() {
        setpartnerstate(!partnerstate)
    }
    return (

        <section className="box-borrows w-full mx-auto bg-cover bg-center inline-block" >
            <div className="launchpad">
                <div>
                    <LaunchPadHead />
                </div>
                <LaunchPadSlider />
                <div className="flex justify-center">
                    <LaunchPadContent />
                </div>
                <>{partnerstate ?
                    (<div className="fixed ms:mx-0 mx-4 bottom-0 ms:right-5 right-0 float-right" >
                        <div className="relative">
                            <img className="sm:max-w-[318px]" src={partner} />
                            <a onClick={changestate} className="absolute top-0 right-0 w-[25px] h-[25px]"></a>
                            <a href="https://forms.gle/xe4vvHpeXU3jweGc9" target="_blank" className="absolute top-8 right-0 w-full h-[60px]"></a>
                        </div>
                    </div>) :
                    (<img onClick={changestate} className="fixed max-w-[48px] bottom-0 sm:right-9 right-5 float-right" src={partner_icon} />)
                }
                </>
            </div>


        </section>
    );
};

export default LaunchPadPage;
