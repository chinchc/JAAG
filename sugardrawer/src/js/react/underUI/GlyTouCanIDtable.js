//@flow

"use strict";

import React from "react";
import Table from "semantic-ui-react/dist/commonjs/collections/Table";
import api from "APIConfig";

export default class GlyTouCanIDtable extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const wurcs: string = this.props.wurcs;
        const imgsrc: string = this.props.image;
        const id: string = this.props.id;

        let list: Array<React> = [];
        list.unshift(
            <Table.Row key={`result-${id}`}>
                <Table.Cell style={{wordWrap: "break-word", width: "100px"}}>
                    <a href={api.KEY === "GlyTouCanID" ? `${api.API_URL}${id}` : `${api.API_URL}${wurcs}`} target="_blank">{api.KEY === "GlyTouCanID" ? id : wurcs}</a>
                </Table.Cell>
                <Table.Cell rowSpan={list.length + 1}>
                    <img src={imgsrc}/>
                </Table.Cell>
            </Table.Row>
        );

        //TODO: 余白が大きすぎるので整形する
        return (
            <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{api.CAPTION !== undefined ? api.CAPTION : api.KEY}</Table.HeaderCell>
                            <Table.HeaderCell>Image</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {list}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}