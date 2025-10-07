//@flow
"use strict";

import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import createjs from "createjs-easeljs";
import {getColor} from "../data/getColor";
import {basicData} from "../data/graphicsData";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {clickEdge, rollOutEdge, rollOverEdge} from "../clickEvent/edgeMousePortal";
import { liaise } from "../index";

export default class CreateLinkage {

    constructor() {
    }

    makeEdgeContainer (_target: GlycosidicLinkage, _shapes: Object) {
        let edgeContainer = new createjs.Container();
        edgeContainer.name = `${_target.id}-edge`;

        // make linkage line
        edgeContainer.addChild(this._makeEdgeLine(_target, _shapes));

        // make linkage notation
        edgeContainer.addChild(this._makeEdgeNotation(_target, _shapes));

        edgeContainer.addEventListener("click", clickEdge, false);
        edgeContainer.addEventListener("rollover", rollOverEdge, false);
        edgeContainer.addEventListener("rollout", rollOutEdge, false);

        return edgeContainer;
    }

    _makeEdgeLine (_edge, _shapes) {
        //TODO: LinkageTypeをあつかうための情報が必要

        let acceptorX: number = _shapes[_edge.targetNode.id][0];
        let acceptorY: number = _shapes[_edge.targetNode.id][1];
        let donorX: number = _shapes[_edge.sourceNode.id][0];
        let donorY: number = _shapes[_edge.sourceNode.id][1];

        //calc position between donor and acceptor
        let line: createjs.Shape = new createjs.Shape();
        line.name = "line";
        line.graphics
            .beginStroke(getColor("black"))
            .setStrokeStyle(basicData.edgeSize)
            .moveTo(acceptorX, acceptorY)
            .lineTo(donorX, donorY);

        return line;
    }

    _makeEdgeNotation (_edge, _shapes) {
        let donorNode = _edge.targetNode;
        let anomericity = this._getAnomeriState(donorNode);
        let donorPos = _edge.donorPosition;

        //AcceptorPosition is donor side position
        //DonorPosition is acceptor side position

        // make position text
        let edgeInfo = "";
        edgeInfo += anomericity;
        edgeInfo += " ";
        edgeInfo += (donorPos === DonorPosition.UNDEFINED) ? "?" : donorPos.value;

        const sourceY: number = _shapes[_edge.source][1];
        const targetY: number = _shapes[_edge.target][1];
        let edgeState = new createjs.Text(edgeInfo, basicData.linkageSize + "px serif", getColor("black"));
        edgeState.name = "linkPos";
        edgeState.textAlign = "center";
        edgeState.textBaseline = (sourceY !== targetY) ? "middle" : "top";

        // make text area
        let textArea = new createjs.Shape();
        textArea.name = "textbox";
        textArea.graphics.beginFill(getColor("white"));
        const baseLine = this._assignTextboxBaseLine(edgeState);
        textArea.graphics.drawRect(baseLine.leftEnd, baseLine.topEnd, edgeState.getMeasuredWidth(), edgeState.getMeasuredLineHeight());

        // make edge container
        let pos = this._calcXYLinkageLabel(_edge, _shapes, edgeState);
        let edgeNotationComponent = new createjs.Container();
        edgeNotationComponent.name = `${_edge.id}-notation`;
        edgeNotationComponent.x = pos[0];
        edgeNotationComponent.y = pos[1];
        edgeNotationComponent.addChild(textArea);
        edgeNotationComponent.addChild(edgeState);

        // modify top position
        this._modifyPosition(edgeNotationComponent, _edge, _shapes);

        return edgeNotationComponent;
    }

    updateLinkage (_edge: GlycosidicLinkage, _shapes: Object) {
        let anomericity = this._getAnomeriState(_edge.targetNode);
        let donorPos: DonorPosition = _edge.donorPosition;

        //AcceptorPosition is donor side position
        //DonorPosition is acceptor side position

        let edgeInfo: string = "";
        edgeInfo += anomericity;
        edgeInfo += " ";
        edgeInfo += (donorPos === DonorPosition.UNDEFINED) ? "?" : donorPos.value;

        // update linkage position notation
        // edge.children[1] -> edgeComponent
        // edgeComponent[0] -> line
        // edgeComponent[1] -> edgeNotationComponent

        let edgeNotationComponent: createjs.Container = _edge.children[0].children[1];

        // for edge text
        let edgeState: createjs.Text = edgeNotationComponent.children[1];
        const sourceY: number = _shapes[_edge.source][1];
        const targetY: number = _shapes[_edge.target][1];
        edgeState.text = edgeInfo;
        edgeState.textBaseline = (sourceY !== targetY) ? "middle" : "top";

        // for edge text-box
        let edgeTextBox: createjs.Shape = edgeNotationComponent.children[0];
        const baseLine = this._assignTextboxBaseLine(edgeState);
        edgeTextBox
            .graphics
            .clear()
            .beginFill(getColor("white"))
            .drawRect(baseLine.leftEnd, baseLine.topEnd, edgeState.getMeasuredWidth(), edgeState.getMeasuredLineHeight());

        // modify top position
        this._modifyPosition(edgeNotationComponent, _edge, _shapes);

        return _edge;
    }

    updateFragmentRootLinkage () {
        let anomericity: string = "?";
        let donorPos: string = "?";

        if (liaise.newEdge.anomericity === Anomericity.ALPHA) {
            anomericity = "α";
        }
        if (liaise.newEdge.anomericity === Anomericity.BETA) {
            anomericity = "β";
        }

        if (liaise.newEdge.donorPosition !== DonorPosition.UNDEFINED) {
            donorPos = liaise.newEdge.donorPosition[0].value;
        }

        // update linkage notation
        liaise.canvasEdge.parent.children.map( (child) => {
            if (child.name === "label") {
                child.text = `${anomericity} ${donorPos}`;
            }
        });
    }

    _getAnomeriState (_node: Monosaccharide) {
        const anomericity = _node.anomericity;
        if (anomericity === Anomericity.ALPHA) return "α";
        if (anomericity === Anomericity.BETA) return "β";
        return "?";
    }

    _calcXYLinkageLabel (_edge: GlycosidicLinkage, _shapes: Object) {
        const donor: Monosaccharide = _edge.targetNode;
        const acceptor: Monosaccharide = _edge.sourceNode;

        let donorX: number = _shapes[donor.id][0];
        let donorY: number = _shapes[donor.id][1];
        let acceptorX: number = _shapes[acceptor.id][0];
        let acceptorY: number = _shapes[acceptor.id][1];

        let usualX: number = (donorX + acceptorX) * .5;
        let usualY: number = (donorY + acceptorY) * .5;

        let posX: number = usualX;
        let posY: number = usualY;

        return [posX, posY];
    }

    _assignTextboxBaseLine (_edgeState) {
        let ret = {
            topEnd: 0 - _edgeState.getMeasuredLineHeight(),
            leftEnd: 0 - _edgeState.getMeasuredWidth() * .5
        };

        if (_edgeState.textBaseline === "middle") {
            ret.topEnd = ret.topEnd + 5;
        } else {
            ret.topEnd = 0 - _edgeState.getMeasuredLineHeight() * .06125;
        }

        return ret;
    }

    _modifyPosition (_edgeNotationComponent) {
        let edgeState = _edgeNotationComponent.children[1];

        if (edgeState.textBaseline === "middle") {
            _edgeNotationComponent.y = _edgeNotationComponent.y + 3;
        } else {
            _edgeNotationComponent.y = _edgeNotationComponent.y + 3;
        }

        return _edgeNotationComponent;
    }
}