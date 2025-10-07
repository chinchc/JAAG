// Enhanced GlycoCT Parser and BondedAtomPairs Generator
// Based on research from:
// - https://doi.org/10.1016/j.carres.2008.03.011 (GlycoCT specification)
// - https://glic.glycoinfo.org/documentation/carbohydrate_sequence/PointsToNoteAboutGlycoCT/
// - https://doi.org/10.1093/glycob/cwaf048 (AlphaFold3 glycan modeling)

class EnhancedGlycoCTParser {
    constructor() {
        this.ccdMapping = new Map();
        this.atomMappings = new Map(); // For bondedAtomPairs atom names
        this.mappingsLoaded = false;
        
        this.loadCCDMappings().then(() => {
            this.mappingsLoaded = true;
        });
        
        this.initializeAtomMappings();
        
    }

    async loadCCDMappings() {
        // Use embedded mappings directly
        this.loadEnhancedFallbackMappings();
    }

    loadEnhancedFallbackMappings() {
        
        // Comprehensive fallback mappings based on CCD.csv - all non-"none" entries
        const mappings = [
            // Hexose
            // Glc
            { sugar: 'glucose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'GLC' },
            { sugar: 'glucose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BGC' },
            { sugar: 'glucose', d: 'L', a: 'beta', ring: 'Fur', ccd: 'A1AIO' },
            { sugar: 'glucose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'Z8T' },            
            // Man
            { sugar: 'mannose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'MAN' },
            { sugar: 'mannose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BMA' },
            // Gal
            { sugar: 'galactose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'GLA' },
            { sugar: 'galactose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'GXL' },
            { sugar: 'galactose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'GLZ' },
            { sugar: 'galactose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'GAL' },
            { sugar: 'galactose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'GIV' },
            // Gul
            { sugar: 'gulose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '4GL' },
            { sugar: 'gulose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'GUP' },
            { sugar: 'gulose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'GL0' },
            { sugar: 'gulose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'Z8H' },
            // Alt
            { sugar: 'altrose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'SHD' },
            { sugar: 'altrose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'Z6H' },
            { sugar: 'altrose', d: 'L', a: 'beta', ring: 'Pyr', ccd: '3MK' },
            // All
            { sugar: 'allose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'VDV' },
            { sugar: 'allose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'AFD' },
            { sugar: 'allose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'Z2D' },
            { sugar: 'allose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'VDS' },
            { sugar: 'allose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'ALL' },
            { sugar: 'allose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'WOO' },
            // Tal
            { sugar: 'talose', d: 'L', a: 'alpha', ring: 'Fur', ccd: 'A5C' },
            { sugar: 'talose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'SDY' },
            { sugar: 'talose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'ZEE' },
            // Ido
            { sugar: 'idose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'ZCD' },
            { sugar: 'idose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'Z0F' },
            { sugar: 'idose', d: 'L', a: 'beta', ring: 'Pyr', ccd: '4N2' },

            // HexNAc
            // GlcNAc
            { sugar: 'glcnac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'NDG' },
            { sugar: 'glcnac', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'NGZ' },
            { sugar: 'glcnac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'NAG' },
            // ManNAc
            { sugar: 'mannac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'BM3' },
            { sugar: 'mannac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BM7' },
            // GalNAc
            { sugar: 'galnac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'A2G' },
            { sugar: 'galnac', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'YYQ' },
            { sugar: 'galnac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'NGA' },
            // GulNAc
            { sugar: 'gulnac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'LXB' },
            // AllNAc
            { sugar: 'allnac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'NAA' },
            // TalNAc
            { sugar: 'talnac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'A1AAJ' },
            // IdoNAc
            { sugar: 'idonac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'LXZ' },
            { sugar: 'idonac', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'HSQ' },

            // HexN
            // GlcN
            { sugar: 'glucosamine', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'PA1' },
            { sugar: 'glucosamine', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'GCS' },
            // ManN
            { sugar: 'mannosamine', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '95Z' },
            // GalN
            { sugar: 'galactosamine', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'X6X' },
            { sugar: 'galactosamine', d: 'D', a: 'beta', ring: 'Pyr', ccd: '1GN' },
            
            // HexA
            // Glucuronic acid (GlcA)
            { sugar: 'glca', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'GCU' },
            { sugar: 'glca', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BDP' },
            // Mannuronic acid (ManA) 
            { sugar: 'mana', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'MAV' },
            { sugar: 'mana', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BEM' },
            // Galacturonic acid (GalA)  
            { sugar: 'gala', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'ADA' },
            { sugar: 'gala', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'GTR' },
            { sugar: 'gala', d: 'D', a: 'beta', ring: 'Fur', ccd: 'GTK' },
            // Guluronic acid (GulA)  
            { sugar: 'gula', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'LGU' },
            // Taluronic acid (TalA)
            { sugar: 'tala', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'X1X' },
            { sugar: 'tala', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'X0X' },
            // Iduronic acid (IdoA)
            { sugar: 'idoa', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'IDR' },

            // DeoxyHex
            // Qui
            { sugar: 'quinovose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'G6D' },
            // Rha
            { sugar: 'rhamnose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'RAM' },
            { sugar: 'rhamnose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'R4M' },
            // 6dGul
            { sugar: '6dgulose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: '66O' },
            // Fuc
            { sugar: 'fucose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'FCA' },
            { sugar: 'fucose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'FUC' },
            { sugar: 'fucose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'GYE' },
            { sugar: 'fucose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'FCB' },
            { sugar: 'fucose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'FUL' },

            // DeoxyHexNAc
            // QuiNAc
            { sugar: 'quinac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'Z9W' },
            // FucNAc
            { sugar: 'fucnac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '49T' },

            // Di-deoxyHex
            // Oli (2,6-dideoxy-arabinose) -> SugarDrawer has issue generating this
            { sugar: 'olivose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'RAE' },
            { sugar: 'olivose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'DDA' },
            { sugar: 'olivose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'Z5J' },
            // Tyv (3,6-dideoxy-arabinose)
            { sugar: 'tyvelose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'TYV' },
            // Abe (3,6-dideoxy-xylose)
            { sugar: 'abequose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'ABE' },
            // Par (3,6-dideoxy-ribose)
            { sugar: 'paratose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'PZU' },
            // Dig (2,6-dideoxy-ribose)
            { sugar: 'digitose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'Z3U' },

            // Pentose
            // Ara
            { sugar: 'arabinose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'BXY' },
            { sugar: 'arabinose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '64K' },
            { sugar: 'arabinose', d: 'L', a: 'alpha', ring: 'Fur', ccd: 'AHR' },
            { sugar: 'arabinose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'ARA' },
            { sugar: 'arabinose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'BXX' },
            { sugar: 'arabinose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'SEJ' },
            { sugar: 'arabinose', d: 'L', a: 'beta', ring: 'Fur', ccd: 'FUB' },
            { sugar: 'arabinose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'ARB' },
            // Lyx
            { sugar: 'lyxose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'LDY' },
            { sugar: 'lyxose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'Z4W' },
            // Xyl
            { sugar: 'xylose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'XYS' },
            { sugar: 'xylose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'HSY' },
            { sugar: 'xylose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'XYZ' },
            { sugar: 'xylose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'XYP' },
            { sugar: 'xylose', d: 'L', a: 'beta', ring: 'Pyr', ccd: 'LXC' },
            // Rib
            { sugar: 'ribose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'RIB' },
            { sugar: 'ribose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'YYM' },
            { sugar: 'ribose', d: 'L', a: 'alpha', ring: 'Fur', ccd: 'Z6J' },
            { sugar: 'ribose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'BDR' },
            { sugar: 'ribose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'RIP' },
            { sugar: 'ribose', d: 'L', a: 'beta', ring: 'Fur', ccd: '32O' },
            { sugar: 'ribose', d: 'L', a: 'beta', ring: 'Pyr', ccd: '0MK' },

            // 3-Deoxy-nonulosonic acids
            // Kdn (Keto-deoxy-nonulonic acid)
            { sugar: 'kdn', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'KDM' },
            { sugar: 'kdn', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'KDN' },
            // Neu5Ac (N-acetylneuraminic acid)
            { sugar: 'neu5ac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'SIA' },
            { sugar: 'neu5ac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'SLB' },
            // Neu5Gc (N-glycolyl-neuraminic acid)
            { sugar: 'neu5gc', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'NGC' },
            { sugar: 'neu5gc', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'NGE' },

            // 3,9-Dideoxy-nonulosonic acids
            // None

            // Unknown
            // LDmanHep
            { sugar: 'ldmanhep', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'GMH' },
            // Kdo (3-deoxy-D-manno-oct-2-ulosonic acid)
            { sugar: 'kdo', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'KDO' },
            // DDmanHep
            { sugar: 'ddmanhep', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '289' },
            // MurNAc (N-acetylmuramic acid
            { sugar: 'murnac', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'MUB' },
            { sugar: 'murnac', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'AMU' },
            // Mur
            { sugar: 'mur', d: 'D', a: 'alpha', ring: 'Pyr', ccd: '1S4' },
            { sugar: 'mur', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'MUR' },

            // Assigned
            // Api
            { sugar: 'apiose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'XXM' },
            // Fru
            { sugar: 'fructose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'Z9N' },
            { sugar: 'fructose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'FRU' },
            { sugar: 'fructose', d: 'D', a: 'beta', ring: 'Pyr', ccd: 'BDF' },
            { sugar: 'fructose', d: 'L', a: 'beta', ring: 'Fur', ccd: 'LFR' },
            // Tag
            { sugar: 'tagatose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'T6T' },
            // Sor
            { sugar: 'sorbose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'HVC' },
            { sugar: 'sorbose', d: 'L', a: 'alpha', ring: 'Pyr', ccd: 'SOE' },
            { sugar: 'sorbose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'UEA' },
            // Psi
            { sugar: 'psicose', d: 'D', a: 'alpha', ring: 'Fur', ccd: 'PSV' },
            { sugar: 'psicose', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'WEB' },
            { sugar: 'psicose', d: 'L', a: 'alpha', ring: 'Fur', ccd: 'SF6' },
            { sugar: 'psicose', d: 'D', a: 'beta', ring: 'Fur', ccd: 'TTV' },
            { sugar: 'psicose', d: 'L', a: 'beta', ring: 'Fur', ccd: 'SF9' },
            
            // Special case: Glucose with n-sulfate
            { sugar: 'glucosensulfate', d: 'D', a: 'alpha', ring: 'Pyr', ccd: 'GNS' },
        ];

        mappings.forEach(m => {
            const key = this.createMappingKey(m.sugar, m.d, m.a, m.ring);
            this.ccdMapping.set(key, {
                ccd: m.ccd,
                sugar: m.sugar,
                stereochemistry: m.d,
                anomeric: m.a,
                ring: m.ring
            });
        });
        
        
        // Test some key lookups
    }

    initializeAtomMappings() {
        // Standard atom names for glycosidic bonds in PDB/CCD format
        this.atomMappings = new Map([
            // Common glycosidic bond atoms
            ['C1', 'C1'],   // Anomeric carbon
            ['O1', 'O1'],   // Anomeric oxygen
            ['C2', 'C2'],
            ['O2', 'O2'],
            ['C3', 'C3'],
            ['O3', 'O3'],
            ['C4', 'C4'],
            ['O4', 'O4'],
            ['C5', 'C5'],
            ['O5', 'O5'],
            ['C6', 'C6'],
            ['O6', 'O6'],
            
            // Sialic acid specific
            ['C2', 'C2'],   // Sialic acid anomeric position
            ['O2', 'O2'],
            
            // Ring oxygen
            ['O5', 'O5'],   // Ring oxygen for pyranose
            ['O4', 'O4'],   // Ring oxygen for furanose
        ]);
    }

    parseCCDMapping(csvText) {
        // Implementation similar to existing but with enhanced sugar name mapping
        const lines = csvText.split('\n');
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 6) {
                const [class_, monosaccharide, dorL, anomeric, ring, ccd] = values;
                if (ccd && ccd.toLowerCase() !== 'none') {
                    const sugarName = this.extractEnhancedSugarName(monosaccharide);
                    const key = this.createMappingKey(sugarName, dorL, anomeric, ring);
                    this.ccdMapping.set(key, {
                        ccd: ccd,
                        class: class_,
                        monosaccharide: monosaccharide,
                        stereochemistry: dorL,
                        anomeric: anomeric,
                        ring: ring
                    });
                }
            }
        }
    }

    extractEnhancedSugarName(monosaccharide) {
        // Enhanced sugar name extraction with special cases
        const name = monosaccharide.toLowerCase();
        
        // Handle special cases based on research
        if (name.includes('n-acetyl')) {
            if (name.includes('glucos') || name.includes('glc')) return 'glcnac';
            if (name.includes('galact') || name.includes('gal')) return 'galnac';
            if (name.includes('mannos') || name.includes('man')) return 'mannac';
        }
        
        if (name.includes('neu5ac') || name.includes('sialic')) return 'neu5ac';
        if (name.includes('neu5gc')) return 'neu5gc';
        if (name.includes('kdn')) return 'kdn';
        if (name.includes('fucose') || name.includes('fuc')) return 'fucose';
        if (name.includes('xylose') || name.includes('xyl')) return 'xylose';
        
        // Standard names
        if (name.includes('glucose') || name.includes('glc')) return 'glucose';
        if (name.includes('galactose') || name.includes('gal')) return 'galactose';
        if (name.includes('mannose') || name.includes('man')) return 'mannose';
        
        return name;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    createMappingKey(sugarName, stereochemistry, anomeric, ring) {
        // Normalize anomeric configuration: a->alpha, b->beta
        const normalizedAnomeric = this.normalizeAnomeric(anomeric);
        return `${sugarName}_${stereochemistry.toLowerCase()}_${normalizedAnomeric}_${ring.toLowerCase()}`;
    }
    
    normalizeAnomeric(anomeric) {
        const anomerMap = {
            'a': 'alpha',
            'b': 'beta',
            'alpha': 'alpha',
            'beta': 'beta',
            'o': 'unknown',
            'x': 'unknown'
        };
        return anomerMap[anomeric.toLowerCase()] || anomeric.toLowerCase();
    }

    /**
     * Enhanced GlycoCT parsing with proper substituent handling
     */
    parseGlycoCT(glycoCT) {
        const lines = glycoCT.trim().split('\n');
        const residues = [];
        const linkages = [];
        const substituents = [];
        
        let currentSection = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            if (trimmed === 'RES') {
                currentSection = 'RES';
                continue;
            } else if (trimmed === 'LIN') {
                currentSection = 'LIN';
                continue;
            } else if (trimmed === 'SUB') {
                currentSection = 'SUB';
                continue;
            }
            
            switch (currentSection) {
                case 'RES':
                    if (trimmed.match(/^\d+s:/)) {
                        const substituent = this.parseSubstituent(trimmed);
                        if (substituent) substituents.push(substituent);
                    } else {
                        const residue = this.parseResidue(trimmed);
                        if (residue) residues.push(residue);
                    }
                    break;
                case 'LIN':
                    const linkage = this.parseLinkage(trimmed);
                    if (linkage) linkages.push(linkage);
                    break;
                case 'SUB':
                    const substituent = this.parseSubstituent(trimmed);
                    if (substituent) substituents.push(substituent);
                    break;
            }
        }
        
        return { residues, linkages, substituents };
    }

    /**
     * Enhanced residue parsing with better sugar name recognition
     */
    parseResidue(line) {
        
        // Match pattern: 1b:b-dglc-HEX-1:5 or complex sialic acid patterns
        const match = line.match(/^(\d+)([bs]):(.+)$/);
        if (!match) return null;
        
        const [, id, type, description] = match;
        
        // Parse the sugar description
        const sugarInfo = this.parseEnhancedSugarDescription(description);
        if (!sugarInfo) return null;
        
        const residue = {
            id: parseInt(id),
            type: type,
            residueType: type === 'b' ? 'basetype' : 'substituent',
            ...sugarInfo,
            description: description,
            originalLine: line
        };
        
        return residue;
    }

    /**
     * Enhanced sugar description parsing with systematic classification
     */
    parseEnhancedSugarDescription(description) {

        // Handle sialic acids: a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
        if (description.includes('NON') && description.includes('keto')) {
            return this.parseSialicAcid(description);
        }

        // Handle heptoses: a-dgro-dman-HEP-1:5 or a-lgro-dman-HEP-1:5
        if (description.includes('HEP') && description.includes('gro')) {
            return this.parseHeptose(description);
        }

        // Handle standard sugars: b-dglc-HEX-1:5 or modified sugars: a-lgal-HEX-1:5|6:d
        const standardMatch = description.match(/^([abx])-([dl])([a-z]+)-([A-Z]+)-(\d+):(\d+)(.*)$/);
        if (!standardMatch) return null;

        const [, anomeric, stereo, sugar, baseType, ringStart, ringEnd, modifications] = standardMatch;

        // Check for undefined anomeric configuration
        if (anomeric === 'x') {
            throw new Error(`Undefined anomeric configuration detected in "${description}". Please specify either 'a' (alpha) or 'b' (beta) instead of 'x' for proper CCD code mapping.`);
        }

        // Determine ring type from ring positions
        let ringType;
        if (ringStart === '1' && ringEnd === '4') {
            ringType = 'Fur'; // 1:4 = Furanose (5-membered ring)
        } else if (ringStart === '1' && ringEnd === '5') {
            ringType = 'Pyr'; // 1:5 = Pyranose (6-membered ring)
        } else if (ringStart === '2' && ringEnd === '5') {
            ringType = 'Fur'; // 2:5 = Furanose for ketoses
        } else if (ringStart === '2' && ringEnd === '6') {
            ringType = 'Pyr'; // 2:6 = Pyranose for ketoses
        } else {
            ringType = 'Pyr'; // Default to pyranose for other cases
        }

        // Store parsed information for later classification
        return {
            anomeric: anomeric,
            stereochemistry: stereo.toUpperCase(),
            baseSugar: sugar,  // Raw sugar name from GlycoCT (e.g., 'glc', 'gal')
            sugarName: null,   // Will be determined later based on substituents
            baseType: baseType,
            ringStart: parseInt(ringStart),
            ringEnd: parseInt(ringEnd),
            ring: ringType,
            modifications: modifications || ''
        };
    }

    /**
     * Parse sialic acid structures - needs substituent context
     */
    parseSialicAcid(description, substituents = [], linkages = []) {
        
        // Pattern: a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
        const parts = description.split('|');
        const mainPart = parts[0]; // a-dgro-dgal-NON-2:6
        
        const match = mainPart.match(/^([abx])-d([a-z]+)-d([a-z]+)-NON-(\d+):(\d+)$/);
        if (match) {
            const [, anomeric, , , ringStart, ringEnd] = match;
            
            // Check for undefined anomeric configuration in sialic acids
            if (anomeric === 'x') {
                throw new Error(`Undefined anomeric configuration detected in sialic acid "${description}". Please specify either 'a' (alpha) or 'b' (beta) instead of 'x' for proper CCD code mapping.`);
            }
            
            // Default to neu5ac for initial parsing - will be corrected in convertToCCDAndBonds
            let sugarName = 'neu5ac';
            
            // Check for N-substituents to determine sialic acid type
            substituents.forEach(sub => {
                if (sub.name === 'n-acetyl') {
                    sugarName = 'neu5ac';
                } else if (sub.name === 'n-glycolyl') {
                    sugarName = 'neu5gc';
                }
            });
            
            
            const modifications = parts.slice(1).join('|');
            
            // Determine ring type from ring positions (same logic as regular sugars)
            let ringType;
            if (ringStart === '1' && ringEnd === '4') {
                ringType = 'Fur'; // 1:4 = Furanose (5-membered ring)
            } else if (ringStart === '1' && ringEnd === '5') {
                ringType = 'Pyr'; // 1:5 = Pyranose (6-membered ring)  
            } else {
                ringType = 'Pyr'; // Default to pyranose for other cases
            }
            
            return {
                anomeric: anomeric,
                stereochemistry: 'D',
                sugarName: sugarName,
                baseType: 'NON',
                ringStart: parseInt(ringStart),
                ringEnd: parseInt(ringEnd),
                ring: ringType,
                modifications: modifications
            };
        }
        
        return null;
    }

    /**
     * Parse heptose structures (7-carbon sugars)
     * Pattern: a-dgro-dman-HEP-1:5 (D-glycero-D-manno-heptose = ddmanhep = 289)
     *          a-lgro-dman-HEP-1:5 (L-glycero-D-manno-heptose = ldmanhep = GMH)
     */
    parseHeptose(description) {
        // Pattern: a-[d/l]gro-[d/l][sugar]-HEP-[ring]
        const match = description.match(/^([abx])-([dl])gro-([dl])([a-z]+)-HEP-(\d+):(\d+)(.*)$/);
        if (match) {
            const [, anomeric, c2stereo, mainStereo, sugar, ringStart, ringEnd, modifications] = match;

            // Check for undefined anomeric configuration
            if (anomeric === 'x') {
                throw new Error(`Undefined anomeric configuration detected in heptose "${description}". Please specify either 'a' (alpha) or 'b' (beta) instead of 'x' for proper CCD code mapping.`);
            }

            // Construct heptose name based on stereochemistry
            // d-gro-d-man = ddmanhep (D-glycero-D-manno-heptose)
            // l-gro-d-man = ldmanhep (L-glycero-D-manno-heptose)
            const c2prefix = c2stereo.toLowerCase();
            const mainPrefix = mainStereo.toLowerCase();
            const sugarName = `${c2prefix}${mainPrefix}${sugar}hep`;

            // Determine ring type
            let ringType;
            if (ringStart === '1' && ringEnd === '4') {
                ringType = 'Fur';
            } else if (ringStart === '1' && ringEnd === '5') {
                ringType = 'Pyr';
            } else {
                ringType = 'Pyr';
            }

            return {
                anomeric: anomeric,
                stereochemistry: mainStereo.toUpperCase(),
                baseSugar: sugarName,
                sugarName: sugarName,
                baseType: 'HEP',
                ringStart: parseInt(ringStart),
                ringEnd: parseInt(ringEnd),
                ring: ringType,
                modifications: modifications || ''
            };
        }

        return null;
    }

    /**
     * Normalize sugar names with special cases
     */
    normalizeEnhancedSugarName(sugar) {
        
        const normalizations = {
            // Hexose
            'glc': 'glucose',
            'man': 'mannose',
            'gal': 'galactose',
            'gul': 'gulose',
            'alt': 'altrose',
            'all': 'allose',
            'tal': 'talose',
            'ido': 'idose',
            // Deoxyhexose
            'qui': 'quinovose',
            'rha': 'rhamnose',
            'fuc': 'fucose',
            // Pentose
            'ara': 'arabinose',
            'lyx': 'lyxose',
            'xyl': 'xylose',
            'rib': 'ribose',
            // Assigned
            'api': 'apiose',
            'fru': 'fructose',
            'tag': 'tagatose',
            'sor': 'sorbose',
            'psi': 'psicose',
        };
        
        const normalized = normalizations[sugar.toLowerCase()] || sugar.toLowerCase();
        return normalized;
    }

    addNAcetyl(sugarName) {
        const acetylMap = {
            'glucose': 'glcnac',
            'mannose': 'mannac',
            'galactose': 'galnac',
            'gulose': 'gulnac',
            'altrose': 'altnac',
            'allose': 'allnac',
            'talose': 'talnac',
            'idose': 'idonac',
            'mur': 'murnac'  // Muramic acid + N-acetyl = MurNAc
        };

        return acetylMap[sugarName] || sugarName;
    }

    /**
     * Convert base sugar to amino sugar (HexN)
     */
    addAmino(sugarName) {
        const aminoMap = {
            'glucose': 'glucosamine',  // GlcN
            'mannose': 'mannosamine',   // ManN
            'galactose': 'galactosamine', // GalN
            'gulose': 'gulosamine',     // GulN
            'altrose': 'altrosamine',   // AltN
            'allose': 'allosamine',     // AllN
            'talose': 'talosamine',      // TalN
            'idose': 'idosamine'       // IdoN
        };

        return aminoMap[sugarName] || sugarName;
    }

    /**
     * Add n-sulfate modification to sugar name
     * Special case: glucose + n-sulfate = glucosensulfate (GNS)
     */
    addNSulfate(sugarName) {
        const nSulfateMap = {
            'glucose': 'glucosensulfate'  // Special case: GNS
        };
        
        // Only glucose gets transformed to glucosensulfate (GNS)
        // All other sugars keep their original name - the n-sulfate components (NH4, SO4-2) are added separately
        const result = nSulfateMap[sugarName] || sugarName;
        return result;
    }

    /**
     * Enhanced linkage parsing
     */
    parseLinkage(line) {
        
        // Pattern: 1:1d(2+1)2n or 1:1o(4+1)3d
        const match = line.match(/^(\d+):(\d+)([od])\((\d+)\+(\d+)\)(\d+)([nod])$/);
        if (match) {
            const [, linkageId, donorId, donorType, donorPos, acceptorPos, acceptorId, acceptorType] = match;
            
            const linkage = {
                id: parseInt(linkageId),
                donor: {
                    residueId: parseInt(donorId),
                    type: donorType,
                    position: parseInt(donorPos)
                },
                acceptor: {
                    residueId: parseInt(acceptorId), 
                    type: acceptorType,
                    position: parseInt(acceptorPos)
                },
                linkageType: `${acceptorPos}-${donorPos}`
            };
            
            return linkage;
        }
        
        return null;
    }

    parseSubstituent(line) {
        
        const match = line.match(/^(\d+)s:(.+)$/);
        if (match) {
            const [, id, name] = match;
            
            const substituent = {
                id: parseInt(id),
                name: name.toLowerCase(),
                type: 'substituent'
            };
            
            return substituent;
        }
        
        return null;
    }

    /**
     * Detect linkage-based special cases (like GNS: alpha-D-glucose + n-sulfate at C2)
     */
    detectLinkageBasedSpecialCases(parsed) {
        const specialCases = new Map();
        const processedSubstituents = new Set();
        
        // Iterate through all base residues
        parsed.residues.forEach(residue => {
            if (residue.residueType !== 'basetype') return;
            
            
            // Find all substituents linked to this residue
            const linkedSubstituents = this.findLinkedSubstituentsWithPosition(residue.id, parsed.substituents, parsed.linkages);
            
            // Check for GNS special case: alpha-D-glucose + n-sulfate at position 2
            if (residue.sugarName === 'glucose' && 
                residue.stereochemistry === 'D' && 
                residue.anomeric === 'a' && 
                residue.ring === 'Pyr') {
                
                const nSulfateAtC2 = linkedSubstituents.find(sub => 
                    sub.name === 'n-sulfate' && sub.linkPosition === 2
                );
                
                if (nSulfateAtC2) {
                    specialCases.set(residue.id, { type: 'GNS', ccdCode: 'GNS' });
                    processedSubstituents.add(nSulfateAtC2.id);
                }
            }
            
            // TODO: Add other special cases here (e.g., GalNAc, GlcNAc special forms)
            // Example pattern for future expansion:
            // if (residue.sugarName === 'galactose' && other conditions...) {
            //     const acetylAtC2 = linkedSubstituents.find(sub => 
            //         sub.name === 'n-acetyl' && sub.linkPosition === 2
            //     );
            //     if (acetylAtC2) {
            //         specialCases.set(residue.id, { type: 'GalNAc', ccdCode: 'NGA' });
            //         processedSubstituents.add(acetylAtC2.id);
            //     }
            // }
        });
        
        // Mark processed substituents as special cases too (so they get skipped)
        processedSubstituents.forEach(subId => {
            specialCases.set(subId, { type: 'PROCESSED', ccdCode: null });
        });
        
        return specialCases;
    }

    /**
     * Find substituents linked to a specific residue with their link positions
     */
    findLinkedSubstituentsWithPosition(residueId, substituents, linkages) {
        const linked = [];
        
        linkages.forEach(linkage => {
            // Check if this linkage connects our residue to a substituent
            if (linkage.donor.residueId === residueId) {
                const substituent = substituents.find(sub => sub.id === linkage.acceptor.residueId);
                if (substituent) {
                    linked.push({
                        ...substituent,
                        linkPosition: linkage.donor.position,
                        linkageType: linkage.linkageType
                    });
                }
            }
        });
        
        return linked;
    }

    /**
     * Convert parsed GlycoCT to CCD codes and bondedAtomPairs
     */
    async convertToCCDAndBonds(glycoCT, entityId = "G") {
        
        // Wait for mappings to be loaded if they haven't been yet
        if (!this.mappingsLoaded) {
            await this.loadCCDMappings();
            this.mappingsLoaded = true;
        }
        
        
        const parsed = this.parseGlycoCT(glycoCT);
        
        const ccdCodes = [];
        const bondedAtomPairs = [];
        
        // Detect linkage-based special cases (like GNS)
        const specialCases = this.detectLinkageBasedSpecialCases(parsed);
        
        // Process residues to get CCD codes
        parsed.residues.forEach(residue => {
            // Check if this residue is part of a special case
            const specialCase = specialCases.get(residue.id);
            if (specialCase) {
                ccdCodes.push(specialCase.ccdCode);
                return; // Skip normal processing for special cases
            }
            
            
            let effectiveSugarName = residue.sugarName;
            
            // Special handling for sialic acids (NON-based sugars)
            if (residue.baseType === 'NON') {

                // Start with KDN as default for sialic acids
                effectiveSugarName = 'kdn';

                // Find N-substituents linked to this residue
                const linkedSubstituents = this.findLinkedSubstituents(residue.id, parsed.substituents, parsed.linkages);

                // Check each linked substituent
                linkedSubstituents.forEach(sub => {
                    if (sub.name === 'n-acetyl') {
                        effectiveSugarName = 'neu5ac';
                    } else if (sub.name === 'n-glycolyl') {
                        effectiveSugarName = 'neu5gc';
                    }
                });

            } else if (residue.baseType === 'OCT') {
                // Special handling for KDO (OCT-based sugars)
                effectiveSugarName = 'kdo';

            } else if (residue.baseType === 'HEP') {
                // Special handling for heptoses (7-carbon sugars)
                // Already parsed in parseHeptose, use the sugarName directly
                effectiveSugarName = residue.sugarName;

            } else if (residue.modifications && residue.modifications.includes('2:keto')) {
                // Special handling for ketoses (fructose, etc.)
                // Pattern: ara-HEX-2:5|2:keto or ara-HEX-2:6|2:keto
                // arabinose + 2:keto = fructose
                effectiveSugarName = this.classifyKetose(residue);

            } else {
                // Regular sugar - systematic classification
                effectiveSugarName = this.classifyResidue(residue, parsed.substituents, parsed.linkages);
            }
            
            const ccd = this.mapToCCD(effectiveSugarName, residue.stereochemistry, residue.anomeric, residue.ring);
            if (ccd) {
                ccdCodes.push(ccd);
                if (window.app && window.app.addToDebugLog) {
                    window.app.addToDebugLog('SUCCESS', `Residue ${residue.id}: ${effectiveSugarName} → ${ccd}`);
                }
            } else {
                if (window.app && window.app.addToDebugLog) {
                    window.app.addToDebugLog('ERROR', `Residue ${residue.id}: No CCD code for ${effectiveSugarName} (${residue.stereochemistry}-${residue.anomeric}-${residue.ring})`);
                }
            }
        });
        
        // Validate that all residues have CCD codes before processing linkages
        if (ccdCodes.length < parsed.residues.length) {
            const missingCount = parsed.residues.length - ccdCodes.length;
            const errorMsg = `Failed to map ${missingCount} residue(s) to CCD codes. Cannot generate glycan structure.`;
            if (window.app && window.app.addToDebugLog) {
                window.app.addToDebugLog('ERROR', errorMsg);
            }
            throw new Error(`Missing CCD mappings for ${missingCount} residue(s)`);
        }
        
        // Process linkages to create bondedAtomPairs
        
        if (parsed.linkages.length === 0) {
        }
        
        // Only create bonds between base residues (not substituents)
        parsed.linkages.forEach(linkage => {
            
            // Check if this is a linkage between base residues (not to substituents)
            const donorResidue = parsed.residues.find(r => r.id === linkage.donor.residueId);
            const acceptorResidue = parsed.residues.find(r => r.id === linkage.acceptor.residueId);
            
            if (donorResidue && acceptorResidue) {
                // Both are base residues, create bond
                const bond = this.createBondedAtomPair(linkage, parsed.residues, entityId);
                if (bond) {
                    bondedAtomPairs.push(bond);
                }
            } else {
                // One is a substituent, skip bond creation for now
            }
        });
        
        const result = {
            ccdCodes: ccdCodes,
            bondedAtomPairs: bondedAtomPairs,
            parsed: parsed
        };
        
        
        return result;
    }

    /**
     * Systematically classify a residue based on base sugar + substituents + modifications
     * Returns the appropriate sugar name for CCD mapping
     */
    classifyResidue(residue, substituents, linkages) {
        const baseSugar = residue.baseSugar;  // e.g., 'glc', 'gal', 'man'
        const modifications = residue.modifications || '';
        const stereo = residue.stereochemistry;
        const ring = residue.ring;
        const anomeric = residue.anomeric;

        // Get linked substituents with position information
        const linkedSubs = this.findLinkedSubstituentsWithPosition(residue.id, substituents, linkages);

        // Check for amino (N) at position 2
        const hasAmino = linkedSubs.some(sub =>
            (sub.name === 'amino' || sub.name === 'n') && sub.linkPosition === 2
        );

        // Check for N-acetyl at position 2
        const hasNAcetyl = linkedSubs.some(sub =>
            (sub.name === 'n-acetyl' || sub.name === 'nac') && sub.linkPosition === 2
        );

        // Check for N-acetyl at ANY position (for special cases like muramic acid)
        const hasAnyNAcetyl = linkedSubs.some(sub =>
            (sub.name === 'n-acetyl' || sub.name === 'nac')
        );

        // Normalize base sugar name
        const baseSugarNormalized = this.normalizeEnhancedSugarName(baseSugar);

        // Classification priority:
        // 1. Di-deoxyhexose: Two deoxy modifications (e.g., 2:d|6:d, 3:d|6:d) - MUST check FIRST
        // 2. DeoxyhexNAc: 6:d + N-acetyl at C2 (must check BEFORE regular HexNAc)
        // 3. HexNAc (N-acetylhexosamine): Hex + N-acetyl at C2
        // 4. Hexosamine (HexN): Hex + Amino at C2
        // 5. Hexuronate (HexA): Hex + 6:a modification
        // 6. Deoxyhexose: Hex + 6:d modification
        // 7. Pentose: PEN base type
        // 8. Unknown/Assigned: Default hexose

        // Di-deoxyhexose: Two deoxy modifications - check FIRST before other classifications
        // Pattern: ara-HEX-1:5|3:d|6:d → tyvelose (TYV)
        //          xyl-HEX-1:5|3:d|6:d → abequose (ABE)
        //          rib-HEX-1:5|3:d|6:d → paratose (PZU)
        //          rib-HEX-1:5|2:d|6:d → digitose (Z3U)
        //          ara-HEX-1:5|2:d|6:d → olivose
        if (modifications.includes('6:d')) {
            // Check for 3,6-dideoxy
            if (modifications.includes('3:d')) {
                const dideoxy36Map = {
                    'ara': 'tyvelose',   // 3,6-dideoxy-arabinose
                    'xyl': 'abequose',   // 3,6-dideoxy-xylose
                    'rib': 'paratose'    // 3,6-dideoxy-ribose
                };
                if (dideoxy36Map[baseSugar]) {
                    return dideoxy36Map[baseSugar];
                }
            }

            // Check for 2,6-dideoxy
            if (modifications.includes('2:d')) {
                const dideoxy26Map = {
                    'ara': 'olivose',   // 2,6-dideoxy-arabinose
                    'rib': 'digitose'  // 2,6-dideoxy-ribose
                };
                if (dideoxy26Map[baseSugar]) {
                    return dideoxy26Map[baseSugar];
                }
            }
        }

        // DeoxyhexNAc: 6:d modification + N-acetyl at C2
        if (modifications.includes('6:d') && hasNAcetyl) {
            const deoxyhexNAcMap = {
                'gal': 'fucnac',   // 6-deoxy-galactose + N-acetyl = fucosamine-NAc
                'man': 'rhanac',   // 6-deoxy-mannose + N-acetyl = rhamnosamine-NAc
                'glc': 'quinac'    // 6-deoxy-glucose + N-acetyl = quinovosamine-NAc
            };
            if (deoxyhexNAcMap[baseSugar]) {
                return deoxyhexNAcMap[baseSugar];
            }
        }

        // HexNAc: Base sugar + N-acetyl at C2 (no 6:d)
        // Special case: muramic acid can have N-acetyl at ANY position (position 5)
        if (hasNAcetyl || (baseSugar === 'mur' && hasAnyNAcetyl)) {
            return this.addNAcetyl(baseSugarNormalized);
        }

        // Hexosamine: Base sugar + Amino at C2
        if (hasAmino) {
            return this.addAmino(baseSugarNormalized);
        }

        // Hexuronate: Base sugar + 6:a modification (both pyranose and furanose)
        if (modifications.includes('6:a')) {
            // Convert to uronic acid form
            const uronicMap = {
                'glucose': 'glca',
                'mannose': 'mana',
                'galactose': 'gala',
                'gulose': 'gula',
                'altrose': 'alta',
                'allose': 'alla',
                'talose': 'tala',
                'idose': 'idoa'
            };
            return uronicMap[baseSugarNormalized] || baseSugarNormalized;
        }

        // Deoxyhexose: Base sugar + 6:d modification (no N-acetyl)
        // The database handles stereo/anomeric/ring-specific mappings
        if (modifications.includes('6:d')) {
            const deoxyMap = {
                'glc': 'quinovose',
                'man': 'rhamnose',
                'gul': '6dgulose',
                'alt': '6daltrose',
                'tal': '6dtalose',
                'gal': 'fucose'
            };
            if (deoxyMap[baseSugar]) {
                return deoxyMap[baseSugar];
            }
        }

        // Default: return normalized base sugar
        return baseSugarNormalized;
    }

    /**
     * Classify ketose sugars (sugars with 2:keto modification)
     * Pattern: ara-HEX-2:5|2:keto or ara-HEX-2:6|2:keto
     * arabinose + 2:keto = fructose
     */
    classifyKetose(residue) {
        const baseSugar = residue.baseSugar;

        // Map ketose base sugars to their ketose forms
        const ketoseMap = {
            'ara': 'fructose',  // arabinose + 2:keto = fructose
            // Add more ketose mappings as needed
        };

        return ketoseMap[baseSugar] || baseSugar;
    }

    /**
     * Find N-acetyl substituents for a residue
     */
    findNAcetylSubstituents(residueId, substituents, linkages) {
        const nAcetylSubstituents = substituents.filter(sub => 
            sub.name.includes('n-acetyl') || sub.name.includes('nac')
        );
        
        return nAcetylSubstituents.filter(sub => {
            return linkages.some(linkage => 
                (linkage.donor.residueId === residueId && linkage.acceptor.residueId === sub.id) ||
                (linkage.acceptor.residueId === residueId && linkage.donor.residueId === sub.id)
            );
        });
    }

    /**
     * Find amino substituents linked to a specific residue
     */
    findAminoSubstituents(residueId, substituents, linkages) {
        const aminoSubstituents = substituents.filter(sub => 
            sub.name === 'amino' || sub.name.includes('amino')
        );
        
        return aminoSubstituents.filter(sub => {
            return linkages.some(linkage => 
                (linkage.donor.residueId === residueId && linkage.acceptor.residueId === sub.id) ||
                (linkage.acceptor.residueId === residueId && linkage.donor.residueId === sub.id)
            );
        });
    }

    /**
     * Find n-sulfate substituents linked to a specific residue
     */
    findNSulfateSubstituents(residueId, substituents, linkages) {
        const nSulfateSubstituents = substituents.filter(sub => 
            sub.name === 'n-sulfate' || sub.name.includes('nsulfate') || sub.name.includes('ns')
        );
        
        return nSulfateSubstituents.filter(sub => {
            return linkages.some(linkage => 
                (linkage.donor.residueId === residueId && linkage.acceptor.residueId === sub.id) ||
                (linkage.acceptor.residueId === residueId && linkage.donor.residueId === sub.id)
            );
        });
    }

    /**
     * Map sugar to CCD code with enhanced lookup
     */
    mapToCCD(sugarName, stereochemistry, anomeric, ring) {
        
        const key = this.createMappingKey(sugarName, stereochemistry, anomeric, ring);
        
        let mapping = this.ccdMapping.get(key);
        
        if (mapping) {
            // Apply automatic CCD replacements (SIA → SIA-2, SLB → SLB-2, NGC → NGC-2, NGE → NGE-2)
            const replacedCCD = this.applyAutomaticCCDReplacement(mapping.ccd);
            if (replacedCCD !== mapping.ccd) {
                return replacedCCD;
            }
            return mapping.ccd;
        }
        
        // Fallback to simple name lookup
        const simpleKey = sugarName.toLowerCase();
        mapping = this.ccdMapping.get(simpleKey);
        
        if (mapping) {
            // Apply automatic CCD replacements (SIA → SIA-2, SLB → SLB-2, NGC → NGC-2, NGE → NGE-2)
            const replacedCCD = this.applyAutomaticCCDReplacement(mapping.ccd);
            if (replacedCCD !== mapping.ccd) {
                return replacedCCD;
            }
            return mapping.ccd;
        }
        
        // Debug: show all available keys that contain the sugar name
        let found = false;
        for (let [mapKey, mapValue] of this.ccdMapping.entries()) {
            if (mapKey.includes(sugarName.toLowerCase()) || mapValue.sugar === sugarName) {
                found = true;
            }
        }
        if (!found) {
        }
        
        // Comprehensive error reporting when CCD mapping is not found
        
        // Show what's available for this sugar
        let foundAlternatives = false;
        for (let [mapKey, mapValue] of this.ccdMapping.entries()) {
            if (mapKey.includes(sugarName.toLowerCase()) || mapValue.sugar === sugarName) {
                foundAlternatives = true;
            }
        }
        if (!foundAlternatives) {
        }
        
        
        // Send warning to debug log
        if (window.app && window.app.showWarning) {
            const warningMsg = `CCD lookup failed: No mapping found for ${sugarName} (${stereochemistry}-${anomeric}-${ring}). Key: "${key}"`;
            window.app.showWarning(warningMsg);
        }
        
        return null;
    }

    /**
     * Apply automatic CCD replacements for specific sialic acid variants
     * SIA → SIA-2, SLB → SLB-2, NGC → NGC-2, NGE → NGE-2
     */
    applyAutomaticCCDReplacement(ccdCode) {
        const replacements = {
            'SIA': 'SIA-2',
            'SLB': 'SLB-2',
            'NGC': 'NGC-2',
            'NGE': 'NGE-2'
        };
        
        if (replacements[ccdCode]) {
            // Also register the userCCD data for this replacement
            this.registerAutomaticUserCCD(replacements[ccdCode], ccdCode);
            return replacements[ccdCode];
        }
        
        return ccdCode;
    }

    /**
     * Register userCCD data for automatic CCD replacements
     * Adds to both glycanUserCCDs and main userCCDs storage
     */
    async registerAutomaticUserCCD(newCcdCode, originalCcdCode) {
        try {
            // Check if we already have this userCCD registered
            if (window.app && window.app.glycanUserCCDs && window.app.glycanUserCCDs[newCcdCode]) {
                return;
            }
            
            // Use embedded userCCD data instead of fetch
            let userCCDContent = null;
            if (window.embeddedUserCCDData && window.embeddedUserCCDData[newCcdCode]) {
                userCCDContent = window.embeddedUserCCDData[newCcdCode];
            } else {
                return;
            }
            
            // Initialize window.app if not exists
            if (!window.app) {
                window.app = {};
            }
            
            // Register in the global glycanUserCCDs object
            if (!window.app.glycanUserCCDs) {
                window.app.glycanUserCCDs = {};
            }
            
            const userCCDData = {
                userCCD: userCCDContent.replace(/\r\n/g, '\\n').replace(/\r/g, '\\n').replace(/\n/g, '\\n'),
                source: 'automatic',
                originalCCD: originalCcdCode
            };
            
            window.app.glycanUserCCDs[newCcdCode] = userCCDData;
            
            // ALSO register in main userCCDs storage for full integration
            if (!window.app.userCCDs) {
                window.app.userCCDs = {};
            }
            window.app.userCCDs[newCcdCode] = userCCDData;
                
                // Invoke the userCCD tracking system
                if (window.trackUserCCD) {
                    window.trackUserCCD({
                        componentId: newCcdCode,
                        method: 'automatic',
                        source: 'automatic',
                        content: `Auto-loaded ${originalCcdCode} replacement`,
                        timestamp: Date.now()
                    });
                }
                
                
                // userCCD loaded silently
        } catch (error) {
        }
    }

    /**
     * Find all substituents linked to a specific residue (for sialic acids)
     * Based on GlycoCT specification: linkage format is donor:acceptor
     * For N-substituents on sialic acids: 1:1d(5+1)2n means residue 1 position 5 links to residue 2 position 1
     */
    findLinkedSubstituents(residueId, substituents, linkages) {
        
        const linkedSubstituents = [];
        
        // Find linkages where this residue is the donor (NON links to substituent)
        // Format: 1:1d(5+1)2n means residue 1 position 5 → residue 2 position 1 (nitrogen)
        linkages.forEach(linkage => {
            
            if (linkage.donor.residueId === residueId) {
                // Find the acceptor substituent (check if acceptor ID matches any substituent)
                const substituent = substituents.find(sub => sub.id === linkage.acceptor.residueId);
                if (substituent) {
                    linkedSubstituents.push(substituent);
                } else {
                }
            }
        });
        
        return linkedSubstituents;
    }

    /**
     * Create bondedAtomPair from linkage information
     * Format: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
     */
    createBondedAtomPair(linkage, residues, entityId = "G") {
        // Find the residues involved in this linkage
        const donorResidue = residues.find(r => r.id === linkage.donor.residueId);
        const acceptorResidue = residues.find(r => r.id === linkage.acceptor.residueId);
        
        if (!donorResidue || !acceptorResidue) {
            return null;
        }
        
        // Create bondedAtomPair in correct AlphaFold3 format
        // GlycoCT linkage: donor_position connects to acceptor_position
        // This means: O[donor_position] of donor connects to C[acceptor_position] of acceptor
        const bond = [
            [entityId, linkage.donor.residueId, `O${linkage.donor.position}`],
            [entityId, linkage.acceptor.residueId, `C${linkage.acceptor.position}`]
        ];
        
        return bond;
    }

    /**
     * Get standard atom name for linkage position
     * In GlycoCT: donor_position connects to acceptor_position
     * Bond is from donor_carbon to acceptor_oxygen, then acceptor_oxygen to acceptor_carbon
     */
    getLinkageAtomName(position, isDonor) {
        if (isDonor) {
            // Donor atom is typically the carbon at the donor position
            return `C${position}`;
        } else {
            // Acceptor atom is the oxygen at the acceptor position  
            return `O${position}`;
        }
    }
}

// Global instance and helper function
window.enhancedGlycoCTParser = new EnhancedGlycoCTParser();

/**
 * Enhanced conversion function for GlycoCT to ligand with bondedAtomPairs
 */
async function convertGlycoCTToEnhancedLigand(glycoCT, entityId = "G") {

    // Final validation check before processing
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoCT);
        if (!validation.valid) {
            throw new Error(`Invalid GlycoCT structure: ${validation.error}`);
        }
    }

    try {
        const result = await window.enhancedGlycoCTParser.convertToCCDAndBonds(glycoCT, entityId);
        
        const ligand = {
            ligand: {
                id: entityId,
                ccdCodes: result.ccdCodes
            }
        };
        
        return {
            ligand: ligand,
            bondedAtomPairs: result.bondedAtomPairs,
            parsed: result.parsed
        };
        
    } catch (error) {
        throw error;
    }
}

// Make the conversion function globally accessible
window.convertGlycoCTToEnhancedLigand = convertGlycoCTToEnhancedLigand;
