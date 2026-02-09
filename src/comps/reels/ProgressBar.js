import React from "react";

const ProgressBar = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      bottom: "82px",
      left: "16px",
      right: "16px",
      height: "2px",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "1px",
      zIndex: 5,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${progress}%`,
        backgroundColor: "#fff",
        borderRadius: "1px",
        transition: "width 0.3s linear",
      }}
    />
  </div>
);

export default ProgressBar;
