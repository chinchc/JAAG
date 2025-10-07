//@flow
"use strict";

import emFunction from "sugar-sketcher/src/js/guifunction/emFunction";
import RepeatingUnit from "sugar-sketcher/src/js/models/glycomics/RepeatingUnit";
import appFunction from "sugar-sketcher/src/js/guifunction/appFunction";

/**
 This class references functions implemented in SugarSketcher.
 Original code: sugar-sketcher/src/js/guifunction/menuFunction.js
 */

export default class CreateRepetition {
    constructor() {
        this._ef = new emFunction();
        this._af = new appFunction();
    }

    start (_shapes, _treeData, _glycan) {
        //TODO: 繰り返しユニットを構成する単糖の取り出し
        let nodes: Array<Node> = [_clickedNode].concat(_selectedNodes);
        if (!isRepeated(nodes))
        {
            let treeNode = findNodesInTree(nodes, _treeData);
            let repEntry, repExit;
            if (isBranchSelected(treeNode)) // BRANCH
            {
                repEntry = treeNode[0].node;
                repExit = findRepExit(treeNode[0], _treeData, _clickedNode, _selectedNodes);
                if (repExit.length !== 1) // If the rep unit has 2 exits
                {
                    return;
                }
                repExit = repExit[0].node;
            }
            else // NO BRANCH
            {
                let entryExit = findEntryAndExit(treeNode);
                if (!entryExit)
                {
                    return;
                }
                repEntry = entryExit[0];
                repExit = entryExit[1];
            }

            if (repExit !== undefined) // Doesn't finish by a fork
            {
                let min = "n";
                if (min == null || min === "")
                {
                    return;
                }
                let max = "n";
                if (max == null || max === "")
                {
                    return;
                }
                let donor = "?";
                if (donor !== "?" && (donor > this._ef.getNumberCarbons(repExit) || donor < 1))
                    return;
                let acceptor = "?";
                if (acceptor !== "?" && (acceptor > 3 || acceptor < 1))
                    return;
                let id = this._af.randomString(7);
                let repeatingUnit = new RepeatingUnit(id,treeNode,min,max,repEntry,repExit,donor,acceptor);
                nodes.filter(function(node) {
                    node.repeatingUnit = repeatingUnit;
                });
                _shapes = moveNodesInsideRep(_shapes, _treeData, _glycan);
            }
        }

        return _shapes;
    }
}