//@flow
"use strict";

import {modeType} from "../../react/modeType";
import { liaise } from "../index";
import CreateModification from "../sugarsketcher/CreateModification";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import CreateLinkage from "../createBind/CreateLinkage";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import appFunction from "sugar-sketcher/src/js/guifunction/appFunction";
import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import CreateMonosaccharide from "../sugarsketcher/CreateMonosaccharide";
import {startUpdate, upDateRootOfFragment} from "../images/update/updateCanvas";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import {SNFGSymbolGlycan} from "../data/SNFGGlycanTable";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import CreateFragmentBracket from "../createFragment/CreateFragmentBracket";

const vf: Object = new visFunction();
const ef: Object = new emFunction();

export function nodeClickEvents(): void {
    console.log("Select node");
    switch (liaise.modeType) {
        case modeType.NODE: {
            const af: Object = new appFunction();
            const createMono:Object = new CreateMonosaccharide();

            let currentGraph: Glycan = liaise.canvasNode.parent.parent;
            let shapes: Object = liaise.getNewShapes(currentGraph);
            let treeData: Object = liaise.getNewTreeData(currentGraph);

            //Check number of node for donor side.
            if (checkNumberOfChildren(liaise.canvasNode.parent) === (ef.getNumberCarbons(liaise.canvasNode.parent) - 1)) {
                alert("This monosaccharide can not have any more children.");
                liaise.canvasNode = undefined;
                break;
            }

            liaise.actionUndoRedo.setNode();

            let node: Object = {};
            let donor: Monosaccharide = createMono.makeMonosaccharideImageComponent(liaise.newNode);
            let acceptor = liaise.canvasNode.parent;
            let generatedEdgeId: string = af.randomString(7);
            let acceptorPos: AcceptorPosition = AcceptorPosition.prototype.getAcceptorPosition(SNFGSymbolGlycan[donor.monosaccharideType.name].anomericPosition);
            let glycosidicLink: GlycosidicLinkage = new GlycosidicLinkage(generatedEdgeId, acceptor, donor, acceptorPos, undefined);

            //
            currentGraph.addMonosaccharide(donor, glycosidicLink);
            treeData = vf.updateTreeVisualization(glycosidicLink, currentGraph, treeData);
            node["node"] = donor;
            node["parent"] = acceptor;

            let shape: Object = vf.calculateXandYNode(node, currentGraph, shapes);
            donor.x = shape[0];
            donor.y = shape[1];
            shapes[donor.id] = shape;

            //Define linkage symbol
            let creLink = new CreateLinkage();
            glycosidicLink.addChild(creLink.makeEdgeContainer(glycosidicLink, shapes));
            //glycosidicLink = creLink.makeEdgeContainer(glycosidicLink, shapes);

            currentGraph.removeNodeById(donor.id);
            currentGraph.addMonosaccharide(donor, glycosidicLink);

            //Check monosaccharide position
            currentGraph = startUpdate(currentGraph);

            currentGraph.removeChild(acceptor);
            currentGraph.addChild(glycosidicLink);
            currentGraph.addChild(donor);
            currentGraph.addChild(acceptor);

            liaise.newGraph = currentGraph;
            liaise.setNewShapes(currentGraph, shapes);
            liaise.setNewTreeData(currentGraph, treeData);

            liaise.stageUpdate();
            liaise.canvasNode = undefined;
            liaise.newNode = undefined;

            break;
        }
        case modeType.MODIFICATION: {
            console.log("add modification");

            let glycan: Glycan = liaise.canvasNode.parent.parent;

            //Check number of node for donor side.
            if (liaise.newSubstituent === undefined) {
                alert("Please select any substituent from \"Add Substituent\".");
                liaise.initSelectedParams();
                break;
            }
            if (checkNumberOfChildren(liaise.canvasNode.parent) === (ef.getNumberCarbons(liaise.canvasNode.parent) - 1)) {
                alert("This monosaccharide can not have any more children.");
                liaise.initSelectedParams();
                break;
            }

            liaise.actionUndoRedo.setNode();

            // add "Substituent" to "Glycan" and represent selected modification.
            let createMod = new CreateModification();
            liaise.newGraph = createMod.start(liaise.newSubstituent, glycan);
            liaise.stageUpdate();
            liaise.canvasNode = undefined;
            liaise.newSubstituent = undefined;

            return;
        }
        case modeType.REPEAT: {
            //TODO: SugarSketcherの処理を活用する
            //TODO: 複数の単糖を選択する処理を実装する、あるいは繰り返し構造を設計する専用のインターフェイスのデザインを考える
            if (liaise.canvasNode !== undefined) {
                //let repeatBracket: RepeatBracket = createRepeatBracket(liaise.selectedNode, event.currentTarget);
                //repeatBracket.addEventListener("click", repeatClickEvent, false);
                //repeatBracket.startSugar.setRepeatBracket(repeatBracket);
                //liaise.addStage(repeatBracket);
                //liaise.stageUpdate();
                //liaise.removeSelectedNode();
            }
            //liaise.stageUpdate();
            liaise.canvasNode = undefined;

            return;
        }
        case modeType.FRAGMENT: {
            if (liaise.newNode === undefined && liaise.newSubstituent === undefined) {
                alert("Please select any monosaccharide.");
                liaise.initSelectedParams();
                return;
            }

            let coreGraph = liaise.canvasNode.parent.parent;
            const createBracket = new CreateFragmentBracket();
    
            if (coreGraph.id.indexOf("fragments") !== -1) {
                alert("Please select the core side monosaccharide.\n" +
                    "Your selected monosaccharide is contains in any fragment.");
                liaise.canvasNode = undefined;
                return;
            }

            if (coreGraph.graph.nodes().length === 1) {
                alert("Glycan fragments can not be added to monosaccharide.\n" +
                    "Please select a glycan linked of two or more monosaccharides.");
                liaise.canvasNode = undefined;
                return;
            }

            // make fragment bracket
            if (liaise.subGraph.length === 0) {
                liaise.addStage(createBracket.makeFragmentIDLayer(coreGraph));
                liaise.addStage(coreGraph);
            }

            // add monosaccharide fragments
            if (liaise.newNode !== undefined) {
                createBracket.makeMonosaccharideFragment(coreGraph);
            }

            // add substituent fragments
            if (liaise.newSubstituent !== undefined) {
                createBracket.makeSubstituentFragment();
            }

            // assign each fragments position
            if (liaise.subGraph.length > 1) {
                upDateRootOfFragment(coreGraph);
            }

            liaise.stageUpdate();
            liaise.newNode = undefined;
            liaise.canvasNode = undefined;

            return;
        }
        case modeType.NOT_SELECTED: {
            alert("Please select any command.");
            return;
        }
        default: {
            return;
        }
    }
}

const checkNumberOfChildren = (_currentNode: Monosaccharide): boolean => {
    const glycan: Glycan = _currentNode.parent;
    let ret: number = vf.getNodeChild(_currentNode, glycan).length;

    if (_currentNode.ringType !== RingType.UNDEFINED) {
        ret += 2;
    }

    return ret;
};