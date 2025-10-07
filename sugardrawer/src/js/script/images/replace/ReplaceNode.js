"use strict";

import {liaise} from "../../index";
import CreateMonosaccharide from "../../sugarsketcher/CreateMonosaccharide";
import CreateMonosaccharideContainer from "../../createSugar/CreateMonosaccharideContainer";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import {updateIsomer, updateRingType} from "../update/updateMonosaccharide";

export default class ReplaceNode {
    constructor() {}

    startReplace() {
        // for monosaccharide
        if (liaise.newNode !== undefined && liaise.canvasNode !== undefined) {
            this.replaceMonosaccharide();
        }

        // for substituent
        if (liaise.newSubstituent !== undefined && liaise.canvasSubstituent !== undefined) {
            this.replaceSubstituent();
        }
    }

    replaceMonosaccharide () {
        let currentGraph = liaise.canvasNode.parent.parent;

        const createMono = new CreateMonosaccharide();
        const createMonoComp = new CreateMonosaccharideContainer();
        let target = createMono.makeMonosaccharideObject(liaise.newNode);

        // if glycan is single monosaccharide
        currentGraph.graph.nodes().map( (node) => {
            if (node !== liaise.canvasNode.parent) return;
            node.monosaccharideType = target.monosaccharideType;
            node.children = [];
            node.addChild(createMonoComp.makeMonosaccharideConTainer(node.monosaccharideType.name));

            // update monoasccharide structural information
            updateIsomer(node);
            updateRingType(node);

            node.children[0].updateCache();
        });

        liaise.stageUpdate();
    }

    replaceSubstituent () {
        let currentGraph = liaise.canvasSubstituent.parent.parent;

        currentGraph.graph.edges().map( (edge) => {
            if (!(edge instanceof SubstituentLinkage)) return;
            if (edge.targetNode !== liaise.canvasSubstituent.parent) return;
            edge.targetNode.substituentType = liaise.newSubstituent;
            edge.targetNode.children.map( (child) => {
                child.text = `${edge.donorPosition.value === "undefined" ? "?" : edge.donorPosition.value}${liaise.newSubstituent.label}`;
            });
        });

        liaise.stageUpdate();
    }
}