"use strict";

import React from "react";
import {Menu, Sidebar} from "semantic-ui-react";
import {Canvas} from "../Canvas";
import {SidebarContents} from "./SidebarContents";
import {HorizontalCommand} from "../horizonalUI/HorizontalCommand";

export class SidebarLeftPush extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaValue: ""
        };
    }

    getSidebarContents() {
        const sidebarContents = new SidebarContents(this.state.textareaValue);
        return sidebarContents.getContents(this.props.currentMode);
    }

    render(){
        const sidebarContent = this.props.visible ? this.getSidebarContents() : "";

        const canvasStyleProps = {
            width: 1000,
            height: 500,
            overflowY: "scroll",
            overflowX: "scroll",
            border: "1px solid gray"
        };

        return (
            <div id={"expert-sidebar"}>
                <Sidebar.Pushable>
                    <Sidebar as = { Menu }
                        animation = "overlay"
                        visible = { this.props.visible }
                        vertical
                        inverted
                        icon="labeled"
                        style={{
                            backgroundColor: "white",
                            width: "auto !important",
                            border: "1px solid gray"
                        }}
                    >
                        { sidebarContent }
                    </Sidebar>
                    <Sidebar.Pusher style={{textAlign: "center"}}>
                        <HorizontalCommand />
                        <Canvas {...canvasStyleProps}/>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}