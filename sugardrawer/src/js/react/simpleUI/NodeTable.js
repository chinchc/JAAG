"use strict";

import React from "react";
import {Table} from "semantic-ui-react";
import {liaise} from "../../script";
import {nodeModeSearch} from "../nodeModeSearch";
import MonosaccharideContent from "../expertUI/MonosaccharideContent";

export class NodeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
    }


    onClickEvent(e) {
        liaise.newNode=nodeModeSearch(e.target.id);
    }

    render(){
        return (
            <div>
                <Table definition style={{textAlign: "center"}}>
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
                            <Table.Cell><MonosaccharideContent item={"Hex"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Glc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Man"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Gal"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Gul"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Alt"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"All"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Tal"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Ido"}/></Table.Cell>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Square</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"HexNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GlcNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"ManNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GalNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GulNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AltNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AllNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"TalNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"IdoNAc"}/></Table.Cell>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Crossed Square</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"HexN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GlcN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"ManN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GalN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GulN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AltN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AllN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"TalN"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"IdoN"}/></Table.Cell>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Diamond</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"HexA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GlcA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"ManA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GalA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"GulA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AltA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"AllA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"TalA"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"IdoA"}/></Table.Cell>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Triangle</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"dHex"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Qui"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Rha"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"SixdGul"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"SixdAlt"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"SixdTal"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Fuc"}/></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Divided Triangle</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"dHexNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"QuiNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"RhaNAc"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"SixdAltNAc"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"SixdTalNAc"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"FucNAc"}/></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Rectangle</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"ddHex"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Oli"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Tyv"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Abe"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Par"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Dig"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Col"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Star</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Pen"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Ara"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Lyx"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Xyl"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Rib"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filled Diamond</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Non"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Kdn"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Neu5Ac"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Neu5Gc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Neu"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Sia"}/></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Diamond</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"dNon"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Pse"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Leg"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"Aci"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell><MonosaccharideContent item={"4eLeg"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Flat Hexagon</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Unknown"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Bac"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"LDManHep"}/></Table.Cell>
                            <Table.Cell> <MonosaccharideContent item={"Kdo"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Dha"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"DDManHep"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"MurNAc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"MurNGc"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Mur"}/></Table.Cell>
                            <Table.Cell/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Pentagon</Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Assigned"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Api"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Fru"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Tag"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Sor"}/></Table.Cell>
                            <Table.Cell><MonosaccharideContent item={"Psi"}/></Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell/>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
