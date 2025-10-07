"use strict";

import {makeGlycoCT} from "../../converter/converterInterface";
import {liaise} from "../../index";
import GlycanTextParser from "../../util/GlycanTextParser";

export default class UpdateGlycan {
    constructor() {}

    updateGlycanImage () {
        if (liaise.newGraph.length === 0) {
            alert("Please depict any glycan the on canvas.");
            return;
        }

        // encode wurcs string
        let gct = makeGlycoCT();
        this.glycoctTowurcs(gct);
    }

    glycoctTowurcs (_gct) {
        let apiURL = "https://api.glycosmos.org/glycanformatconverter/2.5.2/glycoct2wurcs/";
        apiURL += encodeURIComponent(_gct);

        fetch(apiURL)
            .then( (res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert("Request failed: " + res.status);
                }
            }).then( (json) => {
                if ("WURCS" in json) {
                    // import wurcs string
                    this.wurcsToglycoct(json.WURCS);
                }
                if ("message" in json) {
                    alert(json.message);
                }
            }).catch(err => alert(err.message));
    }

    wurcsToglycoct (_wurcs) {
        liaise.initStage();
        if (liaise.newGraph.length !== 0) {
            liaise.initGraph();
        }

        let apiURL = "https://api.glycosmos.org/glycanformatconverter/2.5.2/wurcs2glycoct/";
        apiURL += encodeURIComponent(_wurcs);

        fetch (apiURL)
            .then (function (res) {
                return res.json();
            }).then (function (json) {
                if ("GlycoCT" in json) {
                    let txtParser = new GlycanTextParser(json.GlycoCT);
                    txtParser.parseFormula();
                    txtParser.showImage();
                }
                if ("message" in json) {
                    alert(json.message);
                }
            }).catch(function (e) {
                alert("Error in TextImporterMenu.js @importText: \n" + `${e.message}` + "\n" + `${e.stack}`);
            });
    }
}