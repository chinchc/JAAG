"use strict";

import {liaise} from "../../index";
import CreateModificationNotation from "../../createModification/CreateModificationNotation";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";

export const upDateSubstituentNotation = (_glycan) => {
    let substituentLayer = liaise.getLayer("substituent");

    let edgeObject = {};
    _glycan.graph.edges().map( (edge) => {
        if (!(edge instanceof SubstituentLinkage)) return;
        if (!(edge.sourceNode.id in edgeObject)) {
            edgeObject[edge.sourceNode.id] = [edge];
        } else {
            edgeObject[edge.sourceNode.id].push(edge);
        }
    });

    liaise.removeStage(substituentLayer);

    const createSubState = new CreateModificationNotation();

    Object.keys(edgeObject).map( (key) => {
        edgeObject[key].map( (edge) => {
            createSubState.makeNotationContainer(_glycan, edge);
        });
    });
};