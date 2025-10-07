//@flow

"use strict";

import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import createjs from "createjs-easeljs";
import {getColor} from "../../data/getColor";
import {basicData} from "../../data/graphicsData";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import CreateLinkage from "../../createBind/CreateLinkage";
import {assingFreePosition} from "../../createModification/assignFreePosition";
import {calcRootLabel} from "../../createBind/createRootSymbol";
import CreateFragmentBracket from "../../createFragment/CreateFragmentBracket";
import {liaise} from "../../index";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import CreateFragmentID from "../../createFragment/CreateFragmentID";

export const startUpdate = (_glycan: Glycan): Glycan => {

    updateSugars(_glycan);
    updateLinkages(_glycan);
    updateRootSymbol(_glycan.getRootNode());
    if (_glycan.id === "Glycan") {
        // modify fragments position
        updateFragmentBracket(_glycan);
        upDateRootOfFragment(_glycan);
    }

    // optimize sub-graph position
    checkCollisionOfSubGraph();

    return _glycan;
};

const updateSugars = (_glycan: Glycan): void => {
    const shapes: Object = liaise.getNewShapes(_glycan);
    _glycan.graph.nodes().map( (node) => {
        if (node instanceof Monosaccharide) {
            node.x = shapes[node.id][0];
            node.y = shapes[node.id][1];
            updateFragmentIDsPosition(node);
        }
    });
};

const updateLinkages = (_glycan: Glycan): void => {
    _glycan.graph.edges().map( (edge) => {
        if (edge instanceof GlycosidicLinkage) {
            updateGlycoSidicLinkage(edge, _glycan);
        }
        if (edge instanceof SubstituentLinkage) {
            updateSubstituentLinkage(edge, _glycan);
        }
    });
};

export const updateGlycoSidicLinkage = (_edge: GlycosidicLinkage, _glycan: Glycan): void => {
    let donorNode: Monosaccharide = _edge.getEdgeTarget();
    let acceptorNode: Monosaccharide = _edge.getEdgeSource();

    let edgeComponent: createjs.Container = _edge.children[0];
    let link: createjs.Shape = edgeComponent.children[0];
    link.graphics
        .clear()
        .beginStroke(getColor("black"))
        .setStrokeStyle(basicData.edgeSize)
        .moveTo(acceptorNode.x, acceptorNode.y)
        .lineTo(donorNode.x, donorNode.y);

    const creLin = new CreateLinkage();
    const shapes: Object = liaise.getNewShapes(_glycan);
    let pos: Array<number> = creLin._calcXYLinkageLabel(_edge, shapes);
    edgeComponent.children[1].x = pos[0];
    edgeComponent.children[1].y = pos[1];

    creLin._modifyPosition(edgeComponent.children[1]);
};

export const updateSubstituentLinkage = (_edge: SubstituentLinkage, _glycan: Glycan): void => {
    let donorNode: Substituent = _edge.getEdgeTarget();
    let sub: createjs.Container = extractChild(`${donorNode.id}_notation`, donorNode.children);
    const subPos: Object = assingFreePosition(_glycan, _edge);
    let x = _edge.getEdgeSource().x;
    let y = _edge.getEdgeSource().y;
    let notation: string = sub.children[1].text;

    sub.x = subPos.x + x;
    sub.y = subPos.y + y;
    sub.children[1].text = notation.replace(notation[0],
        _edge.donorPosition.value === "undefined" ? "?" : _edge.donorPosition.value);
};

export const updateRootSymbol = (_root: Monosaccharide): void => {
    const x: number = _root.x;
    const y: number = _root.y;
    const glycan: Glycan = _root.parent;

    let rootSymbol: createjs.Container = extractChild("root", glycan.children);

    rootSymbol.children.map( (child) => {
        if (child.name === "line") {
            child.graphics
                .clear()
                .beginStroke(getColor("black"))
                .setStrokeStyle(basicData.edgeSize)
                .moveTo(x + 50, y)
                .lineTo(x, y);
        }
        if (child.name === "root-notation") {
            child.children.map( (notationChild) => {
                if (notationChild.name !== "label") return;
                let pos: Array<number> = calcRootLabel(_root);
                child.x = pos[0];
                child.y = pos[1] + 9;
            });
        }
        if (child.name === "symbol") {
            child.graphics
                .clear()
                .beginStroke(getColor("black"))
                .setStrokeStyle(basicData.edgeSize)
                .moveTo(x + 50, y - 20)
                .bezierCurveTo(x + 45, y - 10, x + 45, y - 10, x + 50, y)
                .bezierCurveTo(x + 55, y + 10, x + 55, y + 10, x + 50, y + 20);
        }
    });
};

const updateFragmentBracket = (_glycan: Glycan): void => {
    if (liaise.getLayer("fragmentIDs") === undefined) return;

    const fragmentIDs: createjs.Container = liaise.getLayer("fragmentIDs");
    let fragmentBracket: createjs.Shape = extractChild("bracket", fragmentIDs.children);

    if (fragmentBracket === undefined) return;

    fragmentBracket.graphics.clear();
    const createFragBracket = new CreateFragmentBracket();
    let modifyedBracket = createFragBracket.makeFragmentBracket(_glycan);
    fragmentBracket.graphics = modifyedBracket.graphics;
};

export const upDateRootOfFragment = (_glycan: Glycan): void => {
    if (_glycan.id !== "Glycan") return;
    if (liaise.subGraph.length === 0) return;

    const fragmentIDs: createjs.Container = liaise.getLayer("fragmentIDs");
    const fragmentBracket: createjs.Shape = extractChild("bracket", fragmentIDs.children);
    const bracketInstruction: Object = makeBracketMargin(fragmentBracket);
    const min: number = -45 * (liaise.subGraph.length * .5);
    const bracketMargin: number = bracketInstruction.high - bracketInstruction.margin * .5;

    liaise.subGraph.map( (subGraph, index) => {
        rootPos.posX = fragmentBracket.graphics.command.x - 100;
        if (liaise.subGraph.length === 1) {
            rootPos.posY = bracketMargin;
        } else {
            rootPos.posY = bracketMargin - (min + 45 * index);
        }

        updateRootPosition(subGraph, rootPos);
    });
};

export const updateRootPosition = (_glycan, _rootPos) => {
    let visFunc = new visFunction();
    let shapes: Object = liaise.getNewShapes(_glycan);
    let treeData: Object = liaise.getNewTreeData(_glycan);
    shapes.root = [_rootPos.posX, _rootPos.posY];
    shapes[_glycan.getRootNode().id] = shapes.root;
    shapes = visFunc.generateShapes(_glycan, shapes, treeData)[0];

    liaise.setNewShapes(_glycan, shapes);
    liaise.setNewTreeData(_glycan, treeData);
    liaise.newGraph = startUpdate(_glycan);
};

const extractChild = (_key: string, _children: Array<Object>): Object => {
    let ret: Object;
    _children.map( (child) => {
        if (_key === child.name) ret = child;
    });

    return ret;
};

const makeBracketMargin = (_bracket): Object => {
    const activeInstructions: Object = _bracket.graphics._activeInstructions;
    let ret: Object = {
        low: activeInstructions[3].y,
        high: activeInstructions[1].y,
        margin: activeInstructions[1].y - activeInstructions[3].y
    };

    ret.division = ret.margin / (liaise.subGraph.length + 1);
    return ret;
};

const updateFragmentIDsPosition = (_node: Monosaccharide): void => {
    if (liaise.getLayer("fragmentIDs") === undefined) return;
    const createFGID: Object = new CreateFragmentID();
    liaise.getLayer("fragmentIDs").children.map( (child) => {
        if (child.name !== _node.id) return;
        createFGID.assignFragmentIDPosition(_node, child);
    });
};

export const checkCollisionOfSubGraph = () => {
    liaise.subGraph.map( (graph1) => {
        graph1.graph.nodes().map( (node1) => {
            liaise.subGraph.map( (graph2) => {
                if (graph1.id === graph2.id) return;
                graph2.graph.nodes().map( (node2) => {

                    const llpt: Object = node1.localToLocal(0, 0, node2);
                    if (node2.hitTest(llpt.x, llpt.y)) {
                        const shape2 = liaise.getNewShapes(graph2);
                        rootPos.posX = shape2.root[0];
                        rootPos.posY = shape2.root[1] - 50;
                        updateRootPosition(graph2, rootPos);
                    }
                });
            });
        });
    });
};