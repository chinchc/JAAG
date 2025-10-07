//@flow
"use strict";

import CreateLinkage from "../../script/createBind/CreateLinkage";
import {liaise} from "../../script";
import GlycosidicLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/GlycosidicLinkage";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import {startUpdate} from "../../script/images/update/updateCanvas";
import {Form} from "semantic-ui-react";
import React from "react";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import EdgeStatusStacker from "../../script/util/EdgeStatusStacker";

export default class EdgeFormComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};

        this.onClickMenuEvent = this.onClickMenuEvent.bind(this);
    }

    onClickMenuEvent (e) {
        const name: string = e.target.name;
        const creLin: Object = new CreateLinkage();

        switch(name) {
            case "carbon" : {
                liaise.actionUndoRedo.setNode();

                if (liaise.canvasEdge.name === "root") {
                    let anomericState: string = "";
                    if (Anomericity[e.target.value] === Anomericity.ALPHA) {
                        anomericState = "α";
                    } else if (Anomericity[e.target.value] === Anomericity.BETA) {
                        anomericState = "β";
                    } else {
                        anomericState = "?";
                    }

                    let glycan: Glycan = liaise.canvasEdge.parent;
                    glycan.getRootNode().anomericity = Anomericity[e.target.value];
                    liaise.canvasEdge.children.map( (child) => {
                        if (child.name !== "root-notation") return;
                        child.children.map( (notationChild) => {
                            if (notationChild.name !== "label") return;
                            let text: string = notationChild.text;
                            notationChild.text = text.replace(text[0], anomericState);
                        });
                    });

                    liaise.stageUpdate();
                    break;
                }

                if (liaise.canvasEdge.name.match(/.+-edge/).length > 0) {
                    let currentEdge: GlycosidicLinkage = liaise.canvasEdge.parent;
                    let currentGraph: Glycan = currentEdge.parent;
                    let shapes: Object = liaise.getNewShapes(currentGraph);

                    currentEdge.targetNode.anomericity = Anomericity[e.target.value];

                    // update position
                    currentGraph = startUpdate(currentGraph);

                    // Represent linkage position in selected edge
                    creLin.updateLinkage(currentEdge, shapes);
                    liaise.newGraph = currentGraph;

                    liaise.stageUpdate();
                    break;
                }

                break;
            }
            case "donor" : { // target linkage position in SugarSketcher
                liaise.actionUndoRedo.setNode();

                if (liaise.canvasEdge.name === "root") {
                    let currentEdge: GlycosidicLinkage = liaise.canvasEdge.parent;
                    currentEdge.acceptorPosition = AcceptorPosition[e.target.value];
                    liaise.stageUpdate();
                    break;
                }

                if (liaise.canvasEdge.name.match(/.+-edge/).length > 0) {
                    let currentGraph: Glycan = liaise.canvasEdge.parent;
                    if (currentGraph.id.indexOf("fragments") !== -1) {
                        if (!isNaN(e.target.value)) {
                            currentGraph.parentEdge.acceptorPosition = AcceptorPosition[e.target.value];
                        } else {
                            currentGraph.parentEdge.acceptorPosition = AcceptorPosition.UNDEFINED;
                        }
                    } else {
                        //TODO: rootのアノマー位置を変更する方法、今はedgeで定義するため情報をもつことがない
                    }
                    liaise.newGraph = currentGraph;

                    liaise.stageUpdate();
                    break;
                }
                break;
            }
            case "acceptor" : { // source linkage position in SugarSkecther
                liaise.actionUndoRedo.setNode();

                if (liaise.canvasEdge.name === "root") {
                    // for root side
                    let currentGraph: Glycan = liaise.canvasEdge.parent;

                    if (currentGraph.id.indexOf("fragments") !== -1) {
                        let position: string = "?";

                        // update parentEdge for fragments
                        if (e.target.value !== "UNDEFINED") {
                            currentGraph.parentEdge.donorPosition = DonorPosition[e.target.value];
                            position = DonorPosition[e.target.value].value;
                        } else {
                            currentGraph.parentEdge.donorPosition = DonorPosition.UNDEFINED;
                            position = "?";
                        }

                        // update linkage label for fragments
                        liaise.canvasEdge.children.map( (child) => {
                            if (child.name !== "root-notation") return;
                            child.children.map( (notationChild) => {
                                if (notationChild.name !== "label") return;
                                notationChild.text = notationChild.text.slice(0, -1) + position;
                            });
                        });
                        /*
                        liaise.canvasEdge.parent.children.map((child) => {
                            if (child.name === "label") {
                                child.text = child.text.slice(0, -1) + position;
                            }
                        });
                         */
                    }

                    liaise.stageUpdate();
                    break;
                }

                if (liaise.canvasEdge.name.match(/.+-edge/).length > 0) {
                    let currentEdge: GlycosidicLinkage = liaise.canvasEdge.parent;
                    let currentGraph: Glycan = currentEdge.parent;
                    let shapes: Object = liaise.getNewShapes(currentGraph);
                    let treeData: Object = liaise.getNewTreeData(currentGraph);

                    currentEdge.donorPosition = DonorPosition[e.target.value];

                    //recalculate monosaccharide positions
                    let visFunc = new visFunction();
                    rootPos.posX = shapes.root[0];
                    rootPos.posY = shapes.root[1];

                    shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];
                    liaise.setNewShapes(currentGraph, shapes);

                    // update position
                    currentGraph = startUpdate(currentGraph);

                    // Represent linkage position in selected edge
                    creLin.updateLinkage(currentEdge, shapes);

                    liaise.newGraph = currentGraph;
                    liaise.setNewTreeData(currentGraph, treeData);
                    liaise.stageUpdate();
                    break;
                }
                break;
            }
            case "linkagetype" : {
                break;
            }
            default : {
                break;
            }
        }

        this.forceUpdate();
    }

    render () {

        const edgeStacker: EdgeStatusStacker = new EdgeStatusStacker();
        edgeStacker.start(liaise.canvasEdge);

        return(
            <Form>
                <Form.Group>
                    <label>Anomeric carbon</label>
                    <Form.Field
                        label={"?"}
                        type={"radio"}
                        control={"input"}
                        name={"carbon"}
                        value={"UNDEFINED"}
                        checked={edgeStacker.carbon === Anomericity.UNDEFINED}
                        onChange={this.onClickMenuEvent}
                    />
                    <Form.Field
                        label={"α"}
                        type={"radio"}
                        control={"input"}
                        name={"carbon"}
                        value={"ALPHA"}
                        checked={edgeStacker.carbon === Anomericity.ALPHA}
                        onChange={this.onClickMenuEvent}
                        disabled={edgeStacker.canOperateAnom === false}
                    />
                    <Form.Field
                        label={"β"}
                        type={"radio"}
                        control={"input"}
                        name={"carbon"}
                        value={"BETA"}
                        checked={edgeStacker.carbon === Anomericity.BETA}
                        onChange={this.onClickMenuEvent}
                        disabled={edgeStacker.canOperateAnom === false}
                    />
                </Form.Group>

                <Form.Group>
                    <label>Anomeric position</label>
                    <Form.Field
                        label={"?"}
                        type={"radio"}
                        control={"input"}
                        name={"donor"}
                        value={"UNDEFINED"}
                        checked={edgeStacker.donor === AcceptorPosition.UNDEFINED}
                        onChange={this.onClickMenuEvent}
                    />
                    <Form.Field
                        label={"1"}
                        type={"radio"}
                        control={"input"}
                        name={"donor"}
                        value={"ONE"}
                        checked={edgeStacker.donor === AcceptorPosition.ONE}
                        onChange={this.onClickMenuEvent}
                        disabled={edgeStacker.usableDonorPos === 2 || edgeStacker.canOperateDonor === false}
                    />
                    <Form.Field
                        label={"2"}
                        type={"radio"}
                        control={"input"}
                        name={"donor"}
                        value={"TWO"}
                        checked={edgeStacker.donor === AcceptorPosition.TWO}
                        onChange={this.onClickMenuEvent}
                        disabled={edgeStacker.usableDonorPos === 1 || edgeStacker.canOperateDonor === false}
                    />
                </Form.Group>

                <Form.Group>
                    <label>Acceptor position</label>
                    <Form.Field
                        label={"?"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"UNDEFINED"}
                        checked={edgeStacker.acceptor === DonorPosition.UNDEFINED}
                        onChange={this.onClickMenuEvent}
                    />
                    <Form.Field
                        label={"1"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"ONE"}
                        checked={edgeStacker.acceptor === DonorPosition.ONE}
                        onChange={this.onClickMenuEvent}
                        disabled={!(1 in edgeStacker.usablePos) || edgeStacker.usablePos[1] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"2"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"TWO"}
                        checked={edgeStacker.acceptor === DonorPosition.TWO}
                        onChange={this.onClickMenuEvent}
                        disabled={!(2 in edgeStacker.usablePos) || edgeStacker.usablePos[2] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"3"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"THREE"}
                        checked={edgeStacker.acceptor === DonorPosition.THREE}
                        onChange={this.onClickMenuEvent}
                        disabled={!(3 in edgeStacker.usablePos) || edgeStacker.usablePos[3] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"4"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"FOUR"}
                        checked={edgeStacker.acceptor === DonorPosition.FOUR}
                        onChange={this.onClickMenuEvent}
                        disabled={!(4 in edgeStacker.usablePos) || edgeStacker.usablePos[4] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"5"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"FIVE"}
                        checked={edgeStacker.acceptor === DonorPosition.FIVE}
                        onChange={this.onClickMenuEvent}
                        disabled={!(5 in edgeStacker.usablePos) || edgeStacker.usablePos[5] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"6"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"SIX"}
                        checked={edgeStacker.acceptor === DonorPosition.SIX}
                        onChange={this.onClickMenuEvent}
                        disabled={!(6 in edgeStacker.usablePos) || edgeStacker.usablePos[6] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"7"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"SEVEN"}
                        checked={edgeStacker.acceptor === DonorPosition.SEVEN}
                        onChange={this.onClickMenuEvent}
                        disabled={!(7 in edgeStacker.usablePos) || edgeStacker.usablePos[7] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"8"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"EIGHT"}
                        checked={edgeStacker.acceptor === DonorPosition.EIGHT}
                        onChange={this.onClickMenuEvent}
                        disabled={!(8 in edgeStacker.usablePos) || edgeStacker.usablePos[8] === false || edgeStacker.isUsable}
                    />
                    <Form.Field
                        label={"9"}
                        type={"radio"}
                        control={"input"}
                        name={"acceptor"}
                        value={"NINE"}
                        checked={edgeStacker.acceptor === DonorPosition.NINE}
                        onChange={this.onClickMenuEvent}
                        disabled={!(9 in edgeStacker.usablePos) || edgeStacker.usablePos[9] === false || edgeStacker.isUsable}
                    />
                </Form.Group>

                <Form.Group style={{display: "none"}}>
                    <label>Linkage Type</label>
                </Form.Group>

                <Form.Group style={{display: "none"}}>
                    <label>Probability</label>
                </Form.Group>
            </Form>
        );
    }

}