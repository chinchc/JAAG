//@flow
"use strict";

import {liaise} from "../index";
import isEmpty from "lodash.isempty";
import toNumber from "lodash.tonumber";
import {startUpdate} from "../images/update/updateCanvas";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export const wheelPortal = (e): void => {
    if (isEmpty(liaise.stage.children)) return;
    if (e.deltaY > 0) {
        zoomOut();
    }
    if (e.deltaY < 0) {
        zoomIn();
    }
    //liaise.stageUpdate();
};

const zoomIn = (): void => {
    return changeScale(liaise.stage.children[0].scaleX + .01);
};

const zoomOut = (): void => {
    return changeScale(liaise.stage.children[0].scaleX - .01);
};

const changeScale = (_scale) => {
    const scale: number = toNumber(_scale);
    let coreGraph: Glycan = liaise.coreGraph;
    let shapes: Object = liaise.getNewShapes(coreGraph);
    let treeData: Object = liaise.getNewTreeData(coreGraph);

    liaise.stage.children.forEach( (child) => {
        child.scaleX = child.scaleY = scale;
    });

    // assign a center position to root residue according to scale
    rootPos.posX = (liaise.stage.canvas.width - scale * coreGraph.getBounds().width) / 2;
    rootPos.posY = (liaise.stage.canvas.height - scale * coreGraph.getBounds().height) / 2;

    coreGraph.getRootNode().x = rootPos.posX;
    coreGraph.getRootNode().y = rootPos.posY;

    let visFunc = new visFunction();
    shapes = visFunc.generateShapes(coreGraph, shapes, treeData)[0];
    liaise.setNewShapes(coreGraph, shapes);

    // modify core position
    startUpdate(coreGraph);

    liaise.stageUpdate();
};