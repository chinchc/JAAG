//@flow

"use strict";

import React from "react";
import {searchHorizontalSugarList} from "./horizontalSugarList";
import ReactDOM from "react-dom";
import LastWorkIcon from "./LastWorkIcon";
import {Button, Popup} from "semantic-ui-react";

export class HorizontalCommand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spicies: "mammal"
        };
    }

    onChangeSpicies(e) {
        this.modifyContents(e.target.value);
        this.setState({spicies: e.target.value});
    }

    modifyContents (_species: string) {
        let list = searchHorizontalSugarList(_species);

        //make monosaccharide symbol
        ReactDOM.render(
            list,
            document.getElementById("nodelist")
        );
    }

    componentDidMount() {
        this.modifyContents("mammal");
    }

    render () {
        const style: Object = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "10px",
            alignItems: "center"
        };

        const subStyle: Object = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "15px",
            marginRight: "10px"
        };

        return (
            <div id={"horizontal-command"} style={style}>
                <select style={{display: "none"}} id={"species"} onChange={(e) => this.onChangeSpicies(e)}>
                    <option value={"mammal"}>Mammal</option>
                    <option value={"bacteria"}>Bacteria</option>
                    <option value={"plant"}>Plant</option>
                </select>
                <div id={"nodelist"} />

                <Popup on={"hover"} content={"Selection History"} trigger={
                    <div id={"lastword"} style={{marginLeft: "15px", display: "none"}}>
                        <Popup
                            trigger={<Button circular icon={"inbox"}/>}
                            position={"bottom right"}
                            on={"click"}
                        >
                            <LastWorkIcon/>
                        </Popup>
                    </div>
                } />
                {/*
                <div id={"currentnode"} style={subStyle}>
                    <div id={"label"} >Current item: </div>
                    <div id={"selected"} style={{marginRight: "40px"}} />
                </div>
                */}
                {/*
                <div id={"currentmode"} style={subStyle}>
                    <div id={"modecontent"}>
                        <div id={"label"}>Current mode:</div>
                        <div id={"mode"}/>
                    </div>
                    <div id={"modecancel"}/>
                </div>
                */}
            </div>
        );
    }
}