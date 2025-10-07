//@flow
"use strict";

import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";

export const substituentPosition = (_donor: DonorPosition) => {

    switch (_donor) {
        case DonorPosition.UNDEFINED: {
            return {
                x : 23,
                y : 20
            };
        }
        case DonorPosition.ONE: {
            return {
                x : 12,
                y : 20
            };
        }
        case DonorPosition.TWO: {
            return {
                x : 0,
                y : 20
            };
        }
        case DonorPosition.THREE: {
            return {
                x : -12,
                y : 20
            };
        }
        case DonorPosition.FOUR: {
            return {
                x : -23,
                y : 20
            };
        }
        case DonorPosition.FIVE: {
            return {
                x : 23,
                y : -20
            };
        }
        case DonorPosition.SIX: {
            return {
                x : 12,
                y : -20
            };
        }
        case DonorPosition.SEVEN: {
            return {
                x : 0,
                y : -20
            };
        }
        case DonorPosition.EIGHT: {
            return {
                x : -12,
                y : -20
            };
        }
        case DonorPosition.NINE: {
            return {
                x : -23,
                y : -20
            };
        }
    }

    return;
};