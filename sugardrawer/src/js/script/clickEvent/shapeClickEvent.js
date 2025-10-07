//@flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import createjs from "createjs-easeljs";
import {liaise} from "../index";
import {modeType} from "../../react/modeType";
import {searchHorizontalNodeIndex} from "../../react/horizonalUI/horizontalSugarList";
import MonosaccharideContent from "../../react/expertUI/MonosaccharideContent";
import ModeCancelButton from "../../react/horizonalUI/ModeCancelButton";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";
import {clickContent} from "./contentClickCursor";
import {getMonosaccharideTextNotation} from "../data/SymbolNotation";

export const shapeClickEvent = (e) => {
    let target: createjs.shape = e.target;
    liaise.newNode = target.graphics.name;

    if (target.option !== undefined) {
        liaise.modeType = modeType.NODE;
        liaise.sideBarCancel();
    }

    /*
    let elm: HTMLElement = document.querySelector("#selected");
    if (elm.children.length > 0) {
        elm.children[0].remove();
    }
     */

    // set current selection
    //currentSelectNode(target);

    // add to tool box
    addLastWord(target);

    // add cancel button
    //addCancelButton();

    // add current select monosaccharide at mouse cursor
    clickContent(e);
};

export const currentSelectNode = (_target: createjs.shape) => {
    return ReactDOM.render(
        <MonosaccharideContent item={_target.graphics.name} notation={getMonosaccharideTextNotation(_target.graphics.name)} />,
        document.getElementById("selected")
    );
};

export const addLastWord = (_target: createjs.shape): void => {
    let listID: string = document.querySelector("#nodelist").children[0].id;
    if (searchHorizontalNodeIndex(listID).indexOf(_target.graphics.name) === -1 &&
        isEmpty(filter(liaise.usedItems, {content: _target.graphics.name}))) {
        liaise.usedItems = {
            type: "monosaccharide",
            content: _target.graphics.name
        };
    }
};

export const addCancelButton = (): void => {
    const cancel = () => {
        liaise.initSelectedParams();
        document.getElementById("modecontent").lastChild.innerText = "";
        document.getElementById("modecancel").innerText = "";
    };

    let cancelButton: HTMLElement = document.getElementById("modecancel");
    if (cancelButton !== null) {
        if (cancelButton.children.length !== 0) return;
    }

    // append mode cancel button
    ReactDOM.render(
        <ModeCancelButton onCancel={() => cancel()}/>,
        document.getElementById("modecancel")
    );
};