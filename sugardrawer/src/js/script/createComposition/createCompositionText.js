//@flow
"use strict";

import createjs from "createjs-easeljs";
import { basicData } from "../data/graphicsData";
import { getColor } from "../data/getColor";
import { CompositionText } from "../class/CompositionText";

export let createCompositionText = (nop: number): CompositionText => {
    let text: createjs.Text = new createjs.Text(String(nop) + " ×",  basicData.compositionTextSize + "px serif", getColor("black"));
    // let text: createjs.Text = new createjs.Text(String(nop) + " ×",  "100px serif", getColor("black"));
    let compositionText: CompositionText = new CompositionText();
    compositionText.addChild(text);
    compositionText.setNop(nop);
    return compositionText;
};