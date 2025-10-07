//@flow

"use strict";

import React from "react";
import {Divider, Grid, Header, Label, Segment} from "semantic-ui-react";
import {liaise} from "../../script";
import GlycanTextParser from "../../script/util/GlycanTextParser";
import StructureTemplate from "../../script/data/StructureTemplate";

export class StructureTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSelect: ""
        };
    }

    onClickEvent (_event: Object) {
        if (_event.target.id === "") {
            alert("This structure can not support.");
            return;
        }

        //generate GlycoCT
        const template = new StructureTemplate();
        let formula: string = template.getTemplate(_event.target.id);

        liaise.initStage();
        rootPos.posX = liaise.stage.canvas.width * .5;
        rootPos.posY = liaise.stage.canvas.height * .5;
        if (liaise.newGraph.length !== 0) {
            liaise.initGraph();
        }

        let txtPraser: Object = new GlycanTextParser(formula);
        txtPraser.parseFormula();
        txtPraser.showImage();

        this.setState({currentSelect: _event.target.id});
    }

    render() {
        return (
            <div>
                <Segment textAlign={"center"} color={"purple"}>
                    <Header>N-glycan</Header>
                    <Divider section/>
                    <Grid columns={4}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"ncore"} onClick={ (event) => this.onClickEvent(event) } tag>Core</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ncorefuc"} onClick={ (event) => this.onClickEvent(event) } tag>Fucosylated core</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ncorebisect"} onClick={ (event) => this.onClickEvent(event) } tag>Bisecting core</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ncorebisectfuc"} onClick={ (event) => this.onClickEvent(event) } tag>Bisecting<br/>fucosylated core</Label>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"ncoreman"} onClick={ (event) => this.onClickEvent(event) } tag>High mannose</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ncorehyb"} onClick={ (event) => this.onClickEvent(event) } tag>Hybrid</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ncorecomp"} onClick={ (event) => this.onClickEvent(event) } tag>Complex</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment textAlign={"center"} color={"purple"}>
                    <Header>O-glycan</Header>
                    <Divider section/>
                    <Grid columns={4}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore1"} onClick={ (event) => this.onClickEvent(event) } tag>Core1</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore2"} onClick={ (event) => this.onClickEvent(event) } tag>Core2</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore3"} onClick={ (event) => this.onClickEvent(event) } tag>Core3</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore4"} onClick={ (event) => this.onClickEvent(event) } tag>Core4</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore5"} onClick={ (event) => this.onClickEvent(event) } tag>Core5</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore6"} onClick={ (event) => this.onClickEvent(event) } tag>Core6</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore7"} onClick={ (event) => this.onClickEvent(event) } tag>Core7</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"ocore8"} onClick={ (event) => this.onClickEvent(event) } tag>Core8</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment textAlign={"center"} color={"purple"}>
                    <Header>Glycosphingolipids</Header>
                    <Divider section/>
                    <Grid columns={5}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} as={"a"} id={"gslarthro"} onClick={ (event) => this.onClickEvent(event) } tag>Arthro</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslgala"} onClick={ (event) => this.onClickEvent(event) } tag>Gala</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslganglio"} onClick={ (event) => this.onClickEvent(event) } tag>Ganglio</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslglobo"} onClick={ (event) => this.onClickEvent(event) } tag>Globo</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslisoglobo"} onClick={ (event) => this.onClickEvent(event) } tag>Isoglobo</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"gsllacto"} onClick={ (event) => this.onClickEvent(event) } tag>Lact</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslmollu"} onClick={ (event) => this.onClickEvent(event) } tag>Mollu</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslmuco"} onClick={ (event) => this.onClickEvent(event) } tag>Muco</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gslneolacto"} onClick={ (event) => this.onClickEvent(event) } tag>Neolacto</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment textAlign={"center"} color={"purple"}>
                    <Header>GAGs</Header>
                    <Divider section/>
                    <Grid columns={5}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"gaghyaluronic"} onClick={ (event) => this.onClickEvent(event) } tag>Hyaluronic acid</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagchodroitin4"} onClick={ (event) => this.onClickEvent(event) } tag>Chondroitin<br/>(4-sulfate)</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagchodroitin6"} onClick={ (event) => this.onClickEvent(event) } tag>Chondroitin<br/>(6-sulfate)</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagchodroitin26"} onClick={ (event) => this.onClickEvent(event) } tag>Chondroitin<br/>(2,6-sulfate)</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagchodroitin46"} onClick={ (event) => this.onClickEvent(event) } tag>Chondroitin<br/>(4,6-sulfate)</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"gagdermatan"} onClick={ (event) => this.onClickEvent(event) } tag>Dermatan sulfate</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagkeratan"} onClick={ (event) => this.onClickEvent(event) } tag>Keratan sulfate</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagheparin"} onClick={ (event) => this.onClickEvent(event) } tag>Heparin</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"gagheparan"} onClick={ (event) => this.onClickEvent(event) } tag>Heparan sulfate</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment textAlign={"center"} color={"purple"}>
                    <Header>Lewis</Header>
                    <Divider section/>
                    <Grid columns={5}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>3'sulfo LewisX</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisA"} onClick={ (event) => this.onClickEvent(event) } tag>LewisA</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisB"} onClick={ (event) => this.onClickEvent(event) } tag>LewisB</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisC"} onClick={ (event) => this.onClickEvent(event) } tag>LewisC</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisD"} onClick={ (event) => this.onClickEvent(event) } tag>LewisD</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisX"} onClick={ (event) => this.onClickEvent(event) } tag>LewisX</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lewisY"} onClick={ (event) => this.onClickEvent(event) } tag>LewisY</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"sialylLewisA"} onClick={ (event) => this.onClickEvent(event) } tag>Sialyl LewisA</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"sialylLewisX"} onClick={ (event) => this.onClickEvent(event) } tag>Sialyl LewisX</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment textAlign={"center"} color={"purple"}>
                    <Header>Antigen</Header>
                    <Divider section/>
                    <Grid columns={6}>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"antigenA"} onClick={ (event) => this.onClickEvent(event) } tag>Blood<br/>group A</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"antigenB"} onClick={ (event) => this.onClickEvent(event) } tag>Blood<br/>group B</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"antigenH"} onClick={ (event) => this.onClickEvent(event) } tag>Blood<br/>group H</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>Cad</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GD1a</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GD1b</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GD2</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GD3</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GM1a</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GM1b</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GM2</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} onClick={ (event) => this.onClickEvent(event) } tag color={"red"}>GM3</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as={"a"} id={"lacDiNAc"} onClick={ (event) => this.onClickEvent(event) } tag>LacDiNAc</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"lactoseAmine"} onClick={ (event) => this.onClickEvent(event) } tag>Lactosamine</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"polyLactoseAmine"} onClick={ (event) => this.onClickEvent(event) } tag>Poly lactosamin</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"antigenP"} onClick={ (event) => this.onClickEvent(event) } tag>P antigen</Label>
                            </Grid.Column>
                            <Grid.Column>
                                <Label as={"a"} id={"antigenPk"} onClick={ (event) => this.onClickEvent(event) } tag>Pk antigen</Label>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}