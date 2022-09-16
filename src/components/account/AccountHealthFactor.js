import React from "react";
import { nFormatter } from "../../utils/lib";


const AccountHealthFactor = ({value}) => {

  const showColor = (v) => {

      v = Number(v);

      if (v >= 2.15 ) { 
        return "#52E9A9"; //green
      }

      if(1.54 <= v){
        return "#edf618"; //yellow
      }

      if(1.2 <= v){
        return "#ff7a45"; //yellow
      }

      if(v < 1.2){
        return "#FF4D4F"; //red
      }

      return "#FFFFFF"; //white

  }

  return (
    <span className={`font-poppins`} style={{color:`${showColor(value)}`}}>
      {value && value > 1000 ? nFormatter(value,2) : value}
    </span>
  );
};
export default AccountHealthFactor;
