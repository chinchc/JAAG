"use strict";

import React from "react";
import { Table, Image, Button, Checkbox, Form, TextArea} from "semantic-ui-react";
import {liaise} from "../../script";
import { NodeImage } from "./NodeImage";
import { nodeModeType } from "../nodeModeType";

export class CompositionTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // currentValue: liaise.nodeSelect,
            currentValue: liaise.compositionSelect,
            undef: false,
            textAreaValue: ""
        };
    }


    onClickEvent() {
        console.log("compositionに入ったよ！");
        let compositionsArray = liaise.searchComposition();
        console.log(compositionsArray);
        if(compositionsArray.length === 0 ) {
            return;
        }
        //createComposition(compositionsArray);
    }

    onChangeEvent(e) {
        let currentState = this.state;
        liaise.setCompositionSelect(e.target.name, e.target.value);
        currentState.currentValue = liaise.getCompositionSelect();
        this.setState(currentState);
    }

    onClickToggleEvent = () => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.undef = false;
        }
        else {
            currentState.undef = true;
        }
        liaise.undefComposition = currentState.undef;
        this.setState(currentState);
    };

    onChangeUndefSugarNameAra = (e) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.textAreaValue = e.target.value;
            liaise.undefCompositionName = currentState.textAreaValue;
            this.setState(currentState);
        }
    };



    render(){
        const defImageStyle = {
            style: {}
        };
        const defTextAreaSize = {
            style: {
                width: "100%",
                height: "100%"
            }
        };

        const defTableSize = {
            style: {
                "textAlign": "center",
                width: "auto"
            }
        }

        return (
            <div>
                <Button onClick = { () => this.onClickEvent() } primary active = {false} >Apply!</Button>
                <Table definition  {...defTableSize} >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell ></Table.HeaderCell>
                            <Table.HeaderCell>White<br/>(Generic)</Table.HeaderCell>
                            <Table.HeaderCell>Blue</Table.HeaderCell>
                            <Table.HeaderCell>Green</Table.HeaderCell>
                            <Table.HeaderCell>Yellow</Table.HeaderCell>
                            <Table.HeaderCell>Orange</Table.HeaderCell>
                            <Table.HeaderCell>Pink</Table.HeaderCell>
                            <Table.HeaderCell>Purple</Table.HeaderCell>
                            <Table.HeaderCell>Light Blue</Table.HeaderCell>
                            <Table.HeaderCell>Brown</Table.HeaderCell>
                            <Table.HeaderCell>Red</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Filled Circle</Table.Cell>
                            <Table.Cell id = { "Hexose" } ><NodeImage image='../image/symbol/Hexose.jpg' id = { "Hexose" } selected = { this.state.currentMode === nodeModeType.HEXOSE } defStyle = { defImageStyle }/>
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Hexose"} min = {"0"} max = {"100"} value = {this.state.currentValue["Hexose"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Glc" }  ><NodeImage image='../image/symbol/Glc.jpg'  id = { "Glc" } selected = { this.state.currentMode === nodeModeType.GLC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Glc"} min = {"0"} max = {"100"} value = {this.state.currentValue["Glc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Man" }  ><NodeImage image='../image/symbol/Man.jpg'  id = { "Man" } selected = { this.state.currentMode === nodeModeType.MAN } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Man"} min = {"0"} max = {"100"} value = {this.state.currentValue["Man"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Gal" }  ><NodeImage image='../image/symbol/Gal.jpg'  id = { "Gal" } selected = { this.state.currentMode === nodeModeType.GAL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Gal"} min = {"0"} max = {"100"} value = {this.state.currentValue["Gal"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Gul" }  ><NodeImage image='../image/symbol/Gul.jpg'  id = { "Gul" } selected = { this.state.currentMode === nodeModeType.GUL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Gul"} min = {"0"} max = {"100"} value = {this.state.currentValue["Gul"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Alt" }  ><NodeImage image='../image/symbol/Alt.jpg'  id = { "Alt" } selected = { this.state.currentMode === nodeModeType.ALT } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Alt"} min = {"0"} max = {"100"} value = {this.state.currentValue["Alt"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "All" }  ><NodeImage image='../image/symbol/All.jpg'  id = { "All" } selected = { this.state.currentMode === nodeModeType.ALL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"All"} min = {"0"} max = {"100"} value = {this.state.currentValue["All"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Tal" }  ><NodeImage image='../image/symbol/Tal.jpg'  id = { "Tal" } selected = { this.state.currentMode === nodeModeType.TAL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Tal"} min = {"0"} max = {"100"} value = {this.state.currentValue["Tal"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Ido" }  ><NodeImage image='../image/symbol/Ido.jpg'  id = { "Ido" } selected = { this.state.currentMode === nodeModeType.IDO } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Ido"} min = {"0"} max = {"100"} value = {this.state.currentValue["Ido"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Square</Table.Cell>
                            <Table.Cell id = { "HexNAc" }  ><NodeImage image='../image/symbol/HexNAc.jpg'  id = { "HexNAc" } selected = { this.state.currentMode === nodeModeType.HEXNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"HexNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["HexNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GlcNAc" }  ><NodeImage image='../image/symbol/GlcNAc.jpg'  id = { "GlcNAc" } selected = { this.state.currentMode === nodeModeType.GLCNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GlcNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["GlcNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "ManNAc" }  ><NodeImage image='../image/symbol/ManNAc.jpg'  id = { "ManNAc" } selected = { this.state.currentMode === nodeModeType.MANNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"ManNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["ManNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GalNAc" }  ><NodeImage image='../image/symbol/GalNAc.jpg'  id = { "GalNAc" } selected = { this.state.currentMode === nodeModeType.GALNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GalNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["GalNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GulNAc" }  ><NodeImage image='../image/symbol/GulNAc.jpg'  id = { "GulNAc" } selected = { this.state.currentMode === nodeModeType.GULNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GulNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["GulNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AltNAc" }  ><NodeImage image='../image/symbol/AltNAc.jpg'  id = { "AltNAc" } selected = { this.state.currentMode === nodeModeType.ALTNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AltNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["AltNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AllNAc" }  ><NodeImage image='../image/symbol/AllNAc.jpg'  id = { "AllNAc" } selected = { this.state.currentMode === nodeModeType.ALLNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AllNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["AllNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "TalNAc" }  ><NodeImage image='../image/symbol/TalNAc.jpg'  id = { "TalNAc" } selected = { this.state.currentMode === nodeModeType.TALNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"TalNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["TalNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "IdoNAc" }  ><NodeImage image='../image/symbol/IdoNAc.jpg'  id = { "IdoNAc" } selected = { this.state.currentMode === nodeModeType.IDONAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"IdoNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["IdoNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Crossed Square</Table.Cell>
                            <Table.Cell id = { "Hexosamine" }  ><NodeImage image='../image/symbol/Hexosamine.jpg'  id = { "Hexosamine" } selected = { this.state.currentMode === nodeModeType.HEXOSAMINE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Hexosamine"} min = {"0"} max = {"100"} value = {this.state.currentValue["Hexosamine"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GlcN" }  ><NodeImage image='../image/symbol/GlcN.jpg'  id = { "GlcN" } selected = { this.state.currentMode === nodeModeType.GLCN } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GlcN"} min = {"0"} max = {"100"} value = {this.state.currentValue["GlcN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "ManN" }  ><NodeImage image='../image/symbol/MAnN.jpg'  id = { "ManN" } selected = { this.state.currentMode === nodeModeType.MANN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"ManN"} min = {"0"} max = {"100"} value = {this.state.currentValue["ManN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GalN" }  ><NodeImage image='../image/symbol/GalN.jpg'  id = { "GalN" } selected = { this.state.currentMode === nodeModeType.GALN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GalN"} min = {"0"} max = {"100"} value = {this.state.currentValue["GalN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GulN" }  ><NodeImage image='../image/symbol/GulN.jpg'  id = { "GulN" } selected = { this.state.currentMode === nodeModeType.GULN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GulN"} min = {"0"} max = {"100"} value = {this.state.currentValue["GulN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AltN" }  ><NodeImage image='../image/symbol/AltN.jpg'  id = { "AltN" } selected = { this.state.currentMode === nodeModeType.ALTN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AltN"} min = {"0"} max = {"100"} value = {this.state.currentValue["AltN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AllN" }  ><NodeImage image='../image/symbol/AllN.jpg'  id = { "AllN" } selected = { this.state.currentMode === nodeModeType.ALLN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AllN"} min = {"0"} max = {"100"} value = {this.state.currentValue["AllN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "TalN" }  ><NodeImage image='../image/symbol/TalN.jpg'  id = { "TalN" } selected = { this.state.currentMode === nodeModeType.TALN } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"TalN"} min = {"0"} max = {"100"} value = {this.state.currentValue["TalN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "IdoN" }  ><NodeImage image='../image/symbol/IdoN.jpg'  id = { "IdoN" } selected = { this.state.currentMode === nodeModeType.IDON } defStyle = { defImageStyle }  />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"IdoN"} min = {"0"} max = {"100"} value = {this.state.currentValue["IdoN"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Diamond</Table.Cell>
                            <Table.Cell id = { "Hexuronate" }  ><NodeImage image='../image/symbol/Hexuronate.jpg'  id = { "Hexuronate" } selected = { this.state.currentMode === nodeModeType.HEXURONATE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Hexuronate"} min = {"0"} max = {"100"} value = {this.state.currentValue["Hexuronate"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GlcA" }  ><NodeImage image='../image/symbol/GlcA.jpg'  id = { "GlcA" } selected = { this.state.currentMode === nodeModeType.GLCA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GlcA"} min = {"0"} max = {"100"} value = {this.state.currentValue["GlcA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "ManA" }  ><NodeImage image='../image/symbol/ManA.jpg'  id = { "ManA" } selected = { this.state.currentMode === nodeModeType.MANA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"ManA"} min = {"0"} max = {"100"} value = {this.state.currentValue["ManA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GalA" }  ><NodeImage image='../image/symbol/GalA.jpg'  id = { "GalA" } selected = { this.state.currentMode === nodeModeType.GALA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GalA"} min = {"0"} max = {"100"} value = {this.state.currentValue["GalA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "GulA" }  ><NodeImage image='../image/symbol/GulA.jpg'  id = { "GulA" } selected = { this.state.currentMode === nodeModeType.GULA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"GulA"} min = {"0"} max = {"100"} value = {this.state.currentValue["GulA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AltA" }  ><NodeImage image='../image/symbol/AltA.jpg'  id = { "AltA" } selected = { this.state.currentMode === nodeModeType.ALTA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AltA"} min = {"0"} max = {"100"} value = {this.state.currentValue["AltA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "AllA" }  ><NodeImage image='../image/symbol/AllA.jpg'  id = { "AllA" } selected = { this.state.currentMode === nodeModeType.ALLA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"AllA"} min = {"0"} max = {"100"} value = {this.state.currentValue["AllA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "TalA" }  ><NodeImage image='../image/symbol/TalA.jpg'  id = { "TalA" } selected = { this.state.currentMode === nodeModeType.TALA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"TalA"} min = {"0"} max = {"100"} value = {this.state.currentValue["TalA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "IdoA" }  ><NodeImage image='../image/symbol/IdoA.jpg'  id = { "IdoA" } selected = { this.state.currentMode === nodeModeType.IDOA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"IdoA"} min = {"0"} max = {"100"} value = {this.state.currentValue["IdoA"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Triangle</Table.Cell>
                            <Table.Cell id = { "Deoxyhexose" }  ><NodeImage image='../image/symbol/Deoxyhexose.jpg'  id = { "Deoxyhexose" } selected = { this.state.currentMode === nodeModeType.DEOXYHEXOSE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Deoxyhexose"} min = {"0"} max = {"100"} value = {this.state.currentValue["Deoxyhexose"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Qui" }  ><NodeImage image='../image/symbol/Qui.jpg'  id = { "Qui" } selected = { this.state.currentMode === nodeModeType.QUI } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Qui"} min = {"0"} max = {"100"} value = {this.state.currentValue["Qui"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Rha" }  ><NodeImage image='../image/symbol/Rha.jpg'  id = { "Rha" } selected = { this.state.currentMode === nodeModeType.RHA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Rha"} min = {"0"} max = {"100"} value = {this.state.currentValue["Rha"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dGul" }  ><NodeImage image='../image/symbol/6dGul.jpg'  id = { "6dGul" } selected = { this.state.currentMode === nodeModeType.D6GUL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"6dGul"} min = {"0"} max = {"100"} value = {this.state.currentValue["6dGul"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "6dAlt" }  ><NodeImage image='../image/symbol/6dAlt.jpg'  id = { "6dAlt" } selected = { this.state.currentMode === nodeModeType.D6ALT } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"6dAlt"} min = {"0"} max = {"100"} value = {this.state.currentValue["6dAlt"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dTal" }  ><NodeImage image='../image/symbol/6dTal.jpg'  id = { "6dTal" } selected = { this.state.currentMode === nodeModeType.D6TAL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"6dTal"} min = {"0"} max = {"100"} value = {this.state.currentValue["6dTal"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Fuc" }  ><NodeImage image='../image/symbol/Fuc.jpg'  id = { "Fuc" } selected = { this.state.currentMode === nodeModeType.FUC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Fuc"} min = {"0"} max = {"100"} value = {this.state.currentValue["Fuc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Triangle</Table.Cell>
                            <Table.Cell id = { "DeoxyhexNAc" }  ><NodeImage image='../image/symbol/DeoxyhexNAc.jpg'  id = { "DeoxyhexNAc" } selected = { this.state.currentMode === nodeModeType.DEOXYHEXNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"DeoxyhexNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["DeoxyhexNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "QuiNAc" }  ><NodeImage image='../image/symbol/QuiNAc.jpg'  id = { "QuiNAc" } selected = { this.state.currentMode === nodeModeType.QUINAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"QuiNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["QuiNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "RhaNAc" }  ><NodeImage image='../image/symbol/RhaNAc.jpg'  id = { "RhaNAc" } selected = { this.state.currentMode === nodeModeType.RHANAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"RhaNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["RhaNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dAltNAc" }  ><NodeImage image='../image/symbol/6dAltNAc.jpg'  id = { "6dAltNAc" } selected = { this.state.currentMode === nodeModeType.D6ALTNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"6dAltNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["6dAltNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dTalNAc" }  ><NodeImage image='../image/symbol/6dTalNAc.jpg'  id = { "6dTalNAc" } selected = { this.state.currentMode === nodeModeType.D6TALNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"6dTalNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["6dTalNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "FucNAc" }  ><NodeImage image='../image/symbol/FucNAc.jpg'  id = { "FucNAc" } selected = { this.state.currentMode === nodeModeType.FUCNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"FucNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["FucNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Rectangle</Table.Cell>
                            <Table.Cell id = { "Di-deoxyhexose" }  ><NodeImage image='../image/symbol/Di-deoxyhexose.jpg'  id = { "Di-deoxyhexose" } selected = { this.state.currentMode === nodeModeType.DI_DEOXYHEXOSE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Di-deoxyhexose"} min = {"0"} max = {"100"} value = {this.state.currentValue["Di-deoxyhexose"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Oli" }  ><NodeImage image='../image/symbol/Oli.jpg'  id = { "Oli" } selected = { this.state.currentMode === nodeModeType.OLI } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Oli"} min = {"0"} max = {"100"} value = {this.state.currentValue["Oli"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Tyv" }  ><NodeImage image='../image/symbol/Tyv.jpg'  id = { "Tyv" } selected = { this.state.currentMode === nodeModeType.TYV } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Tyv"} min = {"0"} max = {"100"} value = {this.state.currentValue["Tyv"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Abe" }  ><NodeImage image='../image/symbol/Abe.jpg'  id = { "Abe" } selected = { this.state.currentMode === nodeModeType.ABE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Abe"} min = {"0"} max = {"100"} value = {this.state.currentValue["Abe"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Par" }  ><NodeImage image='../image/symbol/Par.jpg'  id = { "Par" } selected = { this.state.currentMode === nodeModeType.PAR } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Par"} min = {"0"} max = {"100"} value = {this.state.currentValue["Par"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Dig" }  ><NodeImage image='../image/symbol/Dig.jpg'  id = { "Dig" } selected = { this.state.currentMode === nodeModeType.DIG } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Dig"} min = {"0"} max = {"100"} value = {this.state.currentValue["Dig"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Col" }  ><NodeImage image='../image/symbol/Col.jpg'  id = { "Col" } selected = { this.state.currentMode === nodeModeType.COL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Col"} min = {"0"} max = {"100"} value = {this.state.currentValue["Col"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Star</Table.Cell>
                            <Table.Cell id = { "Pentose" }  ><NodeImage image='../image/symbol/Pentose.jpg'  id = { "Pentose" } selected = { this.state.currentMode === nodeModeType.PENTOSE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Pentose"} min = {"0"} max = {"100"} value = {this.state.currentValue["Pentose"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Ara" }  ><NodeImage image='../image/symbol/Ara.jpg'  id = { "Ara" } selected = { this.state.currentMode === nodeModeType.ARA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Ara"} min = {"0"} max = {"100"} value = {this.state.currentValue["Ara"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Lyx" }  ><NodeImage image='../image/symbol/Lyx.jpg'  id = { "Lyx" } selected = { this.state.currentMode === nodeModeType.LYX } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Lyx"} min = {"0"} max = {"100"} value = {this.state.currentValue["Lyx"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Xyl" }  ><NodeImage image='../image/symbol/Xyl.jpg'  id = { "Xyl" } selected = { this.state.currentMode === nodeModeType.XYL } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Xyl"} min = {"0"} max = {"100"} value = {this.state.currentValue["Xyl"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Rib" }  ><NodeImage image='../image/symbol/Rib.jpg'  id = { "Rib" } selected = { this.state.currentMode === nodeModeType.RIB } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Rib"} min = {"0"} max = {"100"} value = {this.state.currentValue["Rib"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Diamond</Table.Cell>
                            <Table.Cell id = { "Deoxynonulosonate" }  ><NodeImage image='../image/symbol/Deoxynonulosonate.jpg'  id = { "Deoxynonulosonate" } selected = { this.state.currentMode === nodeModeType.DEOXYNONULOSONATE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Deoxynonulosonate"} min = {"0"} max = {"100"} value = {this.state.currentValue["Deoxynonulosonate"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Kdn" }  ><NodeImage image='../image/symbol/Kdn.jpg'  id = { "Kdn" } selected = { this.state.currentMode === nodeModeType.KDN } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Kdn"} min = {"0"} max = {"100"} value = {this.state.currentValue["Kdn"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Neu5Ac" }  ><NodeImage image='../image/symbol/Neu5Ac.jpg'  id = { "Neu5Ac" } selected = { this.state.currentMode === nodeModeType.NEU5AC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Neu5Ac"} min = {"0"} max = {"100"} value = {this.state.currentValue["Neu5Ac"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Neu5Gc" }  ><NodeImage image='../image/symbol/Neu5Gc.jpg'  id = { "Neu5Gc" } selected = { this.state.currentMode === nodeModeType.NEU5GC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Neu5Gc"} min = {"0"} max = {"100"} value = {this.state.currentValue["Neu5Gc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Neu" }  ><NodeImage image='../image/symbol/Neu.jpg'  id = { "Neu" } selected = { this.state.currentMode === nodeModeType.NEU } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Neu"} min = {"0"} max = {"100"} value = {this.state.currentValue["Neu"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Sia" }  ><NodeImage image='../image/symbol/Sia.jpg'  id = { "Sia" } selected = { this.state.currentMode === nodeModeType.SIA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Sia"} min = {"0"} max = {"100"} value = {this.state.currentValue["Sia"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Diamond</Table.Cell>
                            <Table.Cell id = { "Di-deoxynonulosonate" }  ><NodeImage image='../image/symbol/Di-deoxynonulosonate.jpg'  id = { "Di-deoxynonulosonate" }  selected = { this.state.currentMode === nodeModeType.DI_DEOXYNONULOSONATE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Di-deoxynonulosonate"} min = {"0"} max = {"100"} value = {this.state.currentValue["Di-deoxynonulosonate"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Pse" }  ><NodeImage image='../image/symbol/Pse.jpg'  id = { "Pse" } selected = { this.state.currentMode === nodeModeType.PSE } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Pse"} min = {"0"} max = {"100"} value = {this.state.currentValue["Pse"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Leg" }  ><NodeImage image='../image/symbol/Leg.jpg'  id = { "Leg" } selected = { this.state.currentMode === nodeModeType.LEG } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Leg"} min = {"0"} max = {"100"} value = {this.state.currentValue["Leg"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Aci" }  ><NodeImage image='../image/symbol/Aci.jpg'  id = { "Aci" } selected = { this.state.currentMode === nodeModeType.ACI } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Aci"} min = {"0"} max = {"100"} value = {this.state.currentValue["Aci"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "4eLeg" }  ><NodeImage image='../image/symbol/4eLeg.jpg'  id = { "4eLeg" } selected = { this.state.currentMode === nodeModeType.E4LEG } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"4eLeg"} min = {"0"} max = {"100"} value = {this.state.currentValue["4eLeg"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Hexagon</Table.Cell>
                            <Table.Cell id = { "Unknown" }  ><NodeImage image='../image/symbol/Unknown.jpg'  id = { "Unknown" } selected = { this.state.currentMode === nodeModeType.UNKNOWN } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Unknown"} min = {"0"} max = {"100"} value = {this.state.currentValue["Unknown"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Bac" }  ><NodeImage image='../image/symbol/Bac.jpg'  id = { "Bac" } selected = { this.state.currentMode === nodeModeType.BAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Bac"} min = {"0"} max = {"100"} value = {this.state.currentValue["Bac"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "LDmanHep" }  ><NodeImage image='../image/symbol/LDmanHep.jpg'  id = { "LDmanHep" }  selected = { this.state.currentMode === nodeModeType.LDMANHEP } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"LDmanHep"} min = {"0"} max = {"100"} value = {this.state.currentValue["LDmanHep"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Kdo" }  ><NodeImage image='../image/symbol/Kdo.jpg'  id = { "Kdo" } selected = { this.state.currentMode === nodeModeType.KDO } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Kdo"} min = {"0"} max = {"100"} value = {this.state.currentValue["Kdo"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Dha" }  ><NodeImage image='../image/symbol/Dha.jpg'  id = { "Dha" } selected = { this.state.currentMode === nodeModeType.DHA } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Dha"} min = {"0"} max = {"100"} value = {this.state.currentValue["Dha"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "DDmanHep" }  ><NodeImage image='../image/symbol/DDmanHep.jpg'  id = { "DDmanHep" } selected = { this.state.currentMode === nodeModeType.DDMANHEP } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"DDmanHep"} min = {"0"} max = {"100"} value = {this.state.currentValue["DDmanHep"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "MurNAc" }  ><NodeImage image='../image/symbol/MurNAc.jpg'  id = { "MurNAc" } selected = { this.state.currentMode === nodeModeType.MURNAC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"MurNAc"} min = {"0"} max = {"100"} value = {this.state.currentValue["MurNAc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "MurNGc" }  ><NodeImage image='../image/symbol/MurNGc.jpg'  id = { "MurNGc" } selected = { this.state.currentMode === nodeModeType.MURNGC } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"MurNGc"} min = {"0"} max = {"100"} value = {this.state.currentValue["MurNGc"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Mur" }  ><NodeImage image='../image/symbol/Mur.jpg'  id = { "Mur" } selected = { this.state.currentMode === nodeModeType.MUR } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Mur"} min = {"0"} max = {"100"} value = {this.state.currentValue["Mur"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Pentagon</Table.Cell>
                            <Table.Cell id = { "Assigned" }  ><NodeImage image='../image/symbol/Assigned.jpg'  id = { "Assigned" } selected = { this.state.currentMode === nodeModeType.ASSIGNED } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Assigned"} min = {"0"} max = {"100"} value = {this.state.currentValue["Assigned"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Api" }  ><NodeImage image='../image/symbol/Api.jpg'  id = { "Api" } selected = { this.state.currentMode === nodeModeType.API } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Api"} min = {"0"} max = {"100"} value = {this.state.currentValue["Api"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Fru" }  ><NodeImage image='../image/symbol/Fru.jpg'  id = { "Fru" } selected = { this.state.currentMode === nodeModeType.FRU } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Fru"} min = {"0"} max = {"100"} value = {this.state.currentValue["Fru"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Tag" }  ><NodeImage image='../image/symbol/Tag.jpg'  id = { "Tag" } selected = { this.state.currentMode === nodeModeType.TAG } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Tag"} min = {"0"} max = {"100"} value = {this.state.currentValue["Tag"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Sor" }  ><NodeImage image='../image/symbol/Sor.jpg'  id = { "Sor" } selected = { this.state.currentMode === nodeModeType.SOR } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Sor"} min = {"0"} max = {"100"} value = {this.state.currentValue["Sor"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell id = { "Psi" }  ><NodeImage image='../image/symbol/Psi.jpg'  id = { "Psi" } selected = { this.state.currentMode === nodeModeType.PSI } defStyle = { defImageStyle } />
                                <br/>
                                <form>
                                    <input type = {"number"} name = {"Psi"} min = {"0"} max = {"100"} value = {this.state.currentValue["Psi"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                                </form>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Form>
                    <Form.Field>
                        <Table>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            toggle
                                            label = "undefined Sugar in up-list."
                                            checked = {this.state.undef}
                                            onChange = {this.onClickToggleEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <TextArea value = {this.state.textAreaValue} { ...defTextAreaSize } onChange = {(event) => this.onChangeUndefSugarNameAra(event)} placeholder = "please enter undefind sugar name." autoHeight/>
                        <input type = {"number"} name = {"Undefined"} min = {"0"} max = {"100"} value = {this.state.currentValue["Undefined"]} step = {"1"} onChange={ (event) => this.onChangeEvent(event) } />
                    </Form.Field>
                </Form>
            </div>
        );
    }
}