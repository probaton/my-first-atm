import React from "react";
import "./style/KeyPad.css";

export type KeyPadValue = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "OK" | "X";

interface Props {
  onKeyPress: (value: KeyPadValue) => void;
}

function KeyPad({ onKeyPress }: Props) {
  const renderKey = (keyLabel: KeyPadValue) => {
    const handleClick = () => onKeyPress(keyLabel);
    return (
      <div key={keyLabel} className="atm-key-pad-button" onClick={handleClick}>
        {keyLabel}
      </div>
    );
  };

  const renderKeyRow = (keyLabels: KeyPadValue[]) => {
    const keys = keyLabels.map(renderKey);
    return <div className="atm-key-pad-row">{keys}</div>;
  };

  return (
    <div className="atm-key-pad">
      {renderKeyRow(["1", "2", "3"])}
      {renderKeyRow(["4", "5", "6"])}
      {renderKeyRow(["7", "8", "9"])}
      {renderKeyRow(["X", "0", "OK"])}
    </div>
  );
}

export default KeyPad;
