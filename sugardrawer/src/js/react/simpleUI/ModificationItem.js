//@flow

"use strict";

import React from "react";
import {Form, Checkbox, Table} from "semantic-ui-react";
import { liaise } from "../../script";
import { modifiData } from "../../script/data/modificationData";
import SubstituentType from "sugar-sketcher/src/js/models/glycomics/dictionary/SubstituentType";
import ReactDOM from "react-dom";
import NonSymbolContent from "../horizonalUI/NonSymbolContent";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";

export class ModificationContents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModification: "",
        };
    }

    onChangeModificationEvent = (e, data) =>  {
        if (data.id === "") {
            alert("This substituent can not support.");
            return;
        }
        liaise.newSubstituent = SubstituentType[data.id.name];
        this.setState({selectedModification: data.id});

        if (isEmpty(filter(liaise.usedItems, {content: data.id.name}))) {
            liaise.usedItems = {
                type: "substituent",
                content: data.id.label
            };
        }

        /*
        ReactDOM.render(
            <NonSymbolContent item={data.id.label} type={"substituent"} width={50}/>,
            document.getElementById("selected")
        );
         */
    };

    render () {
        return (
            <div>
                <Form>
                    <Form.Field>
                        <Table>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.RLac.TrivalName + "\n ( "+ modifiData.RLac.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = { SubstituentType.RLactate1 }
                                            checked = {this.state.selectedModification === SubstituentType.RLactate1}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.RPy.TrivalName+ "\n ( "+ modifiData.RPy.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = { SubstituentType.RPyruvate}
                                            checked = {this.state.selectedModification === SubstituentType.RPyruvate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.SLac.TrivalName+ "\n ( "+ modifiData.SLac.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = { SubstituentType.SLactate1}
                                            checked = {this.state.selectedModification === SubstituentType.SLactate1}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.SPy.TrivalName+ "\n ( "+ modifiData.SPy.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = { SubstituentType.SPyruvate}
                                            checked = {this.state.selectedModification === SubstituentType.SPyruvate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.XLac.TrivalName+ "\n ( "+ modifiData.XLac.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.XLac.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Am.TrivalName+ "\n ( "+ modifiData.Am.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.Am.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Br.TrivalName+ "\n ( "+ modifiData.Br.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Bromo}
                                            checked = {this.state.selectedModification === SubstituentType.Bromo}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Cl.TrivalName+ "\n ( "+ modifiData.Cl.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Chloro}
                                            checked = {this.state.selectedModification === SubstituentType.Chloro}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.DiMe.TrivalName+ "\n ( "+ modifiData.DiMe.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.DiMe.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Et.TrivalName+ "\n ( "+ modifiData.Et.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Ethyl}
                                            checked = {this.state.selectedModification === SubstituentType.Ethyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.F.TrivalName+ "\n ( "+ modifiData.F.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Fluoro}
                                            checked = {this.state.selectedModification === SubstituentType.Fluoro}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Fo.TrivalName+ "\n ( "+ modifiData.Fo.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Formyl}
                                            checked = {this.state.selectedModification === SubstituentType.Formyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Gc.TrivalName+ "\n ( "+ modifiData.Gc.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.Gc.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.I.TrivalName+ "\n ( "+ modifiData.I.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.I.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.N.TrivalName+ "\n ( "+ modifiData.N.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Amino}
                                            checked = {this.state.selectedModification === SubstituentType.Amino}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NAm.TrivalName+ "\n ( "+ modifiData.NAm.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.NAm.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NDiMe.TrivalName+ "\n ( "+ modifiData.NDiMe.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.NDiMe.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NEtOH.TrivalName+ "\n ( "+ modifiData.NEtOH.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Ethanolamine}
                                            checked = {this.state.selectedModification === SubstituentType.Ethanolamine}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NFo.TrivalName+ "\n ( "+ modifiData.NFo.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.NFormyl}
                                            checked = {this.state.selectedModification === SubstituentType.NFormyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NGc.TrivalName+ "\n ( "+ modifiData.NGc.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.NGlycolyl}
                                            checked = {this.state.selectedModification === SubstituentType.NGlycolyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NMe.TrivalName+ "\n ( "+ modifiData.NMe.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.NMethyl}
                                            checked = {this.state.selectedModification === SubstituentType.NMethyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NS.TrivalName+ "\n ( "+ modifiData.NS.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.NSulfate}
                                            checked = {this.state.selectedModification === SubstituentType.NSulfate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.NSuc.TrivalName+ "\n ( "+ modifiData.NSuc.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.NSuccinate}
                                            checked = {this.state.selectedModification === SubstituentType.NSuccinate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.OMeOH.TrivalName+ "\n ( "+ modifiData.OMeOH.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Hydroxymethyl}
                                            checked = {this.state.selectedModification === SubstituentType.Hydroxymethyl}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.P.TrivalName+ "\n ( "+ modifiData.P.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Phosphate}
                                            checked = {this.state.selectedModification === SubstituentType.Phosphate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.PCho.TrivalName+ "\n ( "+ modifiData.PCho.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.PCho.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.PEm.TrivalName+ "\n ( "+ modifiData.PEm.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.PEm.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.PPEm.TrivalName+ "\n ( "+ modifiData.PPEm.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.PPEm.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Py.TrivalName+ "\n ( "+ modifiData.Py.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Pyruvate}
                                            checked = {this.state.selectedModification === SubstituentType.Pyruvate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.PyP.TrivalName+ "\n ( "+ modifiData.PyP.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.PyP.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.S.TrivalName+ "\n ( "+ modifiData.S.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Sulfate}
                                            checked = {this.state.selectedModification === SubstituentType.Sulfate}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.SH.TrivalName+ "\n ( "+ modifiData.SH.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {SubstituentType.Thio}
                                            checked = {this.state.selectedModification === SubstituentType.Thio}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Suc.TrivalName+ "\n ( "+ modifiData.Suc.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.Suc.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Checkbox
                                            radio
                                            label = { modifiData.Tri_P.TrivalName+ "\n ( "+ modifiData.Tri_P.Name + ")" }
                                            name = "checkboxRadioGroup"
                                            id = {""}
                                            checked = {this.state.selectedModification === modifiData.Tri_P.TrivalName}
                                            onChange = {this.onChangeModificationEvent}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                    </Table.Cell>
                                    <Table.Cell>
                                    </Table.Cell>
                                </Table.Row>

                            </Table.Body>
                        </Table>
                    </Form.Field>
                </Form>
            </div>
        );
    }
}
