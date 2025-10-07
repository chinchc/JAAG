//@flow

"use strict";

import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import MonosaccharideType from "sugar-sketcher/src/js/views/glycomics/dictionary/MonosaccharideType";
import {SNFGSymbolGlycan} from "../data/SNFGGlycanTable";
import Edge from "sugar-sketcher/src/js/models/dataStructure/GraphEdge";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export const checkUsableSubstituentPosition = (_substituent: Substituent, _glycan: Glycan): Object => {
    let ret: Object = {};
    for (const edge of _substituent.parent.graph.edges()) {
        if (edge.targetNode === _substituent) {
            ret = checkUsablePosition(edge, _glycan);
        }
    }

    return ret;
};

export const checkUsableFragmentRootPosition = (): Object => {
    let usablePos: Object = {};
    Array.from(new Array(9)).map( (v, i) => i + 1).map( (value) => {
        usablePos[value] = true; 
    });

    return usablePos;
};

export const checkUsablePosition = (_edge: Object, _glycan: Glycan): Object => {
    let usablePos: Object = {};

    //define usable linkage position
    for (let i = 1; i < SNFGSymbolGlycan[_edge.sourceNode.monosaccharideType.name].carbBone + 1; i++) {
        usablePos[i] = true;
    }

    //check using linkage position
    usablePos = checkEdge(usablePos, _edge, _glycan);
    let anomPos: number = checkAnomericPosition(_edge, _glycan);

    //check position of native substituent
    for (let pos of SNFGSymbolGlycan[_edge.sourceNode.monosaccharideType.name].disablePosition) {
        usablePos[pos] = false;
    }

    //check ring position
    if (anomPos === 1) {
        usablePos[1] = false;
        if (_edge.sourceNode.ringType === RingType.P) {
            usablePos[5] = false;
        }
        if (_edge.sourceNode.ringType === RingType.F) {
            usablePos[4] = false;
        }
    }
    if (anomPos === 2) {
        usablePos[2] = false;
        if (_edge.sourceNode.ringType === RingType.P) {
            usablePos[6] = false;
        }
        if (_edge.sourceNode.ringType === RingType.F) {
            usablePos[5] = false;
        }
    }

    return usablePos;
};

const checkEdge = (_usablePos: Object, _edge: Object, _glycan: Glycan): Object => {
    for (let edge of _glycan.graph.edges()) {
        if (_edge.sourceNode === edge.sourceNode) {
            if (edge.donorPosition === DonorPosition.UNDEFINED) continue;
            _usablePos[edge.donorPosition.value] = false;
        }
    }
    return _usablePos;
};

const checkAnomericPosition = (_edge: Object, _glycan: Glycan): number => {
    let anomPos:number = -1;

    _glycan.graph.edges().map( (edge) => {
        if (_edge.sourceNode !== edge.targetNode) return;
        if (edge.acceptorPosition === AcceptorPosition.UNDEFINED) return;
        anomPos = edge.acceptorPosition.value;
    });

    if (_edge.sourceNode === _glycan.getRootNode()) {
        if (_edge instanceof GlycosidicLinkage) {
            anomPos = SNFGSymbolGlycan[_edge.sourceNode.monosaccharideType.name].anomericPosition;
        } else {
            anomPos = SNFGSymbolGlycan[_glycan.getRootNode().monosaccharideType.name].anomericPosition;
        }
    }

    return anomPos;
};

export const isThisLinkageBoneded = (_edge: Edge, _donorPos: DonorPosition): void => {
    const donorPos = _donorPos.value;
    if (_donorPos === DonorPosition.UNDEFINED) return false;

    //check size of source node
    const monoType: MonosaccharideType = _edge.sourceNode.monosaccharideType;
    if( donorPos > SNFGSymbolGlycan[monoType.name].carbBone ) {
        alert("Please select a position more under " + SNFGSymbolGlycan[monoType.name].carbBone);
        return true;
    }

    if (!(checkUsablePosition(_edge, _edge.parent)[_donorPos.value])) {
        alert("This position is already bonded for other node.");
        return true;
    }

    return false;
};