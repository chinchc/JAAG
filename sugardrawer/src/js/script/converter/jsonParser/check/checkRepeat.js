//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import { check_position } from "./checkPosition";
import { check_probability } from "./checkProbability";
import { check_linkagetype } from "./checkLinkagetype";
import {check_bridge} from "./checkBridge";

export let check_repeat = (repeat: Object): boolean => {
    let repeat_numKeys: Array<string> = Object.keys(repeat);
    if(repeat_numKeys.length === 0) return true;
    for(let repeat_numKey: string of repeat_numKeys) {
        let repeat_keys: Array<string> = Object.keys(repeat[repeat_numKey]);
        if(repeat_keys.length === 0) return false;
        let MIN_FLAG: boolean = false;
        let POSITION_FLAG: boolean = false;
        let MAX_FLAG: boolean = false;
        let START_FLAG: boolean = false;
        let PROBABILITY_FLAG: boolean = false;
        let END_FLAG: boolean = false;
        // let BRIDGE_FLAG: boolean = false;
        let LINKAGE_FLAG: boolean = false;
        for(let repeat_key: string of repeat_keys) {
            switch(repeat_key.toLowerCase()) {
                case JSONKeys.Min.toLowerCase(): {
                    if(typeof repeat[repeat_numKey][repeat_key] === "number") MIN_FLAG = true;
                    else MIN_FLAG = false;
                    break;
                }
                case JSONKeys.Position.toLowerCase(): {
                    POSITION_FLAG = check_position(repeat[repeat_numKey][repeat_key]);
                    break;
                }
                case JSONKeys.Max.toLowerCase(): {
                    if(typeof repeat[repeat_numKey][repeat_key] === "number") MAX_FLAG = true;
                    else MAX_FLAG = false;
                    break;

                }
                case JSONKeys.Start.toLowerCase(): {
                    if(typeof repeat[repeat_numKey][repeat_key] === "string") START_FLAG = true;
                    else START_FLAG = false;
                    break;
                }
                case JSONKeys.Probability.toLowerCase(): {
                    PROBABILITY_FLAG = check_probability(repeat[repeat_numKey][repeat_key]);
                    break;
                }
                case JSONKeys.End.toLowerCase(): {
                    if(typeof repeat[repeat_numKey][repeat_key] === "string") END_FLAG = true;
                    else END_FLAG = false;
                    break;
                }
                // case JSONKeys.Bridge.toLowerCase(): {
                //     BRIDGE_FLAG = check_bridge(repeat[repeat_numKey][repeat_key]);
                //     break;
                // }
                case JSONKeys.LinkageType.toLowerCase(): {
                    LINKAGE_FLAG = check_linkagetype(repeat[repeat_numKey][repeat_key]);
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        if(MIN_FLAG && POSITION_FLAG && MAX_FLAG && START_FLAG && PROBABILITY_FLAG && END_FLAG && LINKAGE_FLAG) continue;
        else return false;
    }
    return true;
};
