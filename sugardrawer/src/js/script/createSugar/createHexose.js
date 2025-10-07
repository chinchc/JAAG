//@flow
"use strict";

import { getColor } from "../data/getColor";
import { nodeModeType } from "../../react/nodeModeType";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createHexose = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol){
        case nodeModeType.HEX:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "Hex";
            break;
        case nodeModeType.GLC:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "Glc";
            break;
        case nodeModeType.MAN:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Man";
            break;
        case nodeModeType.GAL:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "Gal";
            break;
        case nodeModeType.GUL:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "Gul";
            break;
        case nodeModeType.ALT:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "Alt";
            break;
        case nodeModeType.ALL:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "All";
            break;
        case nodeModeType.TAL:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "Tal";
            break;
        case nodeModeType.IDO:
            shape.graphics.beginFill(getColor("brown"));
            shape.graphics.name = "Ido";
            break;
        default:
            return;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawCircle(0, 0, symbolSize);

    return shape;
};