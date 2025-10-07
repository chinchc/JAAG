//@flow

"use strict";

import ReactDOM from "react-dom";
import {liaise} from "../index";
import React from "react";
import {basicData} from "../data/graphicsData";
import CurrentSelectMonosaccharideCursor from "../../react/CurrentSelectMonosaccharideCursor";
import CurrentSelectSubstituentCursor from "../../react/CurrentSelectSubstituentCursor";

export const clickContent = (e) => {

    assignMousePosition(e);

    ReactDOM.render(
        <CurrentSelectMonosaccharideCursor item={liaise.newNode} />,
        document.getElementById("current-monosaccharide")
    );

    document.addEventListener("mousemove", (e) => {
        let cursor = document.querySelector("#current-monosaccharide");
        cursor.style.transform = `translate(${e.x + basicData.symbolSize * .5}px, ${e.y - 45}px)`;
    });
};

export const clickContentModification = (e) => {

    assignMousePosition(e);

    ReactDOM.render(
        <CurrentSelectSubstituentCursor item={liaise.newSubstituent.label} />,
        document.getElementById("current-monosaccharide")
    );

    document.addEventListener("mousemove", (e) => {
        let cursor = document.querySelector("#current-monosaccharide");
        cursor.style.transform = `translate(${e.x + basicData.symbolSize * .5}px, ${e.y - 45}px)`;
    });
};

const assignMousePosition = (e) => {
    let cursor = document.querySelector("#current-monosaccharide");
    cursor.innerText = "";
    cursor.style.transform = `translate(${e.nativeEvent.x + basicData.symbolSize * .5}px, ${e.nativeEvent.y - 45}px)`;
    cursor.style.position = "absolute";
    cursor.style.zIndex = 1;
};
