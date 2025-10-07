//@flow
"use strict";

import createjs from "createjs-easeljs";
import {getColor} from "../data/getColor";
import {basicData} from "../data/graphicsData";
import {liaise} from "../index";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {fragmentIDsClickPortal} from "../clickEvent/fragmentIDsClickPortal";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";

export default class CreateFragmentID {
    constructor() {}

    drawFragmentIDs (): void {
        let fragmentIDs: createjs.Container = liaise.getLayer("fragmentIDs");

        // remove all fragment ids
        fragmentIDs.children.slice(0, fragmentIDs.children.length).map( (child) => {
            if (child.name === "bracket") return;
            fragmentIDs.removeChild(child);
        });

        let count: number = 1;
        liaise.subGraph.map( (subGraph) => {
            //if (subGraph.parentNodeIDs.length === liaise.coreGraph.graph.nodes().length) return;
            if (subGraph.parentNodeIDs.length === this._countCoreMonosaccharide(liaise.coreGraph)) return;

            this._drawFragmentID(subGraph, count);
            count++;
        });
    }

    _drawFragmentID (_subGraph: Glycan, _id: number): void {
        // fragments side
        const fragID: createjs.Text = this._makeFragmentIDComponent(_subGraph.getRootNode(), `*${_id}`);
        liaise.getLayer("fragmentIDs").addChild(fragID);

        // core side
        _subGraph.parentNodeIDs.map( (parentID) => {
            const coreNode: Monosaccharide = liaise.coreGraph.getNodeById(parentID);
            const fragIDCoreSide: createjs.Text = this._makeFragmentIDComponent(coreNode, `*${_id}`);
            // append event listener
            this._appendEventListenrer(fragIDCoreSide);
            liaise.getLayer("fragmentIDs").addChild(fragIDCoreSide);
        });
    }

    _makeFragmentIDComponent (_node: Monosaccharide, _currentID: string): createjs.Text {
        let fragID: createjs.Text = undefined;
        let label: string = undefined;

        // check have any fragment ids
        liaise.getLayer("fragmentIDs").children.map( (child) => {
            if (child.name !== _node.id) return;
            fragID = child;
            label = child.text;
        });

        if (fragID === undefined) {
            label = `${_currentID}`;
            fragID = new createjs.Text(label, basicData.linkageSize + "px serif", getColor("black"));
            fragID.name = _node.id;
            fragID.textAlign = "center";
            fragID.textBaseline = "top";
        } else {
            label += label.includes(_currentID) ? "" : `${_currentID}`;
            fragID.text = label;
        }

        fragID = this.assignFragmentIDPosition(_node, fragID);

        return fragID;
    }


    assignFragmentIDPosition (_node: Monosaccharide, _fragID: createjs.Text): createjs.Text {
        if (_node.parent.id.indexOf("fragments") !== -1) {
            _fragID.x = _node.x + 45;
            _fragID.y = _node.y - 12;
        }

        if (_node.parent.id === "Glycan") {
            _fragID.x = _node.x;
            _fragID.y = _node.y - 30;
        }

        return _fragID;
    }

    _appendEventListenrer (_fragID: createjs.Text): createjs.Text {
        _fragID.addEventListener("rollover", function(e) {
            let target = e.target;
            target.color = getColor("red");
            target.font = "bold 14px serif";
            liaise.stageUpdate();
        });

        _fragID.addEventListener("rollout", function(e) {
            let target = e.target;
            target.color = getColor("black");
            target.font = "11px serif";
            liaise.stageUpdate();
        });

        _fragID.addEventListener("mousedown", fragmentIDsClickPortal, false);

        return _fragID;
    }

    _countCoreMonosaccharide (_coreGraph: Glycan): number {
        let ret: number = 0;

        _coreGraph.graph.nodes().map( (node) => {
            if (node instanceof Substituent) return;
            ret++;
        });

        return ret;
    }

}