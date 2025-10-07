//@flow

"use strict";

import React from "react";
import ReactDOM from "react-dom";
import createjs from "createjs-easeljs";
import {getColor} from "../script/data/getColor";

export default class CurrentSelectSubstituentCursor extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount(): * {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);
        //canvas.width = this.props.width === undefined ? 36 : this.props.width;
        //canvas.height = this.props.height === undefined ? 36 : this.props.height;

        this.stage = new createjs.Stage(canvas);

        const text: createjs.Text = new createjs.Text(this.props.item, "15px serif", getColor("black"));
        canvas.width = text.getMeasuredWidth();
        canvas.height = text.getMeasuredLineHeight();

        text.textAlign = "center";
        text.textBaseline = "middle";
        text.x = this.stage.canvas.width * .5;
        text.y = this.stage.canvas.height * .5;
        text.cache(0-canvas.width, 0-canvas.height, canvas.width*2.4, canvas.height*2);

        this.stage.addChild(text);
        this.stage.update();
    }

    render () {
        return (
            <canvas ref = "canvas"/>
        );
    }
}