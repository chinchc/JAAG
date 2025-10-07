"use strict";

import React from "react";
import { TextArea, Form } from "semantic-ui-react";

export class Help extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const defSize = {
            style: {
                width: "100%",
                height: "100%"
            }
        };
        return (
            <Form { ...defSize }>
                <TextArea value = {this.props.explainText} { ...defSize }  autoHeight/>
            </Form>
        );
    }
}