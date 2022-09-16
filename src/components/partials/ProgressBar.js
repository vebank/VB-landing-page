import React from "react";

const ProgressBar = ({completed = 0, isShowLabel = false, labelClassName = ""}) => {

  return (
    <div className="w-full h-1.5 bg-grey-9">
      <div style={{width: `${completed}%`, transition: 'width 0.5s ease-in-out',}} className="h-full bg-btn-veb rounded-md transition ease-in-out duration-300">
        {isShowLabel && (<span className={`${labelClassName}`}>{`${completed}%`}</span>)}
      </div>
    </div>
  );
};

export default ProgressBar;