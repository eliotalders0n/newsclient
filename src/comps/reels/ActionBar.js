import React from "react";
import ActionButton from "./ActionButton";

const ActionBar = ({ isMuted, onToggleMute, onShare, index, total }) => (
  <div
    style={{
      position: "absolute",
      bottom: "120px",
      right: "12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      zIndex: 5,
    }}
  >
    <ActionButton
      icon={isMuted ? "bi-volume-mute-fill" : "bi-volume-up-fill"}
      onClick={onToggleMute}
    />
    <ActionButton icon="bi-share-fill" onClick={onShare} />
    <span
      style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {index + 1}/{total}
    </span>
  </div>
);

export default ActionBar;
