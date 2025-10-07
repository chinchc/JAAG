//@flow
"use strict";

import React from "react";
import {Table, Label} from "semantic-ui-react";
import { liaise } from "../../script";
import { linkageModeSearch } from "./linkageModeSearch";
import { linkageModeType } from "./linkageModeType";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import ReactDOM from "react-dom";
import NonSymbolContent from "../horizonalUI/NonSymbolContent";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";

export class EdgeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSelect: ""
        };
    }

    onClickEvent(e) {
        let id: string = e.target.id;
        let currentMode: Symbol = linkageModeSearch(id);
        let params: Object = {};

        if (currentMode === linkageModeType.NOT_SELECTED) {
            params.anomericity = Anomericity.UNDEFINED;
            params.acceptorPosition = AcceptorPosition.UNDEFINED;
            params.donorPosition = DonorPosition.UNDEFINED;
        } else {
            if (id[0] === "a") {
                params.anomericity = Anomericity.ALPHA;
            } else {
                params.anomericity = Anomericity.BETA;
            }

            if (id.length === 4) {
                params.donorPosition = [DonorPosition.prototype.getDonorPosition(parseInt(id[3]))];
                params.id = "edge";
            } else {
                params.donorPosition = [DonorPosition.UNDEFINED];
                params.id = "root";
            }

            if (id[1] === "1") {
                params.acceptorPosition = AcceptorPosition.ONE;
            } else {
                params.acceptorPosition = AcceptorPosition.TWO;
            }
        }
        liaise.newEdge = params;
        if (isEmpty(filter(liaise.usedItems, {content: id}))) {
            liaise.usedItems = {
                type: params.id,
                content: id
            };
        }

        ReactDOM.render(
            <NonSymbolContent item={id} type={"edge"} width={50}/>,
            document.getElementById("selected")
        );

        this.setState({currentSelect: id});
    }

    /*
    onClickToggleEvent = () => {
        let currentState = this.state;
        currentState.currentMode = linkageModeSearch("");
        liaise.linkageSelect = currentState.currentMode;
        if(currentState.undef) {
            currentState.undef = false;
        }
        else {
            currentState.undef = true;
        }
        liaise.undefLinkage = currentState.undef;
        this.setState(currentState);
    };
    onChangeAnomericRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.anomeric = {value}.value;
            liaise.undefLinkageSelect.anomeric = currentState.anomeric;
            this.setState(currentState);
        }
    };

    onChangeParentPositionRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.parentPosition = {value}.value;
            liaise.undefLinkageSelect.parentPosition = currentState.parentPosition;
            this.setState(currentState);
        }
    };

    onChangeChildPositionRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.childPosition = {value}.value;
            liaise.undefLinkageSelect.childPosition = currentState.childPosition;
            this.setState(currentState);
        }
    };
     */

    // DEBUG

    render () {
        const defTableSize = {
            style: {
                "textAlign": "center"
            }
        };

        /*<LinkageImage image='../image/symbol/a2-1.png' id = { "a2-1" } selected = { this.state.currentMode === linkageModeType.A2_1 } defStyle = { defImageStyle }/>*/

        return (
            <div>
                <Table definition {...defTableSize} >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>a1</Table.HeaderCell>
                            <Table.HeaderCell>b1</Table.HeaderCell>
                            <Table.HeaderCell>a2</Table.HeaderCell>
                            <Table.HeaderCell>b2</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>root</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-1"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-1</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-1"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-1</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-2"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-2</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-2"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-2</Label>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>3</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-3"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-3</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-3"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-3</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-3"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-3</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-3"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-3</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>4</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-4"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-4</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-4"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-4</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-4"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-4</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-4"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-4</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>5</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-5"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-5</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-5"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-5</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-5"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-5</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-5"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-5</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>6</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-6"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-6</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-6"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-6</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-6"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-6</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-6"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-6</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>7</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-7"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-7</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-7"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-7</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-7"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-7</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-7"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-7</Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>8</Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a1-8"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a1-8</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b1-8"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b1-8</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"a2-8"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>a2-8</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label as={"a"} id={"b2-8"} onClick={ (event) => this.onClickEvent(event) } tag size={"huge"}>b2-8</Label>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );


        /*
        <Form>
            <Form.Field>
                <Table style={{width: "auto"}}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <Checkbox
                                    toggle
                                    label = "undefined linkage"
                                    checked = {this.state.undef}
                                    onClick = {this.onClickToggleEvent}
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form.Field>
        </Form>
        */
        /*
        <Form>
            <Table style={{width: "auto"}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="3"> Select the anomer of the donor sugar.</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="α"
                                    name="anomericGroup"
                                    value="α"
                                    checked={this.state.anomeric === "α"}
                                    onChange = {this.onChangeAnomericRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="β"
                                    name="anomericGroup"
                                    value="β"
                                    checked={this.state.anomeric === "β"}
                                    onChange = {this.onChangeAnomericRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="undefined"
                                    name="ringRadioGroup"
                                    value="?"
                                    checked={this.state.anomeric === "?"}
                                    onChange = {this.onChangeAnomericRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Form>
        */
        /*
        <Form>
            <Table style={{width: "auto"}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="5"> Select position of the acceptor sugar .</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="1"
                                    name="parentGroup"
                                    value="1"
                                    checked={this.state.parentPosition === "1"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="2"
                                    name="parentGroup"
                                    value="2"
                                    checked={this.state.parentPosition === "2"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="3"
                                    name="parentGroup"
                                    value="3"
                                    checked={this.state.parentPosition === "3"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="4"
                                    name="parentGroup"
                                    value="4"
                                    checked={this.state.parentPosition === "4"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="5"
                                    name="parentGroup"
                                    value="5"
                                    checked={this.state.parentPosition === "5"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="6"
                                    name="parentGroup"
                                    value="6"
                                    checked={this.state.parentPosition === "6"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="7"
                                    name="parentGroup"
                                    value="7"
                                    checked={this.state.parentPosition === "7"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="8"
                                    name="parentGroup"
                                    value="8"
                                    checked={this.state.parentPosition === "8"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="9"
                                    name="parentGroup"
                                    value="9"
                                    checked={this.state.parentPosition === "9"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="undefined"
                                    name="parentGroup"
                                    value="?"
                                    checked={this.state.parentPosition === "?"}
                                    onChange = {this.onChangeParentPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Form>

        <Form>
            <Table style={{width: "auto"}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="5"> Select position of the donor sugar .</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="1"
                                    name="childGroup"
                                    value="1"
                                    checked={this.state.childPosition === "1"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="2"
                                    name="childGroup"
                                    value="2"
                                    checked={this.state.childPosition === "2"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="3"
                                    name="childGroup"
                                    value="3"
                                    checked={this.state.childPosition === "3"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="4"
                                    name="childGroup"
                                    value="4"
                                    checked={this.state.childPosition === "4"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="5"
                                    name="childGroup"
                                    value="5"
                                    checked={this.state.childPosition === "5"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="6"
                                    name="childGroup"
                                    value="6"
                                    checked={this.state.childPosition === "6"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="7"
                                    name="childGroup"
                                    value="7"
                                    checked={this.state.childPosition === "7"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="8"
                                    name="childGroup"
                                    value="8"
                                    checked={this.state.childPosition === "8"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="9"
                                    name="childGroup"
                                    value="9"
                                    checked={this.state.childPosition === "9"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                        <Table.Cell>
                            <Form.Field>
                                <Radio
                                    label="undefined"
                                    name="childGroup"
                                    value="?"
                                    checked={this.state.childPosition === "?"}
                                    onChange = {this.onChangeChildPositionRadio}
                                />
                            </Form.Field>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Form>
         */
    }
}
