"use strict";

import React from "react";
import { Table, Image, Form, Checkbox, TextArea, Radio, Button } from "semantic-ui-react";
import { liaise } from "../../script";
import { nodeModeSearch } from "../nodeModeSearch";
import { NodeImage } from "./NodeImage";
import { nodeModeType } from "../nodeModeType";

export class FragmentTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMode: liaise.newNode,
            undef: false,
            textAreaValue: "",
            isomerValue: "",
            ringValue: "",
            carbonBackbone: ""
        };
    }


    onClickEvent(e) {
        let currentState = this.state;
        currentState.undef = false;
        currentState.currentMode = nodeModeSearch(e.target.id);
        currentState.textAreaValue = "";
        currentState.isomerValue = "";
        currentState.ringValue = "";
        currentState.carbonBackbone = "";
        //undeNodeの設定を削除
        //liaise.initUndefNodeSelect();
        this.setState(currentState);
        liaise.newNode = currentState.currentMode;
        console.log(e.target.id);
    }

    onButtonClickEvent() {
        console.log("Clickしたよ！");
        /*
        if (liaise.getSelectedFragmentNonReductionSugar().length === 0) {
            alert("Please select non reduction sugar!");
            return;
        }
         */
        //createSelectedFragment();
    }


    onClickToggleEvent = () => {
        let currentState = this.state;
        currentState.currentMode = nodeModeSearch("");
        liaise.newNode = currentState.currentMode;
        if(currentState.undef) {
            currentState.undef = false;
        }
        else {
            currentState.undef = true;
        }
        liaise.undefNode = currentState.undef;
        this.setState(currentState);
    };

    onChangeUndefSugarNameAra = (e) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.textAreaValue = e.target.value;
            liaise.undefNodeSelect.name = currentState.textAreaValue;
            this.setState(currentState);
        }
    };

    onChangeIsomerRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.isomerValue = {value}.value;
            liaise.undefNodeSelect.isomer = currentState.isomerValue;
            this.setState(currentState);
        }
    };

    onChangeRingRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.ringValue = {value}.value;
            liaise.undefNodeSelect.ring = currentState.ringValue;
            this.setState(currentState);
        }
    };

    onChangeBackboneRadio = (e, {value}) => {
        let currentState = this.state;
        if(currentState.undef) {
            currentState.carbonBackbone = {value}.value;
            liaise.undefNodeSelect.backbone = currentState.carbonBackbone;
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
        };

        return (
            <div>
                <Table definition {...defTableSize} >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
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
                            <Table.Cell id = { "Hexose" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Hexose.jpg" id = { "Hexose" } selected = { this.state.currentMode === nodeModeType.HEXOSE } defStyle = { defImageStyle }/></Table.Cell>
                            <Table.Cell id = { "Glc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Glc.jpg"  id = { "Glc" } selected = { this.state.currentMode === nodeModeType.GLC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Man" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Man.jpg"  id = { "Man" } selected = { this.state.currentMode === nodeModeType.MAN } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Gal" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Gal.jpg"  id = { "Gal" } selected = { this.state.currentMode === nodeModeType.GAL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Gul" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Gul.jpg"  id = { "Gul" } selected = { this.state.currentMode === nodeModeType.GUL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Alt" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Alt.jpg"  id = { "Alt" } selected = { this.state.currentMode === nodeModeType.ALT } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "All" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/All.jpg"  id = { "All" } selected = { this.state.currentMode === nodeModeType.ALL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Tal" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Tal.jpg"  id = { "Tal" } selected = { this.state.currentMode === nodeModeType.TAL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Ido" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Ido.jpg"  id = { "Ido" } selected = { this.state.currentMode === nodeModeType.IDO } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Square</Table.Cell>
                            <Table.Cell id = { "HexNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/HexNAc.jpg"  id = { "HexNAc" } selected = { this.state.currentMode === nodeModeType.HEXNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GlcNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GlcNAc.jpg"  id = { "GlcNAc" } selected = { this.state.currentMode === nodeModeType.GLCNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "ManNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/ManNAc.jpg"  id = { "ManNAc" } selected = { this.state.currentMode === nodeModeType.MANNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GalNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GalNAc.jpg"  id = { "GalNAc" } selected = { this.state.currentMode === nodeModeType.GALNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GulNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GulNAc.jpg"  id = { "GulNAc" } selected = { this.state.currentMode === nodeModeType.GULNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "AltNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AltNAc.jpg"  id = { "AltNAc" } selected = { this.state.currentMode === nodeModeType.ALTNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "AllNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AllNAc.jpg"  id = { "AllNAc" } selected = { this.state.currentMode === nodeModeType.ALLNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "TalNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/TalNAc.jpg"  id = { "TalNAc" } selected = { this.state.currentMode === nodeModeType.TALNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "IdoNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/IdoNAc.jpg"  id = { "IdoNAc" } selected = { this.state.currentMode === nodeModeType.IDONAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Crossed Square</Table.Cell>
                            <Table.Cell id = { "Hexosamine" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Hexosamine.jpg"  id = { "Hexosamine" } selected = { this.state.currentMode === nodeModeType.HEXOSAMINE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GlcN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GlcN.jpg"  id = { "GlcN" } selected = { this.state.currentMode === nodeModeType.GLCN } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "ManN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/MAnN.jpg"  id = { "ManN" } selected = { this.state.currentMode === nodeModeType.MANN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "GalN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GalN.jpg"  id = { "GalN" } selected = { this.state.currentMode === nodeModeType.GALN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "GulN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GulN.jpg"  id = { "GulN" } selected = { this.state.currentMode === nodeModeType.GULN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "AltN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AltN.jpg"  id = { "AltN" } selected = { this.state.currentMode === nodeModeType.ALTN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "AllN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AllN.jpg"  id = { "AllN" } selected = { this.state.currentMode === nodeModeType.ALLN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "TalN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/TalN.jpg"  id = { "TalN" } selected = { this.state.currentMode === nodeModeType.TALN } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell id = { "IdoN" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/IdoN.jpg"  id = { "IdoN" } selected = { this.state.currentMode === nodeModeType.IDON } defStyle = { defImageStyle }  /></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Diamond</Table.Cell>
                            <Table.Cell id = { "Hexuronate" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Hexuronate.jpg"  id = { "Hexuronate" } selected = { this.state.currentMode === nodeModeType.HEXURONATE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GlcA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GlcA.jpg"  id = { "GlcA" } selected = { this.state.currentMode === nodeModeType.GLCA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "ManA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/ManA.jpg"  id = { "ManA" } selected = { this.state.currentMode === nodeModeType.MANA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GalA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GalA.jpg"  id = { "GalA" } selected = { this.state.currentMode === nodeModeType.GALA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "GulA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/GulA.jpg"  id = { "GulA" } selected = { this.state.currentMode === nodeModeType.GULA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "AltA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AltA.jpg"  id = { "AltA" } selected = { this.state.currentMode === nodeModeType.ALTA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "AllA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/AllA.jpg"  id = { "AllA" } selected = { this.state.currentMode === nodeModeType.ALLA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "TalA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/TalA.jpg"  id = { "TalA" } selected = { this.state.currentMode === nodeModeType.TALA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "IdoA" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/IdoA.jpg"  id = { "IdoA" } selected = { this.state.currentMode === nodeModeType.IDOA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Triangle</Table.Cell>
                            <Table.Cell id = { "Deoxyhexose" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Deoxyhexose.jpg"  id = { "Deoxyhexose" } selected = { this.state.currentMode === nodeModeType.DEOXYHEXOSE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Qui" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Qui.jpg"  id = { "Qui" } selected = { this.state.currentMode === nodeModeType.QUI } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Rha" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Rha.jpg"  id = { "Rha" } selected = { this.state.currentMode === nodeModeType.RHA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dGul" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/6dGul.jpg"  id = { "6dGul" } selected = { this.state.currentMode === nodeModeType.D6GUL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "6dAlt" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/6dAlt.jpg"  id = { "6dAlt" } selected = { this.state.currentMode === nodeModeType.D6ALT } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dTal" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/6dTal.jpg"  id = { "6dTal" } selected = { this.state.currentMode === nodeModeType.D6TAL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Fuc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Fuc.jpg"  id = { "Fuc" } selected = { this.state.currentMode === nodeModeType.FUC } defStyle = { defImageStyle } /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Triangle</Table.Cell>
                            <Table.Cell id = { "DeoxyhexNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/DeoxyhexNAc.jpg"  id = { "DeoxyhexNAc" } selected = { this.state.currentMode === nodeModeType.DEOXYHEXNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "QuiNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/QuiNAc.jpg"  id = { "QuiNAc" } selected = { this.state.currentMode === nodeModeType.QUINAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "RhaNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/RhaNAc.jpg"  id = { "RhaNAc" } selected = { this.state.currentMode === nodeModeType.RHANAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dAltNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/6dAltNAc.jpg"  id = { "6dAltNAc" } selected = { this.state.currentMode === nodeModeType.D6ALTNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "6dTalNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/6dTalNAc.jpg"  id = { "6dTalNAc" } selected = { this.state.currentMode === nodeModeType.D6TALNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "FucNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/FucNAc.jpg"  id = { "FucNAc" } selected = { this.state.currentMode === nodeModeType.FUCNAC } defStyle = { defImageStyle } /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Rectangle</Table.Cell>
                            <Table.Cell id = { "Di-deoxyhexose" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Di-deoxyhexose.jpg"  id = { "Di-deoxyhexose" } selected = { this.state.currentMode === nodeModeType.DI_DEOXYHEXOSE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Oli" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Oli.jpg"  id = { "Oli" } selected = { this.state.currentMode === nodeModeType.OLI } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Tyv" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Tyv.jpg"  id = { "Tyv" } selected = { this.state.currentMode === nodeModeType.TYV } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Abe" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Abe.jpg"  id = { "Abe" } selected = { this.state.currentMode === nodeModeType.ABE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Par" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Par.jpg"  id = { "Par" } selected = { this.state.currentMode === nodeModeType.PAR } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Dig" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Dig.jpg"  id = { "Dig" } selected = { this.state.currentMode === nodeModeType.DIG } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Col" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Col.jpg"  id = { "Col" } selected = { this.state.currentMode === nodeModeType.COL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Star</Table.Cell>
                            <Table.Cell id = { "Pentose" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Pentose.jpg"  id = { "Pentose" } selected = { this.state.currentMode === nodeModeType.PENTOSE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Ara" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Ara.jpg"  id = { "Ara" } selected = { this.state.currentMode === nodeModeType.ARA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Lyx" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Lyx.jpg"  id = { "Lyx" } selected = { this.state.currentMode === nodeModeType.LYX } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Xyl" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Xyl.jpg"  id = { "Xyl" } selected = { this.state.currentMode === nodeModeType.XYL } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Rib" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Rib.jpg"  id = { "Rib" } selected = { this.state.currentMode === nodeModeType.RIB } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Diamond</Table.Cell>
                            <Table.Cell id = { "Deoxynonulosonate" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Deoxynonulosonate.jpg"  id = { "Deoxynonulosonate" } selected = { this.state.currentMode === nodeModeType.DEOXYNONULOSONATE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Kdn" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Kdn.jpg"  id = { "Kdn" } selected = { this.state.currentMode === nodeModeType.KDN } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Neu5Ac" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Neu5Ac.jpg"  id = { "Neu5Ac" } selected = { this.state.currentMode === nodeModeType.NEU5AC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Neu5Gc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Neu5Gc.jpg"  id = { "Neu5Gc" } selected = { this.state.currentMode === nodeModeType.NEU5GC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Neu" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Neu.jpg"  id = { "Neu" } selected = { this.state.currentMode === nodeModeType.NEU } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Sia" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Sia.jpg"  id = { "Sia" } selected = { this.state.currentMode === nodeModeType.SIA } defStyle = { defImageStyle } /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Diamond</Table.Cell>
                            <Table.Cell id = { "Di-deoxynonulosonate" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Di-deoxynonulosonate.jpg"  id = { "Di-deoxynonulosonate" }  selected = { this.state.currentMode === nodeModeType.DI_DEOXYNONULOSONATE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Pse" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Pse.jpg"  id = { "Pse" } selected = { this.state.currentMode === nodeModeType.PSE } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Leg" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Leg.jpg"  id = { "Leg" } selected = { this.state.currentMode === nodeModeType.LEG } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "Aci" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Aci.jpg"  id = { "Aci" } selected = { this.state.currentMode === nodeModeType.ACI } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell id = { "4eLeg" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/4eLeg.jpg"  id = { "4eLeg" } selected = { this.state.currentMode === nodeModeType.E4LEG } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Hexagon</Table.Cell>
                            <Table.Cell id = { "Unknown" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Unknown.jpg"  id = { "Unknown" } selected = { this.state.currentMode === nodeModeType.UNKNOWN } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Bac" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Bac.jpg"  id = { "Bac" } selected = { this.state.currentMode === nodeModeType.BAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "LDmanHep" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/LDmanHep.jpg"  id = { "LDmanHep" }  selected = { this.state.currentMode === nodeModeType.LDMANHEP } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Kdo" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Kdo.jpg"  id = { "Kdo" } selected = { this.state.currentMode === nodeModeType.KDO } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Dha" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Dha.jpg"  id = { "Dha" } selected = { this.state.currentMode === nodeModeType.DHA } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "DDmanHep" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/DDmanHep.jpg"  id = { "DDmanHep" } selected = { this.state.currentMode === nodeModeType.DDMANHEP } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "MurNAc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/MurNAc.jpg"  id = { "MurNAc" } selected = { this.state.currentMode === nodeModeType.MURNAC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "MurNGc" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/MurNGc.jpg"  id = { "MurNGc" } selected = { this.state.currentMode === nodeModeType.MURNGC } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Mur" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Mur.jpg"  id = { "Mur" } selected = { this.state.currentMode === nodeModeType.MUR } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Pentagon</Table.Cell>
                            <Table.Cell id = { "Assigned" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Assigned.jpg"  id = { "Assigned" } selected = { this.state.currentMode === nodeModeType.ASSIGNED } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Api" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Api.jpg"  id = { "Api" } selected = { this.state.currentMode === nodeModeType.API } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Fru" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Fru.jpg"  id = { "Fru" } selected = { this.state.currentMode === nodeModeType.FRU } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Tag" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Tag.jpg"  id = { "Tag" } selected = { this.state.currentMode === nodeModeType.TAG } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Sor" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Sor.jpg"  id = { "Sor" } selected = { this.state.currentMode === nodeModeType.SOR } defStyle = { defImageStyle } /></Table.Cell>
                            <Table.Cell id = { "Psi" } onClick = { (event) => this.onClickEvent(event) } ><NodeImage image="../image/symbol/Psi.jpg"  id = { "Psi" } selected = { this.state.currentMode === nodeModeType.PSI } defStyle = { defImageStyle } /></Table.Cell>
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
                                        <Button onClick = { () => this.onButtonClickEvent() } primary active = {false} >Apply!</Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            toggle
                                            label = "undefined Monosaccharide in SNFG"
                                            checked = {this.state.undef}
                                            onChange = {this.onClickToggleEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <TextArea value = {this.state.textAreaValue} { ...defTextAreaSize } onChange = {(event) => this.onChangeUndefSugarNameAra(event)} placeholder = "please enter undefind sugar name." autoHeight/>
                    </Form.Field>
                </Form>

                <Form>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="3"> Select undefined sugar isomer.</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="L"
                                            name="isomerRadioGroup"
                                            value="L"
                                            checked={this.state.isomerValue === "L"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="D"
                                            name="isomerRadioGroup"
                                            value="D"
                                            checked={this.state.isomerValue === "D"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="undefined"
                                            name="isomerRadioGroup"
                                            value="undefined"
                                            checked={this.state.isomerValue === "undefined"}
                                            onChange = {this.onChangeIsomerRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Form>

                <Form>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="3"> Select undefined sugar ring.</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="pyranose"
                                            name="ringRadioGroup"
                                            value="pyranose"
                                            checked={this.state.ringValue === "pyranose"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="furanose"
                                            name="ringRadioGroup"
                                            value="furanose"
                                            checked={this.state.ringValue === "furanose"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="undefined"
                                            name="ringRadioGroup"
                                            value="undefined"
                                            checked={this.state.ringValue === "undefined"}
                                            onChange = {this.onChangeRingRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Form>


                <Form>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="5"> Select undefined sugar carbon backbone.</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label= {1}
                                            name="backboneRadioGroup"
                                            value={1}
                                            checked={this.state.carbonBackbone === 1}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={2}
                                            name="backboneRadioGroup"
                                            value={2}
                                            checked={this.state.carbonBackbone === 2}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={3}
                                            name="backboneRadioGroup"
                                            value={3}
                                            checked={this.state.carbonBackbone === 3}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={4}
                                            name="backboneRadioGroup"
                                            value={4}
                                            checked={this.state.carbonBackbone === 4}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={5}
                                            name="backboneRadioGroup"
                                            value={5}
                                            checked={this.state.carbonBackbone === 5}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={6}
                                            name="backboneRadioGroup"
                                            value={6}
                                            checked={this.state.carbonBackbone === 6}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={7}
                                            name="backboneRadioGroup"
                                            value={7}
                                            checked={this.state.carbonBackbone === 7}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={8}
                                            name="backboneRadioGroup"
                                            value={8}
                                            checked={this.state.carbonBackbone === 8}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label={9}
                                            name="backboneRadioGroup"
                                            value={9}
                                            checked={this.state.carbonBackbone === 9}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Field>
                                        <Radio
                                            label="undefined"
                                            name="backboneRadioGroup"
                                            value={NaN}
                                            checked={isNaN(this.state.carbonBackbone)}
                                            onChange = {this.onChangeBackboneRadio}
                                        />
                                    </Form.Field>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Form>
            </div>
        );
    }
}
