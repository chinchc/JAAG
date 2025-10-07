//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";

export let check_probability = (probability: Object): boolean => {
    let probability_keys: Array<string> = Object.keys(probability);
    if(probability_keys.length === 0) return false;
    let HIGH_FLAG: boolean = false;
    let LOW_FLAG: boolean = false;
    for(let probability_key: string of probability_keys) {
        switch(probability_key.toLowerCase()){
            case JSONKeys.High.toLowerCase(): {
                if(typeof probability[probability_key] === "number") HIGH_FLAG = true;
                else HIGH_FLAG = false;
                break;
            }
            case JSONKeys.Low.toLowerCase(): {
                if(typeof probability[probability_key] === "number") LOW_FLAG = true;
                else LOW_FLAG = false;
                break;
            }
            default: {
                return false;
            }
        }
    }
    if(HIGH_FLAG && LOW_FLAG) return true;
    else false;
};
