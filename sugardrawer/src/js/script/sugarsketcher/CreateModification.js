//@flow

"use strict";

import {liaise} from "../index";
import SubstituentType from "sugar-sketcher/src/js/models/glycomics/dictionary/SubstituentType";
import Substituent from "sugar-sketcher/src/js/models/glycomics/nodes/Substituent";
import SubstituentsPositions from "sugar-sketcher/src/js/models/io/glycoCT/SubstituentsPositions";
import SubstituentLinkage from "sugar-sketcher/src/js/models/glycomics/linkages/SubstituentLinkage";
import MonosaccharideType from "sugar-sketcher/src/js/views/glycomics/dictionary/MonosaccharideType";
import appFunction from "sugar-sketcher/src/js/guifunction/appFunction";
import menuFunction from "sugar-sketcher/src/js/guifunction/menuFunction";
import visFunction from "sugar-sketcher/src/js/guifunction/visFunction";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import CreateModificationNotation from "../createModification/CreateModificationNotation";

export default class CreateModification {
    constructor() {}

    start (_params: Object, _glycan: Glycan) {
        /*
        * This source code is referenced from SugarSketcher.
        * */
        const appFunc = new appFunction();
        let newSubstituent: Substituent = new Substituent(appFunc.randomString(7), _params);
        let subName: string = _params.name;
        let acceptorPosition: number = "?";

        let newType: string =
            this.getMono(liaise.canvasNode.parent.monosaccharideType.name + SubstituentType[subName].label);
        if (newType && SubstituentsPositions[newType.name].position === acceptorPosition) {
            const menuFunc = new menuFunction();
            _glycan = menuFunc.updateNodeType(liaise.canvasNode.parent, newType, _glycan);
        } else {
            const visFunc: Object = new visFunction();
            let donorPos: DonorPosition = visFunc.getDonorPositionWithSelection(acceptorPosition);
            let treeData: Object = liaise.getNewTreeData(_glycan);

            // Create the linkage
            let subLinkage: SubstituentLinkage =
                new SubstituentLinkage(appFunc.randomString(7), liaise.canvasNode.parent, newSubstituent, donorPos);

            _glycan.addSubstituent(newSubstituent, subLinkage);

            treeData = visFunc.updateTreeVisualization(subLinkage, _glycan, treeData);

            liaise.setNewTreeData(_glycan, treeData);

            // make substituent text component
            const modNotation = new CreateModificationNotation();
            newSubstituent.addChild(modNotation.makeNotationContainer(_glycan, subLinkage));

            _glycan.addChild(newSubstituent);
        }

        return _glycan;
    }

    getMono(name)
    {
        switch (name)
        {
            case "KdnNAc":
                return MonosaccharideType.Neu5Ac;
            case "KdnNGc":
                return MonosaccharideType.Neu5Gc;
            case "KdnN":
                return MonosaccharideType.Neu;
        }
        return MonosaccharideType[name];
    }
}