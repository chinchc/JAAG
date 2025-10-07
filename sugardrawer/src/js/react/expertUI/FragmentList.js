//@flow

"use strict";

import MonosaccharideList from "./MonosaccharideList";
import ModificationList from "./ModificationList";
import React from "react";

export default class FragmentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        const style = {
            width: 200
        };
        return (
            <div style={style}>
                <MonosaccharideList />
                <div style={{display:"none"}}>
                    <h2>Modification</h2>
                	<ModificationList />
                </div>
            </div>
        );
    }



}