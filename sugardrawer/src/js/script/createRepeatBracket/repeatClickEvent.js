//@flow
"use strict";

import { liaise } from "../index";
import { modeType } from "../../react/modeType";
import { repeatModal } from "./repeatModal";
import { createRepeatShape } from "./createRepeatShape";

export let repeatClickEvent = (event: Object) => {
    switch (liaise.modeType) {
        case modeType.REPEAT: {
            let repeatNumber: string = repeatModal();
            if(repeatNumber === "") {
                return;
            }
            createRepeatShape(repeatNumber, event.currentTarget);
            liaise.stageUpdate();
            break;
        }
        default: {
            return;
        }
    }
};