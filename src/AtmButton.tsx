import React from "react";
import "./style/AtmButton.css";

interface Props {
  flip?: boolean;
  onClick?: () => void;
}

function AtmButton({ flip, onClick }: Props) {
  return (
    <div className={`atm-button-container ${flip ? "flip-row" : ""}`} onClick={onClick}>
      <span className="atm-button-guide" />
      <div className="atm-button" />
    </div>
  );
}

export default AtmButton;
