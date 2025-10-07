"use strict";

import {createSNFGSymbol} from "./createSNFGSymbol";
import createjs from "createjs-easeljs";
import {getColor} from "../data/getColor";
import {liaise} from "../index";
import {basicData} from "../data/graphicsData";
import {rollOut, rollOver} from "../clickEvent/nodeHoverEvent";
import {nodeClickPortal} from "../clickEvent/nodeClickPortal";
import {nodeModeSearch, nodeType} from "../../react/nodeModeSearch";
import {nodeModeType} from "../../react/nodeModeType";

export default class CreateMonosaccharideContainer {
    constructor() {}

    makeMonosaccharideConTainer (_nodeName) {
        let monoComp = new createjs.Container();
        monoComp.name = "monosaccharide";

        // make monosaccharide shape
        monoComp.addChild(createSNFGSymbol(_nodeName));

        switch (nodeType(nodeModeSearch(_nodeName))) {
            case nodeModeType.NOT_SELECTED: {
                monoComp.addChild(this.appendUndefNumber());
                break;
            }
            default: {
                // make isomer
                monoComp.addChild(this.appendIsomer());

                // make ring size
                monoComp.addChild(this.appendRingSize());
                break;
            }
        }

        // add event listener
        monoComp = this.appendEventListener(monoComp);

        return monoComp;
    }

    appendUndefNumber (_monoComp) {
        let jsNumber = new createjs.Text("", "13px serif", getColor("black"));

        const undefNode = liaise.undefNode;
        Object.keys(undefNode).forEach((index) => {
            if (undefNode[index].name === _monoComp.graphics.name) {
                jsNumber.text = parseInt(index) + 1;
            }
        });

        jsNumber.name = "number";
        jsNumber.textAlign = "center";
        jsNumber.textBaseline = "middle";

        return jsNumber;
    }

    appendRingSize () {
        //define ring type
        let jsRing = new createjs.Text("", basicData.isomerSize + "px serif", getColor("black"));
        jsRing.name = "ring";
        jsRing.textAlign = "left";
        jsRing.textBaseline = "middle";

        return jsRing;
    }

    appendIsomer () {
        //define isomer
        let jsIsomer = new createjs.Text("", basicData.isomerSize + "px serif", getColor("black"));
        jsIsomer.name = "isomer";
        jsIsomer.textAlign = "right";
        jsIsomer.textBaseline = "middle";

        return jsIsomer;
    }

    appendEventListener (_monoComp) {
        //add rollover event
        _monoComp.addEventListener("rollover", rollOver, false);

        //add rollout event
        _monoComp.addEventListener("rollout", rollOut, false);

        //add click event
        _monoComp.addEventListener("mousedown", nodeClickPortal, false);

        _monoComp.cache(-20, -20, 20 * 2, 20 * 2);

        return _monoComp;
    }
}