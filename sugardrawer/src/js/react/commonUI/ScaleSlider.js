//@flow
"use strict";

import React from "react";
import { liaise } from "../../script";
import toNumber from "lodash.tonumber";
import {Icon, Popup} from "semantic-ui-react";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {startUpdate} from "../../script/images/update/updateCanvas";

export default class ScaleSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1
        };
    }

    onChangeScale(e) {
        if (liaise.newGraph.length === 0) return;

        let value: number = e.target.value;
        this.setState({scale: value});

        // reference : https://qiita.com/KitaitiMakoto/items/2ac522b92a063055bcbb

        const scale: number = toNumber(value);
        let coreGraph: Glycan = liaise.coreGraph;
        let shapes: Object = liaise.getNewShapes(coreGraph);
        let treeData: Object = liaise.getNewTreeData(coreGraph);

        liaise.stage.children.forEach( (child) => {
            child.scaleX = child.scaleY = scale;
        });

        // calculate center position
        let totalWidth: number = 0;
        liaise.stage.children.map( (child) => {
            if (child.getBounds() === null) return;
            totalWidth += child.getBounds().height;
        });

        // assign a center position to root residue according to scale
        rootPos.posX = (liaise.stage.canvas.width / liaise.stage.children[0].scaleX) / 2 + (totalWidth / liaise.stage.children[0].scaleX) / 2;
        rootPos.posY = (liaise.stage.canvas.height / liaise.stage.children[0].scaleY) / 2;

        coreGraph.getRootNode().x = rootPos.posX;
        coreGraph.getRootNode().y = rootPos.posY;

        let visFunc = new visFunction();
        shapes = visFunc.generateShapes(coreGraph, shapes, treeData)[0];
        liaise.setNewShapes(coreGraph, shapes);

        // modify core position
        startUpdate(coreGraph);

        liaise.stageUpdate();
    }

    render() {
        let { scale } = this.state;
        const sidebarStyle = {
            style : {
                display: "flex",
                marginRight: "20px",
                justifyContent: "center",
                fontSize: "1.5em",
                alignItems: "center"
            }
        };

        return(
            <div {...sidebarStyle}>
                <Icon name={"zoom out"} />
                <Popup on={"hover"} content={`${parseInt(scale * 100)} %`} trigger={
                    <input
                        min={.01}
                        max={3}
                        name="scale"
                        onChange={(e) => this.onChangeScale(e)}
                        step={.01}
                        type={"range"}
                        value={scale}
                    />
                } />
                <Icon name={"zoom in"} />
            </div>
        );
    }
}