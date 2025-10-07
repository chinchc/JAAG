/* Modified by Chin Huang at University of Georgia for JAAG on 2025-10-01: UI header adjustments and info modal. */
"use strict";

import  React from "react";
import {Button, Modal, Header} from "semantic-ui-react";

export class ToolHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        // Use the same margins as the actual canvas for proper centering
        const canvasMargins = {
            marginLeft: "30px", // Same as actual canvas
            marginRight: "30px", // Same as actual canvas
            marginTop: "10px"
        };

        return (
            <div style={{...canvasMargins, textAlign: 'center', marginBottom: '20px'}}>
                <div style={{marginBottom: '8px'}}>
                    <Header as={"h1"} style={{margin: '0', display: 'inline-block'}}>
                        SugarDrawer
                        <Modal trigger={<Button circular icon={"info"} style={{marginLeft: '6px', verticalAlign: 'middle', fontSize: '10px', width: '16px', height: '16px', minHeight: '16px', padding: '0'}} />}>
                            <Modal.Header>SugarDrawer: 1.18.2</Modal.Header>
                            <Modal.Content>
                                <ul>
                                    <li>
                                    Symbol Nomenclature for Glycans (SNFG): <a href={"https://www.ncbi.nlm.nih.gov/glycans/snfg.html"}>https://www.ncbi.nlm.nih.gov/glycans/snfg.html</a><br/><p/>
                                    </li>
                                    <li>
                                    Tsuchiya S, Matsubara M, Aoki-Kinoshita KF, Yamada I. SugarDrawer: A Web-Based Database Search Tool with Editing Glycan Structures. <em>Molecules</em>. 2021 Nov 25;26(23):7149.
                                         (<a href={"https://www.mdpi.com/1420-3049/26/23/7149"}>doi: 10.3390/molecules26237149</a>)
                                    </li>
                                </ul>
                            </Modal.Content>
                        </Modal>
                    </Header>
                </div>
                <div style={{fontSize: '12px', color: '#666', lineHeight: '1.3', maxWidth: '600px', margin: '0 auto'}}>
                    Tsuchiya S, Matsubara M, Aoki-Kinoshita KF, Yamada I. SugarDrawer: A Web-Based Database Search Tool with Editing Glycan Structures. <em>Molecules</em>. 2021 Nov 25;26(23):7149. <a href={"https://www.mdpi.com/1420-3049/26/23/7149"} target="_blank" rel="noopener noreferrer">doi: 10.3390/molecules26237149</a>
                </div>
            </div>
        );
    }
}
