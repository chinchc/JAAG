//@flow
"use strict";

import Monosaccharide from "sugar-sketcher/src/js/models/glycomics/nodes/Monosaccharide";
import {nodeModeSearch, nodeType} from "../../react/nodeModeSearch";
import appFunction from "sugar-sketcher/src/js/guifunction/appFunction";
import Anomericity from "sugar-sketcher/src/js/models/glycomics/dictionary/Anomericity";
import {nodeModeType} from "../../react/nodeModeType";
import Isomer from "sugar-sketcher/src/js/models/glycomics/dictionary/Isomer";
import {SNFGSymbolGlycan} from "../data/SNFGGlycanTable";
import MonosaccharideType from "sugar-sketcher/src/js/views/glycomics/dictionary/MonosaccharideType";
import RingType from "sugar-sketcher/src/js/models/glycomics/dictionary/RingType";
import CreateMonosaccharideContainer from "../createSugar/CreateMonosaccharideContainer";

export default class CreateMonosaccharide {
    constructor() {
    }

    makeMonosaccharideImageComponent (_nodeName): Monosaccharide {
        const createMonoComp = new CreateMonosaccharideContainer();
        let mono = this.makeMonosaccharideObject(_nodeName);

        mono.addChild(createMonoComp.makeMonosaccharideConTainer(_nodeName));

        return mono;
    }

    makeMonosaccharideObject (_nodeName: string): Monosaccharide {
        const appFunc = new appFunction();
        const id: string = appFunc.randomString(7);

        const anomericity: Anomericity = Anomericity.UNDEFINED;

        switch (nodeType(nodeModeSearch(_nodeName))) {
            case nodeModeType.NOT_SELECTED: {
                let type: MonosaccharideType = MonosaccharideType.Assigned;

                let isomer: Isomer = Isomer.UNDEFINED;
                let ringType: RingType = RingType.UNDEFINED;
                return new Monosaccharide(id, type, anomericity, isomer, ringType);
            }
            default: {
                const snfgSymbol = SNFGSymbolGlycan[_nodeName];
                let type: MonosaccharideType = MonosaccharideType[_nodeName];

                let isomer: Isomer = this.generateIsomer(snfgSymbol.isomer);
                let ringType: RingType = this.generateRingType(snfgSymbol.ring);
                return new Monosaccharide(id, type, anomericity, isomer, ringType);
            }
        }
    }

    generateIsomer(_isomer: string): Isomer {
        if (_isomer === "D")
            return Isomer.D;
        if (_isomer === "L")
            return Isomer.L;

        return Isomer.UNDEFINED;
    }

    generateRingType(_ringType: string): RingType {
        if (_ringType.startsWith("P"))
            return RingType.P;
        if (_ringType.startsWith("F"))
            return RingType.F;

        return RingType.UNDEFINED;
    }
}