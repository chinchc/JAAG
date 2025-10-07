//@flow

"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import GlyTouCanIDtable from "../../react/underUI/GlyTouCanIDtable";
import { liaise } from "../index";
import GlycoCTWriterForFragments from "../io/GlycoCT/GlycoCTWriterForFragments";
import {API} from "../../api/glycosmosAPI";

const $ = require("jquery");
let query: Object = {};

//TODO: GlycanからGTCIDを効率的に得るまでの枠組みの検討
//TODO: GlycoCT2WURCS, WURCS2GTCIDではAPIを複数噛ませる必要があるため非同期処理の問題が付き纏う
export const search = (_glycan: Glycan) => {
    if (document.querySelector("#textArea") !== null) {
        document.querySelector("#textArea").textContent = "";
    }

    makeGlycanTextFormat(_glycan);
};

const makeGlycanTextFormat = (_glycan: Object) => {
    let ret: string = "";
    if (_glycan === undefined) return ret;

    //Generate GlycoCT formula
    //define hierarchy
    let trees: Array<Object> = [];
    liaise.newGraph.map( (graph) => {
        let treeData: Object = liaise.getNewTreeData(graph);
        const tree = d3.layout.tree().size([150, 150]);
        tree.nodes(treeData);
        trees.push(treeData);
    });
    const gctWriter = new GlycoCTWriterForFragments(liaise.newGraph, trees);
    ret = gctWriter.exportGlycoCT();

    Promise.resolve()
        .then(glycoCT2wurcs.bind(this, encodeURIComponent(ret)))
        .then( (value) => {
            wurcs2image(value);
        });
    /*
        .then( (value) => {
            createSearchTable(value);
        });
         */
};

const glycoCT2wurcs = (_gct: string) => {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            let apiURL: string = "https://api.glycosmos.org/glycanformatconverter/2.10.0/glycoct2wurcs/";
            apiURL += _gct;

            fetch(apiURL)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        alert("Request failed: " + res.status);
                    }
                })
                .then(json => {
                    query = json;
                    resolve(query);
                })
                .catch(err => alert(err));
        }, 500);
    });
};

const wurcs2image = (_query: Object) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            url: `${API.wurcs2image + encodeURIComponent(_query.WURCS)}`,
            dataType: "text",
            success: function(data) {
                const imgsrc = $("<div>").html(data)[0].getElementsByTagName("img")[0].src;
                createSearchTable(_query, imgsrc);
            }
        });
    });
};

const createSearchTable = (_query: Object, _imgsrc: string) => {
    let idTable: HTMLElement = document.getElementById("idtable");
    idTable.style.display = "flex";
    idTable.style.justifyContent = "center";
    idTable.style.alignItems = "center";

    ReactDOM.render(
        <GlyTouCanIDtable id={_query.id} image={_imgsrc} wurcs={_query.WURCS}/>,
        idTable
    );
};