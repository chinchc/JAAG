//@flow
"use strict";

import React from "react";
import {liaise} from "../../script";
import {Button, Popup} from "semantic-ui-react";
import {removeSubstituent} from "../../script/images/remove/removeSubstituent";
import ReplaceNode from "../../script/images/replace/ReplaceNode";

export default class RightClickSubstituentMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick (e) {
        const id: string = e.currentTarget.id;

        switch(id) {
            case "delete" : {
                liaise.actionUndoRedo.setNode();
                removeSubstituent(this.props.trigger.parent);
                break;
            }
            case "changepos" : {
                liaise.actionUndoRedo.setNode();

                break;
            }
            case "replace" : {
                liaise.actionUndoRedo.setNode();
                liaise.canvasSubstituent = this.props.trigger;
                const repNode = new ReplaceNode();
                repNode.startReplace();
                this.onClose();
                break;
            }
            default : {
                break;
            }
        }
    }

    onClose () {
        document.getElementById("menu").style.display = "none";
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

        return (
            <div {...menuLayout}>
                <Popup on={"hover"} content='Delete' trigger={
                    <Button id={"delete"} onClick={this.handleItemClick} icon="eraser" />
                }/>
                <Popup on={"hover"} content='Replace' trigger={
                    <Button id={"replace"} onClick={(e) => this.handleItemClick(e)} icon="exchange" disabled={!liaise.newSubstituent}/>
                }/>
                <Popup on={"hover"} content='Close' trigger={
                    <Button id={"close"} onClick={this.onClose} icon="close" />
                }/>
                <Button id={"changepos"} onClick={this.handleItemClick} style={{display: "none"}}>Change</Button>
            </div>
        );
    }
}