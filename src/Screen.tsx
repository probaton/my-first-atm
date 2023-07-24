import React from "react";
import "./style/Screen.css";

import { getScreenTexts, ScreenState } from "./util/screenTexts";

interface Props {
  screenState: ScreenState;
}

function Screen({ screenState }: Props) {
  const screenTexts = getScreenTexts(screenState);

  const renderTitle = () => {
    const titleText = screenTexts[0] || "Failed to load screen text";
    return <div className="atm-screen-title">{titleText}</div>;
  };

  const renderButtonTextField = () => {
    if (screenTexts.length <= 1) return;

    return (
      <div className="atm-screen-button-container">
        {renderRightButtonTexts()}
        {renderLeftButtonTexts()}
      </div>
    );
  };

  const renderRightButtonTexts = () => {
    const buttonTexts = screenTexts.slice(1, 5);
    return <div className="atm-screen-buttons-right">{renderButtonTexts(buttonTexts)}</div>;
  };

  const renderLeftButtonTexts = () => {
    const buttonTexts = screenTexts.slice(5, 9);
    return <div className="atm-screen-buttons-left">{renderButtonTexts(buttonTexts)}</div>;
  };

  const renderButtonTexts = (texts: string[]) => {
    return texts.map((text, i) => <div key={i} className="atm-screen-button">{text}</div>);
  };

  return (
    <div className={screenTexts.length <= 1 ? "atm-screen-no-buttons" : "atm-screen-with-buttons"}>
      {renderTitle()}
      {renderButtonTextField()}
    </div>
  );
}

export default Screen;
