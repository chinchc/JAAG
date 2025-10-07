//@flow
"use stirct";
import { Bridge } from "../../../class/Bridge";
import { BridgeEdge } from "../../../class/BridgeEdge";
import {JSONKeys} from "../../../data/JSONKeys";
import {ParserBridge} from "../../../class/ParserClass/ParserBridge";

export const assignBridge = (bridges: Object, bridgeObj: Object) => {
    for(let key: string of Object.keys(bridges)) {
        let parser: ParserBridge = new ParserBridge();
        for(let bridge_key: string of Object.keys(bridges[key])) {
            switch(bridge_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    parser.Acceptor = bridges[key][bridge_key];
                    break;
                }
                case JSONKeys.Donor.toLowerCase(): {
                    parser.Donor = bridges[key][bridge_key];
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    parser.Notation = bridges[key][bridge_key];
                    break;
                }
            }
        }
        parser.checkNoatation();
        bridgeObj[key] = parser;
    }
    return bridgeObj;
};