//@flow
"use strict";

import {liaise} from "../../index";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import {upDateRootOfFragment} from "../update/updateCanvas";
import CreateFragmentID from "../../createFragment/CreateFragmentID";
import {removeGlycanFragmentBracket} from "./removeFragment";
import {modeType} from "../../../react/modeType";
import ModalCanvasDelete from "../../../react/commonUI/ModalCanvasDelete";
import React from "react";

const ReactDOM = require("react-dom");

export const removeGlycan = (_glycan: Glycan) => {
    if (_glycan.id === "Glycan") {
        liaise.modeType = modeType.DELETE;
        ReactDOM.render(
            <ModalCanvasDelete />,
            document.getElementById("modal")
        );
    }
    if (_glycan.id.indexOf("fragments") !== -1) {
        liaise.removeNewShapes(_glycan);
        liaise.removeNewTreeData(_glycan);
        liaise.removeGraph(_glycan);
        liaise.removeStage(_glycan);

        // remove fragment bracket
        if (liaise.subGraph.length === 0) {
            removeGlycanFragmentBracket(liaise.coreGraph);
        }

        upDateRootOfFragment(liaise.coreGraph);

        const createFGID: Object = new CreateFragmentID();
        createFGID.drawFragmentIDs();

        liaise.stageUpdate();
    }

    liaise.canvasNode = undefined;
};

export const removeAllGlycan = () => {
    liaise.initStage();
    liaise.initGraph();
    liaise.initSelectedParams();
    liaise.setNewShapes({});
    liaise.setNewTreeData({});
    liaise.sideBarCancel();
};