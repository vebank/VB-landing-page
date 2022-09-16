import React from 'react';
import LaunchPad_metrics from "../../assets/images/launchpad/launchpad_metrics.jpg";
import LaunchPad_metrics1 from "../../assets/images/launchpad/launchpad_metrics1.jpg";

const LaunchPadmetrics = () => {

    return (
        <div className="w-full md:pb-40 px-4">
            <div><p className="launchpad-content-title pb-6">$VB Tokenomics</p></div>
            <img className="w-full mb-10 rounded-xl" src={LaunchPad_metrics1} />

        </div>
    );
};

export default LaunchPadmetrics;
