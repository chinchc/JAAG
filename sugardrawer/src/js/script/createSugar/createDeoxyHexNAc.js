//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createDeoxyHexNAc = (nameSymbol: Symbol, symbolSize: number): Object => {
    let shape: createjs.Shape = new createjs.Shape();
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);

    switch (nameSymbol) {
        case nodeModeType.DHEXNAC:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "dHexNAc";
            break;
        case nodeModeType.QUINAC:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "QuiNAc";
            break;
        case nodeModeType.RHANAC:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "RhaNAc";
            break;
        case nodeModeType.D6ALTNAC:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "SixdAltNAc";
            break;
        case nodeModeType.D6GULNAC:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "SixdGulNAc";
            break;
        case nodeModeType.D6TALNAC:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "SixdTalNAc";
            break;
        case nodeModeType.FUCNAC:
            shape.graphics.beginFill(getColor("red"));
            shape.graphics.name = "FucNAc";
            break;
    }

    shape.graphics.moveTo(2 * symbolSize / Math.sqrt(3), 0)  // (x, y) = ( a/√3, 0 )
        .lineTo(-2 * symbolSize / (2 * Math.sqrt(3)), 2 * symbolSize / 2)  // (x, y) = ( -a/(2 * √3), a/2 )
        .lineTo(-2 * symbolSize / (2 * Math.sqrt(3)), 0)
        .closePath()
        .endFill()
        .beginFill(getColor("white"))
        .moveTo(2 * symbolSize / Math.sqrt(3), 0)
        .lineTo(-2 * symbolSize / (2 * Math.sqrt(3)), -2 * symbolSize / 2)  // (x, y) = ( -a/(2 * √3), -a/2 )
        .lineTo(-2 * symbolSize / (2 * Math.sqrt(3)), 0)
        .closePath()
        .endFill();
    shape.rotation = 270;

    return shape;
};