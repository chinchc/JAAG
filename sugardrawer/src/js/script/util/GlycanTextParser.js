//@flow

"use strict";

import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import CreateLinkage from "../createBind/CreateLinkage";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import CreateModification from "../sugarsketcher/CreateModification";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import {makeAttachPoint, makeFragmentAttachPoint} from "../createBind/createRootSymbol";
import {updateIsomer, updateRingType} from "../images/update/updateMonosaccharide";
import {liaise} from "../index";
import {canvasClickEvent} from "../clickEvent/canvasClickEvent";
import {clickEdge} from "../clickEvent/edgeMousePortal";
import {onMouseDown} from "../clickEvent/canvasDragAndDropEvent";
import GlycoCTParserForFragments from "../io/GlycoCT/GlycoCTParserForFragments";
import CreateFragmentBracket from "../createFragment/CreateFragmentBracket";
import {startUpdate} from "../images/update/updateCanvas";
import CreateFragmentID from "../createFragment/CreateFragmentID";
import CreateMonosaccharideContainer from "../createSugar/CreateMonosaccharideContainer";
import CreateModificationNotation from "../createModification/CreateModificationNotation";

export default class GlycanTextParser {
    constructor(_formula: string) {
        this.formula = _formula;
        this.glycan = [];
    }

    set glycan (_glycan: Glycan): void {
        this._glycan = _glycan;
    }

    get glycan (): Glycan {
        return this._glycan;
    }

    parseFormula (): Glycan  {
        try {
            if (this.formula === undefined) {
                throw new Error("GlycoCT is undefined.");
            }

            const parser = new GlycoCTParserForFragments(this.formula);
            this.glycan = parser.parseGlycoCT();
        } catch (e) {
            alert("Error in GlycanTextParser @parseFormula : \n" + `${e.message}\n`);
            return;
        }

        this.glycan.map( (glycan, index) => {
            liaise.newGraph = glycan;

            this._assignPosition(glycan);

            this._assignEdge(glycan);

            this._defineTreeData(glycan);

            // append root attach point
            if (glycan.id === "Glycan") {
                glycan.addChild(makeAttachPoint(glycan.getRootNode()));
            } else {
                glycan.addChild(makeFragmentAttachPoint(glycan.getRootNode()));
            }

            this._assignSymbol(glycan);

            // append fragment bracket
            if (this.glycan.length > 1 && index === 0) {
                const createBracket = new CreateFragmentBracket();
                liaise.addStage(createBracket.makeFragmentIDLayer(glycan));
            }

            // append fragment ids in attach point
            if (glycan.id.indexOf("fragments") !== -1) {
                const createFGID: Object = new CreateFragmentID();
                createFGID.drawFragmentIDs();
            }

        });

        startUpdate(liaise.coreGraph);
    }

    showImage (): void {
        //visualize glycan image
        liaise.newGraph.map( (glycan) => {
            liaise.addStage(glycan);
        });
        liaise.stageUpdate();

        liaise.stage.canvas.removeEventListener("mousedown", onMouseDown, false);
        liaise.stage.canvas.removeEventListener("click", canvasClickEvent, false);
    }

    _assignPosition (_glycan): Object {
        let currentShape;
        const visFunc = new visFunction();
        rootPos.posX = liaise.stage.canvas.width * .75;
        rootPos.posY = liaise.stage.canvas.height * .5;
        currentShape = visFunc.generateShapes(_glycan, {}, undefined)[0];
        liaise.setNewShapes(_glycan, currentShape);
    }

    _assignSymbol (_glycan): Glycan {
        const createComp = new CreateMonosaccharideContainer();

        _glycan.graph.nodes().map( (node) => {
            if (!(node instanceof Monosaccharide)) return;

            // make monosaccharide image component
            let imgComp = createComp.makeMonosaccharideConTainer(node.monosaccharideType.name);
            node.addChild(imgComp);

            node = updateIsomer(node);

            node = updateRingType(node);

            _glycan.addChild(node);
        });
    }

    _assignEdge (_glycan): void {
        const currentShape = liaise.getNewShapes(_glycan);

        _glycan.graph.edges().map( (edge) => {
            if (edge instanceof GlycosidicLinkage) {
                let creLin = new CreateLinkage();
                edge.addChild(creLin.makeEdgeContainer(edge, currentShape));
                _glycan.addChild(edge);
            }
            if (edge instanceof SubstituentLinkage) {
                const creModNotation = new CreateModificationNotation();
                let substituent: Substituent = edge.targetNode;
                substituent.addChild(creModNotation.makeNotationContainer(_glycan, edge));
                _glycan.addChild(substituent);
            }
        });
    }

    _defineTreeData (_glycan): void {
        const emFunc = new emFunction();
        const currentTree = emFunc.generateTree(_glycan);
        liaise.setNewTreeData(_glycan, currentTree);
    }
}