//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import { assignMonosaccharide } from "./assignMonosaccharide";
import {assignEdges} from "./assignEdges";
import {Glycan} from "../../../class/Glycan";
import {Glycobond} from "../../../class/Glycobond";
import {Sugar} from "../../../class/Sugar";
import {assignBridge} from "./assignBridge";
import {Bridge} from "../../../class/Bridge";
import { BridgeEdge } from "../../../class/BridgeEdge";
import {assignRepeat} from "./assignRepeat";
import {RepeatBracket} from "../../../class/RepeatBracket";
import {Fragment} from "../../../class/Fragment";
import {FragmentBracket} from "../../../class/FragmentBracket";
import {assignFragment} from "./assignFragment";
import {Cyclic} from "../../../class/Cyclic";

export const assignMain = (json: Object) => {
    let keys: Array<string> = Object.keys(json);
    //Json のkeyをまとめるための変数郡
    let monosaccharide_key: string = "";
    let edges_key: string = "";
    let repeat_key: string = "";
    let fragment_key: string = "";
    let bridge_key: string = "";

    let monosaccharideObj: Object = {};
    let edgeObj: Object = {};
    let bridgeObj: Object = {};
    let repeatObj: Object = {};
    let fragmentObj: Object = {};
    for(let key: string of keys) {
        switch(key.toLowerCase()) {
            case JSONKeys.Monosaccharides.toLowerCase(): {
                monosaccharide_key = key;
                break;
            }
            case JSONKeys.Edges.toLowerCase(): {
                edges_key = key;
                break;
            }
            case JSONKeys.Repeat.toLowerCase(): {
                repeat_key = key;
                break;
            }
            case JSONKeys.Fragments.toLowerCase(): {
                fragment_key = key;
                break;
            }
            case JSONKeys.Bridge.toLowerCase(): {
                bridge_key = key;
                break;
            }
        }
    }
    let glycanArray: Array<Glycan> = [];
    monosaccharideObj = assignMonosaccharide(json[monosaccharide_key], monosaccharideObj);
    edgeObj = assignEdges(json[edges_key], edgeObj);
    let mainGlycan: Glycan = combineMonoEdge(monosaccharideObj, edgeObj);
    glycanArray.push(mainGlycan);
    bridgeObj = assignBridge(json[bridge_key], bridgeObj);
    combineBridgeGlycan(monosaccharideObj, bridgeObj);
    repeatObj = assignRepeat(json[repeat_key], repeatObj);
    combineRepeat(monosaccharideObj, repeatObj);
    glycanArray = setFragment(monosaccharideObj, glycanArray);
    let nonReductionObj: Object = checkNonReductionSugars(glycanArray);
    fragmentObj = assignFragment(json[fragment_key], fragmentObj);
    checkFragmentParentType(nonReductionObj, fragmentObj, monosaccharideObj);
    setGlycanData(glycanArray);
    setFragmentData(glycanArray, monosaccharideObj, fragmentObj);
    console.log(mainGlycan);

    return glycanArray;




};

const combineMonoEdge = (monoObj: Object, edgeObj: Object): Glycan => {
    let glycan: Glycan = new Glycan();
    glycan.setRootNode(monoObj["m0"]);
    monoObj["m0"].setGlycan(glycan);
    for(let edge_key: string of Object.keys(edgeObj)) {
        let bind: Glycobond = edgeObj[edge_key];
        let parentSugar: Sugar = monoObj[bind.jsonParentId];
        let childSugar: Sugar = monoObj[bind.jsonChildId];
        parentSugar.setChildSugars(childSugar);
        childSugar.setParentSugars(parentSugar);
        childSugar.setParentBond(bind);
        bind.setChildAnomeric(childSugar.getAnomeric());
        bind.setParentSugar(parentSugar);
        bind.setChildSugar(childSugar);
        let linktype: string = childSugar.getAnomeric();
        for(let parentPosition: number of bind.getSvgParentPosition()) {
            linktype += String(parentPosition) + "/";
        }
        bind.setLinkageType(" " + linktype.slice(0, -1));
    }
    return glycan;
};

const combineBridgeGlycan = (monoObj: Object, bridgeObj: Object) => {
    for(let b_key: string of Object.keys(bridgeObj)) {
        let parentSugar: Sugar = monoObj[bridgeObj[b_key].Acceptor];
        let childSugar: Sugar = monoObj[bridgeObj[b_key].Donor];
        let glycobond: Glycobond = new Glycobond();
        let FLAG = false;
        for(let child: Sugar of parentSugar.getChildSugars()) {
            if(child === childSugar) {
                FLAG = true;
                for(let bind: Glycobond of child.getParentBond()) {
                    if(bind.getParentSugar() === parentSugar) {
                        glycobond = bind;
                    }
                }
            }
        }
        if(!FLAG) alert("BridgeError!!");
        let bridge: Bridge = new Bridge();
        let bridgeEdge: BridgeEdge = new BridgeEdge();
        bridge.setParentSugar(parentSugar);
        if(bridgeObj[b_key].dataNoatation === "Undefined") {
            bridge.setName(bridgeObj[b_key].Notation);
        }
        else {
            bridge.setName(bridgeObj[b_key].dataNoatation);
        }
        bridge.setEdge(bridgeEdge);
        bridgeEdge.setParentSugar(parentSugar);
        bridgeEdge.setChildSugar(childSugar);
        bridgeEdge.setLinkageType(glycobond.getLinkageType());
        bridgeEdge.setChildAnomeric(glycobond.getChildAnomeric());
        bridgeEdge.setChildPosition(glycobond.getChildPosition());
        bridgeEdge.setParentPositon(glycobond.getParentPosition());
        parentSugar.setChildBridge(bridge);
    }
};

const combineRepeat = (monoObj: Object, repeatObj: Object) => {
    for(let re_key: string of Object.keys(repeatObj)) {
        if(repeatObj[re_key] === "childCyclic") {
            let cyclic: Cyclic = new Cyclic();
            cyclic.setReductionSugar(monoObj[repeatObj[re_key].Start]);
            cyclic.setNonReductionSugar(monoObj[repeatObj[re_key].End]);
            monoObj[repeatObj[re_key].End].setChildCyclic(cyclic);
            monoObj[repeatObj[re_key].Start].setParentCyclic(cyclic);
        }
        else {
            let repeatBracket: RepeatBracket = new RepeatBracket();
            let startSugar: Sugar = monoObj[repeatObj[re_key].Start];
            let endSugar: Sugar = monoObj[repeatObj[re_key].End];
            repeatBracket.setStartSugar(startSugar);
            repeatBracket.setEndSugar(endSugar);
            repeatBracket.setReepatNumber(repeatObj[re_key].numOfRepeat);
            startSugar.setRepeatBracket(repeatBracket);
        }
    }
};

const setFragment = (monoObj: Object, glycanArray: Array<Glycan>) => {
    let mainGlycan: Glycan = glycanArray[0];
    for(let key: string of Object.keys(monoObj)) {
        if(monoObj[key] === mainGlycan.getRootNode()) continue;
        else {
            if(!monoObj[key].hasParentSugars()) {
                let fragment: Fragment = new Fragment();
                fragment.setRootNode(monoObj[key]);
                glycanArray.push(fragment);
            }
        }
    }

    return glycanArray;
};

const checkNonReductionSugars = (glycanArray: Array<Glycan>): Object => {
    let resultObj: Object = {};
    for(let glycan: Glycan of glycanArray) {
        resultObj[glycan] =recuversiveCheck(glycan.getRootNode(), []);
    }
    return resultObj;

};

const recuversiveCheck = (sugar: Sugar, nonSugars: Array<Sugar>): Array<Sugar> => {
    if(sugar.hasChildSugars()) {
        if(sugar.isChildCyclicEmpty()) {
            for(let child: Sugar of sugar.getChildSugars()) {
                nonSugars = recuversiveCheck(child, nonSugars);
            }
        }
        else {
            for(let child: Sugar of sugar.getChildSugars()) {
                if(sugar.getChildCyclic().getReductionSugar() === child) continue;
                else nonSugars = recuversiveCheck(child, nonSugars);
            }
        }
    }
    else {
        nonSugars.push(sugar);
        return nonSugars;
    }
    return nonSugars;
};

const checkFragmentParentType = (nonReductionObj: Object, fragmentObj: Object, monoObj: Object) => {
    for(let key: string of Object.keys(fragmentObj)) {
        fragmentObj[key].checkParent(nonReductionObj, monoObj);
    }
};

const setGlycanData = (glycanArray: Array<Glycan>) => {
    for(let glycan: Glycan of glycanArray) {
        recuversiveSetGlycanData(glycan.getRootNode(), glycan);
    }
};

const recuversiveSetGlycanData = (sugar: Sugar, glycan: Glycan) => {
    sugar.setGlycan(glycan);
    if(sugar.hasChildSugars()) {
        if(sugar.isChildCyclicEmpty()) {
            for(let child: Sugar of sugar.getChildSugars()) {
                recuversiveSetGlycanData(child, glycan);
            }
        }
        else {
            for(let child: Sugar of sugar.getChildSugars()) {
                if(sugar.getChildCyclic().getReductionSugar() === child) continue;
                else recuversiveSetGlycanData(child, glycan);
            }
        }
    }
};

const setFragmentData = (glycanArray: Array<Glycan>, monoObj: Object, fragmentObj: Object) => {
    for(let key: string of Object.keys(fragmentObj)) {
        let fragmentBracket: FragmentBracket;
        if(fragmentObj[key].ParentIsGlycan) {
            console.log("test", monoObj[fragmentObj[key].Acceptor[0]].getGlycan().isFragmentBracketEmpty());
            if(monoObj[fragmentObj[key].Acceptor[0]].getGlycan().isFragmentBracketEmpty()) {
                fragmentBracket = new FragmentBracket();
                fragmentBracket.setParentGlycan(monoObj[fragmentObj[key].Acceptor[0]].getGlycan());
                monoObj[fragmentObj[key].Acceptor[0]].getGlycan().setFragmentBracket(fragmentBracket);
            }
            else {
                fragmentBracket = monoObj[fragmentObj[key].Acceptor[0]].getGlycan().getFragmentBracket();
            }
            fragmentBracket.setChildGlycans(monoObj[fragmentObj[key].Donor].getGlycan());
            monoObj[fragmentObj[key].Donor].getGlycan().setParentFragmentBracket(fragmentBracket);
        }
        else {
            if(monoObj[fragmentObj[key].Acceptor[0]].isFragmentBracketEmpty()) {
                fragmentBracket = new FragmentBracket();
                fragmentBracket.isResuctionSugar = true;
                for(let monoId: string of fragmentObj[key].Acceptor) {
                    fragmentBracket.setParentSugars(monoObj[monoId]);
                    monoObj[monoId].setFragmentBracket(fragmentBracket);
                }
            }
            else {
                fragmentBracket = monoObj[fragmentObj[key].Acceptor[0]].getFragmentBracket();
            }
            fragmentBracket.setChildGlycans(monoObj[fragmentObj[key].Donor].getGlycan());
            monoObj[fragmentObj[key].Donor].getGlycan().setParentFragmentBracket(fragmentBracket);
        }
    }
};