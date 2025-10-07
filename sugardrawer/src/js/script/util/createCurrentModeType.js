//@flow

"use strict";

import {modeType} from "../../react/modeType";
import ReactDOM from "react-dom";
import React from "react";
import {liaise} from "../index";
import {Button} from "semantic-ui-react";

export const createCurrentModeType = (_modeType: Symbol): void => {
    switch (_modeType) {
        case modeType.NODE: {
            ReactDOM.render(
                <div>{"Add Monosaccharide"}</div>,
                document.getElementById("mode")
            );

            break;
        }
        case modeType.EDGE: {
            ReactDOM.render(
                <div>{"Add Edge"}</div>,
                document.getElementById("mode")
            );

            break;
        }
        case modeType.FRAGMENT: {
            ReactDOM.render(
                <div>{"Add Fragment"}</div>,
                document.getElementById("mode")
            );

            break;
        }
        case modeType.MODIFICATION: {
            ReactDOM.render(
                <div>{"Add Substituent"}</div>,
                document.getElementById("mode")
            );

            break;
        }
        case modeType.REPEAT: {
            ReactDOM.render(
                <div>{"Add Repeat"}</div>,
                document.getElementById("mode")
            );

            break;
        }
        case modeType.NOT_SELECTED: {
            ReactDOM.render(
                <div/>,
                document.getElementById("mode")
            );

            // remove cancel button
            removeCancelButton();
            break;
        }
    }
};

export const removeCancelButton = (): void => {
    let modeCancel: HTMLElement = document.getElementById("modecancel");
    if (modeCancel === null) return;
    if (modeCancel.children.length === 0) return;

    modeCancel.removeChild(modeCancel.firstElementChild);
};