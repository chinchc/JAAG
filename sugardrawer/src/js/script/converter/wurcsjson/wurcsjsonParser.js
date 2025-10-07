//@flow

"use strict";

import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import MonosaccharideType from "sugar-sketcher/src/js/views/glycomics/dictionary/MonosaccharideType";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";

/**
 *
 * @param _jsonObj
 * @returns {null}
 */
export const json2glycan = (_jsonObj: Object): Glycan => {
    let nodeIndex: Object;

    try {
        // parse monosaccharide
        nodeIndex = parseMonosaccharide(_jsonObj.Monosaccharides);

        //
        let glycan: Glycan = new Glycan("g0", nodeIndex["m0"]);

        // parse edges
        const edges: Object = _jsonObj.Edges;
        Object.keys(edges).forEach(key => {
            const edge: Object = edges[key];
            glycan = parseEdges(edge, nodeIndex, glycan);
        }
        );

        return glycan;
    } catch (e) {
        console.log(e.message);
    }
};

/**
 *
 * @param _monosaccharides
 * @returns {Object}
 */
export const parseMonosaccharide = (_monosaccharides: Object): Object => {
    let ret: Object = {};

    Object.keys(_monosaccharides).forEach(key => {
        //id: random six charactor
        //monosaccharideType: Enum
        //anomericity: Enum
        //isomer: Enum
        //ringType: Enum
        const isomer: Isomer = parseIsomer(_monosaccharides[key].Configuration[0]);//TODO: 複数あるconfigurationにどう対応するか
        const ringType: RingType = parseRingType(_monosaccharides[key].RingSize);
        const anomericity: Anomericity = parseAnomericity(_monosaccharides[key].AnomState);
        const monosaccharideType: MonosaccharideType = parseMonosaccharideName(_monosaccharides[key].Notation);
        let node: Monosaccharide = new Monosaccharide(key, monosaccharideType, anomericity, isomer, ringType);
        ret[key] = node;
    }
    );

    return ret;
};

/**
 *
 * @param _edge
 * @param _index
 * @param _glycan
 * @returns {Glycan}
 */
export const parseEdges = (_edge: Object, _index: Object, _glycan: Glycan): void => {

    let donor: Monosaccharide = undefined;
    let acceptor: Monosaccharide = undefined;
    let acceptorPosition: AcceptorPosition = undefined;
    let donorPosition: DonorPosition = undefined;

    /*
        Acceptor m5
        Donor m6
        Position [object Object]
        Probability [object Object]
        LinkageType [object Object]
    */
    Object.keys(_edge).forEach(
        key => {
            switch (key) {
                case "Acceptor":
                    acceptor = _index[_edge[key]];
                    break;
                case "Donor":
                    donor = _index[_edge[key]];
                    break;
                case "Position":
                    //The special rule in SugarSketcher (probably this is typo):
                    // Donor is Acceptor, Acceptor is Donor
                    acceptorPosition = checkAcceptorPosition(_edge[key].Donor[0]);
                    donorPosition = checkDonorPosition(_edge[key].Acceptor[0]);
                    break;
                //case "Probability":
                //    console.log(key);
                //  break;
                //case "LinkageType":
                //    console.log(key);
                //  break;
            }
        }
    );

    if (acceptor === undefined || donor === undefined)
        throw new Error("Any monosaccharide is undefined.");
    if (acceptorPosition === undefined || donorPosition === undefined)
        throw new Error("Any position is undefined.");

    //define GlycosidicLinkage
    let linkage: GlycosidicLinkage =
        new GlycosidicLinkage(acceptor.getId()+"-"+donor.getId(), acceptor, donor, acceptorPosition, donorPosition);

    try {
        _glycan.addMonosaccharide(donor, linkage);
    } catch (e) {
        console.log(e.message);
    }

    return _glycan;
};

/**
 *
 * @param _ringType
 * @returns {number|UNDEFINED|{value}|modifiData.P|{bridgeBind, TrivalName, Name}|[string]|modifiData.F|{bridgeBind, TrivalName, Name}|string}
 */
const parseRingType = (_ringType: string): RingType => {
    if (_ringType === "p") return RingType.P;
    if (_ringType === "f") return RingType.F;
    if (_ringType === "o") return RingType.OPEN;
    if (_ringType === "?") return RingType.UNDEFINED;
};

/**
 *
 * @param _isomer
 * @returns {[string]|UNDEFINED|{value}|*}
 */
const parseIsomer = (_isomer: string): Isomer => {
    if (_isomer === "L") return Isomer.L;
    if (_isomer === "D") return Isomer.D;
    if (_isomer === "?") return Isomer.UNDEFINED;
};

/**
 *
 * @param _anomericState
 * @returns {UNDEFINED|{value}|number|*}
 */
const parseAnomericity = (_anomericState: string): Anomericity => {
    if (_anomericState === "a") return Anomericity.ALPHA;
    if (_anomericState === "b") return Anomericity.BETA;
    if (_anomericState === "?") return Anomericity.UNDEFINED;
};

/**
 *
 * @param _notation
 * @returns {MonosaccharideType}
 */
const parseMonosaccharideName = (_notation: string): MonosaccharideType => {
    let ret: MonosaccharideType = MonosaccharideType[_notation];

    if (ret === undefined) {
        throw new Error(`${_notation} is not support.`);
    }

    return ret;
};

/**
 *
 * @param _number
 * @returns {labels.UNDEFINED|{x, y}|UNDEFINED|{value}}
 */
const checkAcceptorPosition = (_number: number): AcceptorPosition => {
    if (_number === -1)
        return AcceptorPosition.UNDEFINED;
    return AcceptorPosition.prototype.getAcceptorPosition(_number);
};

/**
 *
 * @param _number
 * @returns {labels.UNDEFINED|{x, y}|UNDEFINED|{value}|*}
 */
const checkDonorPosition = (_number: number): DonorPosition => {
    if (_number === -1)
        return DonorPosition.UNDEFINED;
    return DonorPosition.prototype.getDonorPosition(_number);
};