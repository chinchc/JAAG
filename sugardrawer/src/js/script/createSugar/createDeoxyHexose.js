//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createDeoxyHexose = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);

    switch (nameSymbol) {
        case nodeModeType.DHEX:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "dHex";
            break;
        case nodeModeType.QUI:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "Qui";
            break;
        case nodeModeType.RHA:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Rha";
            break;
        case nodeModeType.D6GUL:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "SixdGul";
            break;
        case nodeModeType.D6ALT:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "SixdAlt";
            break;
        case nodeModeType.D6TAL:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "SixdTal";
            break;
        case nodeModeType.FUC:
            shape.graphics.beginFill(getColor("red"));
            shape.graphics.name = "Fuc";
            break;
    }

    shape.graphics
        .moveTo(0, -symbolSize * Math.sqrt(3) * .5)
        .lineTo(-symbolSize, symbolSize * Math.sqrt(3) * .5)
        .lineTo(symbolSize, symbolSize * Math.sqrt(3) * .5)
        .closePath()
        .endFill();

    return shape;
};