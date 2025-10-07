//@flow

"use strict";

import {liaise} from "../index";
import {getColor} from "../data/getColor";
import createjs from "createjs-easeljs";
import {basicData} from "../data/graphicsData";
import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";

let rect_MousedownFlg;
let rectangle: Object = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
};
let nodes: Array<Object> = [];

export const onMouseDown = (e): void => {
    rect_MousedownFlg = true;

    let dragRect: createjs.Shape = getSelectLine("select");
    if (dragRect === undefined) {
        dragRect = new createjs.Shape();
        dragRect.name = "select";
        liaise.addStage(dragRect);
    }

    const rect = liaise.stage.canvas.getBoundingClientRect();
    rectangle.startX = e.clientX - rect.left;
    rectangle.startY = e.clientY - rect.top;

    liaise.stage.canvas.addEventListener("mousemove", onMouseMove, false);
    liaise.stage.canvas.addEventListener("mouseup", onMouseUp, false);
};

export const onMouseMove = (e): void => {
    if(rect_MousedownFlg){
        let dragRect: createjs.Shape = getSelectLine("select");

        // define position
        const rect = e.target.getBoundingClientRect();
        rectangle.endX = e.clientX - rect.left;
        rectangle.endY = e.clientY - rect.top;

        dragRect.graphics
            .clear()
            .beginStroke(getColor("black"))
            .setStrokeStyle(basicData.strokeSize * .5)
            .moveTo(rectangle.startX, rectangle.startY)
            .lineTo(rectangle.endX, rectangle.startY)
            .moveTo(rectangle.startX, rectangle.endY)
            .lineTo(rectangle.endX, rectangle.endY)
            .moveTo(rectangle.endX, rectangle.startY)
            .lineTo(rectangle.endX,rectangle.endY)
            .moveTo(rectangle.startX, rectangle.startY)
            .lineTo(rectangle.startX, rectangle.endY)
            .closePath();

        // extract surrounded nodes
        selectSurroundNodes();

        // change color surrounded nodes
        initNodesColor();
        changeNodesColor();

        liaise.stageUpdate();
    }
};

export const onMouseUp = (e): void => {
    rect_MousedownFlg = false;

    let dragRect: createjs.Shape = getSelectLine("select");
    //dragRect.graphics.clear();

    // undo nodes color
    changeOriginalNodesColor();

    // init params
    clearRectangle();
    nodes = [];

    liaise.removeStage(dragRect);
    liaise.stageUpdate();
    liaise.stage.canvas.removeEventListener("mousemove", onMouseMove, false);
    liaise.stage.canvas.removeEventListener("mouseup", onMouseUp, false);
};

const getSelectLine = (_componentName: string): createjs.Shape => {
    let ret: createjs.Shape = undefined;
    liaise.stage.children.map( (child) => {
        if (child.name !== _componentName) return;
        ret = child;
    });
    return ret;
};

const clearRectangle = (): void => {
    rectangle.startY = 0;
    rectangle.startX = 0;
    rectangle.endX = 0;
    rectangle.endY = 0;
};

const selectSurroundNodes = (): Array<Object> => {
    const maxX: number = Math.max(rectangle.startX, rectangle.endX);
    const minX: number = Math.min(rectangle.startX, rectangle.endX);
    const maxY: number = Math.max(rectangle.startY, rectangle.endY);
    const minY: number = Math.min(rectangle.startY, rectangle.endY);

    nodes = [];
    liaise.newGraph.map( (graph) => {
        graph.graph.nodes().map( (node) => {
            const x: number = node.x;
            const y: number = node.y;
            if ((x > minX && maxX > x) && (y > minY && maxY > y)) {
                nodes.push(node);
            }

            const glpt: Object = node.globalToLocal(liaise.stage.mouseX, liaise.stage.mouseY);
            if (node.hitTest(glpt.x, glpt.y)) {
                nodes.push(node);
            }
        });
    });
};

const changeNodesColor = (): void => {
    nodes.map( (node) => {
        if (node instanceof Monosaccharide) {
            node.children[0].filters = [
                new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0, 0)
            ];
            node.children[0].updateCache();
        } else {
            let text: createjs.Text = node.children[0];
            text.color = getColor("red");
        }
    });
};

const changeOriginalNodesColor = (): void => {
    nodes.map( (node) => {
        if (node instanceof Monosaccharide) {
            node.children[0].filters = [
                new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
            ];
            node.children[0].updateCache();
        } else {
            let text: createjs.Text = node.children[0];
            text.color = getColor("black");
        }
    });
};

const initNodesColor = (): void => {
    liaise.newGraph.map( (graph) => {
        graph.graph.nodes().map( (node) => {
            if (node instanceof Monosaccharide) {
                node.children[0].filters = [
                    new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
                ];
                node.children[0].updateCache();
            } else {
                let text: createjs.Text = node.children[0];
                text.color = getColor("black");
            }
        });
    });
};