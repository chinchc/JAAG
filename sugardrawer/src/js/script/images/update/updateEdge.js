//@flow
"use strict";

import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {liaise} from "../../index";
import {SNFGSymbolGlycan} from "../../data/SNFGGlycanTable";

/*
ring is UNDEFINED : anomericity is UNDEFINED, donor position is UNDEFINED
ring is OPEN : anomericity is UNDEFINED, donor position is not change
 */
export const updateEdgeWithMonosaccharide = (_targetNode: Monosaccharide): void => {
    //extract glycosidiclinkage
    const glycan: Glycan = _targetNode.parent;

    if (_targetNode === glycan.getRootNode()) {
        let rootEdge: Object = extractRootEdge(glycan);
        updateRootEdge(_targetNode, rootEdge);
    } else {
        let visFunc = new visFunction();
        let targetEdge: GlycosidicLinkage = visFunc.findLinkForMono(_targetNode, glycan);
        updateEdge(_targetNode, targetEdge);
    }

};

export const updateEdge = (_targetNode: Monosaccharide, _targetEdge: GlycosidicLinkage): void => {
    if (_targetNode.ringType === RingType.UNDEFINED) {
        _targetEdge.acceptorPosition = AcceptorPosition.UNDEFINED;
    }
    if (_targetNode.ringType === RingType.P || _targetNode.ringType === RingType.F) {
        const donorPos: number = SNFGSymbolGlycan[_targetNode.monosaccharideType.name].anomericPosition;
        if (donorPos === 1) {
            _targetEdge.acceptorPosition = AcceptorPosition.ONE;
        }
        if (donorPos === 2) {
            _targetEdge.acceptorPosition = AcceptorPosition.TWO;
        }
    }

    let edgeNotationComponent: createjs.Container = exrtarctEdgeNotationComponent(_targetEdge);
    let edgeNotation: string = edgeNotationComponent.children[1].text;

    let notations: Array<string> = edgeNotation.split("");
    notations[0] = extractAnomericity(_targetNode);

    edgeNotationComponent.children[1].text = notations[0] + notations[1] + notations[2];
    liaise.stageUpdate();
};

export const updateRootEdge = (_targetNode: Monosaccharide, _targetEdge: Object): void => {
    let label: Object = extractLabelComponent(_targetEdge.children, "label");
    let linkageNotation: string = label.text;

    let notations: Array<string> = linkageNotation.split("");
    notations[0] = extractAnomericity(_targetNode);

    label.text = notations[0] + notations[1] + notations[2];
    liaise.stageUpdate();
};

const extractAnomericity = (_targetNode: Monosaccharide): string => {
    if (_targetNode.anomericity === Anomericity.ALPHA) {
        return "α";
    } else if (_targetNode.anomericity === Anomericity.BETA) {
        return "β";
    }
    return "?";
};

/*
export const updateDonorPosition = (_edge: GlycosidicLinkage): void => {

};

export const updateAcceptorPosition = (_targetNode: Monosaccharide, _targetEdge: GlycosidicLinkage): void => {
};
*/

const extractRootEdge = (_glycan: Glycan): Object => {
    for (const child: Object of _glycan.children) {
        if (child.name === "root") return child;
    }
};

const extractLabelComponent = (_components: Array<Object>, _name: string): Object => {
    let ret: Object = undefined;
    
    _components.map ( (component) => {
        if (component.name === _name) ret = component;
    });

    return ret;
};

const exrtarctEdgeNotationComponent = (_targetEdge: GlycosidicLinkage): createjs.Container => {
    let edgeComponent: createjs.Container = _targetEdge.children[0];
    return edgeComponent.children[1];
};