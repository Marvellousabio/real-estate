// FaNairaSign.jsx
import React from "react";

const FaNairaSign = ({ size = "1em", color = "currentColor", className = "" }) => {
  return (
    <span
      className={className}
      style={{ fontSize: size, color: color, fontWeight: "normal", display: "inline-block", opacity: 0.7 }}
    >
      ₦
    </span>
  );
};

export default FaNairaSign;
