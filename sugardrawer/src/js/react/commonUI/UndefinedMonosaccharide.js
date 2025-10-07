//@flow

"use strict";

import {Button, Form, Grid, Radio, Segment, TextArea} from "semantic-ui-react";
import React from "react";
import {liaise} from "../../script";
import {createSNFGSymbol} from "../../script/createSugar/createSNFGSymbol";
import {addLastWord, currentSelectNode} from "../../script/clickEvent/shapeClickEvent";

//TODO: 構造情報の選択ができるが今のままではシンボルで保管することができない
export default class UndefinedMonosaccharide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.onApply = this.onApply.bind(this);
    }

    onChangeUndefSugarNameAra = (e) => {
        this.setState({name: e.target.value});
    };

    onChangeIsomerRadio = (e, {value}) => {
        this.setState({isomer: value});
    };

    onChangeRingRadio = (e, {value}) => {
        this.setState({ringsize: value});
    };

    onChangeBackboneRadio = (e, {value}) => {
        this.setState({backbone: value});
    };

    onApply () {
        if (!("isomer" in this.state) || !("ringsize" in this.state) || !("backbone" in this.state) || !("name" in this.state)) {
            alert(
                `Some parameter is not defined.\n
                 Isomer : ${this.state.isomer}\n
                 Ring size : ${this.state.ringsize}\n
                 Backbone : ${this.state.backbone}\n
                 Name : ${this.state.name}`);
            return;
        }

        // check duplicate
        const undefNodes: Object = liaise.undefNode;
        let check: number = 0;
        Object.keys(undefNodes).forEach((index: number) => {
            const undefNode: Object = undefNodes[index];
            if (undefNode.name === this.state.name && undefNode.ringsize === this.state.ringsize &&
                undefNode.backbone === this.state.backbone && undefNode.isomer === this.state.isomer) {
                check = 1;
            }
        });

        if (check === 1) {
            alert(
                `This monosaccharide is already defined.\n
                Isomer : ${this.state.isomer}\n
                Ring size : ${this.state.ringsize}\n
                Backbone : ${this.state.backbone}\n
                Name : ${this.state.name}`);
            return;
        }

        liaise.undefNode = {
            "isomer": this.state.isomer,
            "ringsize": this.state.ringsize,
            "backbone" : this.state.backbone,
            "name": this.state.name
        };

        liaise.newNode = this.state.name;

        // make createjs.shape
        let undefShape: createjs.Shape = createSNFGSymbol(this.state.name);

        // make symbol
        currentSelectNode(undefShape);
        addLastWord(undefShape);
    }

    render() {

        return(
            <Form>
                <Form.Field>

                    <Segment>
                        Monosaccharide name
                        <TextArea value = {this.state.textAreaValue} onChange = {(e) => this.onChangeUndefSugarNameAra(e)} placeholder = "Please enter undefind monosaccharide name." autoHeight/>
                    </Segment>

                    <Segment>
                        Isomer

                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="D"
                                            name="isomerRadioGroup"
                                            value="D"
                                            checked={this.state.isomer === "D"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="L"
                                            name="isomerRadioGroup"
                                            value="L"
                                            checked={this.state.isomer === "L"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="?"
                                            name="isomerRadioGroup"
                                            value="?"
                                            checked={this.state.isomer === "?"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Segment>
                        Ring size

                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="P"
                                            name="ringRadioGroup"
                                            value="P"
                                            checked={this.state.ringsize === "P"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="F"
                                            name="ringRadioGroup"
                                            value="F"
                                            checked={this.state.ringsize === "F"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="?"
                                            name="ringRadioGroup"
                                            value="?"
                                            checked={this.state.ringsize === "?"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Segment>
                        Number of carbon backbone

                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={1}
                                            name="backboneRadioGroup"
                                            value={1}
                                            checked={this.state.backbone === 1}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={2}
                                            name="backboneRadioGroup"
                                            value={2}
                                            checked={this.state.backbone === 2}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={3}
                                            name="backboneRadioGroup"
                                            value={3}
                                            checked={this.state.backbone === 3}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={4}
                                            name="backboneRadioGroup"
                                            value={4}
                                            checked={this.state.backbone === 4}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={5}
                                            name="backboneRadioGroup"
                                            value={5}
                                            checked={this.state.backbone === 5}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={6}
                                            name="backboneRadioGroup"
                                            value={6}
                                            checked={this.state.backbone === 6}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={7}
                                            name="backboneRadioGroup"
                                            value={7}
                                            checked={this.state.backbone === 7}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={8}
                                            name="backboneRadioGroup"
                                            value={8}
                                            checked={this.state.backbone === 8}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label={9}
                                            name="backboneRadioGroup"
                                            value={9}
                                            checked={this.state.backbone === 9}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column/>

                                <Grid.Column>
                                    <Form.Field>
                                        <Radio
                                            label="?"
                                            name="backboneRadioGroup"
                                            value={-1}
                                            checked={this.state.backbone === -1}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column/>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Grid>
                        <Grid.Row columns={3}>
                            <Grid.Column/>
                            <Grid.Column>
                                <Button onClick={this.onApply}>Apply</Button>
                            </Grid.Column>
                            <Grid.Column/>
                        </Grid.Row>
                    </Grid>
                </Form.Field>
            </Form>
        );
    }
}