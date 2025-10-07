//@flow
"use strict";

import { ParserRepeat } from "../../../class/ParserClass/ParserRepeat";
import {JSONKeys} from "../../../data/JSONKeys";

export const assignRepeat = (repeats: Object, repeatObj: Object) => {
    for(let key: string of Object.keys(repeats)) {
        let parser: ParserRepeat = new ParserRepeat();
        for(let repeat_key: string of Object.keys(repeats[key])) {
            switch (repeat_key.toLowerCase()) {
                case JSONKeys.Min.toLowerCase(): {
                    parser.Min = repeats[key][repeat_key];
                    break;
                }
                case JSONKeys.Max.toLowerCase(): {
                    parser.Max = repeats[key][repeat_key];
                    break;

                }
                case JSONKeys.Position.toLowerCase(): {
                    parser.Position = repeats[key][repeat_key];
                    break;
                }
                case JSONKeys.Start.toLowerCase(): {
                    parser.Start = repeats[key][repeat_key];
                    break;
                }
                case JSONKeys.End.toLowerCase(): {
                    parser.End = repeats[key][repeat_key];
                    break;
                }
            }
        }
        parser.checkNumOfReapt();
        repeatObj[key] = parser;
    }
    return repeatObj;
};