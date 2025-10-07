//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createHexosamine = (nameSymbol: Symbol): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);

    switch (nameSymbol) {
        case nodeModeType.HEXN:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "HexN";
            break;
        case nodeModeType.GLCN:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "GlcN";
            break;
        case nodeModeType.MANN:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "ManN";
            break;
        case nodeModeType.GALN:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "GalN";
            break;
        case nodeModeType.GULN:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "GulN";
            break;
        case nodeModeType.ALTN:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "AltN";
            break;
        case nodeModeType.ALLN:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "AllN";
            break;
        case nodeModeType.TALN:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "TalN";
            break;
        case nodeModeType.IDON:
            shape.graphics.beginFill(getColor("brown"));
            shape.graphics.name = "IdoN";
            break;
    }

    shape.graphics.moveTo(-14, -14)
        .lineTo(14, -14)
        .lineTo(14, 14)
        .closePath()
        .endFill()
        .beginFill(getColor("white"))
        .moveTo(-14, -14)
        .lineTo(-14, 14)
        .lineTo(14, 14)
        .closePath()
        .endFill();

    return shape;
};