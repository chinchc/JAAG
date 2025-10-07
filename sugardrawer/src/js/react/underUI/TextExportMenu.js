//@flow

import {Button, Dropdown, Form, TextArea} from "semantic-ui-react";
import React from "react";
import {encodeGlycanString} from "../../script/converter/converterInterface";
import {liaise} from "../../script";

//GlycoCT, WURCS, IUPAC, KCF, SVG
export default class TextExportMenu extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            format: "GlycoCT"
        };
        this.formatOnChange = this.formatOnChange.bind(this);
        this.exportText = this.exportText.bind(this);
    }

    formatOnChange (e) {
        this.setState({format: e.currentTarget.innerText});
    }

    exportText () {
        if (this.state.format === "") {
            alert("Please select any format.");
            return;
        }
        if (liaise.newGraph === undefined) {
            alert("Please draw glycan on the canvas.");
            return;
        }
        if (liaise.newGraph.length === 0) {
            alert("Please draw glycan on the canvas.");
            return;
        }
        encodeGlycanString(this.state.format.toLowerCase());
    }

    render () {
        const underStyle = {
            style: {
                marginLeft: "100px",
                marginRight: "100px"
            }
        };
        const options = [
            { key: "glycoct", text: "GlycoCT", value: "glycoct" },
            { key: "wurcs", text: "WURCS", value: "wurcs"},
            { key: "svg", text: "SVG", value: "svg"}
        ];

        return (
            <div {...underStyle}>
                <Form>
                    <Dropdown
                        search
                        selection
                        //wrapSelection={false}
                        options={options}
                        onChange={this.formatOnChange}
                        placeholder={"Format"}
                    />
                    <Button onClick={this.exportText}>Export</Button>
                    <div id={"textform"}/>
                </Form>
            </div>
        );
    }
}