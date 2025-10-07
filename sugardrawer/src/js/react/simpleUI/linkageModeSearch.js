//@flow
"use strict";

import { linkageModeType } from "./linkageModeType";

export function linkageModeSearch(target: string) {
    switch (target) {
        case "a1": return linkageModeType.A1;
        case "a1-2": return linkageModeType.A1_2;
        case "a1-3": return linkageModeType.A1_3;
        case "a1-4": return linkageModeType.A1_4;
        case "a1-5": return linkageModeType.A1_5;
        case "a1-6": return linkageModeType.A1_6;
        case "a1-7": return linkageModeType.A1_7;
        case "a1-8": return linkageModeType.A1_8;
        case "b1": return linkageModeType.B1;
        case "b1-2": return linkageModeType.B1_2;
        case "b1-3": return linkageModeType.B1_3;
        case "b1-4": return linkageModeType.B1_4;
        case "b1-5": return linkageModeType.B1_5;
        case "b1-6": return linkageModeType.B1_6;
        case "b1-7": return linkageModeType.B1_7;
        case "b1-8": return linkageModeType.B1_8;
        case "a2": return linkageModeType.A2;
        case "a2-1": return linkageModeType.A2_1;
        case "a2-3": return linkageModeType.A2_3;
        case "a2-4": return linkageModeType.A2_4;
        case "a2-5": return linkageModeType.A2_5;
        case "a2-6": return linkageModeType.A2_6;
        case "a2-7": return linkageModeType.A2_7;
        case "a2-8": return linkageModeType.A2_8;
        case "b2": return linkageModeType.B2;
        case "b2-1": return linkageModeType.B2_1;
        case "b2-3": return linkageModeType.B2_3;
        case "b2-4": return linkageModeType.B2_4;
        case "b2-5": return linkageModeType.B2_5;
        case "b2-6": return linkageModeType.B2_6;
        case "b2-7": return linkageModeType.B2_7;
        case "b2-8": return linkageModeType.B2_8;

        default: return linkageModeType.NOT_SELECTED;

    }
}
