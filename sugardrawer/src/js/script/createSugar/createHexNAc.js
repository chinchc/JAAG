//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createHexNAc = (nameSymbol: Symbol): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.HEXNAC:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "HexNAc";
            break;
        case nodeModeType.GLCNAC:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "GlcNAc";
            break;
        case nodeModeType.MANNAC:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "ManNAc";
            break;
        case nodeModeType.GALNAC:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "GalNAc";
            break;
        case nodeModeType.GULNAC:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "GulNAc";
            break;
        case nodeModeType.ALTNAC:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "AltNAc";
            break;
        case nodeModeType.ALLNAC:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "AllNAc";
            break;
        case nodeModeType.TALNAC:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "TalNAc";
            break;
        case nodeModeType.IDONAC:
            shape.graphics.beginFill(getColor("brown"));
            shape.graphics.name = "IdoNAc";
            break;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawRect(-14, -14, 2*14, 2*14);

    return shape;
};
