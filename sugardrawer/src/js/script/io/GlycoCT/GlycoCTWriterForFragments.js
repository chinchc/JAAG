/**
 * Author:  Masaaki Matsubara
 * Version: 0.0.1
 */

import GlycoCTWriter from "sugar-sketcher/src/js/models/io/glycoCT/GlycoCTWriter";
import RepeatingUnit from "sugar-sketcher/src/js/models/glycomics/RepeatingUnit";
import DonorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/DonorPosition";
import AcceptorPosition from "sugar-sketcher/src/js/models/glycomics/dictionary/AcceptorPosition";

export default class GlycoCTWriterForFragments extends GlycoCTWriter {

    constructor(glycans,trees){
        super(null, null);
        this.glycans = glycans;
        this.trees = trees;
        this.lastResId = 0;
        this.lastLinId = 0;
        this.lastRepId = 0;
    }

    /**
     * Main function called from outside the class to return the final formula
     * @returns {*}
     */
    exportGlycoCT() {
        // Export core
        var resId = {};
        var repId = {};
        var formula = this.generateGlycan(this.glycans[0], this.trees[0], resId, repId);

        if ( this.glycans.length < 2 )
            return formula;

        // Export fragments
        /**
         * UND
         * UND1:100.0:100.0
         * ParentIDs:{ID1}|{ID2}|...
         * SubtreeLinkageID1:o({donorPosition}+{acceptorPosition})d
         * RES
         * ...
         */
        formula += "\nUND";
        for (var i = 1; i < this.glycans.length; i++)
            formula += this.generateUND(i, this.glycans[i], this.trees[i], resId, repId);

        return formula;
    }

    /**
     * Generates UND section for a fragment part
     * @param _num ID number for this UND section
     * @param _glycanSub Glycan for a fragment
     * @param _treeSub tree info for a fragment
     * @param _resId map node id to residue number
     * @param _repId map node id to repeating unit number
     * @returns {*} string of UND section
     */
    generateUND(_num, _glycanSub, _treeSub, _resId, _repId) {
        // Line for UND ID and probabilities
        var formula = "\nUND" + _num + ":100.0:100.0\n";

        // Line for ParentIDs
        formula += "ParentIDs:";
        var parentIDs = [];
        for ( var nodeIDParent of _glycanSub.parentNodeIDs )
            parentIDs.push(_resId[nodeIDParent]);
        formula += parentIDs.join("|");
        formula += "\n";

        // Line for SubtreeLinkageID
        formula += "SubtreeLinkageID1:o(";
        formula += _glycanSub.parentEdge.donorPosition === DonorPosition.UNDEFINED ?
                    "-1" : _glycanSub.parentEdge.donorPosition.value;
        formula += "+";
        formula += _glycanSub.parentEdge.acceptorPosition === AcceptorPosition.UNDEFINED ?
                    "-1" : _glycanSub.parentEdge.acceptorPosition.value;
        formula += ")d\n";

        // Lines for body
        formula += this.generateGlycan(_glycanSub, _treeSub, _resId, _repId);

        return formula;
    }

    /**
     * Generate string for glycan body (RES and LIN (and REP) sections)
     * @param _glycan Glycan
     * @param _tree tree info for _glycan
     * @param _resId mapping node id to residue number
     * @param _repId mapping node id to repeating unit number
      * @returns {*}
     */
    generateGlycan(_glycan, _tree, _resId, _repId) {
        // Update current glycan and tree
        this.glycan = _glycan;
        this.tree = _tree;

        this.generateArrays(this.tree);
        var res = this.res;
        var associatedSubs = [];
        if (res.length === 0)
        {
            return "";
        }
        var repNumber = 1;

        // RES
        var resInfo = this.generateRES(_resId, _repId, res, associatedSubs, repNumber, this.lastResId);
        var formula = resInfo[1];
        var lastResId = resInfo[0];

        // LIN
        var linInfo = this.generateLIN(_resId, associatedSubs, this.lastLinId);
        formula += linInfo[1];
        var lastLinId = linInfo[0];


        // REP

        for (var residue of this.res)
        {
            if (residue instanceof RepeatingUnit)
            {
                this.rep.push(residue);
            }
        }
        if (this.rep.length !== 0) // if we have REPs
        {
            formula += "REP\n";
            var repCount = 0;
            for (var rep of this.rep)
            {
                this.generateArrays(this.findRepMinDepth(rep),rep.id);
                var entryId = lastResId+1;
                associatedSubs = [];
                resInfo = this.generateRES(_resId,_repId,this.res,associatedSubs,repNumber,lastResId);
                lastResId = resInfo[0];
                var exitId = lastResId;
                formula += "REP" + _repId[rep.id] + ":" + exitId + "o(";
                //TODO: 結合位置がundefinedの場合に対応できていない
                formula += rep.donorPosition === DonorPosition.UNDEFINED ? "-1" : rep.donorPosition;
                formula += "+";
                formula += rep.acceptorPosition === AcceptorPosition.UNDEFINED ? "-1" : rep.acceptorPosition;
                formula += ")" + entryId + "d=";
                formula += rep.min === "?" ? "-1" : rep.min;
                formula += "-";
                formula += rep.max === "?" ? "-1" : rep.max;
                formula += "\n" + resInfo[1];
                linInfo = this.generateLIN(_resId,associatedSubs,lastLinId,rep.id);
                lastLinId = linInfo[0];
                formula += linInfo[1];

                repCount++;
            }
            this.lastRepId += repCount;
        }

        if (formula.substring(formula.length-1) == '\n') // Remove final \n
        {
            formula = formula.substring(0,formula.length-1);
        }

        this.lastResId = lastResId;
        this.lastLinId = lastLinId;

        return formula;
    }

}