//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createUnknown = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.UNKNOWN:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "Unknown";
            break;
        case nodeModeType.BAC:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "Bac";
            break;
        case nodeModeType.LDMANHEP:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "LDManHep";
            break;
        case nodeModeType.KDO:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "Kdo";
            break;
        case nodeModeType.DHA:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "Dha";
            break;
        case nodeModeType.DDMANHEP:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "DDManHep";
            break;
        case nodeModeType.MURNAC:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "MurNAc";
            break;
        case nodeModeType.MURNGC:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "MurNGc";
            break;
        case nodeModeType.MUR:
            shape.graphics.beginFill(getColor("brown"));
            shape.graphics.name = "Mur";
            break;
    }
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.moveTo(-1 * symbolSize, 0)
        .lineTo(-.6 * symbolSize, -1 * 11)
        .lineTo(.6 * symbolSize, -1 * 11)
        .lineTo(symbolSize, 0)
        .lineTo(.6 * symbolSize, 11)
        .lineTo(-.6 * symbolSize, 11)
        .closePath()
        .endFill();

    return shape;
};
