"use strit";

import React from "react";
import { Image } from "semantic-ui-react";

export class LinkageImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const imageProps = this.props.defStyle;

        if (this.props.selected) {
            imageProps.style = {
                "backgroundColor": "rgba(255, 0, 0, 1.0)",
                "opacity": "0.5",
                "border": "5px solid",
                display: "inline-block",
                "verticalAlign": "middle"
            };
        }
        else {
            imageProps.style = {
                display: "inline-block",
                "verticalAlign": "middle"
            };
        }

        return (
            <div>
                <Image src = {this.props.image} size = "tiny" id = {this.props.id} {...imageProps}/>
            </div>
        );
    }
}