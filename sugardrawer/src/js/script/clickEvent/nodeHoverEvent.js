//@flow

"use strict";

import React from "react";
import createjs from "createjs-easeljs";
import {liaise} from "../index";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {getColor} from "../data/getColor";

export const rollOver = (_event: Object) => {
    let target = _event.target;

    // change symbol color on mouse
    target.filters = [
        new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0, 0)
    ];

    // change symbol color on core
    rollOverCore(target);

    target.updateCache();
    liaise.stageUpdate();
};

export const rollOut = (_event: Object) => {
    let target = _event.target;

    //
    target.filters = [
        new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
    ];

    // change symbol color on core
    rollOutCore(target);

    target.updateCache();
    liaise.stageUpdate();
};

const rollOverCore = (_target: Object) => {
    let graph: Glycan = _target.parent.parent;

    if (graph.id === "Glycan") return;
    if (graph.parentNodeIDs === undefined) return;
    if (graph.getRootNode().id !== _target.parent.id) return;

    graph.parentNodeIDs.map( (coreID) => {
        let core = liaise.coreGraph.getNodeById(coreID);
        if (core === undefined) return;
        // core children[0] -> createjs component
        core.children[0].filters = [
            new createjs.ColorFilter(0, 0, 0, 1, 100, 100, 250, 0.5)
        ];
        core.children[0].updateCache();
    });
};

const rollOutCore = (_target: Object) => {
    let graph: Glycan = _target.parent.parent;

    if (graph.id === "Glycan") return;
    if (graph.parentNodeIDs === undefined) return;
    if (graph.getRootNode().id !== _target.parent.id) return;

    graph.parentNodeIDs.map( (coreID) => {
        let core = liaise.coreGraph.getNodeById(coreID);
        if (core === undefined) return;
        // core children[0] -> createjs component
        core.children[0].filters = [
            new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
        ];
        core.children[0].updateCache();
    });
};

export const rollOverSubstituent = (e) => {
    let target = e.currentTarget;

    let textContent = target.children[1];
    textContent.color = getColor("red");
    textContent.font = "bold 14px serif";

    const topEnd = 0 - textContent.getMeasuredLineHeight() * .5;
    const rightEnd = 0 - textContent.getMeasuredWidth() * .5;
    target.children[0]
        .graphics
        .clear()
        .beginFill(getColor("white"))
        .drawRect(rightEnd, topEnd, textContent.getMeasuredWidth(), textContent.getMeasuredLineHeight());
    liaise.stageUpdate();

};

export const rollOutSubstituent = (e) => {
    let target = e.currentTarget;

    let textContent = target.children[1];
    textContent.color = getColor("black");
    textContent.font = "10px serif";

    const topEnd = 0 - textContent.getMeasuredLineHeight() * .5;
    const rightEnd = 0 - textContent.getMeasuredWidth() * .5;
    target.children[0]
        .graphics
        .clear()
        .beginFill(getColor("white"))
        .drawRect(rightEnd, topEnd, textContent.getMeasuredWidth(), textContent.getMeasuredLineHeight());
    liaise.stageUpdate();
};