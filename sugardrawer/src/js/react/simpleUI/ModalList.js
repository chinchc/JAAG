//@flow

"use strict";

import React from "react";
import {Modal} from "semantic-ui-react";
import PropTypes from "prop-types";
import ModalContents from "./ModalContents";

export default class ModalList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    onClose () {
        this.setState({displayModal: false});
    }

    render() {
        const modIndex = new ModalContents();
        const modContent = modIndex.getContents(this.props.template.current_mode_type);

        let header = "";
        if (this.props.template.lastWork === "node")
            header = "Add Monosaccharide";
        if (this.props.template.lastWork === "edge")
            header = "Add linkage";
        if (this.props.template.lastWork === "addModification")
            header = "Add modification";
        if (this.props.template.lastWork === "structure")
            header = "Load structure";
        if (this.props.template.lastWork === "fragment")
            header = "Add fragment";
        if (this.props.template.lastWork === "composition")
            header = "Add composition";
        //if (this.props.template.lastWork === "import")
        //    header = "GlycoCT to Image";

        return (
            <div id={"simple-modal"}>
                <Modal open={this.props.modalOpen} closeIcon={true} onClose={this.props.modalClose}>
                    <Modal.Header>{header}</Modal.Header>
                    <Modal.Content>
                        {
                            <div onClick={this.props.modalClose}>
                                {modContent}
                            </div>
                        }
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

ModalList.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
};