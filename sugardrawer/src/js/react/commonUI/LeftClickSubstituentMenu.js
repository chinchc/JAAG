//@flow
"use strict";

import React from "react";
import {liaise} from "../../script";
import {Button, Form, Popup} from "semantic-ui-react";
import {checkUsableSubstituentPosition} from "../../script/createBind/checkUsablePosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import {startUpdate} from "../../script/images/update/updateCanvas";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export default class LeftClickSubstituentMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onClickMenuEvent = this.onClickMenuEvent.bind(this);
    }

    onClose () {
        document.getElementById("menu").style.display = "none";
    }

    onClickMenuEvent (e) {
        const name: string = e.target.name;
        const value: string = e.target.value;

        switch (name) {
            case "acceptor" : {
                // substituent: this.props.trigger.parent
                // glycan: this.props.trigger.parent.parent
                let subNode = this.props.trigger.parent;
                let currentGraph: Glycan = subNode.parent;

                liaise.actionUndoRedo.setNode();

                for (const edge of currentGraph.graph.edges()) {
                    if (edge.targetNode === subNode) {
                        edge.donorPosition = DonorPosition[value];
                    }
                }

                let shapes: Object = liaise.getNewShapes(currentGraph);
                let treeData: Object = liaise.getNewTreeData(currentGraph);

                //recalculate monosaccharide positions
                rootPos.posX = shapes.root[0];
                rootPos.posY = shapes.root[1];
                let visFunc = new visFunction();
                shapes = visFunc.generateShapes(currentGraph, shapes, treeData)[0];

                // update position
                currentGraph = startUpdate(currentGraph);

                liaise.newGraph = currentGraph;
                liaise.setNewShapes(currentGraph, shapes);
                liaise.stageUpdate();

                break;
            }
            default: {
                break;
            }
        }

        this.forceUpdate();
    }

    render () {
        let menuLayout: Object = {
            style : {
                position: "fixed",
                left: "0px",
                top: "0px",
                cursor: "pointer",
                border: "1px solid #333333",
                padding : "10px",
                margin : "10px",
                backgroundColor : "white",
            }
        };

        const rect = liaise.stage.canvas.getBoundingClientRect();
        menuLayout.style.left = this.props.trigger.x + Math.floor(rect.left);
        menuLayout.style.top = this.props.trigger.y + 100;

        let usablePos: Object = checkUsableSubstituentPosition(this.props.trigger.parent, this.props.trigger.parent.parent);

        const acceptor: DonorPosition = this.props.trigger.parent.donorPosition;

        return (
            <div {...menuLayout}>
                <Form>
                    <Form.Group>
                        <label>Linkage Position</label>
                        <Form.Field
                            label={"?"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"UNDEFINED"}
                            checked={acceptor === DonorPosition.UNDEFINED}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"1"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"ONE"}
                            checked={acceptor === DonorPosition.ONE}
                            onChange={this.onClickMenuEvent}
                            disabled={!(1 in usablePos) || usablePos[1] === false}
                        />
                        <Form.Field
                            label={"2"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"TWO"}
                            checked={acceptor === DonorPosition.TWO}
                            onChange={this.onClickMenuEvent}
                            disabled={!(2 in usablePos) || usablePos[2] === false}
                        />
                        <Form.Field
                            label={"3"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"THREE"}
                            checked={acceptor === DonorPosition.THREE}
                            onChange={this.onClickMenuEvent}
                            disabled={!(3 in usablePos) || usablePos[3] === false}
                        />
                        <Form.Field
                            label={"4"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"FOUR"}
                            checked={acceptor === DonorPosition.FOUR}
                            onChange={this.onClickMenuEvent}
                            disabled={!(4 in usablePos) || usablePos[4] === false}
                        />
                        <Form.Field
                            label={"5"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"FIVE"}
                            checked={acceptor === DonorPosition.FIVE}
                            onChange={this.onClickMenuEvent}
                            disabled={!(5 in usablePos) || usablePos[5] === false}
                        />
                        <Form.Field
                            label={"6"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"SIX"}
                            checked={acceptor === DonorPosition.SIX}
                            onChange={this.onClickMenuEvent}
                            disabled={!(6 in usablePos) || usablePos[6] === false}
                        />
                        <Form.Field
                            label={"7"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"SEVEN"}
                            checked={acceptor === DonorPosition.SEVEN}
                            onChange={this.onClickMenuEvent}
                            disabled={!(7 in usablePos) || usablePos[7] === false}
                        />
                        <Form.Field
                            label={"8"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"EIGHT"}
                            checked={acceptor === DonorPosition.EIGHT}
                            onChange={this.onClickMenuEvent}
                            disabled={!(8 in usablePos) || usablePos[8] === false}
                        />
                        <Form.Field
                            label={"9"}
                            type={"radio"}
                            control={"input"}
                            name={"acceptor"}
                            value={"NINE"}
                            checked={acceptor === DonorPosition.NINE}
                            onChange={this.onClickMenuEvent}
                            disabled={!(9 in usablePos) || usablePos[9] === false}
                        />
                    </Form.Group>

                    <Form.Group style={{display: "none"}}>
                        <label>Linkage Type</label>
                    </Form.Group>

                    <Form.Group style={{display: "none"}}>
                        <label>Probability</label>
                    </Form.Group>

                    <Popup on={"hover"} content='Close' trigger={
                        <Button id={"close"} onClick={this.onClose} icon="close" />
                    }/>
                </Form>
            </div>
        );
    }
}