//@flow
"use strict";

import { Sugar } from "../class/Sugar";

/**
 *
 * @param target: 今焦点をおいている単糖
 * @param most_under_layer: 現在セットされている最低のLayer
 * @returns {number}
 */
export const recuversive_set_YLayer = (target: Sugar, most_under_layer: number): number => {
    for(let child: Sugar of target.getChildSugars()) {
        most_under_layer = recuversive_set_YLayer(child, most_under_layer);
    }
    if(target.hasChildSugars()) {
        switch(target.getChildSugars().length % 2) {
            case 0: {
                let child_max_layer = -10000;
                let child_min_layer = 1;
                for(let child: Sugar of target.getChildSugars()) {
                    if(child_max_layer < child.getYLayer()) child_max_layer = child.getYLayer();
                    else if(child_min_layer > child.getYLayer()) child_min_layer = child.getYLayer();
                }
                target.setYLayer(Math.floor((-1) * (((-1) * child_max_layer + (-1) * child_min_layer) / 2)));  //小数点は切り捨て
                return most_under_layer;
            }
            case 1: {
                target.setYLayer(target.childSugars[Math.floor(target.getChildSugars().length /2)].getYLayer());
                return most_under_layer;
            }
            default: break;
        }
    }
    else {
        let parent: Sugar = target.getParentSugars()[0];
        switch (parent.getChildSugars().length % 2) {
            case 0: {
                for(let index: number = 0; index < parent.getChildSugars().length; index++) {
                    if(target === parent.childSugars[index]) {
                        if(index === parent.getChildSugars().length / 2){
                            target.setYLayer(most_under_layer - 2);
                            return most_under_layer - 2;
                        }
                        else {
                            target.setYLayer(most_under_layer - 1);
                            return most_under_layer - 1;
                        }
                    }
                }
                break;
            }
            case 1: {
                target.setYLayer(most_under_layer - 1);
                return most_under_layer - 1;
            }
            default: break;
        }
    }
    return most_under_layer;
};
