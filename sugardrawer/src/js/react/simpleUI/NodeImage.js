"use strict";

import React from "react";

export class NodeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const imageProps = this.props.defStyle;

        if (this.props.selected) {
            imageProps.style = {
                backgroundColor: "rgba(255,0,0,1.0)",
                opacity: "0.5",
                border: "5px solid",
                display: "inline-block",
                verticalAlign: "middle"
            };
        }
        else {
            imageProps.style = {
                display: "inline-block",
                verticalAlign: "middle"
            };
        }

        return (
            <div style={{cursor: "pointer"}}>
                <p id = { this.props.id } style={{fontSize: "14px"}}>{ this.props.id }</p>
            </div>
        );
    }
}

/*
                <Image src = {this.props.image} size = "mini" id = { this.props.id } {...imageProps}/>
                <br/>
 */