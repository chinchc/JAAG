//@flow

"use strict";

import React from "react";
import {Dropdown, Grid} from "semantic-ui-react";
import {liaise} from "../../script";
import SubstituentType from "sugar-sketcher/src/js/models/glycomics/dictionary/SubstituentType";
import ReactDOM from "react-dom";
import NonSymbolContent from "../horizonalUI/NonSymbolContent";
import isEmpty from "lodash.isempty";
import filter from "lodash.filter";
import {modeType} from "../modeType";
import {clickContentModification} from "../../script/clickEvent/contentClickCursor";

export default class ModificationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onSelectEvent = this.onSelectEvent.bind(this);
    }

    onSelectEvent(e, data) {
        liaise.newSubstituent = SubstituentType[data.value];

        if (liaise.modeType !== modeType.MODIFICATION) {
            liaise.modeType = modeType.MODIFICATION;
        }

        if (isEmpty(filter(liaise.usedItems, {content: liaise.newSubstituent.label}))) {
            liaise.usedItems = {
                type: "substituent",
                content: liaise.newSubstituent.label,
                value: data.value
            };
        }

        /*
        let elm = document.getElementById("selected");
        if (elm.children.length > 0) {
            elm.children[0].remove();
        }
        ReactDOM.render(
            <NonSymbolContent item={liaise.newSubstituent.label} value={data.value} type={"substituent"} width={50}/>,
            document.getElementById("selected")
        );
         */

        // add current select substituent at mouse cursor
        clickContentModification(e);
    }

    render () {
        const defStyle = {
            style: {
                width: 200
            }
        };

        //TODO: 将来的に膨大な数になると考えられるため別ファイルに保管しておく
        const modificationList = [
            {key: "(S)-lactate", text: "(S)-lactate1", value: "SLactate1"}, // monovalent
            //{key: "(S)-lactate2", text: "(S)-lactate2", value: "SLactate2"},
            //{key: "(S)-pyruvate", text: "(S)-pyruvate", value: "SPyruvate"},
            {key: "(R)-lactate", text: "(R)-lactate1", value: "RLactate1"}, // mono
            //{key: "(R)-lactate2", text: "(R)-lactate2", value: "RLactate2"},
            //{key: "(R)-pyruvate", text: "(R)-pyruvate", value: "RPyruvate"},
            {key: "Acetyl", text: "Acetyl", value: "Acetyl"},
            {key: "Amino", text: "Amino", value: "Amino"},
            {key: "Bromo", text: "Bromo", value: "Bromo"},
            {key: "Chloro", text: "Chloro", value: "Chloro"},
            {key: "Ethanolamine", text: "Ethanolamine", value: "Ethanolamine"},
            {key: "Ethyl", text: "Ethyl", value: "Ethyl"},
            {key: "Fluoro", text: "Fluoro", value: "Fluoro"},
            {key: "Formyl", text: "Formyl", value: "Formyl"},
            {key: "Glycolyl", text: "Glycolyl", value: "Glycolyl"},
            {key: "Hydroxymethyl", text: "Hydroxymethyl", value: "Hydroxymethyl"},
            {key: "Imino", text: "Imino", value: "Imino"},
            {key: "Iodo", text: "Iodo", value: "Iodo"},
            {key: "Methyl", text: "Methyl", value: "Methyl"},
            {key: "N-acethyl", text: "N-acethyl", value: "NAcetyl"},
            {key: "N-alanine", text: "N-alanine", value: "NAlanine"},
            {key: "N-dimethyl", text: "N-dimethyl", value: "NDimethyl"},
            {key: "N-formyl", text: "N-formyl", value: "NFormyl"},
            {key: "N-glycolyl", text: "N-glycolyl", value: "NGlycolyl"},
            {key: "N-methyl", text: "N-methyl", value: "NMethyl"},
            {key: "N-succinate", text: "N-succinate", value: "NSuccinate"},
            {key: "N-sulfate", text: "N-sulfate", value: "NSulfate"},
            //{key: "N-trifluoroacethyl", text: "N-trifluoroacethyl", value: "NAMPTrifluoroacetyl"},
            {key: "Nitrate", text: "Nitrate", value: "Nitrate"},
            {key: "O-methyl", text: "O-methyl", value: "OMethyl"},
            {key: "O-nitrate", text: "O-nitrate", value: "ONitrate"},
            {key: "Phosphate", text: "Phosphate", value: "Phosphate"},
            //{key: "Pyruvate", text: "Pyruvate", value: "Pyruvate"},
            {key: "Sulfate", text: "Sulfate", value: "Sulfate"},
            {key: "Thio", text: "Thio", value: "Thio"}
        ];

        return (
            <div {...defStyle}>
                <Grid>
                    <Grid.Row columns={"1"}>
                        <Grid.Column>
                            <Dropdown
                                button
                                options={modificationList}
                                search
                                selection
                                placeholder={"Search Substituent"}
                                onChange={ this.onSelectEvent }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}