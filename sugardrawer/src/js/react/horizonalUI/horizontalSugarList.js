/* Modified by Chin Huang at University of Georgia for JAAG on 2025-10-01: substituent click handling and UI list tweaks. */
//@flow

"use strict";

import React from "react";
import MonosaccharideContent from "../expertUI/MonosaccharideContent";
import {Popup} from "semantic-ui-react";
import {liaise} from "../../script/index";
import {modeType} from "../modeType";
import SubstituentType from "sugar-sketcher/src/js/models/glycomics/dictionary/SubstituentType";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";
import {clickContentModification} from "../../script/clickEvent/contentClickCursor";

const handleSubstituentClick = (substituentValue) => {
    liaise.newSubstituent = SubstituentType[substituentValue];

    if (liaise.modeType !== modeType.MODIFICATION) {
        liaise.modeType = modeType.MODIFICATION;
    }

    if (isEmpty(filter(liaise.usedItems, {content: liaise.newSubstituent.label}))) {
        liaise.usedItems = {
            type: "substituent",
            content: liaise.newSubstituent.label,
            value: substituentValue
        };
    }

    liaise.sideBarCancel();
    clickContentModification({nativeEvent: {x: 0, y: 0}});
};

export const searchHorizontalSugarList = (_species: string): HTMLElement => {
    const sugarStyle: Object = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "0px 1px"
    };

    switch(_species) {
        case "mammal": {
            return (
                <div id={"mammal"} style={sugarStyle} >
                    <MonosaccharideContent item={"Glc"} notation={"Glc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Man"} notation={"Man"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Gal"} notation={"Gal"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcNAc"} notation={"GlcNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GalNAc"} notation={"GalNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Fuc"} notation={"Fuc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Xyl"} notation={"Xyl"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Neu5Gc"} notation={"Neu5Gc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Neu5Ac"} notation={"Neu5Ac"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcA"} notation={"GlcA"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"IdoA"} notation={"IdoA"} width={50} option={"shortcut"}/>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Sulfate')} title="Sulfation">Sul</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('NSulfate')} title="N-Sulfation">N-Sul</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Phosphate')} title="Phosphorylation">Pho</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Acetyl')} title="Acetylation">Ac</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('OMethyl')} title="O-Methylation">O-Me</div>
                </div>
            );
        }
        case "bacteria": {
            return (
                <div id={"bacteria"} style={sugarStyle} >
                    <MonosaccharideContent item={"Glc"} notation={"Glc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Gal"} notation={"Gal"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcNAc"} notation={"GlcNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GalNAc"} notation={"GalNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Rib"} notation={"Rib"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Kdo"} notation={"Kdo"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"dTDP-Rha"} notation={"dTDP-Rha"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Qui"} notation={"Qui"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"6dGul"} notation={"6dGul"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Bac"} notation={"Bac"} width={50} option={"shortcut"}/>
                </div>
            );
        }
        case "plant": {
            return (
                <div id={"plant"} style={sugarStyle} >
                    <MonosaccharideContent item={"Glc"} notation={"Glc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Gal"} notation={"Gal"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Man"} notation={"Man"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Xyl"} notation={"Xyl"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Fuc"} notation={"Fuc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcA"} notation={"GlcA"} width={50} option={"shortcut"}/>
                </div>
            );
        }
        default: {
            return (
                <div id={"mammal"} style={sugarStyle} >
                    <MonosaccharideContent item={"Glc"} notation={"Glc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Man"} notation={"Man"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Gal"} notation={"Gal"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcNAc"} notation={"GlcNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GalNAc"} notation={"GalNAc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Fuc"} notation={"Fuc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Xyl"} notation={"Xyl"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Neu5Gc"} notation={"Neu5Gc"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"Neu5Ac"} notation={"Neu5Ac"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"GlcA"} notation={"GlcA"} width={50} option={"shortcut"}/>
                    <MonosaccharideContent item={"IdoA"} notation={"IdoA"} width={50} option={"shortcut"}/>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Sulfate')} title="Sulfation">Sul</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('NSulfate')} title="N-Sulfation">N-Sul</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Phosphate')} title="Phosphorylation">Pho</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('Acetyl')} title="Acetylation">Ac</div>
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',  cursor: 'pointer'}} onClick={() => handleSubstituentClick('OMethyl')} title="O-Methylation">O-Me</div>
                </div>
            );
        }
    }
};

export const searchHorizontalNodeIndex = (_species: string): Array<String> => {
    switch (_species) {
        case "mammal": {
            return ["Glc", "Man", "Gal", "GlcNAc", "GalNAc", "Fuc", "Xyl", "Neu5Gc", "Neu5Ac", "GlcA", "IdoA", "Sul", "N-Sul", "Pho", "Ac", "O-Me"];
        }
        case "bacteria": {
            return ["Glc", "Gal", "GlcNAc", "GalNAc", "Rib", "Kdo", "dTDP-Rha", "Qui", "6dGul", "Bac"];
        }
        case "plant": {
            return ["Glc", "Gal", "Man", "Xyl", "Fuc", "GlcA"];
        }
        default: {
            return ["Glc", "Man", "Gal", "GlcNAc", "GalNAc", "Fuc", "Xyl", "Neu5Gc", "Neu5Ac", "GlcA", "IdoA", "Sul", "N-Sul", "Pho", "Ac", "O-Me"];
        }
    }
};
