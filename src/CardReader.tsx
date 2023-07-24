import React from "react";
import "./style/CardReader.css";

interface Props {
  accountNr: number | undefined;
  onClick: (accountNr: number | undefined) => void;
}

function CardReader({ accountNr, onClick }: Props) {
  // Pretending to read an account number from the card in the on-click
  return (
    <div className="atm-card-reader" onClick={() => onClick(accountNr ? undefined : 1234567890)}>
      <div className="atm-card-slot" />
      {accountNr && <div className="atm-card" />}
    </div>
  );
}

export default CardReader;
