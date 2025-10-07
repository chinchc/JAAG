//@flow
"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createAssigned = (nameSymbol: Symbol, symbolSize: number): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.ASSIGNED:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "Assigned";
            break;
        case nodeModeType.API:
            shape.graphics.beginFill(getColor("blue"));
            shape.graphics.name = "Api";
            break;
        case nodeModeType.FRU:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Fru";
            break;
        case nodeModeType.TAG:
            shape.graphics.beginFill(getColor("yellow"));
            shape.graphics.name = "Tag";
            break;
        case nodeModeType.SOR:
            shape.graphics.beginFill(getColor("orange"));
            shape.graphics.name = "Sor";
            break;
        case nodeModeType.PSI:
            shape.graphics.beginFill(getColor("pink"));
            shape.graphics.name = "Psi";
            break;
    }
    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawPolyStar(0, 0, symbolSize, 5, 0, -90);

    return shape;
};