//@flow
"use strict";

import { ParserMonosaccharide } from "../../../class/ParserClass/ParserMonosaccharide";
import {JSONKeys} from "../../../data/JSONKeys";

export const assignMonosaccharide = (monosaccharide: Object, monosaccharideObj: Object): Object => {
    for(let key: string of Object.keys(monosaccharide)) {
        let parser: ParserMonosaccharide = new ParserMonosaccharide();
        for(let mono_key of Object.keys(monosaccharide[key])) {
            switch(mono_key.toLowerCase()) {
                case JSONKeys.Modifications.toLowerCase():{
                    parser.Modifications = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.TrivialName.toLowerCase(): {
                    parser.TrivialName = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.Substituents.toLowerCase(): {
                    parser.Substituents = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.Configuration.toLowerCase(): {
                    parser.Configuration = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.SuperClass.toLowerCase(): {
                    parser.SuperClass = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.RingSize.toLowerCase(): {
                    parser.RingSize = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.AnomState.toLowerCase(): {
                    parser.AnomState = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.AnomPosition.toLowerCase(): {
                    parser.AnomPosition = monosaccharide[key][mono_key];
                    break;
                }
                case JSONKeys.Notation.toLowerCase(): {
                    parser.Notation = monosaccharide[key][mono_key];
                    break;
                }
            }
        }
        monosaccharideObj[key] = parser.checkSNFGNoatation();
        parser.checkModificaiton(monosaccharideObj[key]);
        parser.checkSubstituents(monosaccharideObj[key]);
        parser.checkAnome(monosaccharideObj[key]);
    }
    return monosaccharideObj;
};