//@flow
"use strict";

import React from "react";
import {exportText} from "../converter/converterInterface";

export const makeSVG = (_glycoct: string): void => {
    return glycoct2wurcs(_glycoct);
};

const glycoct2wurcs = (_glycoct: string): void => {

    // glycoCT to WURCS
    let gct2wurcs: string = "https://api.glycosmos.org/glycanformatconverter/2.5.2/glycoct2wurcs/";
    gct2wurcs += encodeURIComponent(_glycoct);
    fetch (gct2wurcs
    ).then( res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Request failed: " + res.status);
        }
    }).then(json => {
        if ("message" in json) {
            throw new Error(`${json.message}`);
        }
        wurcs2json(json.WURCS);
    }).catch(e => alert("Error in canvas2svg.js @glycoct2wurcs : \n" + `${e.message}` + "\n" + `${e.stack}`));
};

const wurcs2json = (_wurcs: string): void => {

    //wurcs to json
    let wurcs2json: string = "https://api.glycosmos.org/glycanformatconverter/2.5.2/wurcs2wurcsjson/";
    wurcs2json += encodeURIComponent(_wurcs);

    fetch(wurcs2json
    ).then( res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Request failed: " + res.status);
        }
    }).then(json => {
        if ("message" in json) {
            throw new Error(`${json.message}`);
        }
        json2svg(JSON.stringify(json));
    }).catch(e => alert("Error in canvas2svg @wurcs2json : \n" + `${e.message}` + "\n" + `${e.stack}`));
};

const json2svg = (_json: string): void => {

    let apiURL: string = "https://api.test.glycosmos.org/wurcsjson2svg";

    if (_json.length > 2000) {

        // POST
        fetch (apiURL, {
            method : "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: _json
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if ("result" in json) {
                if (json.result.indexOf("<svg") !== -1) {
                    exportText(json.result);
                } else {
                    exportText("");
                    throw new Error("This glycan can not convert to SVG format.");
                }
            } else if ("message" in json) {
                exportText("");
                throw new Error(json.message);
            }
        }).catch(e => alert("Error in canvas2svg.js @json2svg : \n" + `${e.message}` + "\n" + `${e.stack}`));
    } else {

        //GET
        fetch (apiURL + "?import=" + encodeURIComponent(_json))
            .then (function (res) {
                return res.json();
            }).then (function (json) {
                if ("result" in json) {
                    if (json.result.indexOf("<svg") !== -1) {
                        exportText(json.result);
                    } else {
                        exportText("");
                        alert("This glycan can not convert to SVG format.");
                    }
                } else if ("message" in json) {
                    exportText("");
                    throw new Error(json.message);
                }
            }).catch(e => alert("Error in canvas2svg.js @json2svg : \n" + `${e.message}` + "\n" + `${e.stack}`));
    }
};