//@flow
"use strict";

import { nodeModeType } from "../../react/nodeModeType";
import { createHexose } from "./createHexose";
import { createHexNAc } from "./createHexNAc";
import { createHexosamine } from "./createHexosamine";
import { createHexuronate } from "./createHexuronate";
import { createDeoxyHexose } from "./createDeoxyHexose";
import { createDeoxyHexNAc } from "./createDeoxyHexNAc";
import { createDi_DeoxyHexose } from "./createDi_DeoxyHexose";
import { createPentose } from "./createPentose";
import { createDeoxynonulosonate } from "./createDeoxynonulosonate";
import { createDi_Deoxynonulosonate } from "./createDi_Deoxynonulosonate";
import { createUnknown } from "./createUnknown";
import { createAssigned } from "./createAssigned";
import { createUndefSNFG } from "./createUndefSNFG";
import { basicData } from "../data/graphicsData";
import createjs from "createjs-easeljs";
import {nodeModeSearch, nodeType} from "../../react/nodeModeSearch";

export let createSNFGSymbol: Function = (_nodeName: string): createjs.Shape => {
    const nodeSymbol: Symbol = nodeModeSearch(_nodeName);
    let symbolSize: number = basicData.symbolSize;
    let ret: createjs.shape;

    switch (nodeType(nodeSymbol)) {
        case nodeModeType.HEX: {
            ret = createHexose(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.HEXNAC:{
            ret = createHexNAc(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.HEXN: {
            ret= createHexosamine(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.HEXA: {
            ret= createHexuronate(nodeSymbol);
            break;
        }
        case nodeModeType.DHEX: {
            ret= createDeoxyHexose(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.DHEXNAC: {
            ret= createDeoxyHexNAc(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.DDHEX: {
            ret= createDi_DeoxyHexose(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.PEN: {
            ret= createPentose(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.NON: {
            ret= createDeoxynonulosonate(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.DNON: {
            ret= createDi_Deoxynonulosonate(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.UNKNOWN: {
            ret= createUnknown(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.ASSIGNED: {
            ret= createAssigned(nodeSymbol, symbolSize);
            break;
        }
        case nodeModeType.NOT_SELECTED: {
            ret= createUndefSNFG(symbolSize, _nodeName);
            break;
        }
        default: {
            alert(`SugarDrawer can not support ${_nodeName}.`);
            break;
        }
    }

    //ret.graphics.name = _nodeName;
    ret.name = "symbol";

    return ret;
};