//@flow

"use strict";

import React from "react";
import {liaise} from "../../script";
import MonosaccharideContent from "../expertUI/MonosaccharideContent";
import NonSymbolContent from "./NonSymbolContent";
import {getMonosaccharideTextNotation} from "../../script/data/SymbolNotation";

export default class LastWorkIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(): * {
        liaise.sideBarCancel();
    }

    render() {
        let items: Array<HTMLElement> = [];
        let style: Object = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
        };

        for (const name: string of liaise.usedItems) {
            const nodeName: string = name.content;
            if (name.type === "monosaccharide") {
                items.push(<MonosaccharideContent item={nodeName} notation={getMonosaccharideTextNotation(nodeName)} width={50} option={"shortcut"} />);
            }
            if (name.type === "edge" || name.type === "substituent" || name.type === "root") {
                items.push(<NonSymbolContent item={nodeName} value={name.value} type={name.type} />);
            }
        }


        return(
            <div style={style} >
                {items}
            </div>
        );
    }
}