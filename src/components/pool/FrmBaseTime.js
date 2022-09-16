import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import IcArrowSelect from "../../assets/images/ic_arrow_select.svg";
import IcTickSelect from "../../assets/images/ic_tick_select.svg";

const FrmBaseTime = ({ timeBasis, onTimeBasisChange }) => {
  const [showTimeBasis, setShowTimeBasis] = useState(false);
  const timeBasicArr = [
    { duration: "24H" },
    { duration: "7D" },
    { duration: "30D" },
  ];
  const onTimeBasisSelected = (value) => {
    if (value !== "24H") {
      return;
    }
    onTimeBasisChange(value);
    setShowTimeBasis(!showTimeBasis);
  };
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref?.current && !ref?.current.contains(event.target)) {
        setShowTimeBasis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <div
      className="flex flex-col w-[166px] p-[12px_16px] border border-vbDisableText rounded-lg bg-[#0D1522] cursor-pointer"
      ref={ref}
      onClick={() => setShowTimeBasis(!showTimeBasis)}
    >
      <div className="flex flex-row items-center justify-between space-x-2 pr-4">
        <div className="flex flex-row items-center space-x-3">
          <span className="text-base text-vbDisableText whitespace-nowrap">
            Time Basis
          </span>
          <span className="text-base text-white w-8">{timeBasis}</span>
        </div>
        <img
          alt="select_icon"
          src={IcArrowSelect}
          className={`w-[14px] h-[7px] mr-4 transition-transform ${
            !showTimeBasis ? "rotate-180" : ""
          }`}
        />
      </div>
      {showTimeBasis && (
        <div className="flex flex-col">
          <div className="h-[1px] w-full bg-vbDisableText my-3"></div>
          <div className="flex flex-col space-y-3">
            {timeBasicArr.map((itemTimeBasis, index) => (
              <div
                key={index}
                className="flex flex-row items-center"
                onClick={() => onTimeBasisSelected(itemTimeBasis.duration)}
              >
                <span className="w-full text-base text-white cursor-pointer hover:text-[#7694DE]">
                  {itemTimeBasis.duration}
                </span>
                {timeBasis === itemTimeBasis.duration && (
                  <img alt="select_icon" src={IcTickSelect} className="pl-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrmBaseTime;
