//@flow

"use stric";

import { nodeModeType } from "../../react/nodeModeType";
import { getColor } from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";

export let createDeoxynonulosonate = (nameSymbol: Symbol): createjs.Shape => {
    let shape: createjs.Shape = new createjs.Shape();

    switch (nameSymbol) {
        case nodeModeType.NON:
            shape.graphics.beginFill(getColor("white"));
            shape.graphics.name = "Nonu";
            break;
        case nodeModeType.KDN:
            shape.graphics.beginFill(getColor("green"));
            shape.graphics.name = "Kdn";
            break;
        case nodeModeType.NEU5AC:
            shape.graphics.beginFill(getColor("purple"));
            shape.graphics.name = "Neu5Ac";
            break;
        case nodeModeType.NEU5GC:
            shape.graphics.beginFill(getColor("light_blue"));
            shape.graphics.name = "Neu5Gc";
            break;
        case nodeModeType.NEU:
            shape.graphics.beginFill(getColor("brown"));
            shape.graphics.name = "Neu";
            break;
        case nodeModeType.SIA:
            shape.graphics.beginFill(getColor("red"));
            shape.graphics.name = "Sia";
            break;
    }

    shape.graphics.beginStroke(getColor("black"));
    shape.graphics.setStrokeStyle(basicData.strokeSize);
    shape.graphics.drawRect(-11, -11, 2*11, 2*11);
    shape.rotation = 45;

    return shape;
};