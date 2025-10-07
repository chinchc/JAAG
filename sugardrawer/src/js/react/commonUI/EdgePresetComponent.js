//@flow
"use strict";

import EdgeStatusStacker from "../../script/util/EdgeStatusStacker";
import {liaise} from "../../script";
import {Button} from "semantic-ui-react";
import React from "react";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {startUpdate} from "../../script/images/update/updateCanvas";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import CreateLinkage from "../../script/createBind/CreateLinkage";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export default class EdgePresetComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectItem: ""
        };

        this.onClickMenuEvent = this.onClickMenuEvent.bind(this);
    }

    onClickMenuEvent (e) {
        const value: string = e.target.value;
        this.setState({selectItem: value});
        let values: Array<string> = value.split("");
        const anom: string = values[0];
        const donor: string = values[1];
        const acceptor: string = values[3];
        const creLin: Object = new CreateLinkage();

        // root symbol
        if (liaise.canvasEdge.name === "root") {
            liaise.actionUndoRedo.setNode();
            let currentGraph: Glycan = liaise.canvasEdge.parent;

            if (anom === "α") {
                currentGraph.getRootNode().anomericity = Anomericity.ALPHA;
            } else if (anom === "β") {
                currentGraph.getRootNode().anomericity = Anomericity.BETA;
            } else {
                currentGraph.getRootNode().anomericity = Anomericity.UNDEFINED;
            }

            // update parentEdge status
            if (currentGraph.id.indexOf("fragments") !== -1) {
                if (!isNaN(donor)) {
                    currentGraph.parentEdge.acceptorPosition = AcceptorPosition.prototype.getAcceptorPosition(Number(donor));
                } else {
                    currentGraph.parentEdge.acceptorPosition = AcceptorPosition.UNDEFINED;
                }

                if (!isNaN(acceptor)) {
                    currentGraph.parentEdge.donorPosition = DonorPosition.prototype.getDonorPosition(Number(acceptor));
                } else {
                    currentGraph.parentEdge.donorPosition = DonorPosition.UNDEFINED;
                }
            }

            liaise.canvasEdge.children.map( (child) => {
                if (child.name !== "root-notation") return;
                //if (child.name !== "label") return;
                child.children.map( (notationChild) => {
                    if (notationChild.name !== "label") return;
                    notationChild.text = `${anom} ${acceptor}`;
                });
            });

            liaise.newGraph = startUpdate(currentGraph);
            liaise.stageUpdate();

            this.forceUpdate();

            return;
        }

        // Glycosidic-Linkage
        if (liaise.canvasEdge.name.match(/.+-edge/).length > 0) {
            // parent1: GlycosidicLinkage
            // parent2: Glycan
            let currentLinkage: GlycosidicLinkage = liaise.canvasEdge.parent;
            let currentGraph: Glycan = currentLinkage.parent;
            let shapes: Object = liaise.getNewShapes(currentGraph);
            let treeData: Object = liaise.getNewTreeData(currentGraph);

            liaise.actionUndoRedo.setNode();

            if (anom === "α") {
                currentLinkage.targetNode.anomericity = Anomericity.ALPHA;
            } else if (anom === "β") {
                currentLinkage.targetNode.anomericity = Anomericity.BETA;
            } else {
                currentLinkage.targetNode.anomericity = Anomericity.UNDEFINED;
            }

            if (!isNaN(donor)) {
                currentLinkage.acceptorPosition = AcceptorPosition.prototype.getAcceptorPosition(Number(donor));
            } else {
                currentLinkage.acceptorPosition = AcceptorPosition.UNDEFINED;
            }

            if (!isNaN(acceptor)) {
                currentLinkage.donorPosition = DonorPosition.prototype.getDonorPosition(Number(acceptor));
            } else {
                currentLinkage.donorPosition = DonorPosition.UNDEFINED;
            }

            //recalculate monosaccharide positions
            let visFunc = new visFunction();
            rootPos.posX = shapes.root[0];
            rootPos.posY = shapes.root[1];

            // modify core side monosaccharide position
            shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];
            liaise.setNewShapes(currentGraph, shapes);

            // Represent linkage position in selected edge
            creLin.updateLinkage(currentLinkage, shapes);

            // update core position
            startUpdate(currentGraph);

            liaise.newGraph = currentGraph;
            liaise.stageUpdate();

            this.forceUpdate();
        }
    }

    render () {
        const edgeStacker: EdgeStatusStacker = new EdgeStatusStacker();
        edgeStacker.start(liaise.canvasEdge);

        const contentStyle: Object = {
            style : {
                display: "flex",
                alignItems: "center",
                alignContent: "space-around",
                justifyContent: "space-around",
                width: "400px",
                flexWrap: "wrap",
                margin: "5px"
            }
        };

        let items: Array<HTMLElement> = [];
        edgeStacker.makeEdges().map( (edge, index) => {
            items.push(
                <Button key={index} size={"tiny"} name={"edge"} value={edge} onClick={this.onClickMenuEvent}>{edge}</Button>
            );
        });

        return (
            <div {...contentStyle}>
                {items}
            </div>
        );
    }
}