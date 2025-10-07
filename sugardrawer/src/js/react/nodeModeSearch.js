//@flow
"use strict";

import { nodeModeType } from "./nodeModeType";
import { getColor } from "../script/data/getColor";

export function nodeModeSearch(target: string) {
    switch (target.toLowerCase()) {
        case "Hex".toLowerCase(): return nodeModeType.HEX;
        case "Glc".toLowerCase(): return nodeModeType.GLC;
        case "Man".toLowerCase(): return nodeModeType.MAN;
        case "Gal".toLowerCase(): return nodeModeType.GAL;
        case "Gul".toLowerCase(): return nodeModeType.GUL;
        case "Alt".toLowerCase(): return nodeModeType.ALT;
        case "All".toLowerCase(): return nodeModeType.ALL;
        case "Tal".toLowerCase(): return nodeModeType.TAL;
        case "Ido".toLowerCase(): return nodeModeType.IDO;
        case "HexNAc".toLowerCase(): return nodeModeType.HEXNAC;
        case "GlcNAc".toLowerCase(): return nodeModeType.GLCNAC;
        case "ManNAc".toLowerCase(): return nodeModeType.MANNAC;
        case "GalNAc".toLowerCase(): return nodeModeType.GALNAC;
        case "GulNAc".toLowerCase(): return nodeModeType.GULNAC;
        case "AltNAc".toLowerCase(): return nodeModeType.ALTNAC;
        case "AllNAc".toLowerCase(): return nodeModeType.ALLNAC;
        case "TalNAc".toLowerCase(): return nodeModeType.TALNAC;
        case "IdoNAc".toLowerCase(): return nodeModeType.IDONAC;
        case "HexN".toLowerCase(): return nodeModeType.HEXN;
        case "GlcN".toLowerCase(): return nodeModeType.GLCN;
        case "ManN".toLowerCase(): return nodeModeType.MANN;
        case "GalN".toLowerCase(): return nodeModeType.GALN;
        case "GulN".toLowerCase(): return nodeModeType.GULN;
        case "AltN".toLowerCase(): return nodeModeType.ALTN;
        case "AllN".toLowerCase(): return nodeModeType.ALLN;
        case "TalN".toLowerCase(): return nodeModeType.TALN;
        case "IdoN".toLowerCase(): return nodeModeType.IDON;
        case "HexA".toLowerCase(): return nodeModeType.HEXA;
        case "GlcA".toLowerCase(): return nodeModeType.GLCA;
        case "ManA".toLowerCase(): return nodeModeType.MANA;
        case "GalA".toLowerCase(): return nodeModeType.GALA;
        case "GulA".toLowerCase(): return nodeModeType.GULA;
        case "AltA".toLowerCase(): return nodeModeType.ALTA;
        case "AllA".toLowerCase(): return nodeModeType.ALLA;
        case "TalA".toLowerCase(): return nodeModeType.TALA;
        case "IdoA".toLowerCase(): return nodeModeType.IDOA;
        case "dHex".toLowerCase(): return nodeModeType.DHEX;
        case "Qui".toLowerCase(): return nodeModeType.QUI;
        case "Rha".toLowerCase(): return nodeModeType.RHA;
        case "SixdGul".toLowerCase(): return nodeModeType.D6GUL;
        case "SixdAlt".toLowerCase(): return nodeModeType.D6ALT;
        case "SixdTal".toLowerCase(): return nodeModeType.D6TAL;
        case "Fuc".toLowerCase(): return nodeModeType.FUC;
        case "dHexNAc".toLowerCase(): return nodeModeType.DHEXNAC;
        case "QuiNAc".toLowerCase(): return nodeModeType.QUINAC;
        case "RhaNAc".toLowerCase(): return nodeModeType.RHANAC;
        case "SixdAltNAc".toLowerCase(): return nodeModeType.D6ALTNAC;
        case "SixdTalNAc".toLowerCase(): return nodeModeType.D6TALNAC;
        case "FucNAc".toLowerCase(): return nodeModeType.FUCNAC;
        case "ddHex".toLowerCase(): return nodeModeType.DDHEX;
        case "Oli".toLowerCase(): return nodeModeType.OLI;
        case "Tyv".toLowerCase(): return nodeModeType.TYV;
        case "Abe".toLowerCase(): return nodeModeType.ABE;
        case "Par".toLowerCase(): return nodeModeType.PAR;
        case "Dig".toLowerCase(): return nodeModeType.DIG;
        case "Col".toLowerCase(): return nodeModeType.COL;
        case "Pen".toLowerCase(): return nodeModeType.PEN;
        case "Ara".toLowerCase(): return nodeModeType.ARA;
        case "Lyx".toLowerCase(): return nodeModeType.LYX;
        case "Xyl".toLowerCase(): return nodeModeType.XYL;
        case "Rib".toLowerCase(): return nodeModeType.RIB;
        case "Non".toLowerCase(): return nodeModeType.NON;
        case "Nonu".toLowerCase(): return nodeModeType.NON;
        case "Kdn".toLowerCase(): return nodeModeType.KDN;
        case "Neu5Ac".toLowerCase(): return nodeModeType.NEU5AC;
        case "Neu5Gc".toLowerCase(): return nodeModeType.NEU5GC;
        case "Neu".toLowerCase(): return nodeModeType.NEU;
        case "Sia".toLowerCase(): return nodeModeType.SIA;
        case "dNon".toLowerCase(): return nodeModeType.DNON;
        case "Pse".toLowerCase(): return nodeModeType.PSE;
        case "Leg".toLowerCase(): return nodeModeType.LEG;
        case "Aci".toLowerCase(): return nodeModeType.ACI;
        case "4eLeg".toLowerCase(): return nodeModeType.E4LEG;
        case "Unknown".toLowerCase(): return nodeModeType.UNKNOWN;
        case "Bac".toLowerCase(): return nodeModeType.BAC;
        case "LDManHep".toLowerCase(): return nodeModeType.LDMANHEP;
        case "Kdo".toLowerCase(): return nodeModeType.KDO;
        case "Dha".toLowerCase(): return nodeModeType.DHA;
        case "DDManHep".toLowerCase(): return nodeModeType.DDMANHEP;
        case "MurNAc".toLowerCase(): return nodeModeType.MURNAC;
        case "MurNGc".toLowerCase(): return nodeModeType.MURNGC;
        case "Mur".toLowerCase(): return nodeModeType.MUR;
        case "Assigned".toLowerCase(): return nodeModeType.ASSIGNED;
        case "Api".toLowerCase(): return nodeModeType.API;
        case "Fru".toLowerCase(): return nodeModeType.FRU;
        case "Tag".toLowerCase(): return nodeModeType.TAG;
        case "Sor".toLowerCase(): return nodeModeType.SOR;
        case "Psi".toLowerCase(): return nodeModeType.PSI;
        default: return nodeModeType.NOT_SELECTED;
    }
}

export function nodeType(target: Symbol): Symbol {
    switch (target) {
        case nodeModeType.HEX:
        case nodeModeType.GLC:
        case nodeModeType.MAN:
        case nodeModeType.GAL:
        case nodeModeType.GUL:
        case nodeModeType.ALT:
        case nodeModeType.ALL:
        case nodeModeType.TAL:
        case nodeModeType.IDO:
            return nodeModeType.HEX;
        case nodeModeType.HEXNAC:
        case nodeModeType.GLCNAC:
        case nodeModeType.MANNAC:
        case nodeModeType.GALNAC:
        case nodeModeType.GULNAC:
        case nodeModeType.ALTNAC:
        case nodeModeType.ALLNAC:
        case nodeModeType.TALNAC:
        case nodeModeType.IDONAC:
            return nodeModeType.HEXNAC;
        case nodeModeType.HEXN:
        case nodeModeType.GLCN:
        case nodeModeType.MANN:
        case nodeModeType.GALN:
        case nodeModeType.GULN:
        case nodeModeType.ALTN:
        case nodeModeType.ALLN:
        case nodeModeType.TALN:
        case nodeModeType.IDON:
            return nodeModeType.HEXN;
        case nodeModeType.HEXA:
        case nodeModeType.GLCA:
        case nodeModeType.MANA:
        case nodeModeType.GALA:
        case nodeModeType.GULA:
        case nodeModeType.ALTA:
        case nodeModeType.ALLA:
        case nodeModeType.TALA:
        case nodeModeType.IDOA:
            return nodeModeType.HEXA;
        case nodeModeType.DHEX:
        case nodeModeType.QUI:
        case nodeModeType.RHA:
        case nodeModeType.D6GUL:
        case nodeModeType.D6ALT:
        case nodeModeType.D6TAL:
        case nodeModeType.FUC:
            return nodeModeType.DHEX;
        case nodeModeType.DHEXNAC:
        case nodeModeType.QUINAC:
        case nodeModeType.RHANAC:
        case nodeModeType.D6ALTNAC:
        case nodeModeType.D6GULNAC:
        case nodeModeType.D6TALNAC:
        case nodeModeType.FUCNAC:
            return nodeModeType.DHEXNAC;
        case nodeModeType.DDHEX:
        case nodeModeType.OLI:
        case nodeModeType.TYV:
        case nodeModeType.ABE:
        case nodeModeType.PAR:
        case nodeModeType.DIG:
        case nodeModeType.COL:
            return nodeModeType.DDHEX;
        case nodeModeType.PEN:
        case nodeModeType.ARA:
        case nodeModeType.LYX:
        case nodeModeType.XYL:
        case nodeModeType.RIB:
            return nodeModeType.PEN;
        case nodeModeType.NON:
        case nodeModeType.KDN:
        case nodeModeType.NEU5AC:
        case nodeModeType.NEU5GC:
        case nodeModeType.NEU:
        case nodeModeType.SIA:
            return nodeModeType.NON;
        case nodeModeType.DNON:
        case nodeModeType.PSE:
        case nodeModeType.LEG:
        case nodeModeType.ACI:
        case nodeModeType.E4LEG:
            return nodeModeType.DNON;
        case nodeModeType.UNKNOWN:
        case nodeModeType.BAC:
        case nodeModeType.LDMANHEP:
        case nodeModeType.KDO:
        case nodeModeType.DHA:
        case nodeModeType.DDMANHEP:
        case nodeModeType.MURNAC:
        case nodeModeType.MURNGC:
        case nodeModeType.MUR:
            return nodeModeType.UNKNOWN;
        case nodeModeType.ASSIGNED:
        case nodeModeType.API:
        case nodeModeType.FRU:
        case nodeModeType.TAG:
        case nodeModeType.SOR:
        case nodeModeType.PSI:
            return nodeModeType.ASSIGNED;
        default:
            return nodeModeType.NOT_SELECTED;
    }

}

export const getSymbolColor = (SNFGNameSymbol: Symbol): string => {
    switch (SNFGNameSymbol) {
        case nodeModeType.HEX:
        case nodeModeType.HEXNAC:
        case nodeModeType.HEXN:
        case nodeModeType.HEXA:
        case nodeModeType.DHEX:
        case nodeModeType.DHEXNAC:
        case nodeModeType.DDHEX:
        case nodeModeType.PEN:
        case nodeModeType.NON:
        case nodeModeType.DNON:
        case nodeModeType.UNKNOWN:
        case nodeModeType.ASSIGNED:
            return getColor("white");
        case nodeModeType.GLC:
        case nodeModeType.GLCNAC:
        case nodeModeType.GLCN:
        case nodeModeType.GLCA:
        case nodeModeType.QUI:
        case nodeModeType.QUINAC:
        case nodeModeType.OLI:
        case nodeModeType.BAC:
        case nodeModeType.API:
            return getColor("blue");
        case nodeModeType.MAN:
        case nodeModeType.MANNAC:
        case nodeModeType.MANN:
        case nodeModeType.MANA:
        case nodeModeType.RHA:
        case nodeModeType.RHANAC:
        case nodeModeType.TYV:
        case nodeModeType.ARA:
        case nodeModeType.KDN:
        case nodeModeType.PSE:
        case nodeModeType.LDMANHEP:
        case nodeModeType.FRU:
            return getColor("green");
        case nodeModeType.GAL:
        case nodeModeType.GALNAC:
        case nodeModeType.GALN:
        case nodeModeType.GALA:
        case nodeModeType.LYX:
        case nodeModeType.LEG:
        case nodeModeType.KDO:
        case nodeModeType.TAG:
            return getColor("yellow");
        case nodeModeType.GUL:
        case nodeModeType.GULNAC:
        case nodeModeType.GULN:
        case nodeModeType.GULA:
        case nodeModeType.D6GUL:
        case nodeModeType.ABE:
        case nodeModeType.XYL:
        case nodeModeType.DHA:
        case nodeModeType.SOR:
            return getColor("orange");
        case nodeModeType.ALT:
        case nodeModeType.ALTNAC:
        case nodeModeType.ALTN:
        case nodeModeType.ALTA:
        case nodeModeType.D6ALT:
        case nodeModeType.D6ALTNAC:
        case nodeModeType.PAR:
        case nodeModeType.RIB:
        case nodeModeType.ACI:
        case nodeModeType.DDMANHEP:
        case nodeModeType.PSI:
            return getColor("pink");
        case nodeModeType.ALL:
        case nodeModeType.ALLNAC:
        case nodeModeType.ALLN:
        case nodeModeType.ALLA:
        case nodeModeType.DIG:
        case nodeModeType.NEU5AC:
        case nodeModeType.MURNAC:
            return getColor("purple");
        case nodeModeType.TAL:
        case nodeModeType.TALNAC:
        case nodeModeType.TALN:
        case nodeModeType.TALA:
        case nodeModeType.D6TAL:
        case nodeModeType.D6TALNAC:
        case nodeModeType.COL:
        case nodeModeType.NEU5GC:
        case nodeModeType.E4LEG:
        case nodeModeType.MURNGC:
            return getColor("light_blue");
        case nodeModeType.IDO:
        case nodeModeType.IDONAC:
        case nodeModeType.IDON:
        case nodeModeType.IDOA:
        case nodeModeType.NEU:
        case nodeModeType.MUR:
            return getColor("brown");
        case nodeModeType.FUC:
        case nodeModeType.FUCNAC:
        case nodeModeType.SIA:
            return getColor("red");
        default: return "";

    }

};