/**
 * Author:  Masaaki Matsubara
 * Version: 0.0.1
 */

import GlycoCTParser from "sugar-sketcher/src/js/models/io/glycoCT/GlycoCTParser";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";
import Glycan from "sugar-sketcher/src/js/models/glycomics/Glycan";

export default class GlycoCTParserForFragments extends GlycoCTParser {


    /**
     * Main function of the class, used to parse the formula
     * @returns {*}
     */
    parseGlycoCT() {
        if (this.formula === "") {
            return new Glycan("Glycan");
        }
        // Get the text lines under the RES section
        var res = this.getSection("RES",this.formula);
        var links;
        if (! this.formula.split("LIN")[1]) // If the formula is only one node (no link)
        {
            if (!res[0]) // wrong formula
            {
                return new Glycan("Glycan");
            }
            // Create the root (DonorPosition and AcceptorPosition of root are unknwown from GlycoCT formula)
            this.createResidue(res[0].split(":"), "r", "r");
            return this.glycan;
        }
        else
        {
            // Get the text lines under the LIN section
            links = this.getSection("LIN",this.formula);
        }
        // Get the rep section
        var repSection = this.getSection("REP",this.formula);
        // Get each rep from the rep section
        var reps = this.getRepeatingUnit(repSection);

        // This will contain the id of the created nodes
        var nodesIds = {};

        // This will contain the RepeatingUnit objects, and the nodes that are in it [[RepObject,[nodes...]],...]
        var repInfo = [];

        // If there are some Repeating Units in the formula
        if (reps.length != 0)
        {
            // Use the function to insert the residues and links lines from the REPS to the main RES section
            // so that we get rid of the REP section and finally have only RES and LIN sections, with mixed up indices (doesn't matter)
            var merge = this.mergeRep(reps, res, links);
            res = merge[0];
            links = merge[1];
            repInfo = merge[2];
        }

        // We finally call the function that reads through the lines and calls the function to create nodes
        this.generateNodes(links, nodesIds, res, repInfo);

        var glycans = [];
        // Keep core glycan
        glycans.push(this.glycan);

        // Get the und section
        var undSection = this.getUNDSection(this.formula);
        // Get each und info from the und section
        var unds = this.getFragmentInfo(undSection);

        for (var undInfo of unds )
        {
            // Generate glycans for each und section
            if ( undInfo.lin.length > 0 )
            {
                this.generateNodes(undInfo.lin, nodesIds, undInfo.res, repInfo);
            }
            else
            {
                // For no LIN section in the und section
                this.createResidue(undInfo.res[0].split(":"), "r", "r");
            }
            var glycanSub = this.glycan;

            // Set id
            glycanSub.id = `fragments${unds.indexOf(undInfo) + 1}`;

            // Add parent node IDs
            glycanSub.parentNodeIDs = [];
            for (var parentId of undInfo.info.parentIds )
            {
                glycanSub.parentNodeIDs.push(nodesIds[parentId]);
            }

            // Set parent edge
            var dPos = DonorPosition.prototype.getDonorPosition( parseInt(undInfo.info.subLinks[0].donorPosition) );
            var aPos = AcceptorPosition.prototype.getAcceptorPosition( parseInt(undInfo.info.subLinks[0].acceptorPosition) );
            glycanSub.parentEdge = {"donorPosition": dPos, "acceptorPosition": aPos};

            glycans.push(glycanSub);
        }

        return glycans;
    }

    /**
     * Get lines for UND sections from formula
     * @param formula Array or string
     * @returns {Array}
     */
    getUNDSection(formula) {
        var formulaArray;
        if (!(formula instanceof Array))
        {
            formulaArray = formula.split("\n");
        }
        else
        {
            formulaArray = formula;
        }
        var output = [];
        var flag = false;
        for (var line of formulaArray)
        {
            if ( line === "UND" )
            {
                flag = true;
                continue;
            }
            if (flag)
                output.push(line);
        }
        return output;
    }

    /**
     * Returns all the infos that we can read from the UND section for every fragments
     * Output : [{"info", "res", "lin"},...]
     * "info": {"probability": {"min", "max"}, "parentIds": [], "subLinks"}
     * "subLinks": {"donorPosition", "acceptorPosition", "donorType", "acceptorType"}
     * @param array
     * @returns {Array}
     */
    getFragmentInfo(array) {
        var info;
        var output = [], value = [], prob = {}, pIds = [], subLinks = [];
        /**
         * UND
         * UND{i}:100.0:100.0
         * ParentIDs:{ID1}|{ID2}|...
         * SubtreeLinkageID1:o({donorPosition}+{acceptorPosition})d
         * RES
         * ...
         */
        for (var line of array)
        {
            var split = line.split(/UND\d+:/);
            if ( split[1] )
            {
                // Push previous und info
                if (value.length != 0)
                {
                    info = {"probability": prob, "parentIds": pIds, "subLinks": subLinks};
                    output.push({"info":info,"res":this.getSection("RES",value),"lin":this.getSection("LIN",value)});
                }
                value = [];
                prob = {"min":split[1].split(":")[0], "max":split[1].split(":")[1]};
                continue;
            }

            split = line.split(/ParentIDs:/);
            if ( split[1] )
            {
                pIds = split[1].split("|");
                continue;
            }

            split = line.split(/SubtreeLinkageID\d+:/);
            if ( split[1] )
            {
                var subLink = {
                    "donorPosition": split[1].split("(")[1].split("+")[0],
                    "acceptorPosition": split[1].split(")")[0].split("+")[1],
                    "donorType":split[1].split("(")[0],
                    "acceptorType":split[1].split(")")[1]
                };
                subLinks.push(subLink);
                continue;
            }

            value.push(line);
        }
        // Push last und info
        if (value.length !== 0)
        {
            info = {"probability": prob, "parentIds": pIds, "subLinks": subLinks};
            output.push({"info":info,"res":this.getSection("RES",value),"lin":this.getSection("LIN",value)});
        }

        return output;
    }
}