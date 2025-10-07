//@flow
"use strict";

import React from "react";
import {liaise} from "../../script";
import EdgeFormComponent from "./EdgeFormComponent";
import {Button, Popup, Radio} from "semantic-ui-react";
import EdgePresetComponent from "./EdgePresetComponent";

export default class LeftClickEdgeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preset: true
        };

        this.onToggleChange = this.onToggleChange.bind(this);
    }

    onClose () {
        document.getElementById("menu").style.display = "none";
    }

    onToggleChange () {
        if (this.state.preset) {
            this.setState({preset: false});
        } else {
            this.setState({preset: true});
        }
        this.forceUpdate();
    }

    render() {
        let menuLayout: Object = {
            style : {
                cursor: "pointer",
                border: "1px solid #333333",
                padding : "10px",
                margin : "10px",
                backgroundColor : "white",
                textAlign: "center"
            }
        };

        const rect = liaise.stage.canvas.getBoundingClientRect();

        liaise.canvasEdge.children.map( (child) => {
            if (child.name !== "line") return;
            let menu = document.getElementById("menu");
            menu.style.left = child.graphics.command.x + Math.floor(rect.left) + "px";
            menu.style.top = child.graphics.command.y + "px";
        });

        return (
            <div {...menuLayout}>
                {
                    this.state.preset ? <EdgePresetComponent/> : <EdgeFormComponent/>
                }
                <Popup on={"hover"} content='Close' trigger={
                    <Button id={"close"} onClick={this.onClose} icon="close"/>
                }/>
                <Radio id={"mode"}
                    label={"Interface type : "}
                    toggle
                    onChange={this.onToggleChange}
                />
                {this.state.preset ? " preset" : " expert"}
            </div>
        );
    }
}