//@flow
"use strict";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createDi_Deoxynonulosonate = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.DNON:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "dNon";
            break;
        case nodeModeType.PSE:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Pse";
            break;
        case nodeModeType.LEG:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "Leg";
            break;
        case nodeModeType.ACI:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "Aci";
            break;
        case nodeModeType.E4LEG:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "4eLeg";
            break;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.moveTo(0, -1 *  symbolSize * 2 *2 /3 / 2)
        .lineTo(-1 *  symbolSize * 2 *2 /3  / 2 * Math.sqrt(3), 0)
        .lineTo(0,  symbolSize * 2 *2 /3 / 2)
        .lineTo( symbolSize * 2 *2 /3 / 2 * Math.sqrt(3), 0)
        .closePath()
        .endFill();

    return shape;
};