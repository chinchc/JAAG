//@flow
"use strict";

import ReactDOM from "react-dom";
import RightClickSubstituentMenu from "../../react/commonUI/RightClickSubstituentMenu";
import React from "react";
import LeftClickSubstituentMenu from "../../react/commonUI/LeftClickSubstituentMenu";

export const substituentClickPortal = (e: Object): void => {
    if (e.nativeEvent.which === 3) {
        rightClick(e);
    } else {
        leftClick(e);
        //TODO: substituentを左クリックする際の処理
        //TODO: おそらく架橋修飾を設計する際に用いるか…？
    }
};

const rightClick = (e: Object): void => {
    document.getElementById("menu").style.display = "block";
    ReactDOM.render(
        <RightClickSubstituentMenu trigger={e.currentTarget}/>,
        document.getElementById("menu")
    );
};

const leftClick = (e: Object): void => {
    document.getElementById("menu").style.display = "block";
    ReactDOM.render(
        <LeftClickSubstituentMenu trigger={e.currentTarget}/>,
        document.getElementById("menu")
    );
};