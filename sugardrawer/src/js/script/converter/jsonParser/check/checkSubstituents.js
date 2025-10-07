//@flow
"use strict";

import {JSONKeys} from "../../../data/JSONKeys";
import {check_position} from "./checkPosition";
import {check_probability} from "./checkProbability";
import {check_linkagetype} from "./checkLinkagetype";
import {check_notation_value} from "./checkNotationValue";

export const check_substituents = (substituents: Array<Object>) => {
    for(let substituent: Object of substituents) {
        let keys: Array<string> = Object.keys(substituent);
        if(keys.length === 0 ) return false;
        let POSITION_FLAG: boolean = false;
        let STATUS_FLAG: boolean = false;
        let PROBABILITY_FLAG: boolean = false;
        let LINKAGETYPE_FLAG: boolean = false;
        let NOTATION_FLAG: boolean = false;
        for(let key: string of keys) {
            switch (key.toLowerCase()) {
                case JSONKeys.Position.toLowerCase(): {
                    POSITION_FLAG = check_position(substituent[key]);
                    break;
                }
                case JSONKeys.Status.toLowerCase(): {
                    switch (substituent[key].toLowerCase()) {
                        case "simple":
                        case "fuzzy": {
                            STATUS_FLAG = true;
                            break;
                        }
                        default: STATUS_FLAG = false;
                    }
                    break;
                }
                case JSONKeys.Probability.toLowerCase(): {
                    PROBABILITY_FLAG = check_probability(substituent[key]);
                    break;
                }
                case JSONKeys.LinkageType.toLowerCase(): {
                    LINKAGETYPE_FLAG = check_linkagetype(substituent[key]);
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    NOTATION_FLAG = check_notation_value(substituent[key]);
                    break;
                }
                default: return false;
            }
        }
        console.log("position", POSITION_FLAG);
        console.log("Status", STATUS_FLAG);
        console.log("Probability", PROBABILITY_FLAG);
        console.log("LinkageType", LINKAGETYPE_FLAG);
        console.log("Notation", NOTATION_FLAG);
        if(POSITION_FLAG && STATUS_FLAG && PROBABILITY_FLAG && LINKAGETYPE_FLAG && NOTATION_FLAG) continue;
        else return false;
    }
    return true;
};