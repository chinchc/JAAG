// //@flow
// "use strict";
//
// import { JSONKeys } from "../../data/JSONKeys";
// import { Sugar } from "../../class/Sugar";
// import {Modification} from "../../class/Modification";
// import {Modificationbond} from "../../class/Modificationbond";
// import {Glycan} from "../../class/Glycan";
// import { SNFGSymbolGlycan } from "../../data/SNFGGlycanTable";
// import {Glycobond} from "../../class/Glycobond";
//
// export const set_monosaccharides = (monosaccharides: Object): Glycan => {
//     let keys: Array<string> = Object.keys(monosaccharides);
//     let monosaccharideObj: Object = {};
//     for(let key: string of keys) {
//         set_monosaccharide(key, monosaccharides[key], monosaccharideObj);
//     }
//     // set_parent_child(glycan, sugars);
//     // // console.log(sugars);
//     // console.log(glycan);
//     // return glycan;
// };
//
// //親子関係のデータをセットする
// const set_parent_child = (glycan: Glycan, sugars: Object) => {
//     let keys: Array<string> = Object.keys(sugars);
//     for(let key: string of keys) {
//         if(!sugars[key].hasParentBond()) continue;
//         let parentId: number = sugars[key].getParentBond()[0].getParentId();
//         sugars[parentId].setChildSugars(sugars[key]);
//         sugars[key].setParentSugars(sugars[parentId]);
//         sugars[key].setGlycan(sugars[parentId].getGlycan());
//         sugars[key].setXLayer(sugars[parentId].getXLayer() + 1);
//         sugars[key].getParentBond()[0].setParentSugar(sugars[parentId]);
//         sugars[key].getParentBond()[0].setChildSugar(sugars[key]);
//     }
// };
//
// const set_monosaccharide = (key: string, monosaccharide: Object, monosaccharideObj: Object) => {
//     let sugar: Sugar = new Sugar("");
//     let glycan: Glycan = new Glycan();
//     let keys: Array<string> = Object.keys(monosaccharide);
//
//     for(let key: string of keys) {
//         switch (key.toLowerCase()) {
//             case JSONKeys.Modifications.toLowerCase(): {
//                 //単糖の置換基
//             }
//             case JSONKeys.TrivialName.toLowerCase(): {
//                 //単糖のベースとなる単糖
//             }
//             case JSONKeys.Substituents.toLowerCase(): {
//                 //修飾
//             }
//             case JSONKeys.Configuration.toLowerCase(): {
//
//             }
//             case JSONKeys.SuperClass.toLowerCase(): {
//
//             }
//             case JSONKeys.RingSize.toLowerCase(): {
//
//             }
//             case JSONKeys.AnomState.toLowerCase(): {
//
//             }
//             case JSONKeys.AnomPosition.toLowerCase(): {
//
//             }
//             case JSONKeys.Notation.toLowerCase(): {
//
//             }
//
//         }
//     }
//
//     let glycobond: Glycobond = new Glycobond();
//     let keys: Array<string> = Object.keys(monosaccharide);
//     for(let key: string of keys) {
//         switch(key.toLowerCase()) {
//             // case JSONKeys.TrivialName.toLowerCase():{
//             //
//             // }
//             case JSONKeys.TrivialNotation.toLowerCase(): {
//                 for(let snfg: string of Object.keys(SNFGSymbolGlycan)) {
//                     if(snfg.toLowerCase() === monosaccharide[key].toLowerCase()) {
//                         sugar.changeName(snfg);
//                         break;
//                     }
//                 }
//                 break;
//             }
//             case JSONKeys.AnomericSymbol.toLowerCase(): {
//                 switch (monosaccharide[key].toLowerCase()) {
//                     case "alpha" || "α" || "a": {
//                         sugar.setAnomeric("α");
//                         break;
//                     }
//                     case "beta" || "β" || "b": {
//                         sugar.setAnomeric("β");
//                         break;
//                     }
//                     default: {
//                         sugar.setAnomeric("undefined");
//                         break;
//                     }
//                 }
//                 break;
//             }
//             case JSONKeys.Configuration.toLowerCase(): {
//                 console.log("configuration", monosaccharide[key]);
//                 if(monosaccharide[key].length === 0) sugar.setIsomer("undefined");
//                 switch(monosaccharide[key][0].toLowerCase()) {
//                     case "d": {
//                         sugar.setIsomer("D");
//                         break;
//                     }
//                     case "l": {
//                         sugar.setIsomer("L");
//                         break;
//                     }
//                     default: {
//                         console.log("こっち??");
//                         sugar.setIsomer("undefined");
//                     }
//                 }
//                 break;
//             }
//             case JSONKeys.Edge.toLowerCase(): {
//                 set_glycobond(sugar, glycan, glycobond, monosaccharide[key]);
//                 glycobond.setChildSugar(sugar);
//                 glycobond.setChildAnomeric(sugar.getAnomeric());
//                 if(sugar === glycan.getRootNode()) break;
//                 else sugar.setParentBond(glycobond);
//                 break;
//             }
//             default: {
//                 continue;
//             }
//         }
//     }
//     console.log("in set monosaccharides function.");
// };
//
// const set_glycobond = (sugar: Sugar, glycan: Glycan, glycobond: Glycobond, edgeObject: Object) => {
//     let keys: Array<string> = Object.keys(edgeObject);
//     for(let key: string of keys) {
//         switch(key.toLowerCase()) {
//             case JSONKeys.Parent.toLowerCase(): {
//                 set_parent(sugar, glycan, glycobond, edgeObject[key]);
//                 break;
//             }
//             // case JSONKeys.Repeat.toLowerCase(): {
//             //     set_repeat();
//             // }
//             // case JSONKeys.Fragment.toLowerCase(): {
//             //    set_fragment();
//             // }
//         }
//     }
// };
//
// const set_parent = (sugar: Sugar, glycan: Glycan, glycobond: Glycobond, parentArray: Array<Object>) => {
//     if(parentArray.length === 0) {
//         glycan.setRootNode(sugar);
//         sugar.setXLayer(0);
//         return;
//     }
//     else {
//         for(let parent: Object of parentArray) {
//             for(let key: string of Object.keys(parent)) {
//                 switch(key.toLowerCase()) {
//                     case JSONKeys.Position.toLowerCase(): {
//                         set_position(glycobond, parent[key]);
//                         break;
//                     }
//                     case JSONKeys.ParentNodeID.toLowerCase(): {
//                         if(parent[key] < 0) {
//                             glycan.setRootNode(sugar);
//                         }
//                         else {
//                             glycobond.setParentId(parent[key]);
//                         }
//                         break;
//                     }
//                 }
//             }
//         }
//     }
// };
//
// const set_position = (glycobond: Glycobond, positionObject: Object) => {
//     for(let key: string of Object.keys(positionObject)) {
//         switch(key.toLowerCase()) {
//             case JSONKeys.ChildSide.toLowerCase(): {
//                 if(positionObject[key].length === 0 || positionObject[key][0] < 0) glycobond.setChildPosition("-1");
//                 else glycobond.setChildPosition(String(positionObject[key][0]));
//                 break;
//             }
//             case JSONKeys.ParentSide.toLowerCase(): {
//                 if(positionObject[key].length === 0 || positionObject[key][0] < 0) glycobond.setParentPositon("-1");
//                 else glycobond.setParentPositon(String(positionObject[key][0]));
//                 break;
//             }
//         }
//     }
// };
//
// // const set_modification = (sguar: Sugar, modifications: Array<Object>) => {
// //     for(let modification: Object of modifications) {
// //         let mod: Modification = new Modification();
// //         let modBind: Modificationbond = new Modificationbond();
// //         let keys: Array<string> = Object.keys(modification);
// //         for(let key: string of keys) {
// //             switch(key.toLowerCase()) {
// //                 case JSONKeys.PositionOne.toLowerCase(): {
// //                     modBind.setParentSugarPosition(modification[key]);
// //                     break;
// //                 }
// //                 case JSONKeys.Notation.toLowerCase(): {
// //                     break;
// //                 }
// //             }
// //         }
// //     }
// // };