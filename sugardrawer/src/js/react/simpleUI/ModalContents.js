//@flow

"use strict";

import {modeType} from "../modeType";
import {NodeTable} from "./NodeTable";
import React from "react";
import {EdgeTable} from "./EdgeTable";
import {ModificationContents} from "./ModificationItem";
import {CompositionTable} from "./compositionTable";
import {StructureTable} from "./StructureTable";

export default class ModalContents {

    constructor() {
    }

    getContents (_currentModeType: modeType) {
        if (_currentModeType === modeType.NODE) {
            return (
                <NodeTable/>
            );
        }
        else if (_currentModeType === modeType.EDGE) {
            return (
                <EdgeTable/>
            );
        }
        else if (_currentModeType === modeType.MODIFICATION) {
            return (
                <ModificationContents/>
            );
        }
        else if (_currentModeType === modeType.FRAGMENT) {
            return (
                <NodeTable/>
            );
        }
        else if (_currentModeType === modeType.COMPOSITION) {
            return (
                <CompositionTable/>
            );
        }
        else if (_currentModeType === modeType.STRUCTURE) {
            return (
                <StructureTable/>
            );
        }
    }
}