//@flow
"use strict";

import {liaise} from "../../script";
import GlycanTextParser from "../../script/util/GlycanTextParser";
import {getTextFormat, textFormat} from "../../script/data/TextFormat";
import {Button, Dropdown, Form, TextArea} from "semantic-ui-react";
import React from "react";

export default class TextImporterMenu extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            inputText: "",
            format: "GlycoCT"
        };

        this.importText = this.importText.bind(this);
        this.formatOnChange = this.formatOnChange.bind(this);
    }

    textOnChange (e: Object) {
        this.setState({inputText: e.target.value});
    }

    importText () {
        const inputText: String = this.state.inputText;
        const format: String = this.state.format;

        if (format === "") {
            alert("Please select any format");
            return;
        }

        if (inputText === "") {
            alert("Please input any glycan string.\n" +
                "SugarDrawer can support GlycoCT format or WURCS format.");
            return;
        }

        liaise.initStage();
        if (liaise.newGraph.length !== 0) {
            liaise.initGraph();
        }

        //wurcs to glycoct
        if (getTextFormat(format.toLowerCase()) === textFormat.WURCS) {
            let apiURL: string = "https://api.glycosmos.org/glycanformatconverter/2.5.2/wurcs2glycoct/";
            apiURL += encodeURIComponent(inputText);

            fetch (apiURL)
                .then (function (res) {
                    return res.json();
                }).then (function (json) {
                    if ("message" in json) {
                        throw new Error(`${json.message}`);
                    }
                    let txtParser: Object = new GlycanTextParser(json.GlycoCT);
                    txtParser.parseFormula();
                    txtParser.showImage();
                }).catch(function (e) {
                    alert("Error in TextImporterMenu.js @importText: \n" + `${e.message}` + "\n" + `${e.stack}`);
                });
        } else {
            let txtParser: Object = new GlycanTextParser(inputText);
            txtParser.parseFormula();
            txtParser.showImage();
        }
    }

    formatOnChange (e) {
        this.setState({format: e.currentTarget.innerText});
    }

    onClose () {
        document.getElementById("textArea").style.display = "none";
    }

    render () {
        /* *
            { key: "wurcs", text: "WURCS", value: "wurcs" },
            { key: "iupac", text: "IUPAC", value: "iupac" },
            { key: "kcf", text: "KCF", value: "kcf" },
            { key: "svg", text: "SVG", value: "svg" }
        * */
        const options = [
            { key: "glycoct", text: "GlycoCT", value: "glycoct" },
            { key: "wurcs", text: "WURCS", value: "wurcs"}
        ];

        const menuLayout: Object = {
            style : {
                cursor: "pointer",
                marginLeft : "100px",
                marginRight: "100px",
                backgroundColor : "white",
            }
        };

        const listLayout: Object = {
            style: {
                display: "flex",
                flexDirection: "row",
            }
        };

        return (
            <div {...menuLayout}>
                <Form>
                    <TextArea placeholder={"Please input any glycan text format."}
                        value={this.state.inputText}
                        onChange={e => this.textOnChange(e)}
                    />
                    <div {...listLayout}>
                        <Dropdown
                            search
                            selection
                            //wrapSelection={false}
                            options={options}
                            onChange={this.formatOnChange}
                            placeholder={"Format"}
                        />
                        <Button onClick={this.importText}>Import</Button>
                    </div>
                </Form>
                {/*<Button onClick={this.onClose}>Close</Button>*/}
            </div>
        );
    }
}