//@flow
"use strict";

import { liaise } from "../../index";

export let culcMaxMinCoordinate = (glycans: Array<Object>): Array<number> => {
    if(liaise.subGraph.length === 0) {
        let maxX: number = glycans[0].getRootNode().getXCoord();
        let minX: number = glycans[0].getRootNode().getXCoord();
        let maxY: number = glycans[0].getRootNode().getYCoord();
        let minY: number = glycans[0].getRootNode().getYCoord();
        let array= [maxX, minX, maxY, minY];
        for(let glycan of glycans) {
            array = recursiveCulcuration(array, glycan.getRootNode());
        }
        return array; //[maxX. minX, maxY, minY]
    }
    else {
        let maxX: number = 0;
        let minX: number = 0;
        let maxY: number = 0;
        let minY: number = 0;
        /*
        let maxX: number = liaise.getSelectedFragmentNonReductionSugar()[0].getXCoord();
        let minX: number = liaise.getSelectedFragmentNonReductionSugar()[0].getXCoord();
        let maxY: number = liaise.getSelectedFragmentNonReductionSugar()[0].getYCoord();
        let minY: number = liaise.getSelectedFragmentNonReductionSugar()[0].getYCoord();
         */
        for(let sugar: Object of liaise.subGraph) {
            if(maxX < sugar.getXCoord()) {
                maxX = sugar.getXCoord();
            }
            else if(minX > sugar.getXCoord()) {
                minX = sugar.getXCoord();
            }
            if(maxY < sugar.getYCoord()) {
                maxY = sugar.getYCoord();
            }
            else if(minY > sugar.getYCoord()) {
                minY = sugar.getYCoord();
            }
        }
        return [maxX, minX, maxY, minY];
    }


};

let recursiveCulcuration = (array: Array<number>, sugar: Object): Array<number> => {
    if(array[0] < sugar.getXCoord()) {
        array[0] = sugar.getXCoord();
    }
    else if (array[1] > sugar.getXCoord()) {
        array[1] = sugar.getXCoord();
    }
    if(array[2] < sugar.getYCoord()) {
        array[2] = sugar.getYCoord();
    }
    else if (array[3] > sugar.getYCoord()) {
        array[3] = sugar.getYCoord();
    }
    if (!sugar.hasChildSugars()){
        return array;
    }
    else {
        for (let child: Object of sugar.childSugars) {
            if(!sugar.isChildCyclicEmpty()) {
                if(sugar.getChildCyclic().getReductionSugar() === child) {
                    continue;
                }
            }
            array = recursiveCulcuration(array, child);
        }
    }
    return array;
};