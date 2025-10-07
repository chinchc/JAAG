"use strict";

import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import {assingFreePosition} from "./assignFreePosition";
import createjs from "createjs-easeljs";
import {getColor} from "../data/getColor";
import {substituentClickPortal} from "../clickEvent/substituentClickPortal";
import {rollOutSubstituent, rollOverSubstituent} from "../clickEvent/nodeHoverEvent";

export default class CreateModificationNotation {

    constructor () {}

    makeNotationContainer (_glycan, _subLinkage) {
        let x = _subLinkage.sourceNode.x;
        let y = _subLinkage.sourceNode.y;
        let linkforMono = _subLinkage.donorPosition === DonorPosition.UNDEFINED ? "?" : _subLinkage.donorPosition.value;
        let subPos = assingFreePosition(_glycan, _subLinkage);

        let notation = "";
        notation += linkforMono;
        notation += _subLinkage.targetNode.substituentType.label;

        let subState = new createjs.Text(notation, 10+"px serif", getColor("black"));
        subState.name = "text";
        subState.textAlign = "center";
        subState.textBaseline = "middle";

        // make text area
        let textArea = new createjs.Shape();
        textArea.name = "textbox";
        textArea.graphics.beginFill(getColor("white"));
        const topEnd = 0 - subState.getMeasuredLineHeight() * .5;
        const rightEnd = 0 - subState.getMeasuredWidth() * .5;
        textArea.graphics.drawRect(rightEnd, topEnd, subState.getMeasuredWidth(), subState.getMeasuredLineHeight());

        // make substituent state container
        let subContainer = new createjs.Container();
        subContainer.name = `${_subLinkage.targetNode.id}_notation`;
        subContainer.x = subPos.x + x;
        subContainer.y = subPos.y + y;
        subContainer.addChild(textArea);
        subContainer.addChild(subState);

        subContainer.addEventListener("click", substituentClickPortal);

        subContainer.addEventListener("rollover", rollOverSubstituent);

        subContainer.addEventListener("rollout", rollOutSubstituent);

        return subContainer;
    }

    /*
    makeNotationContainer (_subLinkage, _glycan) {
        let substituentLayer = liaise.getLayer("substituent");
        if (substituentLayer === undefined) {
            substituentLayer = new createjs.Container();
            substituentLayer.name = "substituent";
            liaise.addStage(substituentLayer);
        }

        const sourceNode = _subLinkage.sourceNode;
        const targetNode = _subLinkage.targetNode;
        const subPos = assingFreePosition(_glycan, _subLinkage);

        let subState;

        substituentLayer.children.map( (substituent) => {
            if (substituent.name.indexOf(sourceNode.id) === -1) return;
            if (subPos.y > 0 && substituent.name.indexOf("up") !== -1) { // to upper
                subState = substituent;
            } else { // to lower
                subState = substituent;
            }
        });

        if (subState === undefined) {
            subState = new createjs.Text("", `${10}px serif`, getColor("black"));
            subState.reference = [];
            if (subPos.y > 0) {
                subState.name = `${_subLinkage.sourceNode.id}_notationUp`;
                subState.x = _subLinkage.sourceNode.x;
                subState.y = _subLinkage.sourceNode.y - 20;
            } else {
                subState.name = `${_subLinkage.sourceNode.id}_notationDown`;
                subState.x = _subLinkage.sourceNode.x;
                subState.y = _subLinkage.sourceNode.y + 20;
            }

            subState.addEventListener("rollover", function(e) {
                let target = e.target;
                target.color = getColor("red");
                target.font = "bold 14px serif";
                liaise.stageUpdate();
            });

            subState.addEventListener("rollout", function(e) {
                let target = e.target;
                target.color = getColor("black");
                target.font = "10px serif";
                liaise.stageUpdate();
            });

            subState.addEventListener("click", substituentClickPortal);
        }

        subState.textAlign = "center";
        subState.textBaseline = "middle";

        if (subState.text !== "") {
            subState.text = `${subState.text},${this.makeNotation(_glycan, _subLinkage)}`;
        } else {
            subState.text = this.makeNotation(_glycan, _subLinkage);
        }

        subState.reference.push(targetNode);
        substituentLayer.addChild(subState);
    }

    makeNotation (_glycan, _subLinkage) {
        let linkforMono = _subLinkage.donorPosition === DonorPosition.UNDEFINED ? "?" : _subLinkage.donorPosition.value;
        let notation = "";
        notation += linkforMono;
        notation += _subLinkage.targetNode.substituentType.label;

        return notation;
    }
     */
}