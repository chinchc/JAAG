"use strict";

import React from "react";
import {Button} from "semantic-ui-react";

export default class ModeCancelButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onClick.bind(this);
    }

    onClick (e) {
        this.props.onCancel(e);
    }

    render () {
        const style = {
            marginLeft: "10px"
        };
        return (
            <Button style={style} circular icon={"cancel"} onClick={(e) => this.onClick(e)} />
        );
    }
}