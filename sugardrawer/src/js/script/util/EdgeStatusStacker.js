//@flow
"use strict";

import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import {SNFGSymbolGlycan} from "../data/SNFGGlycanTable";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {checkUsablePosition, checkUsableFragmentRootPosition} from "../createBind/checkUsablePosition";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import {liaise} from "../index";

export default class EdgeStatusStacker {
    constructor() {
        this._usablePos = {};
        this._canOperateDonor = true;
        this._canOperateAnom = true;
        this._carbon = undefined;
        this._donor = undefined;
        this._acceptor = undefined;
        this._usableDonorPos = -1;

        this._currentEdgeNotation = "";

        this._isUsable = false;
    }

    set usablePos (_usablePos: Object): void {
        this._usablePos = _usablePos;
    }

    set canOperateDonor (_canOperateDonor: boolean): void {
        this._canOperateDonor = _canOperateDonor;
    }

    set canOperateAnom (_canOperateAnom: boolean): void {
        this._canOperateAnom = _canOperateAnom;
    }

    set carbon (_carbon: Anomericity): void {
        this._carbon = _carbon;
    }

    set donor (_donor: AcceptorPosition): void {
        this._donor = _donor;
    }

    set acceptor (_acceptor: DonorPosition): void {
        this._acceptor = _acceptor;
    }

    set usableDonorPos (_donorPos: number): void {
        this._usableDonorPos = _donorPos;
    }

    set isUsable (_usable: boolean): void {
        this._isUsable = _usable;
    }

    set currentEdgeNotation (_edgeNotation: string): void {
        this._currentEdgeNotation = _edgeNotation;
    }

    get usablePos (): Object {
        return this._usablePos;
    }

    get canOperateDonor (): boolean {
        return this._canOperateDonor;
    }

    get canOperateAnom (): boolean {
        return this._canOperateAnom;
    }

    get carbon (): Anomericity {
        return this._carbon;
    }

    get donor (): AcceptorPosition {
        return this._donor;
    }

    get acceptor (): DonorPosition {
        return this._acceptor;
    }

    get usableDonorPos (): number {
        return this._usableDonorPos;
    }

    get isUsable (): boolean {
        return this._isUsable;
    }

    get currentEdgeNotation (): string {
        return this._currentEdgeNotation;
    }

    start (_targetEdge: Object) {
        //TODO: rootとglycosidic linkageの区別
        if (_targetEdge.name === "root") {
            //root line > root container > glycan

            // check core side root monosaccharide
            const glycan: Glycan = _targetEdge.parent;
            if (glycan.id === "Glycan") {
                this.usableDonorPos = SNFGSymbolGlycan[glycan.getRootNode().monosaccharideType.name].anomericPosition;
                this.isUsable = true;
                this.currentEdgeNotation = _targetEdge.children[2].children[1].text;
            }

            // check fragment root monosaccharide
            if (glycan.id.indexOf("fragments") !== -1) {
                this.usableDonorPos = SNFGSymbolGlycan[glycan.getRootNode().monosaccharideType.name].anomericPosition;
                this.usablePos = checkUsableFragmentRootPosition();
                this.currentEdgeNotation = _targetEdge.children[1].children[1].text;
            }

            // check monosaccharide state
            const root: Monosaccharide = glycan.getRootNode();
            this.carbon = root.anomericity;
            if (root.ringType === RingType.UNDEFINED) {
                this.canOperateAnom = false;
                this.canOperateDonor = false;
                this.donor = AcceptorPosition.UNDEFINED;
            } else if (root.ringType === RingType.OPEN) {
                this.canOperateAnom = false;
                this.canOperateDonor = true;
                this.donor = AcceptorPosition.UNDEFINED;
            } else {
                if (this.usableDonorPos === 1) this.donor = AcceptorPosition.ONE;
                if (this.usableDonorPos === 2) this.donor = AcceptorPosition.TWO;
            }

            // check fragments
            if (glycan.id.indexOf("fragments") !== -1) {
                this.acceptor = glycan.parentEdge.donorPosition;
            } else {
                this.acceptor = DonorPosition.UNDEFINED;
            }

            return;
        }

        if (_targetEdge.name.match(/.+-edge/).length > 0) {
            // parent1: GlycosidicLinkage
            // parent2: Glycan
            let currentLinkage: GlycosidicLinkage = liaise.canvasEdge.parent;
            let currentGraph: Glycan = currentLinkage.parent;

            this.currentEdgeNotation = liaise.canvasEdge.children[1].children[1].text;

            this.usableDonorPos = SNFGSymbolGlycan[currentLinkage.targetNode.monosaccharideType.name].anomericPosition;
            this.usablePos = checkUsablePosition(currentLinkage, currentGraph);
            this.isUsable = false;

            const targetNode: Monosaccharide = currentLinkage.targetNode;
            if (targetNode.ringType === RingType.UNDEFINED) {
                this.canOperateAnom = false;
                this.canOperateDonor = false;
            }
            if (targetNode.ringType === RingType.OPEN) {
                this.canOperateAnom = false;
                this.canOperateDonor = true;
            }

            this.carbon = targetNode.anomericity;
            this.donor = currentLinkage.acceptorPosition;
            this.acceptor = currentLinkage.donorPosition;
        }
    }

    makeEdges (): Object {
        let ret: Array<string> = [];
        let edgeNotation: string[] = this.currentEdgeNotation.split("");

        Object.keys(this.usablePos).map( (key) => {
            if (this.usablePos[key] === false && edgeNotation[2] !== key) return;

            let elm: string = "-" + key;

            if (this.canOperateAnom) {
                if (this.canOperateDonor) {
                    ret.push("α" + this.usableDonorPos + elm);
                    ret.push("β" + this.usableDonorPos + elm);
                } else {
                    ret.push("α?" + elm);
                    ret.push("β?" + elm);
                }
            }
            if (this.canOperateDonor) {
                ret.push("?" + this.usableDonorPos + elm);
            }
            ret.push("??" + elm);
        });
        
        //make undefined acceptor
        if (this.canOperateAnom) {
            if (this.canOperateDonor) {
                ret.push("α" + this.usableDonorPos + "-?");
                ret.push("β" + this.usableDonorPos + "-?");
            } else {
                ret.push("α?" + "-?");
                ret.push("β?" + "-?");
            }
        }
        ret.push("??-?");

        return ret;
    }
}