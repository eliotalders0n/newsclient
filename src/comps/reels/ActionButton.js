import React from "react";

const ActionButton = ({ icon, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "rgba(255,255,255,0.15)",
      color: "#fff",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      flexDirection: "column",
      gap: "2px",
    }}
  >
    <i className={`bi ${icon}`} />
    {label && (
      <span style={{ fontSize: "10px", fontWeight: 600 }}>{label}</span>
    )}
  </button>
);

export default ActionButton;
