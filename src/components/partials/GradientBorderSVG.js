import React from "react";

const GradientBorderSVG = ({ data }) => {
  return (
    <svg width="0" height="0" className={data.class}>
      <linearGradient
        id={data.id}
        x1={data.x1}
        x2={data.x2}
        y1={data.y1}
        y2={data.y2}
        gradientTransform={data.transform}
      >
        {data.stop?.map((item, index) => (
          <stop
            key={index}
            offset={item.offset ? item.offset : null}
            stopColor={item.stopColor}
          ></stop>
        ))}
      </linearGradient>
      <symbol overflow="visible" id={data.boder_id}>
        <rect
          width="100%"
          height="100%"
          rx={data.rx}
          ry={data.ry}
          stroke={data.stroke}
        ></rect>
      </symbol>
      <use xlinkHref={"#" + data.boder_id} />
    </svg>
  );
};

export default GradientBorderSVG;
