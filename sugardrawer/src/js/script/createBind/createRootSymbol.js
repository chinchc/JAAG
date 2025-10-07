//@flow
"use strict";

import createjs from "createjs-easeljs";
import {getColor} from "../data/getColor";
import {basicData} from "../data/graphicsData";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {clickEdge, rollOutRoot, rollOverRoot} from "../clickEvent/edgeMousePortal";

export const makeAttachPoint = (_root: Monosaccharide): createjs.Container => {
    let rootSymbolContainer: createjs.Container = new createjs.Container();

    rootSymbolContainer.name = "root";
    rootSymbolContainer.addChild(drawRootSymbol(_root));
    rootSymbolContainer.addChild(drawRootLine(_root));
    rootSymbolContainer.addChild(drawRootLabel(_root));

    // event listener
    rootSymbolContainer.addEventListener("click", clickEdge, false);
    rootSymbolContainer.addEventListener("rollover", rollOverRoot, false);
    rootSymbolContainer.addEventListener("rollout", rollOutRoot, false);

    return rootSymbolContainer;
};


const drawRootSymbol = (_root: Monosaccharide): createjs.Shape => {
    let rootSymbol: createjs.Shape = new createjs.Shape();
    rootSymbol.name = "symbol";
    rootSymbol.graphics
        .setStrokeStyle(basicData.edgeSize)
        .beginStroke(getColor("black"))
        .moveTo(_root.x + 50, _root.y - 20)
        .bezierCurveTo(_root.x + 45, _root.y - 10, _root.x + 45, _root.y - 10, _root.x + 50, _root.y)
        .bezierCurveTo(_root.x + 55, _root.y + 10, _root.x + 55, _root.y + 10, _root.x + 50, _root.y + 20);

    return rootSymbol;
};

export const makeFragmentAttachPoint = (_root: Monosaccharide): createjs.Container => {
    let rootSymbolContainer: createjs.Container = new createjs.Container();

    rootSymbolContainer.name = "root";
    rootSymbolContainer.addChild(drawRootLine(_root));
    rootSymbolContainer.addChild(drawRootLabel(_root));

    // event listener
    rootSymbolContainer.addEventListener("click", clickEdge, false);
    rootSymbolContainer.addEventListener("rollover", rollOverRoot, false);
    rootSymbolContainer.addEventListener("rollout", rollOutRoot, false);

    return rootSymbolContainer;
};

const drawRootLine = (_root: Monosaccharide): createjs.Shape => {
    let line: createjs.Shape = new createjs.Shape();
    line.name = "line";
    line.graphics
        .beginStroke(getColor("black"))
        .setStrokeStyle(basicData.edgeSize)
        .moveTo(_root.x + 50, _root.y)
        .lineTo(_root.x, _root.y);

    return line;
};

const drawRootLabel = (_root: Monosaccharide): createjs.Text => {
    let edgeInfo: string = "";
    edgeInfo += getAnomeriState(_root);
    edgeInfo += " ?";

    let state: createjs.Text =
        new createjs.Text(edgeInfo, basicData.linkageSize + "px serif", getColor("black"));
    //state.x = pos[0];
    //state.y = pos[1] + 3;
    state.name = "label";
    state.textAlign = "center";
    state.textBaseline = "middle";

    // make text area
    let textArea = new createjs.Shape();
    textArea.name = "textbox";
    textArea.graphics.beginFill(getColor("white"));
    const baseLine = {
        topEnd: 0 - state.getMeasuredLineHeight() + 5,
        leftEnd: 0 - state.getMeasuredWidth() * .5
    };
    textArea.graphics.drawRect(baseLine.leftEnd, baseLine.topEnd, state.getMeasuredWidth(), state.getMeasuredLineHeight());

    // make edge container
    let pos: Array<number> = calcRootLabel(_root);
    let rootLabelComponent = new createjs.Container();
    rootLabelComponent.name = "root-notation";
    rootLabelComponent.x = pos[0];
    rootLabelComponent.y = pos[1] + 9;
    rootLabelComponent.addChild(textArea);
    rootLabelComponent.addChild(state);

    return rootLabelComponent;
};

export const calcRootLabel = (_root: Monosaccharide): Array<number> => {
    let usualX:number = (_root.x + _root.x + 50) * .5;
    let usualY:number = _root.y;

    return [usualX + 5, usualY];
};

const getAnomeriState = (_node: Monosaccharide) => {
    const anomericity = _node.anomericity;
    if (anomericity === Anomericity.ALPHA) return "α";
    if (anomericity === Anomericity.BETA) return "β";
    return "?";
};

