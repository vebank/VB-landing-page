import React from "react";

const GradientStrokeSymbol = ({ config }) => {
  const viewBox = `0 0 ${(config.r+5)*2} ${(config.r+5)*2}`
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        opacity={config.opacity}
        cx={`${config.r+5}`}
        cy={`${config.r+5}`}
        r={`${config.r}`}
        stroke="url(#grad)"
        strokeWidth={config.strokeWidth}
      />
      <defs>
        <linearGradient
          id="grad"
          x1={config.x1}
          y1={config.y1}
          x2={config.x2}
          y2={config.y2}
          gradientUnits="userSpaceOnUse"
        >
          {config.linearGradient.map((item, index) => (
            <stop key={index} offset={item.offset} stopColor={item.stopColor} stopOpacity={item.stopOpacity} />
          ))}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientStrokeSymbol;
