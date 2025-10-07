//@flow

"use strict";

import React from "react";
import {Accordion, Radio, Icon, List} from "semantic-ui-react";
import Structures from "sugar-sketcher/src/js/models/glycomics/dictionary/Structures";
import {liaise} from "../../script";
import GlycanTextParser from "../../script/util/GlycanTextParser";
import StructureTemplate from "../../script/data/StructureTemplate";

export default class StructureList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            checked: ""
        };
    }

    onClickEvent = (e, _title) => {
        const index = _title;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    onSelectEvent = (e, data) => {
        const value = data.value;

        liaise.initStage();
        rootPos.posX = liaise.stage.canvas.width * .5;
        rootPos.posY = liaise.stage.canvas.height * .5;
        if (liaise.newGraph.length !== 0) {
            liaise.initGraph();
        }

        if (this.state.checked === value) {
            this.setState({checked: ""});
            return;
        }

        //generate GlycoCT
        const template = new StructureTemplate();
        let formula: string = template.getTemplate(value);

        if (formula === undefined) {
            alert("This structure can not support.");
            return;
        }

        let txtParser: Object = new GlycanTextParser(formula);
        txtParser.parseFormula();
        txtParser.showImage();

        this.setState({checked: value});
    };

    render () {
        const { activeIndex } = this.state;
        const defStyle = {
            style: {
                width: 200
            }
        };

        return (
            <div { ...defStyle }>
                <Accordion styled>
                    <Accordion.Title active={activeIndex === 0} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        N-glycan
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncore"} value={"ncore"} label="Core" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncorefuc"} value={"ncorefuc"} label="Fucosylated core" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncorebisect"} value={"ncorebisect"} label="Bisecting core" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncorebisectfuc"} value={"ncorebisectfuc"} label="Bisecting fucosylated core" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncoreman"} value={"ncoreman"} label="High mannose" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncorehyb"} value={"ncorehyb"} label="Hybrid" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncorecomp"} value={"ncorecomp"} label="Complex" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ncoreoligo"} value={"ncoreoligo"} label="Oligo mannose" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        O-glycan
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore1"} value={"ocore1"} label="Core1" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore2"} value={"ocore2"} label="Core2" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore3"} value={"ocore3"} label="Core3" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore4"} value={"ocore4"} label="Core4" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore5"} value={"ocore5"} label="Core5" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore6"} value={"ocore6"} label="Core6" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore7"} value={"ocore7"} label="Core7" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "ocore8"} value={"ocore8"} label="Core8" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 2} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        Glycosphingolipids
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslarthro"} value={"gslarthro"} label="Arthro" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslgala"} value={"gslgala"} label="Gala" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslganglio"} value={"gslganglio"} label="Ganglio" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslglobo"} value={"gslglobo"} label="Globo" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslisoglobo"} value={"gslisoglobo"} label="Isoglobo" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gsllacto"} value={"gsllacto"} label="Lacto" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslmollu"} value={"gslmollu"} label="Mollu" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslmuco"} value={"gslmuco"} label="Muco" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gslneolacto"} value={"gslneolacto"} label="Neolacto" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 3} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        GAGs
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "gaghyaluronic"} value={"gaghyaluronic"} label="Hyaluronic Acid" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagchodroitin4"} value={"gagchodroitin4"} label="Chondroitin (4-sulfate)" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagchodroitin6"} value={"gagchodroitin6"} label="Chondroitin (6-sulfate)" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagchodroitin26"} value={"gagchodroitin26"} label="Chondroitin (2,6-sulfate)" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagchodroitin46"} value={"gagchodroitin46"} label="Chondroitin (4,6-sulfate)" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagdermatan"} value={"gagdermatan"} label="Dermatan sulfate" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagkeratan"} value={"gagkeratan"} label="Keratan sulfate" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagheparan"} value={"gagheparan"} label="Heparan sulfate" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "gagheparin"} value={"gagheparin"} label="Heparin" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 4} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        Lewis
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 4}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "3'sulfo LewisX"} value={"3'sulfo LewisX"} label="3'sulfo LewisX" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisA"} value={"lewisA"} label="Lewis A" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisB"} value={"lewisB"} label="Lewis B" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisC"} value={"lewisC"} label="Lewis C" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisD"} value={"lewisD"} label="Lewis D" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisX"} value={"lewisX"} label="Lewis X" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lewisY"} value={"lewisY"} label="Lewis Y" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "sialylLewisA"} value={"sialylLewisA"} label="Sialyl Lewis A" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "sialylLewisX"} value={"sialylLewisX"} label="Sialyl Lewis X" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 5} onClick={this.onClickEvent}>
                        <Icon name='dropdown' />
                        Antigen
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                        <List>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenA"} value={"antigenA"} label="Blood group A Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenB"} value={"antigenB"} label="Blood group B Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenH"} value={"antigenH"} label="Blood group H Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenCAD"} value={"antigenCAD"} label="Cad Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GD1a"} value={"GD1a"} label="GD1a" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GD1b"} value={"GD1b"} label="GD1b" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GD2"} value={"GD2"} label="GD2" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GM1a"} value={"GM1a"} label="GM1a" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GM1b"} value={"GM1b"} label="GM1b" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GM2"} value={"GM2"}  label="GM2" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "GM3"} value={"GM3"}  label="GM3" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lacDiNAc"} value={"lacDiNAc"} label="LacDiNAc" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "lactoseAmine"} value={"lactoseAmine"} label="Lactosamine" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenP"} value={"antigenP"} label="P Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "antigenPk"} value={"antigenPk"} label="PK Antigen" onClick={ this.onSelectEvent}/>
                            </List.Item>
                            <List.Item>
                                <Radio checked={this.state.checked === "polyLactoseAmine"} value={"polyLactoseAmine"} label="Poly Lactosamine" onClick={ this.onSelectEvent}/>
                            </List.Item>
                        </List>
                    </Accordion.Content>
                </Accordion>
            </div>
        );
    }
}