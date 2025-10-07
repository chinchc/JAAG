//@flow
"use strict";

/*
import { nodeModeSearch, nodeType } from "../../react/nodeModeSearch";
import {nodeModeType} from "../../react/nodeModeType";
import { basicData } from "../data/graphicsData";
import { createHexose } from "../createSugar/createHexose";
import { createHexNAc } from "../createSugar/createHexNAc";
import { createHexosamine } from "../createSugar/createHexosamine";
import { createHexuronate } from "../createSugar/createHexuronate";
import { createDeoxyHexose } from "../createSugar/createDeoxyHexose";
import { createDeoxyHexNAc } from "../createSugar/createDeoxyHexNAc";
import { createDi_DeoxyHexose } from "../createSugar/createDi_DeoxyHexose";
import { createPentose } from "../createSugar/createPentose";
import { createDeoxynonulosonate } from "../createSugar/createDeoxynonulosonate";
import { createDi_Deoxynonulosonate } from "../createSugar/createDi_Deoxynonulosonate";
import { createUnknown } from "../createSugar/createUnknown";
import { createAssigned } from "../createSugar/createAssigned";
import { createCompositionText } from "./createCompositionText";
import {createUndefSNFG} from "../createSugar/createUndefSNFG";

export let createComposition = (array: Array<string>) => {
    let compositionArray: Array<Symbol> = [];
    let undefList = [];
    for(let item: string of array) {
        console.log(item);
        compositionArray.push(nodeModeSearch(item));
        if(nodeModeSearch(item) === nodeModeType.NOT_SELECTED) {
            undefList.push(item);
        }
    }
    let shapeObject: Object = {};
    let index: number = 0;
    for(let symbol: Symbol of compositionArray) {
        switch(nodeType(symbol)) {
            case nodeModeType.HEXOSE: {
                shapeObject = createHexose(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.HEXNAC: {
                shapeObject = createHexNAc(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.HEXOSAMINE: {
                shapeObject = createHexosamine(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.HEXURONATE: {
                shapeObject = createHexuronate(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.DEOXYHEXOSE: {
                shapeObject = createDeoxyHexose(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.DEOXYHEXNAC: {
                shapeObject = createDeoxyHexNAc(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.DI_DEOXYHEXOSE: {
                shapeObject = createDi_DeoxyHexose(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.PENTOSE: {
                shapeObject = createPentose(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.DEOXYNONULOSONATE: {
                shapeObject = createDeoxynonulosonate(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.DI_DEOXYNONULOSONATE: {
                shapeObject = createDi_Deoxynonulosonate(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.UNKNOWN: {
                shapeObject = createUnknown(symbol, basicData.symbolSize);
                break;
            }
            case nodeModeType.ASSIGNED: {
                shapeObject = createAssigned(symbol, basicData.symbolSize);
                break;
            }
            default: {
                let symbolName = undefList[0];
                shapeObject = createUndefSNFG(symbolName, basicData.symbolSize + 10);
                console.log(shapeObject);
                undefList.splice(0, 1);
            }
        }
        let flag = false;
        for(let item: Object of compositions) {
            if(item instanceof UndefComposition) {
                if(item.getName() === shapeObject.nodeName) {
                    item.getCompositionText().children[0].text = String(liaise.compositionSelect["Undefined"]) + " ×";
                    item.getCompositionText().setNop(liaise.compositionSelect["Undefined"]);
                    index += 1;
                    flag = true;
                }
            }
            else {
                if(item.getName() === shapeObject.nodeName) {
                    item.getCompositionText().children[0].text = String(liaise.compositionSelect[array[index]]) + " ×";
                    item.getCompositionText().setNop(liaise.compositionSelect[array[index]]);
                    index += 1;
                    flag = true;
                }
            }

        }
        if(flag) {
            continue;
        }
        let composition: Object;
        let compositionText: Object;
        if(nodeType(symbol) === nodeModeType.NOT_SELECTED){
            console.log("入ってる?");
            composition = new UndefComposition(shapeObject.nodeName);
            composition.addChild(shapeObject.rect);
            composition.addChild(shapeObject.shape);
            compositionText = createCompositionText(liaise.compositionSelect["Undefined"]);
        }
        else {
            console.log("こっち？");
            composition = new Composition(shapeObject.nodeName);
            composition.addChild(shapeObject.shape);
            compositionText = createCompositionText(liaise.compositionSelect[array[index]]);
        }

        composition.setCompositionText(compositionText);
        let glid: Array<number> = nextCompostionsGrids(compositionText);
        console.log("glids", glid);
        composition.setXCoord(glid[0] - basicData.symbolSize - basicData.symbolDistance);
        composition.setYCoord(glid[1] - basicData.symbolSize - basicData.symbolDistance);
        compositionText.setXCoord(glid[0] - compositionText.children[0].getMeasuredWidth() / 2 - 3 * basicData.compositionTextToSymbol - 2 * basicData.symbolSize - basicData.symbolDistance);
        compositionText.setYCoord(glid[1] - basicData.symbolSize - basicData.symbolDistance - basicData.compositionTextToSymbol);
        compositions.push(composition);
        liaise.addStage(composition);
        liaise.addStage(compositionText);
        index += 1;
    }
    liaise.stageUpdate();
};

export let nextCompostionsGrids = (compositionText: Object): Array<number> => {
    let textWidth: number = compositionText.children[0].getMeasuredWidth();
    let basicX: number = basicData.symbolDistance + textWidth + basicData.compositionTextToSymbol + 2 * basicData.symbolSize + basicData.symbolDistance;
    let basicY: number = basicData.symbolDistance + 2 * basicData.symbolSize + basicData.symbolDistance;
    if(compositionsGlids.length === 0) {
        compositionsGlids.push([basicX, basicY]);
        return [basicX, basicY];
    }
    else if(compositionsGlids.length % 2 === 0 ) {
        let upperCoody: Array<number> = compositionsGlids[compositionsGlids.length - 2];
        compositionsGlids.push([upperCoody[0], upperCoody[1] + basicY]);
        return [upperCoody[0], upperCoody[1] + basicY];
    }
    else {
        let upperCoody: Array<number> = compositionsGlids[compositionsGlids.length - 1];
        compositionsGlids.push([upperCoody[0] + basicX, upperCoody[1]]);
        return [upperCoody[0] + basicX, upperCoody[1]]
    }
};
 */