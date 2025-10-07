//@flow
"use strict";

import {JSONKeys} from "../../../data/JSONKeys";
import {check_modifications} from "./checkModifications";
import { check_substituents } from "./checkSubstituents";

export let check_monosaccharides = (monosaccharides: Object): boolean => {
    let monosaccharides_numKeys: Array<string> = Object.keys(monosaccharides);
    if(monosaccharides_numKeys.length === 0) return false;
    let MODIFICATION_FLAG: boolean = false;
    let TRIVIALNAME_FLAG: boolean = true;
    let SUBSTITUENTS_FLAG: boolean = false;
    let CONFIGURATION_FLAG: boolean = true;
    let SUPERCLASS_FLAG: boolean = true;
    let RINGSIZE_FLAG: boolean = true;
    let ANOMSTATE_FLAG: boolean = true;
    let ANOMPOSITION_FLAG: boolean = true;
    let NOTATION_FLAG: boolean = true;
    let RESULT_FLAG: boolean = true;
    for(let monosaccharides_numKey: string of monosaccharides_numKeys) {
        let monosaccharides_keys: Array<string> = Object.keys(monosaccharides[monosaccharides_numKey]);
        for(let monosaccharides_key of monosaccharides_keys) {
            switch (monosaccharides_key.toLowerCase()) {
                case JSONKeys.Modifications.toLowerCase(): {
                    MODIFICATION_FLAG = check_modifications(monosaccharides[monosaccharides_numKey][monosaccharides_key]);
                    break;
                }
                case JSONKeys.TrivialName.toLowerCase(): {
                    for(let trivialName: string of monosaccharides[monosaccharides_numKey][monosaccharides_key]) {
                        if(typeof  trivialName === "string") continue;
                        else TRIVIALNAME_FLAG = false;
                    }
                    break;
                }
                case JSONKeys.Substituents.toLowerCase(): {
                    SUBSTITUENTS_FLAG = check_substituents(monosaccharides[monosaccharides_numKey][monosaccharides_key]);
                    break;
                }
                case JSONKeys.Configuration.toLowerCase(): {
                    for(let configuration: string of monosaccharides[monosaccharides_numKey][monosaccharides_key]) {
                        if(typeof  configuration === "string") continue;
                        else CONFIGURATION_FLAG = false;
                    }
                    break;
                }
                case JSONKeys.SuperClass.toLowerCase(): {
                    if(typeof monosaccharides[monosaccharides_numKey][monosaccharides_key] === "string") continue;
                    else SUPERCLASS_FLAG = false;
                    break;
                }
                case JSONKeys.RingSize.toLowerCase(): {
                    if(typeof monosaccharides[monosaccharides_numKey][monosaccharides_key] === "string") continue;
                    else RINGSIZE_FLAG = false;
                    break;
                }
                case JSONKeys.AnomState.toLowerCase(): {
                    if(typeof monosaccharides[monosaccharides_numKey][monosaccharides_key] === "string") continue;
                    else ANOMSTATE_FLAG = false;
                    break;
                }
                case JSONKeys.AnomPosition.toLowerCase(): {
                    if(typeof monosaccharides[monosaccharides_numKey][monosaccharides_key] === "number") continue;
                    else ANOMPOSITION_FLAG = false;
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    if(typeof monosaccharides[monosaccharides_numKey][monosaccharides_key] === "string") continue;
                    else NOTATION_FLAG = false;
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        // console.log("Modification", MODIFICATION_FLAG);
        // console.log("TrivialName", TRIVIALNAME_FLAG);
        // console.log("Substituents", SUBSTITUENTS_FLAG);
        // console.log("Configuration", CONFIGURATION_FLAG);
        // console.log("SuperClass", SUPERCLASS_FLAG);
        // console.log("RingSize", RINGSIZE_FLAG);
        // console.log("AnomeState", ANOMSTATE_FLAG);
        // console.log("AnomPosition", ANOMPOSITION_FLAG);
        // console.log("Notation", NOTATION_FLAG);
        // console.log("");
        if(MODIFICATION_FLAG && TRIVIALNAME_FLAG && SUBSTITUENTS_FLAG && CONFIGURATION_FLAG && SUPERCLASS_FLAG && RINGSIZE_FLAG && ANOMSTATE_FLAG && ANOMPOSITION_FLAG && NOTATION_FLAG){
            continue;
        }
        else {
            RESULT_FLAG = false;
            break;
        }
    }
    if(RESULT_FLAG) return true;
    else return false;
};