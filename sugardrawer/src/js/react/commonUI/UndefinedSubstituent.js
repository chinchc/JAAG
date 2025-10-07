//@flow

"use strict";

import React from "react";
import {Checkbox, Form, Table, TextArea} from "semantic-ui-react";
import {liaise} from "../../script";
import {modifiData} from "../../script/data/modificationData";

export default class UndefinedModificationTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onUndefClickToggleEvent = () => {
        let currentState = this.state;
        currentState.selectedModification = modifiData.Undefined.TrivalName;
        currentState.multipleBond = false;
        currentState.bridgeBind = false;
        if(currentState.undef) {
            currentState.undef = false;
            currentState.textAreaValue = "";
        }
        else {
            currentState.undef = true;
        }
        this.setState(currentState);
    };

    onChangeUndefModificationNameAra = (e) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.textAreaValue = e.target.value;
            currentState.selectedModification  = currentState.textAreaValue;
            this.setState(currentState);
            liaise.selectedModification = currentState.selectedModification;
        }
    };

    onChangeMultipleBindToggleEvent = () => {
        let currentState = this.state;
        if(currentState.multipleBond) {
            currentState.multipleBond = false;
            liaise.changeMultipleBind(false);
        }
        else {
            currentState.multipleBond = true;
            liaise.changeMultipleBind(true);
            if(liaise.bridgeBind) {
                currentState.bridgeBind = false;
                liaise.changeBridgeBind(false);
            }
        }
        console.log(liaise.multipleBond);
        this.setState(currentState);
    };

    onChangeBridgeBindToggleEvent = () => {
        console.log("bridgeToggleクリック");
        let currentState = this.state;
        let key = modifiData.Undefined.TrivalName;
        if(currentState.undef) {
            key = "Undefined";
        }
        else {
            for(let item in modifiData) {
                if(currentState.selectedModification === modifiData[item].TrivalName) key = item;
            }
        }
        if(currentState.bridgeBind === true) {
            currentState.bridgeBind = false;
            liaise.changeBridgeBind(false);
        }
        else if(currentState.bridgeBind === false) {
            if(modifiData[key].bridgeBind){
                currentState.bridgeBind = true;
                liaise.changeBridgeBind(true);
                if(liaise.multipleBond) {
                    currentState.multipleBond = false;
                    liaise.changeMultipleBind(false);
                }
            }
            else {
                currentState.bridgeBind = false;
                liaise.changeBridgeBind(false);
            }
        }
        this.setState(currentState);
    };

    render() {
        const defTextAreaSize = {
            style: {
                width: "100%",
                height: "100%"
            }
        };

        return(
            <div>
                <Form.Field>
                    <Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Checkbox
                                        toggle
                                        label = "undefined Modification"
                                        checked = {this.state.undef}
                                        onChange = {this.onUndefClickToggleEvent}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <TextArea value = {this.state.textAreaValue} { ...defTextAreaSize } onChange = {(event) => this.onChangeUndefModificationNameAra(event)} placeholder = "please enter undefind sugar name." autoHeight/>
                </Form.Field>
                <Form.Field>
                    <Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Checkbox
                                        toggle
                                        label = "Multiple bond"
                                        checked= {this.state.multipleBond}
                                        onChange = {this.onChangeMultipleBindToggleEvent}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        toggle
                                        label = "bridge bond"
                                        checked= {this.state.bridgeBind}
                                        onChange = {this.onChangeBridgeBindToggleEvent}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Form.Field>
            </div>
        );
    }
}