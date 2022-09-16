import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from "react-router-dom";

import IcArrowSelect from "../../assets/images/ic_arrow_select.svg";
import IcTickSelect from "../../assets/images/ic_tick_select.svg";
import{Link} from "react-router-dom"

const LaunchPadDropDown = (current) => {
    const [showBasis, setShowBasis] = useState(false);
    const [showval, setVal] = useState("Overview");
    const BasicArr = [
      { duration: "Overview" ,to:"/launchpad#overview"},
      { duration: "Team & Partners" ,to:"/launchpad#team&partners" },
      { duration: "Metrics" ,to:"/launchpad#metrics"}
    ];
    const onBasisSelected = (value) => {
      setShowBasis(!showBasis);
      setVal(value);
    };
    const ref = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref?.current && !ref?.current.contains(event.target)) {
            setShowBasis(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    return (
      <div
        className="flex flex-col absolute w-fit p-[12px_16px] border border-[#666D81] bg-[#182D52] rounded-[32px] cursor-pointer"
        ref={ref}
        onClick={() => setShowBasis(!showBasis)}
      >
        <div className="flex flex-row items-center justify-between space-x-2 pr-4 text-[14px]">
          <div className="flex flex-row items-center space-x-3">
            <span className="text-base text-white whitespace-nowrap">
              {showval}
            </span>
          </div>
          <img
            alt="select_icon"
            src={IcArrowSelect}
            className={`w-[14px] h-[7px] mr-4 transition-transform ${
              !showBasis ? "rotate-180" : ""
            }`}
          />
        </div>
        {showBasis && (
          <div className="flex flex-col">
            <div className="h-[1px] w-full bg-vbDisableText my-3"></div>
            <div className="flex flex-col space-y-3">
              {BasicArr.map((itemBasis, index) => (
                <Link   
                  key={index}
                  className="flex flex-row items-center"
                  onClick={() => onBasisSelected(itemBasis.duration)}
                  to={itemBasis.to}
                >
                    {itemBasis.duration}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default LaunchPadDropDown;