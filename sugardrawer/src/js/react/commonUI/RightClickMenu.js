//@flow

"use strict";

import React from "react";
import {liaise} from "../../script";
import {Button, Form, Popup} from "semantic-ui-react";
import {removeMonosaccharide} from "../../script/images/remove/removeMonosaccharide";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {updateIsomer, updateMonosaccharide, updateRingType} from "../../script/images/update/updateMonosaccharide";
import {updateEdgeWithMonosaccharide} from "../../script/images/update/updateEdge";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import CreateFragmentID from "../../script/createFragment/CreateFragmentID";
import ReplaceNode from "../../script/images/replace/ReplaceNode";

export default class RightClickMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.handleItemClick = this.handleItemClick.bind(this);
        this.onClickMenuEvent = this.onClickMenuEvent.bind(this);
    }

    handleItemClick (e) {
        const id = e.currentTarget.id;
        switch(id) {
            case "delete" : {
                liaise.actionUndoRedo.setNode();
                removeMonosaccharide(this.props.trigger);
                this.onClose();
                break;
            }
            case "edit" : {
                this.setState({editSugar: true});
                break;
            }
            case "replace" : {
                liaise.actionUndoRedo.setNode();
                const repNode = new ReplaceNode();
                repNode.startReplace();
                this.onClose();
                break;
            }
            case "refresh" : {
                liaise.actionUndoRedo.setNode();
                updateMonosaccharide();
                this.onClose();
                break;
            }
            default : {
                break;
            }
        }
    }

    onClickMenuEvent(e) {
        const name: string = e.target.name;
        const value: string = e.target.value;
        switch(name) {
            case "isomer" : {
                liaise.actionUndoRedo.setNode();
                if (value === "UNDEFINED") {
                    liaise.canvasNode.parent.isomer = Isomer.UNDEFINED;
                }
                if (value === "D") {
                    liaise.canvasNode.parent.isomer = Isomer.D;
                }
                if (value === "L") {
                    liaise.canvasNode.parent.isomer = Isomer.L;
                }
                updateIsomer(liaise.canvasNode.parent);
                break;
            }
            case "ring" : {
                liaise.actionUndoRedo.setNode();
                if (value === "UNDEFINED") {
                    liaise.canvasNode.parent.anomericity = Anomericity.UNDEFINED;
                    liaise.canvasNode.parent.ringType = RingType.UNDEFINED;
                }
                if (value === "P") {
                    liaise.canvasNode.parent.ringType = RingType.P;
                }
                if (value === "F") {
                    liaise.canvasNode.parent.ringType = RingType.F;
                }
                if (value === "OPEN") {
                    liaise.canvasNode.parent.anomericity = Anomericity.UNDEFINED;
                    liaise.canvasNode.parent.ringType = RingType.OPEN;
                }
                updateEdgeWithMonosaccharide(liaise.canvasNode.parent);
                updateRingType(liaise.canvasNode.parent);
                break;
            }
            case "linktocore" : {
                let subGraph: Glycan = liaise.canvasNode.parent.parent;
                if (subGraph.parentNodeIDs === undefined) {
                    subGraph.parentNodeIDs = [e.target.value];
                }

                const createFGID: Object = new CreateFragmentID();
                if (subGraph.parentNodeIDs.indexOf(e.target.value) !== -1) {
                    subGraph.parentNodeIDs.splice(subGraph.parentNodeIDs.indexOf(e.target.value), 1);
                    createFGID.drawFragmentIDs();
                } else {
                    subGraph.parentNodeIDs.push(e.target.value);
                    //TODO: 単体レベルで追加する処理を作る
                    createFGID.drawFragmentIDs();
                }

                // check number of parent node IDs
                if (subGraph.parentNodeIDs.length < 2) {
                    alert("Please select two or more monosaccharides.");
                    subGraph.parentNodeIDs.push(e.target.value);
                    createFGID.drawFragmentIDs();
                }

                liaise.subGraph = subGraph;
                liaise.stageUpdate();

                break;
            }
            default : {
                break;
            }
        }

        this.forceUpdate();
    }

    onClose () {
        document.getElementById("menu").style.display = "none";
    }

    render() {
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
        menuLayout.style.left = liaise.canvasNode.parent.x + Math.floor(rect.left);
        menuLayout.style.top = liaise.canvasNode.parent.y - 20;

        const isomer: Isomer = liaise.canvasNode.parent.isomer;
        const ringType: RingType = liaise.canvasNode.parent.ringType;

        const graph: Glycan = liaise.canvasNode.parent.parent;
        const isCore: boolean = (graph.id === "Glycan" || graph.getRootNode().id !== liaise.canvasNode.parent.id);

        return (
            <div {...menuLayout}>
                <Form>
                    <Form.Group>
                        <label>Isomer</label>
                        <Form.Field
                            label={"?"}
                            type={"radio"}
                            control={"input"}
                            name={"isomer"}
                            value={"UNDEFINED"}
                            checked={isomer === Isomer.UNDEFINED}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"D"}
                            type={"radio"}
                            control={"input"}
                            name={"isomer"}
                            value={"D"}
                            checked={isomer === Isomer.D}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"L"}
                            type={"radio"}
                            control={"input"}
                            name={"isomer"}
                            value={"L"}
                            checked={isomer === Isomer.L}
                            onChange={this.onClickMenuEvent}
                        />
                    </Form.Group>

                    <Form.Group>
                        <label>Ring size</label>
                        <Form.Field
                            label={"?"}
                            type={"radio"}
                            control={"input"}
                            name={"ring"}
                            value={"UNDEFINED"}
                            checked={ringType === RingType.UNDEFINED}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"p"}
                            type={"radio"}
                            control={"input"}
                            name={"ring"}
                            value={"P"}
                            checked={ringType === RingType.P}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"f"}
                            type={"radio"}
                            control={"input"}
                            name={"ring"}
                            value={"F"}
                            checked={ringType === RingType.F}
                            onChange={this.onClickMenuEvent}
                        />
                        <Form.Field
                            label={"o"}
                            type={"radio"}
                            control={"input"}
                            name={"ring"}
                            value={"OPEN"}
                            checked={ringType === RingType.OPEN}
                            onChange={this.onClickMenuEvent}
                        />
                    </Form.Group>

                    <Form.Group>
                        <label>Connected</label>
                        {
                            liaise.coreGraph.graph.nodes().map( (node, index) => {
                                if (node instanceof Substituent) return;
                                return(
                                    <Form.Field
                                        key={`connected-${index}`}
                                        label={index}
                                        type={"checkbox"}
                                        control={"input"}
                                        name={"linktocore"}
                                        value={node.id}
                                        checked={graph.parentNodeIDs !== undefined && graph.parentNodeIDs.indexOf(node.id) !== -1}
                                        onChange={this.onClickMenuEvent}
                                        disabled={isCore}
                                    />
                                );
                            })
                        }
                    </Form.Group>

                    <Popup on={"hover"} content='Delete' trigger={
                        <Button id={"delete"} onClick={(e) => this.handleItemClick(e)} icon="eraser"/>
                    }/>
                    <Popup on={"hover"} content='Replace' trigger={
                        <Button id={"replace"} onClick={(e) => this.handleItemClick(e)} icon="exchange" disabled={!liaise.newNode}/>
                    }/>
                    <Popup on={"hover"} content='Close' trigger={
                        <Button id={"close"} onClick={this.onClose} icon="close"/>
                    }/>

                </Form>
            </div>
        );
    }
}