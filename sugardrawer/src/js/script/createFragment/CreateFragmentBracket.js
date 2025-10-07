//@flow

"use strict";

import appFunction from "sugar-sketcher/src/js/guifunction/appFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import { liaise } from "../index";
import {getColor} from "../data/getColor";
import {basicData} from "../data/graphicsData";
import CreateMonosaccharide from "../sugarsketcher/CreateMonosaccharide";
import {makeFragmentAttachPoint} from "../createBind/createRootSymbol";
import CreateFragmentID from "./CreateFragmentID";
import CreateModificationNotation from "../createModification/CreateModificationNotation";

export default class CreateFragmentBracket {
    constructor () {}

    makeFragmentBracket (_glycan: Glycan) {
        let bracket: createjs.Shape = new createjs.Shape();
        bracket.graphics.beginStroke(getColor("black"));
        bracket.name = "bracket";

        let maxY: number = 0;
        let minY: number = 10000;
        let minX: number = 10000;

        _glycan.graph.nodes().map( (node) => {
            if (node instanceof Substituent) return;
            if (node.y > maxY) maxY = node.y;
            if (minY > node.y) minY = node.y;
            if (minX > node.x) minX = node.x;
        });

        bracket.graphics.setStrokeStyle(basicData.strokeSize);
        bracket.graphics
            .moveTo(minX - 5, maxY + 50)
            .lineTo(minX - 30, maxY + 50)
            .lineTo(minX - 30, minY - 50)
            .lineTo(minX - 5, minY - 50);
        //bracket.graphics.endStroke();
        return bracket;
    }

    makeFragmentIDLayer (_coreGraph: Glycan) {
        let fragmentIDLayer: createjs.Container = liaise.getLayer("fragmentIDs");

        if (fragmentIDLayer === undefined) {
            fragmentIDLayer = new createjs.Container();
            fragmentIDLayer.name = "fragmentIDs";
        }

        // make fragment bracket
        fragmentIDLayer.addChild(this.makeFragmentBracket(_coreGraph));

        // assign scale
        fragmentIDLayer.scaleX = _coreGraph.scaleX;
        fragmentIDLayer.scaleY = _coreGraph.scaleY;

        return fragmentIDLayer;
    }
    
    makeMonosaccharideFragment (_coreGraph: Glycan): void {
        const createMono: Object = new CreateMonosaccharide();
        const vf: Object = new visFunction();

        let rootFrag: Monosaccharide = createMono.makeMonosaccharideImageComponent(liaise.newNode);
        let subGraph = new Glycan(`fragments${this.makeNewestFragmentNumber()}`, rootFrag);
        let shapes: Object = {root: []};
        liaise.newGraph = subGraph;

        // extract fragments x coodinate
        liaise.getLayer("fragmentIDs").children.map( (child) => {
            if (child.name !== "bracket") return;
            const bracketInstruction: Object = this.makeBracketMargin(child);
            shapes.root[0] = child.graphics.command.x - 100;
            shapes.root[1] = bracketInstruction.high - bracketInstruction.margin * .5;
        });
    
        shapes[rootFrag.id] = shapes.root;
    
        let treeData: Object = vf.updateTreeVisualization(undefined, subGraph, {});
    
        rootFrag.x = shapes[rootFrag.id][0];
        rootFrag.y = shapes[rootFrag.id][1];

        // append core-side nodes
        subGraph.parentNodeIDs = [];
        _coreGraph.graph.nodes().map( (node) => {
            if (node instanceof Substituent) return;
            subGraph.parentNodeIDs.push(node.id);
        });
        subGraph.parentEdge = {
            acceptorPosition: AcceptorPosition.UNDEFINED, 
            donorPosition: DonorPosition.UNDEFINED
        };
        subGraph.addChild(makeFragmentAttachPoint(rootFrag));
        subGraph.addChild(rootFrag);
    
        // append fragment id at fragment root and core side
        const createFGID: Object = new CreateFragmentID();
        createFGID.drawFragmentIDs();

        // assign scale
        subGraph.scaleX = _coreGraph.scaleX;
        subGraph.scaleY = _coreGraph.scaleY;

        liaise.newGraph = _coreGraph;
        liaise.addStage(subGraph);
        liaise.setNewShapes(subGraph, shapes);
        liaise.setNewTreeData(subGraph, treeData);
    }

    makeSubstituentFragment (_coreGraph: Glycan): void {
        const appFunc = new appFunction();
        const vf: Object = new visFunction();

        let rootFrag: Substituent = new Substituent(appFunc.randomString(7), liaise.newSubstituent);
        //let acceptorPosition: number = "?";
        let subGraph = new Glycan(`fragments${liaise.subGraph.length + 1}`, rootFrag);
        let shapes: Object = {};
        liaise.newGraph = subGraph;
    
        // extract fragments x coodinate
        liaise.getLayer("fragmentIDs").children.map( (child) => {
            if (child.name !== "bracket") return;
            const bracketInstruction: Object = this.makeBracketMargin(child);
            const x: string = child.graphics.command.x - 100;
            const y: string = bracketInstruction.high - bracketInstruction.division * liaise.subGraph.length;
            shapes.root = [x, y];
        });
    
        shapes[rootFrag.id] = shapes.root;

        let treeData: Object = vf.updateTreeVisualization(undefined, subGraph, {});
    
        rootFrag.x = shapes[rootFrag.id][0];
        rootFrag.y = shapes[rootFrag.id][1];
    
        subGraph.parentNodeIDs = [liaise.canvasNode.id];
        subGraph.parentEdge = {
            acceptorPosition: AcceptorPosition.UNDEFINED,
            donorPosition: DonorPosition.UNDEFINED
        };
    
        // make substituent notation
        const creModNotation = new CreateModificationNotation();
        rootFrag.addChild(creModNotation.makeNotationContainer(subGraph, subGraph.parentEdge));
        //subGraph.addChild(makeFragmentAttachPoint(rootFrag));
        subGraph.addChild(rootFrag);

        liaise.newGraph = _coreGraph;
        liaise.addStage(subGraph);
        liaise.setNewShapes(subGraph, shapes);
        liaise.setNewTreeData(subGraph, treeData);
    }
    
    
    makeBracketMargin (_bracket: Object): Object {
        //30, 15, 15, 30
        const activeInstructions: Object = _bracket.graphics._activeInstructions;
        let ret: Object = {
            low: activeInstructions[3].y,
            high: activeInstructions[1].y,
            margin: activeInstructions[1].y - activeInstructions[3].y
        };
    
        ret.division = ret.margin / (liaise.subGraph.length + 1);
        return ret;
    }
    
    makeNewestFragmentNumber (): void {
        if (liaise.subGraph.length === 0) return 1;
        
        let ret: number = -1;
    
        liaise.subGraph.map( (subGraph) => {
            const currentFragNum: number = Number(subGraph.id.replace("fragments", ""));
            if (currentFragNum > ret) ret = currentFragNum;
        });
        
        return ret + 1;
    }
}