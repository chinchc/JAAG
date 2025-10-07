//@flow
"use strict";

/**
 * サイクリック結合の描画とデータ構造設定
 * @param parentSugar: Sugar, 普通のグリコシド結合での親単糖
 * @param childSugar: Sugar, 普通のグリコシド結合での子単糖
 */

export let createCyclic = (parentSugar: Object, childSugar: Object): Object => {
    //let cyclicBond: Glycobond;
    // if(!childSugar.isChildCyclicEmpty()) {
    //     //すでに描画されているか検索
    //     for (let bind: Glycobond of parentSugar.getParentBond()) {
    //         //すでに描画されている場合、削除する
    //         if(bind.getParentSugar() === childSugar) {
    //             liaise.removeStage(bind);  //ステージから削除
    //             childSugar.getParentBond().slice(childSugar.getParentBond().indexOf(bind), 1);  //子Nodeから削除した結合のデータを削除
    //             childSugar.getParentSugars().slice(childSugar.getParentSugars().indexOf(parentSugar), 1);  //子Nodeから削除した結合の親Nodeのデータを削除
    //             parentSugar.getChildSugars().slice(childSugar.getChildSugars().indexOf(childSugar), 1); //親Nodeから削除した結合の子Nodeのデータを削除
    //         }
    //     }
    // }
    /*
	cyclicBond = drawCyclicEdge(parentSugar, childSugar);
    let cyclic: Cyclic = new Cyclic();
    cyclic.setNonReductionSugar(childSugar);
    cyclic.setReductionSugar(parentSugar);
    childSugar.setChildSugars(parentSugar);
    childSugar.setChildCyclic(cyclic);
    parentSugar.setParentSugars(childSugar);
    parentSugar.setParentBond(cyclicBond);
    cyclicBond.setParentSugar(childSugar);
    cyclicBond.setChildSugar(parentSugar);
    return cyclicBond;
	*/
    // let parentChild: Array<Sugar> = culcParentChild(sugar1, sugar2);
    // let parentSugar: Sugar = parentChild[1];
    // let childSugar: Sugar = parentChild[0];
    //
    // let childCyclic: Cyclic = new Cyclic();
    // childCyclic.setReductionSugar(childSugar);
    // childCyclic.setNonReductionSugar(parentSugar);
    // childSugar.setParentSugars(parentSugar);
    // childSugar.setParentBond(edge);
    // // for (let i = 0; i < glycans.length; i++) {
    // //     switch (parentSugar.getGlycan()) {
    // //         case glycans[i]: {
    // //             glycans.splice(i, 1);
    // //             childSugar.setGlycan(parentSugar.getGlycan());
    // //             break;
    // //         }
    // //         default:
    // //             break;
    // //     }
    // // }
    // parentSugar.setChildSugars(childSugar);
    // parentSugar.setChildNodes(childSugar);
    // parentSugar.setChildCyclic(childCyclic);
    // edge.setParentSugar(parentSugar);
    // edge.setChildSugar(childSugar);
};