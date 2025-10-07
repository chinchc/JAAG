//@flow

"use strict";

import React from "react";
import {Accordion, Grid, Icon, Popup} from "semantic-ui-react";
import MonosaccharideContent from "./MonosaccharideContent";
import UndefinedMonosaccharide from "../commonUI/UndefinedMonosaccharide";
import {getMonosaccharideTextNotation} from "../../script/data/SymbolNotation";

export default class MonosaccharideList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selected: "",
            isomer: "",
            ringtype: "",
            isOpen: false
        };

        this.onClickEvent = this.onClickEvent.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    onClickEvent (e, _title) {
        const index = _title;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    handleOpen () {
        this.setState({ isOpen: true });
    }

    render () {
        const { activeIndex } = this.state;
        const defStyle = {
            style: {
                width: 200
            }
        };

        return (
            <div {...defStyle}>
                <Accordion styled>
                    <Accordion.Title active={activeIndex === 0} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Hexose
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Glc"} notation={"Glc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Man"} notation={"Man"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Gal"} notation={"Gal"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Gul"} notation={"Gul"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Alt"} notation={"Alt"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"All"} notation={"All"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Tal"} notation={"Tal"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Ido"} notation={"Ido"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Hex"} notation={"Hexose"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        HexNAc
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GlcNAc"} notation={"GlcNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"ManNAc"} notation={"ManNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GalNAc"} notation={"GalNAc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GulNAc"} notation={"GulNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AltNAc"} notation={"AltNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AllNAc"} notation={"AllNAc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"TalNAc"} notation={"TalNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"IdoNAc"} notation={"IdoNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"HexNAc"} notation={"HexNAc"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 2} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Hexosamine
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GlcN"}  notation={"GlcN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"ManN"} notation={"ManN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GalN"} notation={"GalN"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GulN"} notation={"GulN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AltN"} notation={"AltN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AllN"} notation={"AllN"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"TalN"} notation={"TalN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"IdoN"} notation={"IdoN"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"HexN"} notation={getMonosaccharideTextNotation("HexN")} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 3} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Hexuronate
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GlcA"} notation={"GlcA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"ManA"} notation={"ManA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GalA"} notation={"GalA"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"GulA"} notation={"GulA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AltA"} notation={"AltA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"AllA"} notation={"AllA"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"TalA"} notation={"TalA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"IdoA"} notation={"IdoA"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"HexA"} notation={getMonosaccharideTextNotation("HexA")} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 4} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        DeoxyHexose
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 4}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Qui"} notation={"Qui"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Rha"} notation={"Rha"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"SixdGul"} notation={"6dGul"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"SixdAlt"} notation={"6dAlt"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"SixdTal"} notation={"6dTal"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Fuc"} notation={"Fuc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"dHex"} notation={getMonosaccharideTextNotation("dHex")} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 5} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        DeoxyHexNAc
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"QuiNAc"} notation={"QuiNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"RhaNAc"} notation={"RhaNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"SixdAltNAc"} notation={"6dAltNAc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"SixdTalNAc"} notation={"6dTalNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"FucNAc"} notation={"FucNAc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"dHexNAc"} notation={"DeoxyhexNAc"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 6} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Di-DeoxyHexose
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 6}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Oli"} notation={"Oli"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Tyv"} notation={"Tyv"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Abe"} notation={"Abe"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Par"} notation={"Par"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Dig"} notation={"Dig"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Col"} notation={"Col"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"ddHex"} notation={"Di-deoxyhexose"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 7} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Pentose
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 7}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Ara"} notation={"Ara"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Lyx"} notation={"Lyx"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Xyl"} notation={"Xyl"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Rib"} notation={"Rib"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Pen"} notation={"Pentose"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 8} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Deoxynonulosonate
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 8}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Kdn"} notation={"Kdn"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Neu5Ac"} notation={"Neu5Ac"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Neu5Gc"} notation={"Neu5Gc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Neu"} notation={"Neu"} />
                                </Grid.Column>
                                {/* sia */}
                                <Grid.Column>
                                    <MonosaccharideContent item={"Non"} notation={"Deoxynonulosonate"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 9} onClick={this.onClickEvent} style={{display: "none"}}>
                        <Icon name="dropdown" />
                        Di-deoxyNonulosonate
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 9}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Pse"} notation={"Pse"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Leg"} notation={"Leg"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Aci"} notation={"Aci"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"4eLeg"} notation={"4eLeg"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"dNon"} notation={"Di-deoxynonulosonate"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 10} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Unknown
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 10}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Bac"} notation={"Bac"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"LDManHep"} notation={"LDManHep"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Kdo"} notation={"Kdo"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Dha"} notation={"Dha"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"DDManHep"} notation={"DDManHep"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"MurNAc"} notation={"MurNAc"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"MurNGc"} notation={"MurNGc"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Mur"} notation={"Mur"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Unknown"} notation={"Unknown"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 11} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                        Assigned
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 11}>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Api"} notation={"Api"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Fru"} notation={"Fru"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Tag"} notation={"Tag"} />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Sor"} notation={"Sor"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Psi"} notation={"Psi"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MonosaccharideContent item={"Assigned"} notation={"Assigned"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    {
                    /*
                    <Accordion.Title active={activeIndex === 12} onClick={this.onClickEvent}>
                        <Icon name="dropdown" />
                    Undefined
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 12}>
                        <UndefinedMonosaccharide close={() => {this.setState({isOpen: false});}}/>
                    </Accordion.Content>
                     */
                    }
                </Accordion>
            </div>
        );
    }
}