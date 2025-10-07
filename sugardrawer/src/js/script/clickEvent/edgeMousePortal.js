//@flow
"use strict";

import {getColor} from "../data/getColor";
import {liaise} from "../index";
import {basicData} from "../data/graphicsData";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import {edgeClickEvent} from "./edgeClickEvent";

export const clickEdge = (e): void => {
    liaise.canvasEdge = e.currentTarget;
    return edgeClickEvent();
};

export const rollOverEdge = (e): void => {
    let target: GlycosidicLinkage = e.currentTarget.parent;
    e.currentTarget.children.map( (child) => {
        if (child.name !== "line") return;
        child.graphics
            .clear()
            .beginStroke(getColor("red"))
            .setStrokeStyle(4.0)
            .moveTo(target.sourceNode.x, target.sourceNode.y)
            .lineTo(target.targetNode.x, target.targetNode.y);
        liaise.stageUpdate();
    });
};

export const rollOutEdge = (e): void => {
    let target: GlycosidicLinkage = e.currentTarget.parent;
    e.currentTarget.children.map( (child) => {
        if (child.name !== "line") return;
        child.graphics
            .clear()
            .beginStroke(getColor("black"))
            .setStrokeStyle(basicData.edgeSize)
            .moveTo(target.sourceNode.x, target.sourceNode.y)
            .lineTo(target.targetNode.x, target.targetNode.y);
        liaise.stageUpdate();
    });
};

export const rollOverRoot = (e) => {
    e.currentTarget.children.map( (child) => {
        if (child.name !== "line") return;
        const x = child.graphics.command.x;
        const y = child.graphics.command.y;
        child.graphics
            .clear()
            .beginStroke(getColor("red"))
            .setStrokeStyle(4.0)
            .moveTo(x + 50, y)
            .lineTo(x, y);
        liaise.stageUpdate();
    });
};

export const rollOutRoot = (e) => {
    e.currentTarget.children.map( (child) => {
        if (child.name !== "line") return;
        const x = child.graphics.command.x;
        const y = child.graphics.command.y;
        child.graphics
            .clear()
            .beginStroke(getColor("black"))
            .setStrokeStyle(basicData.edgeSize)
            .moveTo(x + 50, y)
            .lineTo(x, y);
        liaise.stageUpdate();
    });
};