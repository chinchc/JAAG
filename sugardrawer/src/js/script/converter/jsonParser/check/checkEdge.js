//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import { check_position } from "./checkPosition";
import {check_probability} from "./checkProbability";
import {check_linkagetype} from "./checkLinkagetype";

//fragment Edgeのcheck関数
export let check_edge = (edge: Object): boolean => {
    let edge_numKeys: Array<string> = Object.keys(edge);
    if(edge_numKeys.length === 0) return false;
    for(let edge_numKey: string of edge_numKeys) {
        let edge_keys: Array<string> = Object.keys(edge[edge_numKey]);
        if(edge_keys.length === 0) return false;
        let ACCEPTER_FLAG: boolean = false;
        let DONOR_FLAG: boolean = false;
        let POSITION_FLAG: boolean = false;
        let PROBANILITY_FLAG: boolean = false;
        let LINKAGETYPE_FLAG: boolean = false;
        for(let edge_key of edge_keys) {
            switch(edge_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    if(typeof edge[edge_numKey][edge_key] === "string") ACCEPTER_FLAG = true;
                    else ACCEPTER_FLAG = false;
                    break;
                }
                case JSONKeys.Donor.toLowerCase(): {
                    if(typeof edge[edge_numKey][edge_key] === "string") DONOR_FLAG = true;
                    else DONOR_FLAG = false;
                    break;
                }
                case JSONKeys.Position.toLowerCase(): {
                    POSITION_FLAG = check_position(edge[edge_numKey][edge_key]);
                    break;
                }
                case JSONKeys.Probability.toLowerCase(): {
                    PROBANILITY_FLAG = check_probability(edge[edge_numKey][edge_key])
                    break;
                }
                case JSONKeys.LinkageType.toLowerCase(): {
                    LINKAGETYPE_FLAG = check_linkagetype(edge[edge_numKey][edge_key]);
                    break;
                }
                default:{
                    return false;
                }
            }
        }
        if(ACCEPTER_FLAG && DONOR_FLAG && POSITION_FLAG && PROBANILITY_FLAG && LINKAGETYPE_FLAG) continue;
        else return false;
    }
    return true;
};

export const check_fragment_edge = (edge: Object): boolean => {
    let edge_keys: Array<string> = Object.keys(edge);
    if(edge_keys.length === 0) return false;
    let POSITION_FLAG: boolean = false;
    let PROBANILITY_FLAG: boolean = false;
    let LINKAGETYPE_FLAG: boolean = false;
    for(let edge_key of edge_keys) {
        switch(edge_key.toLowerCase()) {
            case JSONKeys.Position.toLowerCase(): {
                POSITION_FLAG = check_position(edge[edge_key]);
                break;
            }
            case JSONKeys.Probability.toLowerCase(): {
                PROBANILITY_FLAG = check_probability(edge[edge_key]);
                break;
            }
            case JSONKeys.LinkageType.toLowerCase(): {
                LINKAGETYPE_FLAG = check_linkagetype(edge[edge_key]);
                break;
            }
            default:{
                return false;
            }
        }
    }
    if(POSITION_FLAG && PROBANILITY_FLAG && LINKAGETYPE_FLAG) return true;
    else return false;
};