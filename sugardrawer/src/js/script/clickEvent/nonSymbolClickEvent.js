//@flow

"use strict";

import createjs from "createjs-easeljs";
import ReactDOM from "react-dom";
import {liaise} from "../index";
import React from "react";
import {modeType} from "../../react/modeType";
import NonSymbolContent from "../../react/horizonalUI/NonSymbolContent";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import SubstituentType from "sugar-sketcher/src/js/models/glycomics/dictionary/SubstituentType";
import toNumber from "lodash.tonumber";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";
import ModeCancelButton from "../../react/horizonalUI/ModeCancelButton";
import {clickContentModification} from "./contentClickCursor";

export const nonSymbolClickEvent = (e): void => {
    let target: createjs.text = e.target;

    if(target.id === "edge") {
        let params: Object = {
            anomericity: parseEdge(target.text, "anomericity"),
            donorPosition: [parseEdge(target.text, "donorPosition")],
            acceptorPosition: parseEdge(target.text, "acceptorPosition"),
            id: target.id
        };
        liaise.modeType = modeType.EDGE;
        liaise.newEdge = params;
    }
    if (target.id === "substituent") {
        //TODO: 取れていない
        liaise.modeType = modeType.MODIFICATION;
        liaise.newSubstituent = SubstituentType[target.value];
    }
    if (target.id === "root") {
        let params: Object = {
            anomericity: Anomericity.UNDEFINED,
            donorPosition: [DonorPosition.UNDEFINED],
            acceptorPosition: AcceptorPosition.UNDEFINED,
            id: target.id
        };
        liaise.modeType = modeType.EDGE;
        liaise.newEdge = params;
    }

    /*
    let elm: HTMLElement = document.querySelector("#selected");
    if (elm.children.length > 0) {
        elm.children[0].remove();
    }
     */

    //set current selection
    //currentSelectNode(target);

    //add to tool box
    addLastWord(target);

    //cancel button
    //addCancelButton();

    // add current select substituent at mouse cursor
    clickContentModification(e);
};

export const currentSelectNode = (_target: createjs.text) => {
    ReactDOM.render(
        <NonSymbolContent item={_target.text} value={_target.value} type={_target.id} width={50}/>,
        document.getElementById("selected")
    );
};

export const addLastWord = (_target: createjs.text): void => {
    if (isEmpty(filter(liaise.usedItems, {content: _target.text}))) {
        liaise.usedItems = {
            type: _target.id,
            content: _target.text,
            value: _target.value
        };
    }
};

const parseEdge = (_edge: string, _state: string): Object => {
    let items: Array<string> = _edge.split("");
    if (_state === "anomericity") {
        return parseAnomericity(items[0]);
    }
    if (_state === "acceptorPosition") {
        return parseAcceptorPosition(items[1]);
    }
    if (_state === "donorPosition") {
        return parseDonorPosition(items[3]);
    }
};

const parseAnomericity = (_anomericity: string): Anomericity => {
    if (_anomericity === "a") {
        return Anomericity.ALPHA;
    }
    if (_anomericity === "b") {
        return Anomericity.BETA;
    }
    return Anomericity.UNDEFINED;
};

const parseDonorPosition = (_donorPosition: string): AcceptorPosition => {
    if (_donorPosition !== "?") {
        return DonorPosition.prototype.getDonorPosition(toNumber(_donorPosition));
    }
    return DonorPosition.UNDEFINED;
};

const parseAcceptorPosition = (_acceptorPosition: string): DonorPosition => {
    if (_acceptorPosition !== "?") {
        return AcceptorPosition.prototype.getAcceptorPosition(toNumber(_acceptorPosition));
    }
    return AcceptorPosition.UNDEFINED;
};

const addCancelButton = (): void => {
    const cancel = () => {
        liaise.initSelectedParams();
        document.getElementById("modecontent").lastChild.innerText = "";
        document.getElementById("modecancel").innerText = "";
    };

    let cancelButton: HTMLElement = document.getElementById("modecancel");
    if (cancelButton !== null) {
        if (cancelButton.children.length !== 0) return;
    }

    // append mode cancel button
    ReactDOM.render(
        <ModeCancelButton onCancel={() => cancel()}/>,
        document.getElementById("modecancel")
    );
};