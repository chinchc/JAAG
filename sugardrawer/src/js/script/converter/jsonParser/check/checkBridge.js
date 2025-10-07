//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import {check_linkagetype} from "./checkLinkagetype";

export let check_bridge = (bridge: Object): boolean => {
    let bridge_numKeys: Array<string> = Object.keys(bridge);
    if(bridge_numKeys.length === 0) return true;
    for(let bridge_numKey: string of bridge_numKeys) {
        let bridge_keys: Array<string> = Object.keys(bridge[bridge_numKey]);
        if(bridge_keys.length === 0 ) return false;
        let ACCEPTOR_FLAG: boolean = false;
        let DONOR_FLAG: boolean = false;
        let NOTATION_FLAG: boolean = false;
        let LINKAGETYPE_FLAG: boolean = false;
        for(let bridge_key: string of bridge_keys) {
            switch(bridge_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    if(typeof bridge[bridge_numKey][bridge_key] === "string") ACCEPTOR_FLAG = true;
                    else ACCEPTOR_FLAG = false;
                    break;
                }
                case JSONKeys.Donor.toLowerCase(): {
                    if(typeof bridge[bridge_numKey][bridge_key] === "string") DONOR_FLAG = true;
                    else DONOR_FLAG = false;
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    if(typeof bridge[bridge_numKey][bridge_key] === "string") NOTATION_FLAG = true;
                    else NOTATION_FLAG = false;
                    break;
                }
                case JSONKeys.LinkageType.toLowerCase(): {
                    LINKAGETYPE_FLAG = check_linkagetype(bridge[bridge_numKey][bridge_key]);
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        if(ACCEPTOR_FLAG && DONOR_FLAG && NOTATION_FLAG && LINKAGETYPE_FLAG) continue;
        else return false;
    }
    return true;
};