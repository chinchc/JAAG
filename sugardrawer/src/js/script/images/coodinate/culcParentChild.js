//@flow
"use strict";

export function culcParentChild(sugar1: Object, sugar2: Object): Array<Object> {
    let parentChild: Array<Sugar> = [];
    if (sugar1.getXLayer() < sugar2.getXLayer()) {
        parentChild = [sugar1, sugar2];
    }
    else {
        parentChild = [sugar2, sugar1];
    }
    // if (sugar1.xCoord < sugar2.xCoord) {
    //     parentChild.push(sugar2);
    //     parentChild.push(sugar1);
    // }
    // else {
    //     parentChild.push(sugar1);
    //     parentChild.push(sugar2);
    // }
    return parentChild;
}