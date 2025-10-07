//@flow

export const getTextFormat = (_format: String): Symbol => {

    switch(_format) {
        case "glycoct":
            return textFormat.GLYCOCT;
        case "wurcs":
            return textFormat.WURCS;
        case "iupacextended" :
            return textFormat.IUPACEXTENDED;
        case "iupaccondensed" :
            return textFormat.IUPACCONDENSED;
        case "iupacshort" :
            return textFormat.IUPACSHORT;
        default:
            return textFormat.UNDEFINED;
    }
};

export const textFormat = {
    GLYCOCT: Symbol(),
    WURCS: Symbol(),
    IUPACCONDENSED: Symbol(),
    IUPACEXTENDED: Symbol(),
    IUPACSHORT: Symbol(),
    UNDEFINED: Symbol()
};