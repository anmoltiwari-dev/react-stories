import React from "react";

type ProgressBarProps = {
  progress: number; // 0 to 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "4px",
        width: "100%",
        background: "rgba(245, 240, 240, 0.2)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(to right, #00f260, #0575e6)",
          transition: "width 50ms linear",
        }}
      />
    </div>
  );
};

export default ProgressBar;
