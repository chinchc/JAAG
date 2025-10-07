//@flow
"use strict";

//This code is based on "https://qiita.com/ampersand/items/69c8d632ed9f60358418"
import {liaise} from "../../index";
import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import {makeGlycoCT} from "../../converter/converterInterface";
import GlycanTextParser from "../../util/GlycanTextParser";

const STACK_MAX_SIZE: number = 10;
const emFunc = new emFunction();

export default class UndoRedo {
    constructor(): void {
        this._undoCT = [];
        this._redoCT = [];
    }

    setNode (): void {
        this._redoCT = [];
        if (this._undoCT.length >= STACK_MAX_SIZE) {
            this._undoCT.pop();
        }

        if (liaise.newGraph.length === 0) return;

        try {
            let gct: string = makeGlycoCT();
            this._undoCT.unshift(gct);
        } catch (e) {
            alert("Error in UndoRedo.js @setNode : \n" + `${e.message}` + "\n" + `${e.stack}`);
        }
    }

    undo (): void {
        if (this._undoCT.length <= 0) return;

        let gct: string = this._undoCT.shift();
        let backup: string = makeGlycoCT();
        this._redoCT.unshift(backup);
        this._importGlycoCT(gct);
    }

    redo (): void {
        if (this._redoCT.length <= 0) return;

        let gct: string = this._redoCT.shift();

        liaise.newGraph.map( (graph) => {
            let treeData: Object = emFunc.generateTree(graph);
            liaise.setNewTreeData(graph, treeData);
        });
        let backup: string = makeGlycoCT();
        this._undoCT.unshift(backup);
        this._importGlycoCT(gct);
    }

    _importGlycoCT (_gct: string) {
        liaise.initStage();
        if (liaise.newGraph.length !== 0) liaise.initGraph();

        let txtParser: Object = new GlycanTextParser(_gct);
        txtParser.parseFormula();
        txtParser.showImage();
    }
}