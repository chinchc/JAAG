//@flow
"use strict";

import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createUndefSNFG = (symbolSize: number, _name: string): Object => {
    let shape: createjs.Shape = new createjs.Shape();

    shape.graphics.name = _name;
    shape.graphics.beginFill(getColor("white"));
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawPolyStar(0, 0, symbolSize, 5, 0, -90);

    return shape;
    /*
    switch(liaise.modeType) {
        case modeType.NODE: {
            let shape: createjs.Text = new createjs.Text(liaise.undefNodeSelect.name, symbolSize + "px serif", getColor("black"));
            let rect: createjs.Shape = new createjs.Shape();
            rect.graphics.beginStroke(getColor("white"));
            rect.graphics.setStrokeStyle(basicData.strokeSize);
            rect.graphics.beginFill(getColor("white"))
                .drawRect(0, 0, shape.getMeasuredWidth(), shape.getMeasuredHeight());
            //shape.cache(-symbolSize, -symbolSize, symbolSize, symbolSize);
            return {shape: shape, rect: rect, nodeName: liaise.undefNodeSelect.name};
        }
        case modeType.COMPOSITION: {
            let shape: createjs.Text = new createjs.Text(symbolName, symbolSize + "px serif", getColor("black"));
            let rect: createjs.Shape = new createjs.Shape();
            rect.graphics.beginStroke(getColor("white"));
            rect.graphics.setStrokeStyle(basicData.strokeSize);
            rect.graphics.beginFill(getColor("white"))
                .drawRect(0, 0, shape.getMeasuredWidth(), shape.getMeasuredHeight());
            //shape.cache(-symbolSize, -symbolSize, symbolSize, symbolSize);
            return {shape: shape, rect: rect, nodeName: symbolName};
        }
        default: {
            return {};
        }
    }
     */
};