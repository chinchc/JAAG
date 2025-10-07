//@flow
"use strict";

import { modeType } from "../../react/modeType";
import { liaise } from "../index";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import CreateMonosaccharide from "../sugarsketcher/CreateMonosaccharide";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import { makeAttachPoint } from "../createBind/createRootSymbol";
import {onMouseDown} from "./canvasDragAndDropEvent";

export function canvasClickEvent() {
    console.log("Select canvas");
    switch(liaise.modeType) {
        case modeType.NODE: {
            let vf: Object = new visFunction();
            let node: Object = {};
            let shapes: Object = {};
            let treeData: Object = {};

            rootPos.posX = liaise.stage.mouseX;
            rootPos.posY = liaise.stage.mouseY;
            shapes.root = [rootPos.posX, rootPos.posY];

            const createMono = new CreateMonosaccharide();
            let mono: Monosaccharide = createMono.makeMonosaccharideImageComponent(liaise.newNode);

            let newGlycan = new Glycan("Glycan", mono);
            node["node"] = mono;

            let shape = vf.calculateXandYNode(node, newGlycan, shapes);

            shapes[mono.id] = shape;
            rootDonorPosition = "?";
            rootAcceptorPosition = "?";
            treeData = vf.updateTreeVisualization(undefined, newGlycan, treeData); // Update visualization in the svg

            mono.x = shape[0];
            mono.y = shape[1];

            newGlycan.addChild(makeAttachPoint(mono));
            newGlycan.addChild(mono);

            liaise.newGraph = newGlycan;
            liaise.addStage(newGlycan);
            liaise.setNewShapes(newGlycan, shapes);
            liaise.setNewTreeData(newGlycan, treeData);

            liaise.stageUpdate();
            liaise.newNode = undefined;
            liaise.canvasNode = undefined;

            liaise.stage.canvas.removeEventListener("mousedown", onMouseDown, false);
            liaise.stage.canvas.removeEventListener("click", canvasClickEvent, false);
            return;
        }

        case modeType.FRAGMENT: {
            if (liaise.newGraph.length === 0) {
                /*
                alert("Glycan fragments require a core glycan. First of all, please design some kind of glycan image on the canvas.\n" +
                    "Suggested utility:\n\n" +
                    "\"Load Structure\"\n" +
                    "\"Add Monosaccharide\"\n" +
                    "\"Import String\"");

                 */
                alert("Please draw any glycan.\n" +
                "Hint: \"Load Structure\", \"Add Monosaccharide\", \"Import String\"");
                liaise.initSelectedParams();
                liaise.sideBarCancel();
            }
            return;
        }
        default: {
            liaise.modeType = modeType.NOT_SELECTED;
            return;
        }
    }
}