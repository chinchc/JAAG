//@flow
"use strict";

import { getColor } from "../data/getColor";
import { basicData } from "../data/graphicsData";
import { Glycobond } from "../class/Glycobond";
import createjs from "createjs-easeljs";
import { Sugar } from "../class/Sugar";

export let drawCyclicEdge = (target1: Sugar, target2: Sugar): Glycobond => {
    let line: createjs.Shape = new createjs.Shape();
    line.graphics.beginStroke(getColor("black"));
    line.graphics.setStrokeStyle(basicData.edgeSize);
    line.graphics.moveTo(target1.xCoord, target1.getYCoord());

    if(target1.xCoord === target2.getXCoord()) {
        line.graphics.quadraticCurveTo((target1.xCoord + target2.xCoord) / 2 - basicData.cyclicEdge, (target1.getYCoord() + target2.getYCoord()) / 2, target2.xCoord, target2.getYCoord());
    }
    else if (target1.getXCoord() < target2.getXCoord()){
        if(target1.getYCoord() >= target2.getYCoord()) {
            line.graphics.quadraticCurveTo((target1.xCoord + target2.xCoord) / 2, (target1.getYCoord() + target2.getYCoord()) / 2 - basicData.cyclicEdge, target2.xCoord, target2.getYCoord());
        }
        else {
            line.graphics.quadraticCurveTo((target1.xCoord + target2.xCoord) / 2, (target1.getYCoord() + target2.getYCoord()) / 2 + basicData.cyclicEdge, target2.xCoord, target2.getYCoord());
        }
    }
    else {
        if(target1.getYCoord() > target2.getYCoord()) {
            line.graphics.quadraticCurveTo((target1.xCoord + target2.xCoord) / 2, (target1.getYCoord() + target2.getYCoord()) / 2 + basicData.cyclicEdge, target2.xCoord, target2.getYCoord());
        }
        else {
            line.graphics.quadraticCurveTo((target1.xCoord + target2.xCoord) / 2, (target1.getYCoord() + target2.getYCoord()) / 2 - basicData.cyclicEdge, target2.xCoord, target2.getYCoord());
        }
    }
    let edge: Glycobond = new Glycobond();
    edge.addChild(line);

    return edge;
};