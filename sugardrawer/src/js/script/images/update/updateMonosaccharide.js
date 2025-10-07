//@flow
"use strict";

import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import {SNFGSymbolGlycan} from "../../data/SNFGGlycanTable";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import {liaise} from "../../index";

export const updateMonosaccharide = (_node: Monosaccharide) => {
    //TODO: シンボルを直接置き換える処理を考える

    return _node;
};

export const updateIsomer = (_node: Monosaccharide): Monosaccharide => {
    //isomer
    const snfgDict: SNFGSymbolGlycan = SNFGSymbolGlycan[_node.monosaccharideType.name];
    let isomer: createjs.Text = extractChild("isomer", _node.children[0].children);
    if (_node.isomer !== Isomer.UNDEFINED && snfgDict.isomer !== _node.isomer.name) {
        isomer.text = _node.isomer.name;//.toLowerCase();
    } else {
        isomer.text = "";
    }
    _node.children[0].updateCache();
    liaise.stageUpdate();

    return _node;
};

export const updateRingType = (_node: Monosaccharide): Monosaccharide => {
    //ring type
    const snfgDict: SNFGSymbolGlycan = SNFGSymbolGlycan[_node.monosaccharideType.name];
    let ring: createjs.Text = extractChild("ring", _node.children[0].children);
    if (_node.ringType !== RingType.UNDEFINED && snfgDict.ring !== _node.ringType.name) {
        if (_node.ringType === RingType.OPEN) {
            ring.text = "o";
        } else {
            ring.text = _node.ringType.name.toLowerCase();
        }
    } else {
        ring.text = "";
    }
    _node.children[0].updateCache();
    liaise.stageUpdate();

    return _node;
};

const extractChild = (_key: string, _children: Array<Object>): Object => {
    let ret: Object;
    _children.map(function (child: Object) {
        if (_key === child.name) ret = child;
    });

    return ret;
};