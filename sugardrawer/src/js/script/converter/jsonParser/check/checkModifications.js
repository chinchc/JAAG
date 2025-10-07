//@flow
"use strict";

import { JSONKeys } from "../../../data/JSONKeys";
import { check_notation_value } from "./checkNotationValue";


/***
 *   JSON MonosaccharidesのModificationのチェック
 * @param json: Modification の配列
 * @returns {boolean} : cehckの結果OKかどうか
 */
export let check_modifications = (modifications: Array<Object>): boolean => {
    if(modifications.length === 0) return true;
    for(let modification: Object of modifications) {
        let POSITION_FLAG:boolean = true;
        let NOTATION_FLAG: boolean = false;
        let keys: Array<string> = Object.keys(modification);
        for(let key of keys) {
            switch (key.toLowerCase()) {
                case JSONKeys.Position.toLowerCase(): {
                    for(let positionNum: number of modification[key]) {
                        if(typeof positionNum !== "number") {
                            POSITION_FLAG = false;
                        }
                    }
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    NOTATION_FLAG = check_notation_value(modification[key]);
                    if(!NOTATION_FLAG) return false;
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        if(POSITION_FLAG && NOTATION_FLAG) {
            continue;
        }
        else {
            return false;
        }
    }
    return true;
};
