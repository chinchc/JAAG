//@flow
"use strict";

export let check_notation_value = (notation: string): boolean => {
    if(typeof notation === "string") return true;
    else return false;
};