//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createHexuronate = (nameSymbol: Symbol): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);

    switch (nameSymbol) {
        case nodeModeType.HEXA:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "HexA";
            break;
        case nodeModeType.GLCA:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "GlcA";
            break;
        case nodeModeType.MANA:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "ManA";
            break;
        case nodeModeType.GALA:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "GalA";
            break;
        case nodeModeType.GULA:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "GulA";
            break;
        case nodeModeType.ALTA:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "AltA";
            break;
        case nodeModeType.ALLA:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "AllA";
            break;
        case nodeModeType.TALA:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "TalA";
            break;
        case nodeModeType.IDOA:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "IdoA";
            break;
    }
    shape.graphics.moveTo(-11, -11)
        .lineTo(11, -11)
        .lineTo(11, 11)
        .closePath()
        .endFill();
    switch(nameSymbol) {
        case nodeModeType.IDOA:
            shape.graphics.beginFill(getColor("brown"));
            break;
        case nodeModeType.ALTA:
            shape.graphics.beginFill(getColor("pink"));
            break;
        default:
            shape.graphics.beginFill(getColor("white"));
            break;
    }

    shape.graphics.moveTo(-11, -11)
        .lineTo(-11, 11)
        .lineTo(11, 11)
        .closePath()
        .endFill();
    shape.rotation = 315;

    return shape;
};