//@flow
"use strict";

import { RepeatBracket } from "../class/RepeatBracket";
import createjs from "createjs-easeljs";
import { getColor } from "../data/getColor";
import { basicData } from "../data/graphicsData";

export let createRepeatShape = (repeatNumber: string, target: RepeatBracket) => {
    switch (target.children.length) {
        case 3: {
            target.children[2].text = repeatNumber;
            target.setReepatNumber(repeatNumber);
            return;
        }
        default: {
            let targetBracket: createjs.Shape;
            if (target.children[0].graphics.command.x > target.children[1].graphics.command.x) {
                targetBracket = target.children[0];
            }
            else {
                targetBracket = target.children[1];
            }
            let shape = new createjs.Text(repeatNumber, basicData.repeatNumberSize + "px serif", getColor("black"));
            shape.x = targetBracket.graphics._activeInstructions[2].x + basicData.repeatNumberX;
            shape.y = targetBracket.graphics._activeInstructions[2].y + basicData.repeatNumberY;
            target.addChild(shape);
            target.setReepatNumber(repeatNumber);
            return;
        }
    }
};