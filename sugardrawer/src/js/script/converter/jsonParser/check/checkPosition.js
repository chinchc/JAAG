//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";

export let check_position = (position: Object): boolean => {
    let position_keys: Array<string> = Object.keys(position);
    if(position_keys.length === 0) return false;
    let ACCEPTER_FLAG: boolean = true;
    let DONOR_FLAG: boolean = true;
    for(let position_key: string of position_keys) {
        switch(position_key.toLowerCase()) {
            case JSONKeys.Acceptor.toLowerCase(): {
                for(let accepter: number of position[position_key]) {
                    if(typeof accepter === "number") continue;
                    else ACCEPTER_FLAG = false;
                }
                break;
            }
            case JSONKeys.Donor.toLowerCase(): {
                for(let donor: number of position[position_key]) {
                    if(typeof donor === "number") continue;
                    else DONOR_FLAG = false;
                }
                break;
            }
            default: {
                return false;
            }
        }
    }
    if(ACCEPTER_FLAG && DONOR_FLAG) return true;
    else return false;
};
