"use strict";

import React from "react";
import ReactDOM from "react-dom";
import createjs from "createjs-easeljs";
import { liaise } from "../script";
import { canvasClickEvent } from "../script/clickEvent/canvasClickEvent";
import {onMouseDown} from "../script/clickEvent/canvasDragAndDropEvent";

export class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.width = 1000;
        canvas.height = 500;
        canvas.addEventListener("click", canvasClickEvent, false);
        canvas.addEventListener("contextmenu", (e) => {e.preventDefault();}, false);
        //canvas.addEventListener("wheel", wheelPortal.bind(this), {passive: true});

        canvas.addEventListener("mousedown", onMouseDown, false);
        // canvas.modeType = modeType;
        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver();
        liaise.stage = this.stage;
    }

    render() {
        return (
            <canvas style = {this.props} ref = "canvas"/>
        );
    }
}