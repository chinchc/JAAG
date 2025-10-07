//@flow

"use strict";

import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import MonosaccharideType from "sugar-sketcher/src/js/views/glycomics/dictionary/MonosaccharideType";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";

/**
 * Encode wurcs-json from Glycan object;
 * @param _glycan
 */
export const wurcsjsonWriter = (_glycan: Glycan): string => {
    let jsonObj: Object = {
        "WURCS": "",
        "Aglycone": "", //not support
        "Fragments": {}, //not support
        "Repeat": {}, //not support
        "Edges": {}, // id: e0, e1, e2....
        "AN": "",
        "Bridge": {}, //not support
        "Monosaccharides": {} // id: m0, m1, m2....
    };

    jsonObj.Monosaccharides = makeMonosaccharideBlock(_glycan);
    jsonObj.Edges = makeEdgeBlock(_glycan);
    return JSON.stringify(jsonObj);
};

const makeMonosaccharideBlock = (_glycan: Glycan): Object => {
    let monosaccharide: Object = {};
    let visFunc: Object = new visFunction();

    /*
        "Modifications": [],
			"TrivialName": [
				"glc"
			],
			"Substituents": [],
			"Configuration": [
				"d"
			],
			"SuperClass": "HEX",
			"RingSize": "",
			"AnomState": "?",
			"AnomPosition": -1,
			"Notation": "GlcNAc"
		}
     */
    _glycan.graph.nodes().forEach((node, index) => {
        let mono: Monosaccharide = node;
        let anomericPosition: number = -1;
        let edge: GlycosidicLinkage = visFunc.findLinkForMono(node, _glycan);

        if (_glycan.getRootNode() === node) {

        } else {
            anomericPosition = edge.acceptorPosition.value;
        }

        let unit: Object = {
            "Modifications": [],
            "TrivalName": [], //TODO: trivial nameを生成する方法の検討
            "Substituents": [],
            "Configuration": [extractIsomer(mono.isomer)],
            "SuperClass": "",
            "RingSize": extractRingType(mono.ringType),
            "AnomState": extractAnomericity(mono.anomericity),
            "AnomPosition": anomericPosition,
            "Notation": extractMonosaccharideName(mono.monosaccharideType)
        };

        monosaccharide["m" + index] = unit;
    });

    return monosaccharide;
};

const makeEdgeBlock = (_glycan: Glycan): Object => {
    let edge: Object = {};

    /*
        "e0": {
			"Acceptor": "m0",
			"Donor": "m1",
			"Position": {
				"Acceptor": [
					4
				],
				"Donor": [
					1
				]
			},
			"Probability": {
				"High": 1,
				"Low": 1
			},
			"LinkageType": {
				"Acceptor": "UNVALIDATED",
				"Donor": "UNVALIDATED"
			}
		}

		"Acceptor" : {
		    "Node" : "",
		    "Position" : [],
		    "LinkageType" : ""
		},
		"Donor" : {
		    "Node" : "",
		    "Position" : [],
		    "LinkaegType" : ""
		}
     */
    _glycan.graph.edges().forEach((edge, index) => {
        let unit: Object = {
            "Acceptor" : "",
            "Donor" : "",
            "Position" : {
                "Acceptor" : [],
                "Donor" : []
            },
            "Probability" : {
                "High" : 1,
                "Low" : 1
            },
            "LinkageType" : {
                "Acceptor" : "UNVALIDATED",
                "Donor" : "UNVALIDATED"
            }
        };

        edge["e" + index] = unit;
    });

    return edge;
};

const extractRingType = (_ringType: RingType): string => {
    if (_ringType === RingType.P) return "p";
    if (_ringType === RingType.F) return "f";
    return "?";
};

const extractIsomer = (_isomer: Isomer): string => {
    if (_isomer === Isomer.D) return "d";
    if (_isomer === Isomer.L) return "l";
    return "?";
};

const extractAnomericity = (_anomericity: Anomericity): string => {
    if (_anomericity === Anomericity.ALPHA) return "α";
    if (_anomericity === Anomericity.BETA) return "β";
    return "?";
};

const extractMonosaccharideName = (_monoType: MonosaccharideType): string => {
    if (_monoType === MonosaccharideType.SixdAlt) {
        return "6dAlt";
    }
    if (_monoType === MonosaccharideType.SixdTal) {
        return "6dTal";
    }
    if (_monoType === MonosaccharideType.SixdGul) {
        return "6dGul";
    }
    if (_monoType === MonosaccharideType.dHexNAc) {
        return "HexNAc";
    }
    if (_monoType === MonosaccharideType.dHex) {
        return "Hex";
    }
    if (_monoType === MonosaccharideType.SixdAltNAc) {
        return "6dAltNac";
    }
    if (_monoType === MonosaccharideType.SixdGulNAc) {
        return "6dGulNAc";
    }
    if (_monoType === MonosaccharideType.SixdTalNAc) {
        return "6dTalNAc";
    }
    if (_monoType === MonosaccharideType.ddHex) {
        return "Hex";
    }
    return _monoType.name;
};

const extractSuperClass = (_monoType: MonosaccharideType): string => {

};