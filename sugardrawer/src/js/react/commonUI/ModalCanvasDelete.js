//@flow

"use strict";

import {Confirm} from "semantic-ui-react";
import {modeType} from "../modeType";
import React from "react";
import {liaise} from "../../script";
import {removeAllGlycan} from "../../script/images/remove/removeGlycan";

export default class ModalCanvasDelete extends React.Component {
    constructor(props) {
        super(props);
    }

    close () {
        liaise.modeType = modeType.NOT_SELECTED;
        this.forceUpdate();
    }

    clearCanvas () {
        removeAllGlycan();
        document.querySelector("#menu").textContent = "";
        document.querySelector("#idtable").textContent = "";
        document.querySelector("#textArea").textContent = "";

        this.close();
    }

    render () {
        return (
            <div id={"delete-canvas"}>
                <Confirm
                    open={liaise.modeType === modeType.DELETE}
                    header={"Delete canvas"}
                    content={"Do you really want to delete all information on the canvas ? This operation can not be undone with \"Undo\"."}
                    cancelButton={"No"}
                    confirmButton={"Yes"}
                    onCancel={() => this.close()}
                    onConfirm={() => this.clearCanvas()}
                />
            </div>
        );
    }
}