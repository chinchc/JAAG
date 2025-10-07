//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createPentose = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.PEN:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "Pen";
            break;
        case nodeModeType.ARA:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Ara";
            break;
        case nodeModeType.LYX:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "Lyx";
            break;
        case nodeModeType.XYL:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "Xyl";
            break;
        case nodeModeType.RIB:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "Rib";
            break;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawPolyStar(0, 0, symbolSize, 5, 0.6, -90);

    return shape;

};