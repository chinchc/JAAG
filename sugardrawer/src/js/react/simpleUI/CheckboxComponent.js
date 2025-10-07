//@flow
"use strict";

import React from "react";
import {Checkbox, Grid, Header, Segment} from "semantic-ui-react";
import {liaise} from "../../script";

export default class CheckboxComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChangeCheckboxEvent = (e, data) => {
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

        /*
        if(data.checked) {
            liaise.setSelectedModifiactionPositions(data.label);
        }
        else {
            liaise.deleateSelectedModifiactionPositions(data.label);
        }
         */
        liaise.newSubstituent.acceptorPosition = currentState.acceptorPosition;
    };

    modifiedArray (_currentState: Object, _pos: number) {
        let ret = _currentState.acceptorPosition.filter(n => n !== _pos);
        return ret;
    }

    render () {
        return(
            <div>
                <Segment>
                    <Header textAlign={"center"}>Linkage position</Header>
                    <Grid columns={5} textAlign={"center"}>
                        <Grid.Row>
                            <Grid.Column>
                                <Checkbox
                                    id = {"1"}
                                    label = "1"
                                    value = {1}
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"2"}
                                    label = "2"
                                    value = {2}
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"3"}
                                    label = "3"
                                    value = {3}
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"4"}
                                    label = "4"
                                    value = {4}
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"5"}
                                    value = {5}
                                    label = "5"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Checkbox
                                    id = {"6"}
                                    value = {6}
                                    label = "6"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"7"}
                                    value = {7}
                                    label= "7"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"8"}
                                    value = {8}
                                    label = "8"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"9"}
                                    value = {9}
                                    label = "9"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Checkbox
                                    id = {"?"}
                                    value = {-1}
                                    label= "?"
                                    onChange = {this.onChangeCheckboxEvent}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>

        );
    }

}