//@flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import createjs from "createjs-easeljs";
import {createSNFGSymbol} from "../../script/createSugar/createSNFGSymbol";
import {shapeClickEvent} from "../../script/clickEvent/shapeClickEvent";
import {Grid, Popup} from "semantic-ui-react";

export default class MonosaccharideContent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);
        canvas.width = this.props.width === undefined ? 36 : this.props.width;
        canvas.height = this.props.height === undefined ? 36 : this.props.height;

        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver();

        const shape: createjs.Shape = createSNFGSymbol(this.props.item);

        //assign monosaccharide symbol option
        if (this.props.option !== undefined) {
            shape.option = this.props.option;
        }

        //shape.name = this.props.item;
        shape.x = this.stage.canvas.width * .5;
        shape.y = this.stage.canvas.height * .5;
        shape.cache(-20, -20, 20*2, 20*2);

        //select utility
        shape.addEventListener("click", (e) => shapeClickEvent(e), false);

        shape.cursor = "pointer";

        this.stage.addChild(shape);
        this.stage.update();
    }

    render () {
        return (
            <Popup on={"hover"} content={this.props.notation} trigger={
                <div>
                    <canvas ref = "canvas"/>
                </div>
            } />
        );
    }
}
