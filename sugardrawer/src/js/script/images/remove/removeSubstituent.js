//@flow
"use strict";

import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import {startUpdate} from "../update/updateCanvas";
import {liaise} from "../../index";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

const visFunc = new visFunction();

export let removeSubstituent = (_selectedSub: Substituent): void => {
    let currentGlycan: Glycan = _selectedSub.parent;

    liaise.actionUndoRedo.setNode();
    liaise.removeStage(_selectedSub);

    currentGlycan.graph.edges().map( (edge) => {
        if (!(edge instanceof SubstituentLinkage)) return;
        if (edge.targetNode === _selectedSub) {
            currentGlycan.removeChild(edge.targetNode);
            currentGlycan.removeSubstituentLinkage(edge);
            currentGlycan.removeSubstituent(_selectedSub);
        }
    });

    let shapes: Object = liaise.getNewShapes(currentGlycan);
    let treeData: Object = liaise.getNewTreeData(currentGlycan);

    //recalculate monosaccharide positions
    shapes = visFunc.generateShapes(currentGlycan, shapes, treeData)[0];

    const emFunc = new emFunction();
    treeData = emFunc.generateTree(currentGlycan);

    // update position
    currentGlycan = startUpdate(currentGlycan);

    liaise.newGraph = currentGlycan;
    liaise.setNewShapes(currentGlycan, shapes);
    liaise.setNewTreeData(currentGlycan, treeData);

    liaise.stageUpdate();
    liaise.canvasSubstituent = undefined;

    document.getElementById("menu").style.display = "none";
};