//@flow
"use strict";

import React from "react";
import {liaise} from "../../script";
import {Dropdown, Menu} from "semantic-ui-react";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {updateIsomer, updateRingType} from "../../script/images/update/updateMonosaccharide";
import {SNFGSymbolGlycan} from "../../script/data/SNFGGlycanTable";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export default class LeftClickMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onClose () {
        document.getElementById("menu").style.display = "none";
    }

    onClickMenuEvent(e, data) {
        const id: string = data.className;
        switch(id) {
            case "carbon" : {
                liaise.actionUndoRedo.setNode();
                if (data.value === "UNDEFINED") {
                    liaise.canvasNode.parent.anomericity = Anomericity.UNDEFINED;
                }
                if (data.value === "ALPHA") {
                    liaise.canvasNode.parent.anomericity = Anomericity.ALPHA;
                }
                if (data.value === "BETA") {
                    liaise.canvasNode.parent.anomericity = Anomericity.BETA;
                }
                break;
            }
            case "pos" : {
                console.log("anomeric state : " + data.value);
                break;
            }
            case "isomer" : {
                liaise.actionUndoRedo.setNode();
                if (data.value === "UNDEFINED") {
                    liaise.canvasNode.parent.isomer = Isomer.UNDEFINED;
                }
                if (data.value === "D") {
                    liaise.canvasNode.parent.isomer = Isomer.D;
                }
                if (data.value === "L") {
                    liaise.canvasNode.parent.isomer = Isomer.L;
                }
                updateIsomer(liaise.canvasNode.parent);
                break;
            }
            case "ring" : {
                liaise.actionUndoRedo.setNode();
                if (data.value === "UNDEFINED") {
                    liaise.canvasNode.parent.ringType = RingType.UNDEFINED;
                }
                if (data.value === "P") {
                    liaise.canvasNode.parent.ringType = RingType.P;
                }
                if (data.value === "F") {
                    liaise.canvasNode.parent.ringType = RingType.F;
                }
                if (data.value === "O") {
                    liaise.canvasNode.parent.ringType = RingType.O;
                }
                updateRingType(liaise.canvasNode.parent);
                break;
            }
            default : {
                break;
            }
        }
    }

    render() {
        let menuLayout: Object = {
            style : {
                position: "fixed",
                left: "0px",
                top: "0px",
                cursor: "pointer"
            }
        };

        const rect = liaise.stage.canvas.getBoundingClientRect();
        menuLayout.style.left = liaise.canvasNode.x + Math.floor(rect.left);
        menuLayout.style.top = liaise.canvasNode.y + 60;

        //extract status of current target
        const SNFGDict: SNFGSymbolGlycan = SNFGSymbolGlycan[liaise.canvasNode.monosaccharideType.name];
        const isomer: Isomer = Isomer[SNFGDict.isomer];
        const ring: RingType = RingType[SNFGDict.ring];

        return(
            <div {...menuLayout}>
                <Menu
                    vertical
                    style={{width: 180}}
                >
                    <Dropdown item text={"Isomer"}>
                        <Dropdown.Menu>
                            <Dropdown.Item text={"?"} className={"isomer"} value={"UNDEFINED"} onClick={this.onClickMenuEvent} icon={isomer === Isomer.UNDEFINED ? "check" : null}>
                            </Dropdown.Item>
                            <Dropdown.Item text={"D"} className={"isomer"} value={"D"} onClick={this.onClickMenuEvent} icon={isomer === Isomer.D ? "check" : null}>
                            </Dropdown.Item>
                            <Dropdown.Item text={"L"} className={"isomer"} value={"L"} onClick={this.onClickMenuEvent} icon={isomer === Isomer.L ? "check" : null}>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown item text={"Ring size"}>
                        <Dropdown.Menu>
                            <Dropdown.Item text={"?"} className={"ring"} value={"UNDEFINED"} onClick={this.onClickMenuEvent} icon={ring === RingType.UNDEFINED ? "check" : null}>
                            </Dropdown.Item>
                            <Dropdown.Item text={"P"} className={"ring"} value={"P"} onClick={this.onClickMenuEvent} icon={ring === RingType.P ? "check" : null}>
                            </Dropdown.Item>
                            <Dropdown.Item text={"F"} className={"ring"} value={"F"} onClick={this.onClickMenuEvent} icon={ring === RingType.F ? "check" : null}>
                            </Dropdown.Item>
                            <Dropdown.Item text={"O"} className={"ring"} value={"OPEN"} onClick={this.onClickMenuEvent} icon={ring === RingType.O ? "check" : null}>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Item
                        name={"Close"}
                        id={"close"}
                        onClick={this.onClose}
                        style={{backgroundColor: "ivory"}}
                    />
                </Menu>
            </div>
        );
    }
}