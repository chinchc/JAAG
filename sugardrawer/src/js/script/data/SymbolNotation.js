"use strict";

export const getMonosaccharideTextNotation = (_name) => {
    let name = _name.toLowerCase();
    switch (name) {
        case "glc": return "Glc";
        case "man": return "Man";
        case "gal": return "Gal";
        case "gul": return "Gul";
        case "alt": return "Alt";
        case "all": return "All";
        case "tal": return "Tal";
        case "ido": return "Ido";
        case "hex": return "Hexose";

        case "glcnac": return "GlcNAc";
        case "mannac": return "ManNAc";
        case "galnac": return "GalNAc";
        case "gulnac": return "GulNAc";
        case "altnac": return "AltNAc";
        case "allnac": return "AllNAc";
        case "talnac": return "TalNAc";
        case "idonac": return "IdoNAc";
        case "hexnac": return "HexNAc";

        case "glcn": return "GlcN";
        case "mann": return "ManN";
        case "galn": return "GalN";
        case "guln": return "GulN";
        case "altn": return "AltN";
        case "alln": return "AllN";
        case "taln": return "TalN";
        case "idon": return "IdoN";
        case "hexn": return "Hexosamine";

        case "glca": return "GlcA";
        case "mana": return "ManA";
        case "gala": return "GalA";
        case "gula": return "GulA";
        case "alta": return "AltA";
        case "alla": return "AllA";
        case "tala": return "TalA";
        case "idoa": return "IdoA";
        case "hexa": return "Hexuronate";

        case "qui": return "Qui";
        case "rha": return "Rha";
        case "sixdgul": return "6dGul";
        case "6dgul": return "6dGul";
        case "sixdalt": return "6dAlt";
        case "6dalt": return "6dAlt";
        case "sixdtal": return "6dTal";
        case "6dtal": return "6dTal";
        case "fuc": return "Fuc";
        case "dhex": return "Deoxyhexose";

        case "quinac": return "QuiNAc";
        case "rhanac": return "RhaNAc";
        case "sixdgulnac": return "6dGulNAc";
        case "6dgulnac": return "6dGulNAc";
        case "sixdaltnac": return "6dAltNAc";
        case "6daltnac": return "6dAltNAc";
        case "sixdtalnac": return "6dTalNAc";
        case "6dtalnac": return "6dTalNAc";
        case "fucnac": return "FucNAc";
        case "dhexnac": return "DeoxyhexNAc";

        case "oli": return "Oli";
        case "tyv": return "Tyv";
        case "abe": return "Abe";
        case "par": return "Par";
        case "dig": return "Dig";
        case "col": return "Col";
        case "ddhex": return "Di-deoxyhexose";

        case "ara": return "Ara";
        case "lyx": return "Lyx";
        case "xyl": return "Xyl";
        case "rib": return "Rib";
        case "pen": return "Pentose";

        case "kdn": return "Kdn";
        case "neu5ac": return "Neu5Ac";
        case "neu5gc": return "Neu5Gc";
        case "neu": return "Neu";
        case "nonu": return "Deoxynonulosonate";
        case "non": return "Deoxynonulosonate";

        case "pse": return "Pse";
        case "leg": return "Leg";
        case "aci": return "Aci";
        case "4eleg": return "4eLeg";
        case "dnon": return "Di-deoxynonulosonate";

        case "bac": return "Bac";
        case "ldmanhep": return "LDManHep";
        case "kdo": return "Kdo";
        case "dha": return "Dha";
        case "ddmanhep": return "DDManHep";
        case "murnac": return "MurNAc";
        case "murngc": return "MurNGc";
        case "mur": return "Mur";
        case "unknown": return "Unknown";

        case "api": return "Api";
        case "fru": return "Fru";
        case "tag": return "Tag";
        case "sor": return "Sor";
        case "psi": return "Psi";
        case "assigned": return "Assigned";
    }
};

export const getSubstituentTextNotation = (_name) => {
    let name = _name.toLowerCase();

    switch (name) {
        case "ac": return "Acethyl";
        case "br": return "Bromo";
        case "cl": return "Chloro";
        case "et": return "Ethyl";
        case "eta": return "Ethanolamine";
        case "f": return "Fluoro";
        case "gc": return "Glycolyl";
        case "hme": return "Hydroxymethyl";
        case "i": return "Iodo";
        case "rlac1": return "(R)-lactate1";
        case "slac1": return "(S)-lactate1";
        case "n": return "Amino";
        case "me": return "Methyl";
        case "nac": return "N-acetyl";
        case "nala": return "N-alanine";
        case "ndime": return "N-dimethyl";
        case "nformyl": return "N-formyl";
        case "ngc": return "N-glycolyl";
        case "nme": return "N-methyl";
        case "nsuc": return "N-succinate";
        case "ns": return "N-sulfate";
        case "ntfa": return "N-trifluoroacetyl";
        case "no2": return "Nitrate";
        case "ome": return "O-mehytl";
        case "no3": return "O-nitrate";
        case "p": return "Phosphate";
        case "pyr": return "Pyruvate";
        case "s": return "Sulfate";
        case "rpyr": return "(R)-pyruvate";
        case "spyr": return "(S)-pyruvate";
        case "rlac2": return "(R)-lactate2";
        case "slac2": return "(S)-lactate2";
        default: return _name;
    }
};