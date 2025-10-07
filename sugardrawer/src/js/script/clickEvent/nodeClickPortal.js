//@flow
"use strict";

import {liaise} from "../index";
import ReactDOM from "react-dom";
import RightClickMenu from "../../react/commonUI/RightClickMenu";
import {nodeClickEvents} from "./nodeClickEvents";
import React from "react";
import {
    startUpdate,
    updateGlycoSidicLinkage,
    updateRootSymbol,
    updateSubstituentLinkage
} from "../images/update/updateCanvas";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import {onMouseDown} from "./canvasDragAndDropEvent";

export const nodeClickPortal = (e): void => {
    liaise.canvasNode = e.currentTarget;
    document.getElementById("menu").style.display = "none";

    liaise.stage.canvas.removeEventListener("mousedown", onMouseDown, false);

    if (e.nativeEvent.which === 3) {
        rightClick(e);
    } else {
        if (liaise.newNode !== undefined || liaise.newSubstituent !== undefined) {
            nodeClickEvents();
        } else {
            dragAndDrop(e);
        }
    }

    liaise.stage.canvas.addEventListener("mousedown", onMouseDown, false);
};

const rightClick = (e): void => {
    let monoObj = e.currentTarget.parent;
    document.getElementById("menu").style.display = "block";
    ReactDOM.render(
        <RightClickMenu trigger={monoObj}/>,
        document.getElementById("menu")
    );
};

const dragAndDrop = (e): void => {

    const drag = function(e) {
        const currentGraph = liaise.canvasNode.parent.parent;
        e.currentTarget.parent.x = e.stageX / Math.abs(currentGraph.scaleX);
        e.currentTarget.parent.y = e.stageY / Math.abs(currentGraph.scaleX);

        currentGraph.graph.edges().map( (edge) => {
            if (edge instanceof SubstituentLinkage) {
                updateSubstituentLinkage(edge, currentGraph);
            } else {
                updateGlycoSidicLinkage(edge, currentGraph);
            }
        });

        if (e.currentTarget.parent === e.currentTarget.parent.parent.getRootNode()) {
            updateRootSymbol(e.currentTarget.parent);
        }

        liaise.stageUpdate();
    };

    const release = function(e) {
        const currentGraph = liaise.canvasNode.parent.parent;
        let shapes: Object = liaise.getNewShapes(currentGraph);
        let treeData: Object = liaise.getNewTreeData(currentGraph);

        e.currentTarget.removeEventListener("pressmove", drag);
        e.currentTarget.removeEventListener("pressup", release);

        if (e.currentTarget.parent === e.currentTarget.parent.parent.getRootNode()) {
            rootPos.posX = e.stageX / Math.abs(currentGraph.scaleX);
            rootPos.posY = e.stageY / Math.abs(currentGraph.scaleX);

            e.currentTarget.parent.x = e.stageX / Math.abs(currentGraph.scaleX);
            e.currentTarget.parent.y = e.stageY / Math.abs(currentGraph.scaleX);

            let visFunc = new visFunction();
            shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];
            liaise.setNewShapes(currentGraph, shapes);
        }

        // modify core position
        startUpdate(currentGraph);

        liaise.stageUpdate();
        liaise.actionUndoRedo.setNode();
    };

    e.currentTarget.addEventListener("pressmove", drag);
    e.currentTarget.addEventListener("pressup", release);
};