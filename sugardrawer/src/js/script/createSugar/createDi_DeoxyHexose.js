//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createDi_DeoxyHexose = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.DDHEX:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "ddHex";
            break;
        case nodeModeType.OLI:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "Oli";
            break;
        case nodeModeType.TYV:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Tyv";
            break;
        case nodeModeType.ABE:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "Abe";
            break;
        case nodeModeType.PAR:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "Par";
            break;
        case nodeModeType.DIG:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "Dig";
            break;
        case nodeModeType.COL:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "Col";
            break;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawRect(-symbolSize, -9, symbolSize*2, 18);

    return shape;
};
