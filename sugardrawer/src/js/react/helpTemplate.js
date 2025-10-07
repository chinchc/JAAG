//@flow

"use strict";

export const helpTemplate = (_id: string) => {
    switch (_id) {
        case "node" : {
            return "Select which monosaccharide unit you want to draw from the submenu and click in the canvas area in the place you want to draw in.  " +
                "If the monosaccharide is not in the submenu list, check " +
                "\"undefined Monosaccharide in SNFG\".  " +
                "Then, type the monosaccharide name, select the isomer, " +
                "ring size and number of carbon backbone.";
        }
        case "edge" : {
            return "Assign positional information to the glycosidic linkages between monosaccharides.  With the linkage position indicated in \"Add linkage\" list selected, click on any glycosidic linkage on the canvas to change the positional information.  If there is a conflict between the join information that user is trying to assign and the one selected on the canvas, some error message will be returned.";
            /*"To draw linkage, select two monosaccharide units. \n" +
                "If you want draw linkage type, select linkage type you want to draw from the submenu list, " +
                "and click on the already drawn linkage.\n" +
                "If you want draw undefined linkage type from the submenu, check  " +
                "\" undefined linkage\" , and select the donor sugar anomer, " +
                "donor sugar's linkage position and acceptor sugar's  " +
                "linkage position. After that, click on the already drawn linkage. ";
             */
        }
        case "addModification" : {
            return "Assign the modification to any monosaccharide.  Selecting a modification from \"Add modification\" list and clicking on a monosaccharide on the canvas will add a modification to that monosaccharide.  The modification is represented as a letter.  You can change the position of modification by clicking a modification on the canvas.";

            /*"To draw single binding modification, select the modification and binding position, " +
                "then click on the target monosaccharide.\n" +
                "If you want multiple binding modification, check \" Multiple bond \" " +
                "and select the modification from the submenu, then select from the " +
                "bottom checkbox more than 1 binding position. \n" +
                "To draw a bridge modification structure, " +
                "select modification from the submenu list, and check \"bridge bond\". " +
                "After that, click the two linked monosaccharide units.\n" +
                "To draw modification that is undefined from the submenu, " +
                "check \" undefined Modification \", type the name, and select the binding position.\n";
             */
        }
        case "repeat" : {
            return "Please select the start and end monosaccharides of the repeated units. \n" +
                "After that, click on the drawn repeat brackets, and input the number of repeats.";
        }
        case "fragment" : {
            return "To draw fragment structure, by clicking on the acceptor monosacchairde " +
                "-not the nonreducing unit-, a bracket will be drawn. " +
                "Then, select the monosaccharide/s , and click by the brackets to draw it. " +
                "Use \" Draw Linakge \" function to draw linkage between fragmnet monosaccharides.\n" +
                "To draw partial fragment structure, select nonreducing monosacchairdes, and click \"apply\" button.";
        }
        case "composition" : {
            return "Select the number of monosaccharides and click \"Apply\" button.";
        }
        case "clear" : {
            return "All drawn glycan images are deleted. ";
        }
        case "export" : {
            return "SugarDrawer converts the glycan drawn on the canvas into a glycan text format that can be used in databases and analysis tools.  " +
                "SugarDrawer provides functions to convert images of glycan into three different text formats: GlycoCT, WURCS, and SVG.";
        }
        case "import" : {
            return "Import string function visualizes the image of the glycan on the canvas by inputting the text format of the glycan.  " +
                "The user can edit the image of glycan output to the canvas and handle a different structure than the input glycan.  " +
                "SugarDrawer supports glycan text in GlycoCT or WURCS format.";
        }
        case "search" : {
            return "Search the glycan database using the glycan structures depicted on the canvas as a query.  " +
                "When the search is finished, the IDs of various databases in which the retrieved glycan structures are registered and a table including the images is displayed at the bottom of the tool.";
        }
        case "structure" : {
            return "Draw images of well-known motif structures in the field of glycobiology on the canvas.  " +
                "The glycan motifs supported in SugarDrawer are N-linked glycans, glycospingolipids, glycosaminoglycans (GAG), Lewis structures and glycan found in various antibodies.  ";
        }
        case "expert" : {
            return "Switch to expert interface mode.";
        }
        case "simple" : {
            return "Switch to simple interface mode.";
        }
        case "undo" : {
            return "Return to the previous operation.";
        }
        case "redo" : {
            return "Return to one later operation.";
        }
        default : {
            return "This is a message area of the selected function.";
        }
    }
};