//@flow
"use strict";

import { liaise } from "../index";
import { modeType } from "../../react/modeType";
import CreateLinkage from "../createBind/CreateLinkage";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import {startUpdate,} from "../images/update/updateCanvas";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import {isThisLinkageBoneded} from "../createBind/checkUsablePosition";
import ReactDOM from "react-dom";
import React from "react";
import LeftClickEdgeMenu from "../../react/commonUI/LeftClickEdgeMenu";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {SNFGSymbolGlycan} from "../data/SNFGGlycanTable";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export function edgeClickEvent() {
    console.log("progress: edgeClickEvent");
    document.getElementById("menu").style.display = "none";

    switch(liaise.modeType) {
        case modeType.EDGE: {
            if (liaise.newEdge === undefined) {
                alert("Please select any linkage position at \"Add Linkage\".");
                liaise.initSelectedParams();
                break;
            }

            if (liaise.newEdge.id === "edge") {
                if (!(liaise.canvasEdge instanceof GlycosidicLinkage)) {
                    if (liaise.canvasEdge.parent.parent.id === "Glycan") {
                        alert("This position can not be assign for the root edge.");
                        liaise.initSelectedParams();
                        break;
                    }
                }
            }

            if (liaise.newEdge.id === "root") {
                if (liaise.canvasEdge instanceof GlycosidicLinkage) {
                    alert("This position can be only assign for the root edge.");
                    liaise.initSelectedParams();
                    break;
                }
                if (liaise.canvasEdge.parent.parent.id !== "Glycan") {
                    alert("This position can not be assign for the fragment root.");
                    liaise.initSelectedParams();
                    break;
                }
            }

            if (liaise.newEdge.id === "edge") {
                if (liaise.canvasEdge instanceof GlycosidicLinkage) {
                    // update glycosidic linkage position
                    let currentGraph: Glycan = liaise.canvasEdge.parent;
                    let shapes: Object = liaise.getNewShapes(currentGraph);
                    let treeData: Object = liaise.getNewTreeData(currentGraph);

                    let edge: GlycosidicLinkage = liaise.canvasEdge;
                    let linkParams: Object = liaise.newEdge;
                    let donorPos: DonorPosition = linkParams.donorPosition[0];
                    let acceptorPos: AcceptorPosition = linkParams.acceptorPosition;
                    edge.targetNode.anomericity = linkParams.anomericity;

                    if (isThisLinkageBoneded(edge, donorPos)) return;

                    edge.donorPosition = donorPos; //acceptor side
                    edge.acceptorPosition = acceptorPos; //anomeric position

                    // Recalculate monosaccharide positions
                    let visFunc = new visFunction();
                    rootPos.posX = shapes.root[0];
                    rootPos.posY = shapes.root[1];
                    shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];
                    liaise.setNewShapes(currentGraph, shapes);

                    // Represent linkage position in selected edge
                    let creLin = new CreateLinkage();
                    creLin.updateLinkage(edge, shapes);

                    liaise.newGraph = startUpdate(currentGraph);
                } else {
                    // update glycosidic linkage position at fragment root
                    let currentGraph: Glycan = liaise.canvasEdge.parent.parent;

                    // update anomericity
                    currentGraph.getRootNode().anomericity = liaise.newEdge.anomericity;

                    // update core side linkage
                    currentGraph.parentEdge.acceptorPosition = liaise.newEdge.acceptorPosition;
                    currentGraph.parentEdge.donorPosition = liaise.newEdge.donorPosition[0];
                    
                    // Represent linkage position in selected edge
                    let creLin = new CreateLinkage();
                    liaise.canvasEdge = creLin.updateFragmentRootLinkage();
                
                    liaise.newGraph = startUpdate(currentGraph);
                }
            } else { 
                // update core side root position
                const linkParams: Object = liaise.newEdge;
                let acceptorPos: AcceptorPosition = linkParams.acceptorPosition;
                let rootNode: Monosaccharide = liaise.canvasEdge.parent.parent.getRootNode();
                let rootPos: Object = extractLinkageNotation(liaise.canvasEdge.parent.children, "label");
                let pos: string = rootPos.text;

                if (acceptorPos.value !==
                    SNFGSymbolGlycan[rootNode.monosaccharideType.name].anomericPosition) {
                    alert("The anomeric position of this monosaccharide should be " +
                        SNFGSymbolGlycan[rootNode.monosaccharideType.name].anomericPosition +
                        ": Your select " + acceptorPos.value);
                    liaise.initSelectedParams();
                    break;
                }

                if (linkParams.anomericity === Anomericity.ALPHA) {
                    rootPos.text = pos.replace(pos[0], "α");
                } else {
                    rootPos.text = pos.replace(pos[0], "β");
                }

                //TODO : modified coreside linkage position in fragmetns root
                rootNode.anomericity = linkParams.anomericity;
            }

            liaise.stageUpdate();

            liaise.canvasEdge = undefined;
            liaise.newEdge = undefined;
            return;
        }
        default: {
            if (liaise.interfaceType === "simple") return;

            let menu = document.getElementById("menu");
            menu.style.display = "block";
            menu.style.position = "absolute";
            /*
            menu.style.pointerEvents = "auto";

            menu.onmousedown = (e) => {
                document.addEventListener("mousemove", drag);
            };

            menu.ondragstart = (e) => {
                return false;
            };

            menu.onmouseup = (e) => {
                document.removeEventListener("mousemove", drag);
            };
             */

            ReactDOM.render(
                <LeftClickEdgeMenu/>,
                menu
            );
            return;
        }
    }
}

const extractLinkageNotation = (_contents: Array<Object>, _name: string): Object => {
    let ret: Object = undefined;

    _contents.map ( (content) => {
        if (content.name === _name) ret = content;
    });

    return ret;
};

/*
const drag = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let width = document.getElementById("menu").offsetWidth;
    let height = document.getElementById("menu").offsetHeight;
    document.getElementById("menu").style.left = (x-width/2) + "px";
    document.getElementById("menu").style.top = (y-height/2) + "px";
};
 */
