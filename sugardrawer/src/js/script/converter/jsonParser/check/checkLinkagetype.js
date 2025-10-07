//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";

export let check_linkagetype = (linkage: Object): boolean => {
    let linkage_keys: Array<string> = Object.keys(linkage);
    if(linkage_keys.length === 0) return false;
    let ACCEPTER_FLAG: boolean = false;
    let DONOR_FLAG: boolean = false;
    for(let linkage_key: string of linkage_keys) {
        switch (linkage_key.toLowerCase()) {
            case JSONKeys.Acceptor.toLowerCase(): {
                if(typeof linkage[linkage_key] === "string") ACCEPTER_FLAG = true;
                else ACCEPTER_FLAG = false;
                break;
            }
            case JSONKeys.Donor.toLowerCase(): {
                if(typeof linkage[linkage_key] === "string") DONOR_FLAG = true;
                else DONOR_FLAG = false;
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
