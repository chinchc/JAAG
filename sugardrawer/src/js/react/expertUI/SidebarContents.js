"use strict";
import React from "react";
import { modeType } from "../modeType";
import MonosaccharideList from "./MonosaccharideList";
import ModificationList from "./ModificationList";
import StructureList from "./StructureList";
import FragmentList from "./FragmentList";

export class SidebarContents {
    constructor(textareaValue){
        this.contents = undefined;
        this.textAreaValue = textareaValue;
    }


    getContents(currentModeType){
        if (currentModeType === modeType.NODE) {
            return (
                <div className={"content-monosaccharide"}>
                    <h3>Add Monosaccharide</h3>
                    <MonosaccharideList />
                </div>
            );
        }
        else if (currentModeType === modeType.MODIFICATION) {
            return (
                <div className={"content-modification"}>
                    <h3>Add Substituent</h3>
                    <ModificationList />
                </div>
            );
        }
        else if (currentModeType === modeType.FRAGMENT) {        
            return (
                <div className={"content-fragment"}>
                    <h3>Add Fragment</h3>
                    <FragmentList />
                </div>
            );
        }
        else if (currentModeType === modeType.STRUCTURE) {
            return (
                <div className={"content-structure"}>
                    <h3>Load Structure</h3>
                    <StructureList/>
                </div>
            );
        }
        /*
        else if (currentModeType === modeType.DRAW_KCF) {
            return (
                <SubTextArea value = { this.textAreaValue }/>
            );
        }
         */
        /*
        else if (currentModeType === modeType.KCF_TEXT_OUT) {
            return (
                <SubTextArea value = { this.textAreaValue }/>
            );
        }
         */
        /*
        else if (currentModeType === modeType.SVG_DOWNLOAD) {
            return (
                <SubTextArea value = { this.textAreaValue }/>
            );
        }
         */
    }
}