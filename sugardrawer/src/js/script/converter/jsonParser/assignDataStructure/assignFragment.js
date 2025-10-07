//@flow
"use strict";

import {ParserFragments} from "../../../class/ParserClass/PaeserFragments";
import {JSONKeys} from "../../../data/JSONKeys";
import {ParserFragmentEdge} from "../../../class/ParserClass/ParserFragmentEdge";

export const assignFragment = (fragments: Object, fragmentObj: Object) => {
    for(let key: string of Object.keys(fragments)) {
        let parser: ParserFragments = new ParserFragments();
        for(let frag_key: string of Object.keys(fragments[key])) {
            switch(frag_key.toLowerCase()) {
                case JSONKeys.Acceptor.toLowerCase(): {
                    parser.Acceptor = fragments[key][frag_key];
                    break;
                }
                case JSONKeys.Donor.toLowerCase(): {
                    parser.Donor = fragments[key][frag_key];
                    break;
                }
                case JSONKeys.Edge.toLowerCase(): {
                    let parser_edge: ParserFragmentEdge = new ParserFragmentEdge();
                    for(let edge_key: string of Object.keys(fragments[key][frag_key])){
                        switch(edge_key.toLowerCase()) {
                            case JSONKeys.Position.toLowerCase(): {
                                for(let position_key: string of Object.keys(fragments[key][frag_key][edge_key])) {
                                    switch(position_key.toLowerCase()) {
                                        case JSONKeys.Acceptor.toLowerCase(): {
                                            parser_edge.Acceptor = fragments[key][frag_key][edge_key][position_key];
                                            break;
                                        }
                                        case JSONKeys.Donor.toLowerCase(): {
                                            parser_edge.Donor = fragments[key][frag_key][edge_key][position_key];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    parser.Edge = parser_edge;
                    break;
                }
            }
        }
        fragmentObj[key] = parser;
    }
    return fragmentObj;
};