import "./style/Atm.css";

import React, { useEffect, useState } from "react";

import AtmButton from "./AtmButton";
import KeyPad, { KeyPadValue } from "./KeyPad";
import Screen from "./Screen";
import CardReader from "./CardReader";

import { ScreenState } from "./util/screenTexts";
import { authenticate } from "./util/authenticate";
import { checkBalance, withdraw } from "./util/balance";

function Atm() {
  const [screenState, setScreenState] = useState<ScreenState>({ id: "welcome" });
  const [buttonFunctions, setButtonFunctions] = useState<(() => void)[] | (() => Promise<void>)[]>([]);
  const [accountNr, setAccountNr] = useState<number | undefined>(undefined);
  const [pin, setPin] = useState<string>("");
  const [customWithdrawAmount, setCustomWithdrawAmount] = useState<string>("");

  useEffect(() => {
    setScreenState({ id: accountNr ? "submitPin" : "welcome" });
    if (!accountNr) {
      setPin("");
    }
  }, [accountNr]);

  useEffect(() => {
    if (!accountNr) return;

    switch (pin.length) {
      case 0: return setScreenState({ id: accountNr ? "submitPin" : "welcome" });
      case 1: return setScreenState({ id: "submitPin", value: "*" });
      case 2: return setScreenState({ id: "submitPin", value: "* *" });
      case 3: return setScreenState({ id: "submitPin", value: "* * *" });
      case 4: return setScreenState({ id: "submitPin", value: "* * * *" });
    }
  }, [pin]);

  useEffect(() => {
    const optionsFunctions = [
      () => setScreenState({ id: "withdraw" }),
      async () => {
        setScreenState({ id: "processing" });
        setScreenState({ id: "balance", value: await checkBalance(accountNr!, pin) });
      },
    ];
    const withdrawFunctions = [
      () => withdrawFunction(80),
      () => withdrawFunction(60),
      () => withdrawFunction(40),
      () => withdrawFunction(20),
      () => setScreenState({ id: "withdrawOther", value: customWithdrawAmount }),
      () => withdrawFunction(200),
      () => withdrawFunction(150),
      () => withdrawFunction(100),
    ];

    switch (screenState.id) {
      case "options": return setButtonFunctions(optionsFunctions);
      case "withdraw": return setButtonFunctions(withdrawFunctions);
      case "welcome":
      case "submitPin":
      case "balance":
      case "processing":
      case "failure":
      default: return setButtonFunctions([]);
    }
  }, [screenState]);

  const withdrawFunction = async (amount: number) => {
    const result = await withdraw(accountNr!, pin, amount);
    return result.success
      ? setScreenState({ id: "withdrawSuccess", value: result.balance })
      : setScreenState({ id: "failure", value: result.message });
  };

  const renderButtons = (rightSide?: boolean) => {
    const buttonIndices = rightSide ? [3, 2, 1, 0] : [7, 6, 5, 4];
    return buttonIndices.map((i) => <AtmButton key={i} flip={rightSide} onClick={buttonFunctions[i]} />);
  };

  const handleAuth = async () => {
    if (pin.length < 4 || !accountNr) return;

    setScreenState({ id: "processing" });
    const isAuthenticated = await authenticate(accountNr, pin);
    setScreenState({ id: isAuthenticated ? "options" : "failure" });
  };

  const handleKeyPadPress = (key: KeyPadValue) => {
    if (!accountNr) return;

    if (screenState.id === "submitPin") {
      switch (key) {
        case "X": return setPin("");
        case "OK": return handleAuth();
        default: {
          if (pin.length >= 4) return;
          setPin(`${pin}${key}`);
        }
      }
    }

    const withdrawCustom = () => {
      if (!customWithdrawAmount || customWithdrawAmount === "0") {
        setCustomWithdrawAmount("");
        return setScreenState({ id: "failure", value: "Please select a valid amount" });
      }
      const amount = parseInt(customWithdrawAmount);
      if (amount % 20 !== 0) {
        setCustomWithdrawAmount("");
        return setScreenState({ id: "failure", value: "Only $20 bills available" });
      }
      withdrawFunction(amount);
      setCustomWithdrawAmount("");
    };

    const updateCustomWithdrawAmount = (newValue: string) => {
      setCustomWithdrawAmount(newValue);
      setScreenState({ id: "withdrawOther", value: `${customWithdrawAmount}${key}` });
    };

    if (screenState.id === "withdrawOther") {
      switch (key) {
        case "X": return updateCustomWithdrawAmount("");
        case "OK": return withdrawCustom();
        default: return updateCustomWithdrawAmount(`${customWithdrawAmount}${key}`);
      }
    }
  };

  return (
    <div className="atm">
      <div className="atm-header">
        <span className="atm-title">My First ATM</span>
        <span className="atm-subtitle">24 HOUR BANKING</span>
      </div>
      <div className="atm-content">
        <div className="atm-interface">
          <CardReader accountNr={accountNr} onClick={(nr) => setAccountNr(nr)} />
          <div className="atm-buttons">{renderButtons(true)}</div>
          <Screen screenState={screenState} />
          <div className="atm-buttons">{renderButtons()}</div>
        </div>
        <div className="atm-input-output">
          <KeyPad onKeyPress={handleKeyPadPress} />
          <div className="atm-money-tray" />
        </div>
      </div>
    </div>
  );
}

export default Atm;
