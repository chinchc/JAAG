//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import { check_fragment_edge } from "./checkEdge";

export let check_fragment = (fragment: Object): boolean => {
    let fragment_numKeys: Array<string> = Object.keys(fragment);
    if(fragment_numKeys.length === 0) return true;
    for(let fragment_numKey: string of fragment_numKeys) {
        let fragment_keys: Array<string> = Object.keys(fragment[fragment_numKey]);
        if(fragment_keys.length === 0) return false;
        let ACCEPTER_FLAG: boolean = true;
        let DONOR_FLAG: boolean = true;
        let EDGE_FLAG: boolean = false;
        for(let fragment_key: string of fragment_keys) {
            switch(fragment_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    for(let monoKey: string of fragment[fragment_numKey][fragment_key]) {
                        if(typeof monoKey === "string") continue;
                        else ACCEPTER_FLAG = false;
                    }
                    break;
                }
                case JSONKeys.Donor.toLowerCase(): {
                    if(typeof fragment[fragment_numKey][fragment_key] === "string") continue;
                    else DONOR_FLAG = false;
                    break;
                }
                case JSONKeys.Edge.toLowerCase(): {
                    EDGE_FLAG = check_fragment_edge(fragment[fragment_numKey][fragment_key]);
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        // console.log("Acceptor", ACCEPTER_FLAG);
        // console.log("Donor", DONOR_FLAG);
        // console.log("Edge", EDGE_FLAG);
        if(ACCEPTER_FLAG && DONOR_FLAG && EDGE_FLAG) continue;
        else return false;
    }
    return true;
};
