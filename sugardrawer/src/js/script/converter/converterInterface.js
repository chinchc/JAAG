/* Modified by Chin Huang at University of Georgia for JAAG on 2025-10-01: export plumbing and GlycoCT display integration. */
//@flow
"use strict";

import React from "react";
import {makeSVG} from "../createSVG/canvas2svg";
import GlycoCTWriterForFragments from "../io/GlycoCT/GlycoCTWriterForFragments";
import ReactDOM from "react-dom";
import {TextArea} from "semantic-ui-react";
import {liaise} from "../index";

export const encodeGlycanString = (_format: string): void => {
    if (_format === "svg") {
        canvas2svg();
    }
    if (_format === "glycoct") {
        let gct: string = makeGlycoCT();
        exportText(gct);
    }
    if (_format === "wurcs") {
        let gct: string = makeGlycoCT();
        let apiURL: string = "https://api.glycosmos.org/glycanformatconverter/2.5.2/glycoct2wurcs/";
        apiURL += encodeURIComponent(gct);

        if (gct === "") {
            exportText("");
            return;
        }

        //GlycoCT to WURCS
        fetch(apiURL)
            .then( (res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert("Request failed: " + res.status);
                }
            }).then( (json) => {
                if ("WURCS" in json) {
                    exportText(json.WURCS);
                }
                if ("message" in json) {
                    exportText(json.message);
                }
            }).catch(e => alert("Error in converterInterface.js @encodeGlycanString->wurcs converter : \n" + `${e.message}` + "\n" + `${e.stack}`));
    }
};

export const makeGlycoCT = (): string => {
    try {
        let graphs: Array<Object> = liaise.newGraph;

        // Generate GlycoCT formula
        // define hierarchy
        let trees: Array<Object> = [];
        graphs.map((graph) => {
            let treeData: Object = liaise.getNewTreeData(graph);
            const tree = d3.layout.tree().size([150, 150]);
            tree.nodes(treeData);
            trees.push(treeData);
        });
        const gctWriter = new GlycoCTWriterForFragments(graphs, trees);
        const glycoctString = gctWriter.exportGlycoCT();

        // Auto-update the GlycoCT display
        updateGlycoCTDisplay(glycoctString);

        return glycoctString;
    } catch (e) {
        alert(`Error in converterInterface.js @makeGlycoCT : \n ${e.message}\n${e.stack}`);
        return "";
    }
};

export const canvas2svg = (): void => {
    let gct: string = makeGlycoCT();

    if (gct !== "") {
        makeSVG(gct);
    } else {
        exportText("");
    }
};

export const exportText = (_result: string): void => {
    ReactDOM.render(
        <TextArea value={_result}/>,
        document.getElementById("textform")
    );
};

export const updateGlycoCTDisplay = (glycoctString: string): void => {
    const glycoctTextarea = document.getElementById('glycoctTextarea');
    if (glycoctTextarea) {
        glycoctTextarea.value = glycoctString || 'No structure drawn';
    }
};
