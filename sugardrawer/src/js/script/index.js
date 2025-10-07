//@flow
"use strict";

import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import OriginalPosition from "sugar-sketcher/src/js/views/parametors/OriginalPosition";
import {LiaiseUI} from "./class/LiaiseUI";

export let liaise: LiaiseUI = new LiaiseUI();
//export let setGlids: Array<Array<number>> = [];
//export let compositions: Array<Object> = [];
//export let compositionsGlids: Array<Array<number>> = [];

global.rootDonorPosition = DonorPosition.UNDEFINED;
global.rootAcceptorPosition = AcceptorPosition.ONE;
global.rootPos = new OriginalPosition();