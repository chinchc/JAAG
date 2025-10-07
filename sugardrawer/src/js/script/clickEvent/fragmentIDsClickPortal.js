//@flow

"use strict";

import {liaise} from "../index";
import {onMouseDown} from "./canvasDragAndDropEvent";

export const fragmentIDsClickPortal = (e): void => {

    liaise.stage.canvas.removeEventListener("mousedown", onMouseDown, false);

    if (e.nativeEvent.which === 3) {
        //rightClick(_e);
    } else {
        //leftClick(_e);
        dragAndDrop(e);
    }

    liaise.stage.canvas.addEventListener("mousedown", onMouseDown, false);
};

const dragAndDrop = (e): void => {
    const drag = function(e) {
        const currentGraph = liaise.coreGraph;
        e.currentTarget.x = e.stageX / Math.abs(currentGraph.parent.scaleX);
        e.currentTarget.y = e.stageY / Math.abs(currentGraph.parent.scaleX);

        liaise.stageUpdate();
    };
    const release = function(e) {
        e.currentTarget.removeEventListener("pressmove", drag);
        e.currentTarget.removeEventListener("pressup", release);

        liaise.stageUpdate();
    };

    e.currentTarget.addEventListener("pressmove", drag);
    e.currentTarget.addEventListener("pressup", release);
};