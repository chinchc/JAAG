//@flow
"use strict";

import { liaise } from "../../index";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import {startUpdate} from "../update/updateCanvas";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {removeGlycan} from "./removeGlycan";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import {removeFragmentIDsInFragment, removeGlycanFragmentIDs} from "./removeFragment";
import React from "react";

const visFunc = new visFunction();
const emFunc = new emFunction();

export const removeMonosaccharide = (_selectedNode: Monosaccharide) => {

    //TODO: leaf側の単糖か判別する falseならエラーを返す
    //TODO: 中間ノードを削除した時に、新しく繋げ直す必要がある

    let currentGraph: Glycan = _selectedNode.parent;

    // check core monosaccharide
    if (_selectedNode === currentGraph.getRootNode()) {
        removeGlycan(currentGraph);
    } else {
        if (!checkMonosaccharideInLeaf(_selectedNode)) {
            alert("This monosaccharide is not remove.\n" +
                "Please select the monosaccharide on the leaf monosaccharide (left-end).\n" +
                "If you select the root monosaccharide (right-end), glycans on the canvas will be deleted.");
            return;
        }

        // modify fragmentIDs
        if (currentGraph.id === "Glycan") {
            // remove parentNodeIDs from core graph
            removeGlycanFragmentIDs(_selectedNode);
            // remove parentNodeIDs from sub graph
            removeFragmentIDsInFragment(_selectedNode);
        }

        // remove monosaccharide from glycan graph
        extractEdges(_selectedNode, currentGraph).map( (edge) => {
            if (edge instanceof GlycosidicLinkage) {
                //remove node from createJS.container
                currentGraph.removeChild(edge.targetNode);
                currentGraph.removeChild(edge);
                //remove node from Graph
                currentGraph.removeNodeById(edge.target);
            } else {
                //remove node from createJS.container
                currentGraph.removeChild(edge.targetNode);
                //remove node from Graph
                currentGraph.removeNodeById(edge.target);
            }
        });

        // re-calculate
        let shapes: Object = liaise.getNewShapes(currentGraph);
        let treeData: Object = liaise.getNewTreeData(currentGraph);

        // recalculate monosaccharide positions
        rootPos.posX = shapes.root[0];
        rootPos.posY = shapes.root[1];
        shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];
        treeData = emFunc.generateTree(currentGraph);

        // update position
        liaise.newGraph = startUpdate(currentGraph);
        liaise.setNewShapes(currentGraph, shapes);
        liaise.setNewTreeData(currentGraph, treeData);

        liaise.stageUpdate();
        liaise.canvasNode = undefined;
    }
};

const checkMonosaccharideInLeaf = (_node: Monosaccharide): boolean => {
    const currentGraph: Glycan = _node.parent;
    let ret: boolean = true;
    //for (let edge of glycan.graph.edges()) {
    for (let edge of currentGraph.graph.edges()) {
        if (edge instanceof GlycosidicLinkage) {
            if (edge.sourceNode === _node) {
                ret = false;
            }
        }
    }
    return ret;
};

const extractEdges = (_node: Monosaccharide, _glycan: Glycan): Array<Object> => {
    let ret: Array<Object> = [];

    _glycan.graph.edges().map( (edge) => {
        if (edge instanceof SubstituentLinkage && edge.source === _node.id) {
            ret.push(edge);
        }
        if (edge instanceof GlycosidicLinkage && edge.target === _node.id) {
            ret.push(edge);
        }
    });

    return ret;
};