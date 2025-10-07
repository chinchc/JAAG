//@flow

"use strict";

import ReactDOM from "react-dom";
import createjs from "createjs-easeljs";
import {createSNFGSymbol} from "../script/createSugar/createSNFGSymbol";
import React from "react";

export default class CurrentSelectMonosaccharideCursor extends React.Component {
    constructor (props) {
        super (props);
    }

    componentDidMount () {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);
        canvas.width = this.props.width === undefined ? 36 : this.props.width;
        canvas.height = this.props.height === undefined ? 36 : this.props.height;

        this.stage = new createjs.Stage(canvas);

        const shape: createjs.Shape = createSNFGSymbol(this.props.item);
        shape.x = this.stage.canvas.width * .5;
        shape.y = this.stage.canvas.height * .5;
        shape.cache(-20, -20, 20*2, 20*2);

        this.stage.addChild(shape);
        this.stage.update();
    }

    render () {
        return (
            <canvas ref = "canvas"/>
        );
    }
}