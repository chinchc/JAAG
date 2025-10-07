//@flow
"use strict";

import {liaise} from "../../index";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import createjs from "createjs-easeljs";

export const removeGlycanFragmentBracket = (_coreGlycan: Glycan): void => {
    if (_coreGlycan.id !== "Glycan") return;

    let fragmentIDs: createjs.Container = liaise.getLayer("fragmentIDs");
    fragmentIDs.children.map( (child, index) => {
        if (child.name !== "bracket") return;
        fragmentIDs.children.splice(index, 1);
    });

    liaise.newGraph = _coreGlycan;
};

export const removeGlycanFragmentIDs = (_currentNode: Node): void => {
    // remove fragmentIDs in core side glycan
    let fragmentIDs: createjs.Container = liaise.getLayer("fragmentIDs");
    if (fragmentIDs === undefined) return;

    fragmentIDs.children.map( (child) => {
        if (child.name !== _currentNode.id) return;
        fragmentIDs.removeChild(child);
    });
};

export const removeFragmentIDsInFragment = (_currentNode: Node): void => {
    liaise.subGraph.map( (graph) => {
        let ind: number = graph.parentNodeIDs.indexOf(_currentNode.id);
        if (ind === -1) return;
        graph.parentNodeIDs.splice(ind, 1);
    });
};