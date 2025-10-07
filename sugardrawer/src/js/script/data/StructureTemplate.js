"use strict";

import Structures from "sugar-sketcher/src/js/models/glycomics/dictionary/Structures";

export default class StructureTemplate {
    constructor() {}

    getTemplate (_motif) {
        if (_motif === "ncorehyb") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2s:n-acetyl\n" +
                "3b:b-dglc-HEX-1:5\n" +
                "4s:n-acetyl\n" +
                "5b:b-dman-HEX-1:5\n" +
                "6b:a-dman-HEX-1:5\n" +
                "7b:b-dglc-HEX-1:5\n" +
                "8s:n-acetyl\n" +
                "9b:b-dgal-HEX-1:5\n" +
                "10b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "11s:n-acetyl\n" +
                "12b:a-dman-HEX-1:5\n" +
                "13b:a-dman-HEX-1:5\n" +
                "14b:a-dman-HEX-1:5\n" +
                "LIN\n" +
                "1:1d(2+1)2n\n" +
                "2:1o(4+1)3d\n" +
                "3:3d(2+1)4n\n" +
                "4:3o(4+1)5d\n" +
                "5:5o(3+1)6d\n" +
                "6:6o(2+1)7d\n" +
                "7:7d(2+1)8n\n" +
                "8:7o(4+1)9d\n" +
                "9:9o(6+2)10d\n" +
                "10:10d(5+1)11n\n" +
                "11:5o(6+1)12d\n" +
                "12:12o(3+1)13d\n" +
                "13:12o(6+1)14d\n";
        }
        if (_motif === "ncorecomp") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2s:n-acetyl\n" +
                "3b:b-dglc-HEX-1:5\n" +
                "4s:n-acetyl\n" +
                "5b:b-dman-HEX-1:5\n" +
                "6b:a-dman-HEX-1:5\n" +
                "7b:b-dglc-HEX-1:5\n" +
                "8s:n-acetyl\n" +
                "9b:b-dgal-HEX-1:5\n" +
                "10b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "11s:n-acetyl\n" +
                "12b:a-dman-HEX-1:5\n" +
                "13b:b-dglc-HEX-1:5\n" +
                "14s:n-acetyl\n" +
                "15b:b-dgal-HEX-1:5\n" +
                "16b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "17s:n-acetyl\n" +
                "18b:a-lgal-HEX-1:5|6:d\n" +
                "LIN\n" +
                "1:1d(2+1)2n\n" +
                "2:1o(4+1)3d\n" +
                "3:3d(2+1)4n\n" +
                "4:3o(4+1)5d\n" +
                "5:5o(3+1)6d\n" +
                "6:6o(2+1)7d\n" +
                "7:7d(2+1)8n\n" +
                "8:7o(4+1)9d\n" +
                "9:9o(6+2)10d\n" +
                "10:10d(5+1)11n\n" +
                "11:5o(6+1)12d\n" +
                "12:12o(2+1)13d\n" +
                "13:13d(2+1)14n\n" +
                "14:13o(4+1)15d\n" +
                "15:15o(6+2)16d\n" +
                "16:16d(5+1)17n\n" +
                "17:1o(6+1)18d\n";
        }
        if (_motif === "ncoreoligo") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2s:n-acetyl\n" +
                "3b:b-dglc-HEX-1:5\n" +
                "4s:n-acetyl\n" +
                "5b:b-dman-HEX-1:5\n" +
                "6b:a-dman-HEX-1:5\n" +
                "7b:a-dman-HEX-1:5\n" +
                "8b:a-dman-HEX-1:5\n" +
                "9b:a-dman-HEX-1:5\n" +
                "10b:a-dman-HEX-1:5\n" +
                "11b:a-dman-HEX-1:5\n" +
                "12b:a-dman-HEX-1:5\n" +
                "13b:a-dman-HEX-1:5\n" +
                "LIN\n" +
                "1:1d(2+1)2n\n" +
                "2:1o(4+1)3d\n" +
                "3:3d(2+1)4n\n" +
                "4:3o(4+1)5d\n" +
                "5:5o(3+1)6d\n" +
                "6:6o(2+1)7d\n" +
                "7:7o(2+1)8d\n" +
                "8:5o(6+1)9d\n" +
                "9:9o(3+1)10d\n" +
                "10:10o(2+1)11d\n" +
                "11:9o(6+1)12d\n" +
                "12:12o(2+1)13d\n";
        }
        if (_motif === "GD1a") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "5b:b-dgal-HEX-1:5\n" +
                "6s:n-acetyl\n" +
                "7b:b-dgal-HEX-1:5\n" +
                "8b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "9s:n-acetyl\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n" +
                "4:2o(4+1)5d\n" +
                "5:5d(2+1)6n\n" +
                "6:5o(3+1)7d\n" +
                "7:7o(3+2)8d\n" +
                "8:8d(5+1)9n\n";
        }
        if (_motif === "GD1b") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "5b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "6s:n-acetyl\n" +
                "7b:b-dgal-HEX-1:5\n" +
                "8s:n-acetyl\n" +
                "9b:b-dgal-HEX-1:5\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n" +
                "4:3o(8+2)5d\n" +
                "5:5d(5+1)6n\n" +
                "6:2o(4+1)7d\n" +
                "7:7d(2+1)8n\n" +
                "8:7o(3+1)9d\n";
        }
        if (_motif === "GD2") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "5b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "6s:n-acetyl\n" +
                "7b:b-dgal-HEX-1:5\n" +
                "8s:n-acetyl\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n" +
                "4:3o(8+2)5d\n" +
                "5:5d(5+1)6n\n" +
                "6:2o(4+1)7d\n" +
                "7:7d(2+1)8n\n";
        }
        if (_motif === "GM1a") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "5b:b-dgal-HEX-1:5\n" +
                "6s:n-acetyl\n" +
                "7b:b-dgal-HEX-1:5\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n" +
                "4:2o(4+1)5d\n" +
                "5:5d(2+1)6n\n" +
                "6:5o(3+1)7d\n";
        }
        if (_motif === "GM1b") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:b-dgal-HEX-1:5\n" +
                "4s:n-acetyl\n" +
                "5b:b-dgal-HEX-1:5\n" +
                "6b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "7s:n-acetyl\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(4+1)3d\n" +
                "3:3d(2+1)4n\n" +
                "4:3o(3+1)5d\n" +
                "5:5o(3+2)6d\n" +
                "6:6d(5+1)7n\n";
        }
        if (_motif === "GM2") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "5b:b-dgal-HEX-1:5\n" +
                "6s:n-acetyl\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n" +
                "4:2o(4+1)5d\n" +
                "5:5d(2+1)6n\n";
        }
        if (_motif === "GM3") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2b:b-dgal-HEX-1:5\n" +
                "3b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d\n" +
                "4s:n-acetyl\n" +
                "LIN\n" +
                "1:1o(4+1)2d\n" +
                "2:2o(3+2)3d\n" +
                "3:3d(5+1)4n\n";
        }
        if (_motif === "3'sulfo LewisX") {
            return "RES\n" +
                "1b:b-dglc-HEX-1:5\n" +
                "2s:n-acetyl\n" +
                "3b:a-lgal-HEX-1:5|6:d\n" +
                "4b:b-dgal-HEX-1:5\n" +
                "5s:sulfate\n" +
                "LIN\n" +
                "1:1d(2+1)2n\n" +
                "2:1o(3+1)3d\n" +
                "3:1o(4+1)4d\n" +
                "4:4o(3+1)5n\n";
        }
        return Structures[_motif].glycoct;
    }
}