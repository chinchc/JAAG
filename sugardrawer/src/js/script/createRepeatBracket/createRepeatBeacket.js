//@flow
"use strict";

import createjs from "createjs-easeljs";
import { RepeatBracket } from "../class/RepeatBracket";
import { Sugar } from "../class/Sugar";
import { getColor } from "../data/getColor";
import { basicData } from "../data/graphicsData";

export let createRepeatBracket = (target1: Object, target2: Object) => {
    let rightNode: Sugar;
    let leftNode: Sugar;
    if(target1.xCoord > target2.xCoord) {
        rightNode = target1;
        leftNode = target2;
    }
    else {
        rightNode = target2;
        leftNode = target1;
    }

    let rightBracket: createjs.Shape = new createjs.Shape();
    let leftBracket: createjs.Shape = new createjs.Shape();
    let repeatBracket = new RepeatBracket();
    repeatBracket.setStartSugar(rightNode);
    repeatBracket.setEndSugar(leftNode);
    rightBracket.graphics.beginStroke(getColor("black"));
    rightBracket.graphics.setStrokeStyle(basicData.repeatStrokeSize);
    rightBracket.graphics.moveTo(rightNode.xCoord + basicData.symbolSize, rightNode.yCoord - basicData.symbolSize - basicData.repeatRange)
        .lineTo(rightNode.xCoord + basicData.symbolSize + basicData.repeatRange, rightNode.yCoord - basicData.symbolSize - basicData.repeatRange)
        .lineTo(rightNode.xCoord + basicData.symbolSize + basicData.repeatRange, rightNode.yCoord + basicData.symbolSize + basicData.repeatRange)
        .lineTo(rightNode.xCoord + basicData.symbolSize, rightNode.yCoord + basicData.symbolSize + basicData.repeatRange);
    leftBracket.graphics.beginStroke(getColor("black"));
    leftBracket.graphics.setStrokeStyle(basicData.repeatStrokeSize);
    leftBracket.graphics.moveTo(leftNode.xCoord - basicData.symbolSize, leftNode.yCoord - basicData.symbolSize - basicData.repeatRange)
        .lineTo(leftNode.xCoord - basicData.symbolSize - basicData.repeatRange, leftNode.yCoord - basicData.symbolSize - basicData.repeatRange)
        .lineTo(leftNode.xCoord - basicData.symbolSize - basicData.repeatRange, leftNode.yCoord + basicData.symbolSize + basicData.repeatRange)
        .lineTo(leftNode.xCoord - basicData.symbolSize, leftNode.yCoord + basicData.symbolSize + basicData.repeatRange);
    repeatBracket.addChild(rightBracket);
    repeatBracket.addChild(leftBracket);
    return repeatBracket;

};