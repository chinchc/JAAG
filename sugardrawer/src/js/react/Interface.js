/* Modified by Chin Huang at University of Georgia for JAAG on 2025-10-01: integration and export behavior tweaks. */
"use strict";

import React from "react";
import {Help} from "./Help";
import {SidebarLeftPush} from "./expertUI/SidebarLeftPush";
import {modeType} from "./modeType";
import {liaise} from "../script";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import ModalList from "./simpleUI/ModalList";
import {search} from "../script/util/search";
import {helpTemplate} from "./helpTemplate";
import {Popup} from "semantic-ui-react";
import TextImporterMenu from "./underUI/TextImportMenu";
import ReactDOM from "react-dom";
import TextExportMenu from "./underUI/TextExportMenu";
import {makeGlycoCT, updateGlycoCTDisplay} from "../script/converter/converterInterface";
import ScaleSlider from "./commonUI/ScaleSlider";
import ModeCancelButton from "./horizonalUI/ModeCancelButton";
import UpdateGlycan from "../script/images/update/UpdateGlycan";
import ModalCanvasDelete from "./commonUI/ModalCanvasDelete";

export class Interface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_mode_type: modeType.NOT_SELECTED,
            explainText: "This is a message area of the selected function.",
            sideBarVisible: false,
            popUpVisible: false,
            simpleMode: false,
            visible: false,
            lastWork: ""
        };

        //this.close = this.close.bind(this);
        //this.clearCanvas = this.clearCanvas.bind(this);

        // assign side bar operation utility
        liaise.sideBarCancel = this.makeCancelUtility();

        // Check if we're running in popup mode
        this.isPopupMode = this.detectPopupMode();

        // Set up message listener for parent window commands
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SUGARDRAWER_CLEAR_CANVAS') {
                this.clearCanvas();
            }
        });

        // Hide GlycoCT Output box in popup mode
        if (this.isPopupMode) {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                const glycoctDisplay = document.getElementById('glycoctDisplay');
                if (glycoctDisplay) {
                    glycoctDisplay.style.display = 'none';
                }
            }, 100);
        }
    }

    detectPopupMode() {
        // Check URL parameter first (most reliable)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('popup') === 'true') {
            return true;
        }

        // Fallback: Check if we're specifically in the popup modal iframe
        try {
            if (window.parent !== window) {
                // Check if parent has the popup modal and if our iframe is inside it
                const parentDoc = window.parent.document;
                const popupModal = parentDoc.getElementById('sugarDrawerPopupModal');
                const popupFrame = parentDoc.getElementById('sugarDrawerPopupFrame');

                // We're in popup mode if the popup modal exists and we're the popup frame
                const isPopup = popupModal && popupFrame && window.frameElement === popupFrame;
                if (isPopup) {
                }
                return isPopup;
            }
            return false;
        } catch (e) {
            // Cross-origin restrictions - check frame ID
            const isInIframe = window.parent !== window;
            const frameId = window.frameElement && window.frameElement.id;
            const isPopup = isInIframe && frameId === 'sugarDrawerPopupFrame';
            if (isPopup) {
            }
            return isPopup;
        }
    }

    onClickEvent(e) {
        let currentState = this.state;
        const targetId = e.currentTarget.name;
        if (targetId === "node") {
            this.initFunctions();
            currentState.current_mode_type = modeType.NODE;
            currentState = this.changeVisual(currentState, targetId);
            currentState.explainText = helpTemplate(targetId);
            //this.addModeCancelButton();
        } else if (targetId === "edge") {
            this.initFunctions();
            currentState.current_mode_type = modeType.EDGE;
            currentState = this.changeVisual(currentState, targetId);
            currentState.explainText = helpTemplate(targetId);
            //this.addModeCancelButton();
        } else if (targetId === "addModification") {
            this.initFunctions();
            currentState.current_mode_type = modeType.MODIFICATION;
            currentState = this.changeVisual(currentState, targetId);
            currentState.explainText = helpTemplate(targetId);
            //this.addModeCancelButton();
        } else if (targetId === "structure") {
            this.initFunctions();
            currentState.current_mode_type = modeType.STRUCTURE;
            currentState = this.changeVisual(currentState, targetId);
            currentState.explainText = helpTemplate(targetId);
            //this.addModeCancelButton();
        } else if (targetId === "repeat") {
            currentState.current_mode_type = modeType.REPEAT;
            currentState.sideBarVisible = false;
            currentState.explainText = helpTemplate(targetId);
        } else if (targetId === "fragment") {
            this.initFunctions();
            currentState.current_mode_type = modeType.FRAGMENT;
            currentState = this.changeVisual(currentState, targetId);
            currentState.explainText = helpTemplate(targetId);
            //this.addModeCancelButton();
        } else if (targetId === "composition") {
            this.initFunctions();
            currentState.current_mode_type = modeType.COMPOSITION;
            currentState.popUpVisible = true;
            currentState.explainText = helpTemplate(targetId);
        } else if (targetId === "delete") {
            const glycan = liaise.coreGraph;
            if (!glycan || glycan.getRootNode() === undefined) {
                currentState.current_mode_type = modeType.NOT_SELECTED;
            } else {
                currentState.current_mode_type = modeType.DELETE;
            }
            currentState.sideBarVisible = false;
            currentState.explainText = helpTemplate(targetId);
        } else if (targetId === "undo") {
            this.setState({explainText: helpTemplate(targetId)});
            const glycan = liaise.coreGraph;
            if (!glycan || glycan.getRootNode() === undefined) {
                alert("Please draw any glycan on the canvas.");
                return;
            }
            liaise.actionUndoRedo.undo();
        } else if (targetId === "redo") {
            this.setState({explainText: helpTemplate(targetId)});
            const glycan = liaise.coreGraph;
            if (!glycan || glycan.getRootNode() === undefined) {
                alert("Please draw any glycan on the canvas.");
                return;
            }
            liaise.actionUndoRedo.redo();
        } else if (targetId === "help") {
            currentState.visible = (!this.state.visible);
            this.setState(currentState);
            return;
        } else if (targetId === "simple") {
            currentState.simpleMode = true;
            currentState.sideBarVisible = false;
            currentState.current_mode_type = modeType.NOT_SELECTED;
            currentState.explainText = helpTemplate(targetId);
            liaise.interfaceType = targetId;
        } else if (targetId === "expert") {
            currentState.simpleMode = false;
            currentState.popUpVisible = false;
            currentState.current_mode_type = modeType.NOT_SELECTED;
            currentState.explainText = helpTemplate(targetId);
            liaise.interfaceType = targetId;
        } else if (targetId === "search") {
            this.setState({explainText: helpTemplate(targetId)});
            const glycan = liaise.coreGraph;
            if (!glycan || glycan.getRootNode() === undefined) {
                alert("Please draw any glycan on the canvas.");
                return;
            }
            search(glycan);
        } else if (targetId === "import") {
            currentState.current_mode_type = modeType.IMPORT;
            currentState.explainText = helpTemplate(targetId);

            document.querySelector("#idtable").textContent = "";
            document.querySelector("#textArea").style.display = "block";
            ReactDOM.render(
                <TextImporterMenu/>,
                document.querySelector("#textArea")
            );
        } else if (targetId === "export") {
            // This case is now handled by directExportGlycoCT method
            return;
        } else if (targetId === "normalize") {
            currentState.current_mode_type = modeType.EDIT;
            currentState.explainText = helpTemplate(targetId);
            const upGraph = new UpdateGlycan();
            upGraph.updateGlycanImage();
        }

        currentState.lastWork = targetId;
        this.setState(currentState);
        liaise.modeType = currentState.current_mode_type;
    }

    render() {
        const defFunctionMenu = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "10px",
            marginBottom: "10px",
            variant: "outline-dark",
            centered: true
        };

        const elementMargin = {
            style: {
                width: "60%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
                display: this.state.visible ? "block" : "none"
            }
        };

        const elementMarginCanvas = {
            style: {
                marginLeft: "30px",
                marginRight: "30px"
            }
        };

        return (
            <div id={"cmdtmp"}>
                <div id={"upcmd"} style = { defFunctionMenu }>
                    <div id={"edit-glycan"}>
                        <Button color={this.state.current_mode_type === modeType.STRUCTURE ? "grey" : (this.state.simpleMode ? "teal" : "facebook")} name="structure" selected = { this.state.current_mode_type === modeType.STRUCTURE } onClick={(e) => this.onClickEvent(e)}>Load Structure</Button>
                        <Button color={this.state.current_mode_type === modeType.NODE ? "grey" : (this.state.simpleMode ? "teal" : "facebook")} name="node" selected = { this.state.current_mode_type === modeType.NODE } onClick={(e) => this.onClickEvent(e)}>Add Monosaccharide</Button>
                        <Button style={{display : this.state.simpleMode ? "block" : "none"}} color={this.state.current_mode_type === modeType.EDGE ? "grey" : (this.state.simpleMode ? "teal" : "facebook")} name="edge" selected = { this.state.current_mode_type === modeType.EDGE } onClick={(e) => this.onClickEvent(e)}>Add Linkage</Button>
                        <Button color={this.state.current_mode_type === modeType.MODIFICATION ? "grey" : (this.state.simpleMode ? "teal" : "facebook")} name="addModification" selected = { this.state.current_mode_type === modeType.MODIFICATION } onClick={(e) => this.onClickEvent(e)}>Add Substituent</Button>
                        <Button style={{display: "none"}} color={"facebook"} name="repeat" selected = { this.state.current_mode_type === modeType.REPEAT} onClick={(e) => this.onClickEvent(e)}>Draw repeating unit</Button>
                        <Button style={{display: "none"}} color={this.state.current_mode_type === modeType.FRAGMENT ? "grey" : (this.state.simpleMode ? "teal" : "facebook")} name="fragment" selected = { this.state.current_mode_type === modeType.FRAGMENT} onClick={(e) => this.onClickEvent(e)}>Add Fragment</Button>
                        <Button style={{display: "none"}} color={"facebook"} name="composition" selected = { this.state.current_mode_type === modeType.COMPOSITION} onClick={(e) => this.onClickEvent(e)}>Add composition</Button>
                    </div>
                    <div id={"edit-util"} style={{marginLeft: "15px"}}>
                        <Popup on={"hover"} content='Undo' trigger={
                            <Button icon="reply" color={"google plus"} name="undo" selected = { this.state.current_mode_type === modeType.UNDO} onClick={(e) => this.onClickEvent(e)} />
                        } />
                        <Popup on={"hover"} content='Redo' trigger={
                            <Button icon="share" color={"google plus"} name="redo" selected = { this.state.current_mode_type === modeType.REDO} onClick={(e) => this.onClickEvent(e)} />
                        } />
                        <Popup on={"hover"} content='Delete' trigger={
                            <Button icon="delete" color={"google plus"} name="delete" selected = { this.state.current_mode_type === modeType.DELETE} onClick={(e) => this.onClickEvent(e)} />
                        } />
                        <Popup on={"hover"} content='Help' trigger={
                            <Button icon="help" color={"google plus"} name="help" onClick={(e) => this.onClickEvent(e)}>
                            </Button>
                        } />
                        <Popup on={"hover"} content='Normalize' trigger={
                            <Button icon="refresh" color={"google plus"} name="normalize" onClick={(e) => this.onClickEvent(e)} />
                        } />
                    </div>
                </div>

                <div id={"help"} { ...elementMargin }>
                    <Help explainText = { this.state.explainText }/>
                </div>

                <div id={"canvas"} { ...elementMarginCanvas }>
                    <ModalList modalOpen={this.state.popUpVisible} template={this.state} modalClose={() => {this.setState({popUpVisible: false});}}/>
                    <SidebarLeftPush visible={this.state.sideBarVisible} hide={this.state.simpleMode} currentMode={this.state.current_mode_type} />
                </div>

                <div id={"undercmd"} style = { defFunctionMenu }>
                    <ScaleSlider/>
                    <Button color="green" size="large" name="oneclick-export" onClick={(event) => this.oneClickExportAndClose(event)} style={{marginRight: "15px", fontWeight: "bold", display: this.isPopupMode ? "inline-block" : "none"}}>
                        Export & Close
                    </Button>
                    <Button name="export" onClick={(event) => this.directExportGlycoCT(event)} style={{display: "none"}}>Export</Button>
                    <Button name="exportcopy" onClick={(event) => this.exportAndCopyGlycoCT(event)} style={{display: "none"}}>Export & Copy</Button>
                    <Button color="green" name="addtojson" onClick={(event) => this.addToJSON(event)} style={{display: this.isPopupMode ? "none" : "inline-block"}}>Export & Add to JSON</Button>
                    <Button name="import" selected = { this.state.current_mode_type === modeType.IMPORT } onClick={(event) => this.onClickEvent(event)} style={{display: "none"}}>Import String</Button>
                    {!(this.state.simpleMode) ?
                        <Button name="simple" style={{display: "none"}} onClick={(event) => this.onClickEvent(event)} >Simple mode</Button> :
                        <Button name="expert" style={{display: "none"}} onClick={(event) => this.onClickEvent(event)}>Expert mode</Button>
                    }
                    <Button style={{display: "none"}} name="custom" onClick={(event) => this.onClickEvent(event)}>Custom</Button>
                    <Button name="search" onClick={(event) => this.onClickEvent(event)} style={{display: "none"}}>Search</Button>
                </div>

                <div id={"modal"}>
                    <ModalCanvasDelete />
                </div>
            </div>
        );
    }

    initFunctions () {
        //TODO: if monosaccharide composition already depicted
        /*
        if(compositions.length !== 0) {
            liaise.initStage();
        }
         */
        liaise.initSelectedParams();
        document.getElementById("menu").style.display = "none";
    }

    changeVisual (_currentState, _targetId) {
        if (!_currentState.simpleMode) {
            _currentState.sideBarVisible =
                (!(_currentState.lastWork === _targetId && _currentState.sideBarVisible));
        } else {
            _currentState.popUpVisible = true;
        }
        if (!_currentState.sideBarVisible && !_currentState.simpleMode) {
            _currentState.current_mode_type = modeType.NOT_SELECTED;
        }

        return _currentState;
    }

    close () {
        let currentState = this.state;
        currentState.current_mode_type = modeType.NOT_SELECTED;
        this.setState(currentState);
    }

    clearCanvas() {
        liaise.initStage();
        liaise.initGraph();
        liaise.initSelectedParams();
        liaise.setNewShapes({});
        liaise.setNewTreeData({});
        this.close();
        document.querySelector("#menu").textContent = "";
        document.querySelector("#idtable").textContent = "";
        document.querySelector("#textArea").textContent = "";
    }

    addModeCancelButton () {
        const cancel = () => {
            let currentState = this.state;
            currentState.current_mode_type = modeType.NOT_SELECTED;
            currentState.sideBarVisible = false;
            currentState.popUpVisible = false;
            this.setState(currentState);
            liaise.initSelectedParams();
            document.getElementById("modecontent").lastChild.innerText = "";
            document.getElementById("modecancel").innerText = "";
        };

        // append mode cancel button
        ReactDOM.render(
            <ModeCancelButton onCancel={() => cancel()}/>,
            document.getElementById("modecancel")
        );
    }

    makeCancelUtility () {
        return () => {
            let currentState = this.state;
            currentState.current_mode_type = modeType.NOT_SELECTED;
            currentState.sideBarVisible = false;
            currentState.popUpVisible = false;
            this.setState(currentState);
        };
    }

    directExportGlycoCT() {
        // Check if glycan is drawn
        if (liaise.newGraph === undefined || liaise.newGraph.length === 0) {
            alert("Please draw glycan on the canvas.");
            return;
        }

        try {
            // Generate GlycoCT and display it directly
            const glycoctString = makeGlycoCT();
            // The updateGlycoCTDisplay is already called inside makeGlycoCT

            // Optional: Show success message
        } catch (error) {
            alert("Error generating GlycoCT: " + error.message);
        }
    }

    exportAndCopyGlycoCT() {
        // Check if glycan is drawn
        if (liaise.newGraph === undefined || liaise.newGraph.length === 0) {
            this.showNotification("Please draw glycan on the canvas.", "error");
            return;
        }

        try {
            // Generate GlycoCT
            const glycoctString = makeGlycoCT();

            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // Modern clipboard API
                navigator.clipboard.writeText(glycoctString).then(() => {
                    this.showNotification("GlycoCT copied to clipboard successfully!", "success");
                }).catch(err => {
                    // Fallback to textarea method
                    this.fallbackCopyToClipboard(glycoctString);
                });
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(glycoctString);
            }
        } catch (error) {
            this.showNotification("Error generating GlycoCT: " + error.message, "error");
        }
    }

    fallbackCopyToClipboard(text) {
        // Create a temporary textarea element
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification("GlycoCT copied to clipboard successfully!", "success");
            } else {
                this.showNotification("Failed to copy GlycoCT to clipboard. Please copy manually from the export area.", "error");
            }
        } catch (err) {
            this.showNotification("Failed to copy GlycoCT to clipboard. Please copy manually from the export area.", "error");
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showNotification(message, type) {
        // Send notification to parent window
        const messageData = {
            type: 'SUGARDRAWER_NOTIFICATION',
            message: message,
            notificationType: type
        };

        try {
            window.parent.postMessage(messageData, '*');
        } catch (error) {
            // Fallback to console log if parent communication fails
        }
    }

    oneClickExportAndClose() {
        // Check if glycan is drawn
        if (liaise.newGraph === undefined || liaise.newGraph.length === 0) {
            this.showNotification("Please draw glycan on the canvas first.", "error");
            return;
        }

        try {
            // Generate GlycoCT
            const glycoctString = makeGlycoCT();

            // Send a comprehensive message to parent that includes export and close request
            const messageData = {
                type: 'SUGARDRAWER_ONE_CLICK_EXPORT',
                glycoct: glycoctString,
                action: 'export_and_close',
                requestClose: true
            };

            try {
                window.parent.postMessage(messageData, '*');

                // NOTE: Canvas will be cleared by parent window after successful validation
                // This prevents clearing the canvas when validation fails
                // Parent will send SUGARDRAWER_CLEAR_CANVAS message on success

            } catch (postMessageError) {
                this.showNotification('Error sending data to parent window: ' + postMessageError.message, "error");
            }

        } catch (error) {
            this.showNotification("Error generating GlycoCT: " + error.message, "error");
        }
    }

    addToJSON() {
        // Check if glycan is drawn
        if (liaise.newGraph === undefined || liaise.newGraph.length === 0) {
            alert("Please draw glycan on the canvas first.");
            return;
        }

        try {
            // Generate GlycoCT
            const glycoctString = makeGlycoCT();

            // Send a message to parent to get the current chain ID
            const messageData = {
                type: 'SUGARDRAWER_ADD_TO_JSON',
                glycoct: glycoctString,
                requestChainId: true
            };

            // Post message to parent window
            try {
                window.parent.postMessage(messageData, '*');

                // NOTE: Canvas will be cleared by parent window after successful validation
                // Parent will send SUGARDRAWER_CLEAR_CANVAS message on success
            } catch (postMessageError) {
                alert('Error sending data to parent window: ' + postMessageError.message);
            }

        } catch (error) {
            alert("Error generating GlycoCT for JSON: " + error.message);
        }
    }
}
