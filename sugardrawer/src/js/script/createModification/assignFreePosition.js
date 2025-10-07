//@flow
"use strict";

import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import {substituentPosition} from "../data/SubstituentPosition";

export const assingFreePosition = (_glycan: Glycan, _subEdge: SubstituentLinkage): void => {
    let subLinkages: Object = {
        low: [],
        high: []
    };
    for (const edge of _glycan.graph.edges()) {
        if (!(edge instanceof SubstituentLinkage)) continue;
        if (edge.getEdgeSource() !== _subEdge.getEdgeSource()) continue;
        if (edge.donorPosition.value < 5 || edge.donorPosition === DonorPosition.UNDEFINED) {
            subLinkages.low.push(edge);
        } else {
            subLinkages.high.push(edge);
        }
    }

    if (subLinkages.low.length > 5) {
        const temp = subLinkages.low.splice(5, subLinkages.low.length);
        subLinkages.high = subLinkages.high.concat(temp);
    }
    if (subLinkages.high.length > 5) {
        const temp = subLinkages.high.splice(5, subLinkages.high.length);
        subLinkages.low = subLinkages.low.concat(temp);
    }

    let ret: Object;

    const lowEdges: Object = assignSubPos(subLinkages.low, true);
    ret = assignSubstituentSpace(lowEdges, _subEdge);

    if (ret !== undefined) {
        return substituentPosition(ret);
    }

    const highEdges: Object = assignSubPos(subLinkages.high, false);
    ret = assignSubstituentSpace(highEdges, _subEdge);

    return substituentPosition(ret);
};

const assignSubstituentSpace = (_edges: Object, _subEdge: SubstituentLinkage) => {
    let ret: DonorPosition = undefined;
    for (const key in _edges) {
        if (_edges[key] === "") continue;
        if (_edges[key] !== _subEdge) continue;
        ret = DonorPosition.prototype.getDonorPosition(key !== "undefined" ? parseInt(key) : key);
    }

    return ret;
};

const assignSubPos = (_subEdges: Array<Object>, _isLow: boolean): Object => {
    let ret: Object = {
        1: "",
        2: "",
        3: "",
        4: "",
        "undefined": ""
    };

    if (!_isLow) {
        ret = {
            5: "",
            6: "",
            7: "",
            8: "",
            9: ""
        };
    }

    for (const subEdge of _subEdges) {
        if (ret[subEdge.donorPosition.value] !== "") {
            ret[getFreeSpace(ret)] = subEdge;
        } else {
            ret[subEdge.donorPosition.value] = subEdge;
        }
    }

    return ret;
};

const getFreeSpace = (_tenant: Object) => {
    let ret = "";
    Object.keys(_tenant).map(function (key) {
        if (_tenant[key] === "") {
            ret = key;
        }
    });
    return ret;
};