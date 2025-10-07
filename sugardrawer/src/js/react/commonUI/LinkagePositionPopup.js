//@flow

"use strict";

import {Button, Checkbox, Grid, Header, Popup} from "semantic-ui-react";
import React from "react";

export default class LinkagePositionPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "?": true,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            acceptorPosition: []
        };

        this.onClickEvent = this.onClickEvent.bind(this);
    }

    onClickEvent(e, data) {
        let currentState:Object = this.state;
        let pos: number = data.value;
        let id: string = data.id;

        if (pos === -1) {
            if (!currentState["?"]) {
                currentState.acceptorPosition = [];
                currentState.acceptorPosition.push(-1);
                this.state[1] = false;
                this.state[2] = false;
                this.state[3] = false;
                this.state[4] = false;
                this.state[5] = false;
                this.state[6] = false;
                this.state[7] = false;
                this.state[8] = false;
                this.state[9] = false;
                this.state["?"] = true;
            }
        } else {
            if (currentState["?"]) {
                currentState["?"] = false;
                currentState.acceptorPosition = [];
            }
            if (!currentState[id]) {
                currentState[id] = true;
                currentState.acceptorPosition.push(pos);
            } else {
                currentState[id] = false;
                currentState.acceptorPosition = this.modifiedArray(currentState, pos);
            }
        }

        this.setState(currentState);
        this.props.onChangeEvent(this.state.acceptorPosition);

        return;
    }

    modifiedArray (_currentState: Object, _pos: number) {
        let ret = _currentState.acceptorPosition.filter(n => n !== _pos);
        return ret;
    }

    render () {
        let usableCarbon = {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true,
            9: true
        };

        return (
            <div>
                <Popup
                    trigger={<Button>select linkage position</Button>}
                    flowing hoverable
                    position="bottom left"
                    disabled={this.state.disabled}
                >
                    <Header as={"h4"}>Select linkage position</Header>
                    <Grid>
                        <Grid.Row columns={"5"}>
                            <Grid.Column>
                                <Checkbox id={"?"} checked={this.state["?"]} label={"?"} onClick={this.onClickEvent} value={-1} />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"1"} checked={this.state[1]} label={"1"} onClick={this.onClickEvent} value={1} disabled={!usableCarbon[1]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"2"} checked={this.state[2]} label={"2"} onClick={this.onClickEvent} value={2} disabled={!usableCarbon[2]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"3"} checked={this.state[3]} label={"3"} onClick={this.onClickEvent} value={3} disabled={!usableCarbon[3]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"4"} checked={this.state[4]} label={"4"} onClick={this.onClickEvent} value={4} disabled={!usableCarbon[4]}/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns={"5"}>
                            <Grid.Column>
                                <Checkbox id={"5"} checked={this.state[5]} label={"5"} onClick={this.onClickEvent} value={5} disabled={!usableCarbon[5]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"6"} checked={this.state[6]} label={"6"} onClick={this.onClickEvent} value={6} disabled={!usableCarbon[6]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"7"} checked={this.state[7]} label={"7"} onClick={this.onClickEvent} value={7} disabled={!usableCarbon[7]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"8"} checked={this.state[8]} label={"8"} onClick={this.onClickEvent} value={8} disabled={!usableCarbon[8]}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox id={"9"} checked={this.state[9]} label={"9"} onClick={this.onClickEvent} value={9} disabled={!usableCarbon[9]}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Popup>
            </div>
        );
    }
}