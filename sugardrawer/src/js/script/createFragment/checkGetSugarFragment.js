//@flow
"use strict";

import {Sugar} from "../class/Sugar";

export let checkSugarHasFragmentBracketinGlycan = (sugar: Sugar): boolean => {
    if(!sugar.isFragmentBracketEmpty()) {
        return true;
    }
    else if(!sugar.isChildCyclicEmpty()) {
        return false;
    }
    else {
        for (let child: Sugar of sugar.getChildSugars()) {
            let result: boolean;
            result = checkSugarHasFragmentBracketinGlycan(child);
            if (result) {
                return result;
            }
        }
        return false;
    }
};

export let getSugarHasFragmentBracket = (sugar: Sugar, resultArray: Array<Sugar>): Array<Sugar> => {
    if(!sugar.isFragmentBracketEmpty()) {
        resultArray.push(sugar);
    }
    else{
        for(let child: Sugar of sugar.getChildSugars()) {
            resultArray = getSugarHasFragmentBracket(child, resultArray);
        }
    }
    return resultArray;
};