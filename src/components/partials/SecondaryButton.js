import React from "react";
import PartialConstants from "../../constants/partial.constants";
import GradientStrokeWrapper from "./GradientStrokeWrapper";

const SecondaryButton = ({
  label = "Button",
  onClick = () => {},
}) => (
  // className="flex flex-row items-center justify-center rounded-full bg-transparent px-4 py-[10px] font-poppins text-base leading-5 relative"
  <button
  className="flex flex-row items-center justify-center rounded-full bg-transparent px-4 py-[10px] font-poppins text-base leading-5 relative"
      // className={`flex flex-row items-center justify-center w-full h-full top-0 text-[${labelColor}] ${className}`}
      onClick={onClick} >
         <GradientStrokeWrapper className="-z-50" borderRadius="8px" />
        {label}</button>
);

export default React.memo(SecondaryButton);
