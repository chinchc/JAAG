//@flow
"use strict";

import {JSONKeys} from "../../../data/JSONKeys";
import { ParserBinding } from "../../../class/ParserClass/ParserBinding";

export const assignEdges = (edges: Object, edgeObj: Object): Object => {
    for(let key: string of Object.keys(edges)) {
        let parser: ParserBinding = new ParserBinding();
        for(let edge_key: string of Object.keys(edges[key])) {
            switch(edge_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    parser.Acceptor = edges[key][edge_key];
                    break;
                }
                case JSONKeys.Donor.toLowerCase():{
                    parser.Donor = edges[key][edge_key];
                    break;
                }
                case JSONKeys.Position.toLowerCase(): {
                    parser.Position = edges[key][edge_key];
                    break;
                }
            }
        }
        parser.checkWhichSide();
        edgeObj[key] = parser.createGlycoBond();
    }
    return edgeObj;
};