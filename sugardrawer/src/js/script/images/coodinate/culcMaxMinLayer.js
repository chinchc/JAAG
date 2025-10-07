//@flow
"use strict";

import {Glycan} from "../class/Glycan";
import {Sugar} from "../class/Sugar";

export const culc_max_min_layer = (glycanArray: Array<Glycan>) => {
    let maxMInLayer: Array<number> = [-1, 100000, -100000, 1]; //[maxX(一番左のlayer), minX(一番右のlayer). maxY(一番上のlayer: 0, -1, -2 ...), minY(一番下のlayer: -20, -21...)]
    for(let glycan: Glycan of glycanArray) {
        maxMInLayer = recuversive_culc_layer(glycan.getRootNode(), maxMInLayer);
    }
    return maxMInLayer;

};

const recuversive_culc_layer = (sugar: Sugar, maxMinLayer: Array<number>): Array<number> => {
    if (sugar.getXLayer() >= maxMinLayer[0]) maxMinLayer[0] = sugar.getXLayer();
    if (sugar.getXLayer() <= maxMinLayer[1]) maxMinLayer[1] = sugar.getXLayer();
    if ((-1) * sugar.getYLayer() >= maxMinLayer[2]) maxMinLayer[2] = (-1) * sugar.getYLayer();
    if ((-1) * sugar.getYLayer() <= maxMinLayer[3]) maxMinLayer[3] = (-1) * sugar.getYLayer();
    for(let child: Sugar of sugar.getChildSugars()) {
        maxMinLayer = recuversive_culc_layer(child, maxMinLayer);
    }
    return maxMinLayer;
};

// export const culc_max_min_layer = (glycan: Glycan) => {
//     let maxMInLayer: Array<number> = [-1, 100000, -100000, 1]; //[maxX(一番左のlayer), minX(一番右のlayer). maxY(一番上のlayer: 0, -1, -2 ...), minY(一番下のlayer: -20, -21...)]
//     maxMInLayer = recuversive_culc_layer(glycan.getRootNode(), maxMInLayer);
//     return maxMInLayer;
//
// };
//
// const recuversive_culc_layer = (sugar: Sugar, maxMinLayer: Array<number>): Array<number> => {
//     if (sugar.getXLayer() >= maxMinLayer[0]) maxMinLayer[0] = sugar.getXLayer();
//     if (sugar.getXLayer() <= maxMinLayer[1]) maxMinLayer[1] = sugar.getXLayer();
//     if (sugar.getYLayer() >= maxMinLayer[2]) maxMinLayer[2] = sugar.getYLayer();
//     if (sugar.getYLayer() <= maxMinLayer[3]) maxMinLayer[3] = sugar.getYLayer();
//     for(let child: Sugar of sugar.getChildSugars()) {
//         maxMinLayer = recuversive_culc_layer(child, maxMinLayer);
//     }
//     return maxMinLayer;
// };