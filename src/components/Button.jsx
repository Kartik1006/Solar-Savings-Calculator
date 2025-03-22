import React from "react";
import "../styles/Button.css"; // Ensure you create this CSS file

const Button = ({ text, onClick }) => {
  return (
    <button className="glow-on-hover" type="button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
