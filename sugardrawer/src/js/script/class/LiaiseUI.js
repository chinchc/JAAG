//@flow
"use strict";

import createjs from "createjs-easeljs";
import {modeType} from "../../react/modeType";
import {compositionSelected} from "../data/compositionSelected";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import {canvasClickEvent} from "../clickEvent/canvasClickEvent";
import UndoRedo from "../images/update/UndoRedo";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {createCurrentModeType} from "../util/createCurrentModeType";

class LiaiseUI {

    constructor() {
        this._modeType = modeType.NOT_SELECTED;

        this.stage = new createjs.Stage();

        //new items
        this._newMonosaccharide = undefined;
        this._newEdge = undefined;
        this._newSubstituent = undefined;
        this._newComposition = compositionSelected; //TODO : need init, setter, getter
        this._undefNode = {};
        this._newGraph = []; //0: core graph, later 0: sub graph

        //image parametors
        this._newShapes = {};
        this._newTreeData = {};

        //selected items
        this._canvasNode = undefined;
        this._canvasEdge = undefined;
        this._canvasSubstituent = undefined;

        //GUI utility
        this._interfaceType = "expert";
        this._doAction = new UndoRedo();
        this._usedItems = [];
        this._sideBarCancel = undefined;
    }

    //canvas
    initSelectedParams() {
        this.modeType = undefined;
        this.newNode = undefined;
        this.newEdge = undefined;
        this.newSubstituent = undefined;

        this.canvasSubstituent = undefined;
        this.canvasNode = undefined;
        this.canvasEdge = undefined;
    }

    // modify graphical elements
    initStage () {
        this.stage.initialize();
        this.stage.canvas.addEventListener("click", canvasClickEvent, false);
        this.stageUpdate();
    }

    addStage(node: Object) {
        this.stage.addChild(node);
    }

    getLayer(_layerName: string) {
        let layer: Object = undefined; 
        this.stage.children.map( (child) => {
            if (child.name !== _layerName) return;
            layer = child;
        });
        return layer;
    }

    stageUpdate() {
        this.stage.update();
    }

    removeStage(node: Object) {
        this.stage.removeChild(node);
    }
    //

    //TODO : おそらく削除する
    changeMultipleBind(data: boolean) {
        this.multipleBond = data;
    }
    changeBridgeBind(data: boolean) {
        this.bridgeBind = data;
    }

    getCompositionSelect(): Object {
        return this._newComposition;
    }
    setCompositionSelect(name: string, value: number) {
        this._newComposition[name] = value;
    }

    //TODO: 多分消すか構成を見直して再利用する
    searchComposition(): Array<string> {
        let resultArray: Array<string> = [];
        for(let key in this._newComposition) {
            if(this._newComposition[key] !== 0) {
                if(key === "Undefined") {
                    //console.log(this.undefCompositionName);
                    //resultArray.push(this.undefCompositionName);
                }
                else {
                    resultArray.push(key);
                }
            }
        }
        return resultArray;
    }

    //TODO: ここまで

    // manage tree params
    setNewShapes (_glycan: Glycan, _shapes: Object) {
        this._newShapes[_glycan.id] = _shapes;
    }

    getNewShapes (_glycan: Glycan) {
        if (_glycan.id in this._newShapes === undefined) {
            return {};
        }
        return this._newShapes[_glycan.id];
    }

    removeNewShapes (_glycan: Glycan) {
        delete this._newShapes[_glycan.id];
    }

    setNewTreeData (_glycan: Glycan, _treeData: Object) {
        this._newTreeData[_glycan.id] = _treeData;
    }

    getNewTreeData (_glycan: Glycan) {
        if (_glycan.id in this._newTreeData === undefined) {
            return {};
        }
        return this._newTreeData[_glycan.id];
    }

    removeNewTreeData (_glycan: Glycan) {
        delete this._newTreeData[_glycan.id];
    }

    // graph manage utilities
    initGraph () {
        this._newGraph = [];
    }

    removeGraph (_glycan: Glycan) {
        this._newGraph.map( (graph, index) => {
            if (graph.id !== _glycan.id) return;
            this._newGraph.splice(index, 1);
        });
    }

    set coreGraph (_core: Glycan) {
        this._newGraph[0] = _core;
    }

    get coreGraph () {
        let ret: Glycan = undefined;
        if (this.newGraph.length === 0) return ret;
        this.newGraph.map( (graph) => {
            if (graph.id !== "Glycan") return;
            ret = graph;
        });

        return ret;
    }

    set newGraph (_graph: Glycan) {
        if (_graph.id === "Glycan") {
            this.coreGraph = _graph;
        }
        if (_graph.id.indexOf("fragments") !== -1) {
            this.subGraph = _graph;
        }
    }

    get newGraph () {
        return this._newGraph;
    }

    set subGraph (_graph: Glycan) {
        if (this._newGraph.includes(_graph)) {
            this._newGraph[this._newGraph.indexOf(_graph)] = _graph;
        } else {
            this._newGraph.push(_graph);
        }
    }

    get subGraph () {
        let ret: Array<Glycan> = [];
        this.newGraph.map( (graph) => {
            if (graph.id === "Glycan") return;
            ret.push(graph);
        });

        return ret;
    }
    //

    //on canvas action
    set modeType (_modeType): void {
        this._modeType = _modeType;
        //createCurrentModeType(_modeType);
    }

    get modeType (): Symbol {
        return this._modeType;
    }

    //on new items
    set newNode (_newNode: string): void {
        if (_newNode === undefined) {
            /*
            let elm: HTMLElement = document.querySelector("#selected");
            if (elm.children.length > 0) {
                elm.children[0].remove();
            }
             */
            let cursor: HTMLElement = document.querySelector("#current-monosaccharide");
            if (cursor.children.length > 0) {
                cursor.children[0].remove();
            }
        }
        this._newMonosaccharide = _newNode;
    }

    get newNode (): string {
        return this._newMonosaccharide;
    }

    set newEdge (_newEdge: Object): void {
        if (_newEdge === undefined) {
            /*
            let elm: HTMLElement = document.querySelector("#selected");
            if (elm.children.length > 0) {
                elm.children[0].remove();
            }
             */
            let cursor: HTMLElement = document.querySelector("#current-monosaccharide");
            if (cursor.children.length > 0) {
                cursor.children[0].remove();
            }
        }
        this._newEdge = _newEdge;
    }

    get newEdge (): Object {
        return this._newEdge;
    }

    set newSubstituent (_newMod: Object): void {
        if (_newMod === undefined) {
            /*
            let elm: HTMLElement = document.querySelector("#selected");
            if (elm.children.length > 0) {
                elm.children[0].remove();
            }
             */
            let cursor: HTMLElement = document.querySelector("#current-monosaccharide");
            if (cursor.children.length > 0) {
                cursor.children[0].remove();
            }
        }
        this._newSubstituent = _newMod;
    }

    get newSubstituent (): Object {
        return this._newSubstituent;
    }

    //on canvas object
    set canvasNode (_node): void {
        this._canvasNode = _node;
    }

    get canvasNode (): Monosaccharide {
        return this._canvasNode;
    }

    set canvasEdge (_edge: GlycosidicLinkage): void {
        this._canvasEdge = _edge;
    }

    get canvasEdge (): GlycosidicLinkage {
        return this._canvasEdge;
    }

    set canvasSubstituent (_sub: Substituent): void {
        this._canvasSubstituent = _sub;
    }

    get canvasSubstituent (): Substituent {
        return this._canvasSubstituent;
    }

    //
    set interfaceType (_type: string): void {
        this._interfaceType = _type;
    }

    get interfaceType (): string {
        return this._interfaceType;
    }

    get actionUndoRedo (): Object {
        return this._doAction;
    }

    set usedItems (_item: string): void {
        this._usedItems.push(_item);
    }

    get usedItems (): Array<Object> {
        return this._usedItems;
    }

    set undefNode (_undefNode: Object): void {
        this._undefNode[Object.keys(this._undefNode).length] = _undefNode;
    }

    get undefNode (): Object {
        return this._undefNode;
    }

    set sideBarCancel (_cancel: Object): void {
        this._sideBarCancel = _cancel;
    }

    get sideBarCancel (): Object {
        return this._sideBarCancel;
    }
}

export { LiaiseUI };