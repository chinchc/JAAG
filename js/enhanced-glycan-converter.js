// Enhanced Glycan Converter with comprehensive CCD mapping from user's library

class EnhancedGlycanConverter {
    constructor() {
        this.ccdMapping = new Map();
        this.loadCCDMappings();
    }

    loadCCDMappings() {
        // Use embedded mappings directly
        this.loadFallbackMappings();
    }

    parseCCDMapping(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        // Expected columns: Class,Monosaccharide,Dor L,alpha OR beta,Pyr OR Fur,CCD
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 6) {
                const [class_, monosaccharide, dorL, anomeric, ring, ccd] = values;
                
                // Skip entries with no CCD code
                if (!ccd || ccd.toLowerCase() === 'none') continue;
                
                // Create lookup key
                const sugarName = this.extractSugarName(monosaccharide);
                const key = this.createMappingKey(sugarName, dorL, anomeric, ring);
                
                this.ccdMapping.set(key, {
                    ccd: ccd,
                    class: class_,
                    monosaccharide: monosaccharide,
                    stereochemistry: dorL,
                    anomeric: anomeric,
                    ring: ring
                });
                

                // Also create simplified keys for common lookups
                const simpleKey = sugarName.toLowerCase();
                if (!this.ccdMapping.has(simpleKey)) {
                    this.ccdMapping.set(simpleKey, {
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

    parseCSVLine(line) {
        // Simple CSV parser that handles quoted fields
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

    extractSugarName(monosaccharide) {
        // Extract sugar name from "Sugar (Abbrev)" format
        const match = monosaccharide.match(/^([^(]+)/);
        const extracted = match ? match[1].trim() : monosaccharide;
        return extracted;
    }

    createMappingKey(sugar, dorL, anomeric, ring) {
        const key = `${sugar.toLowerCase()}_${dorL.toLowerCase()}_${anomeric.toLowerCase()}_${ring.toLowerCase()}`.replace(/\s/g, '');
        return key;
    }

    loadFallbackMappings() {
        // Comprehensive fallback mappings based on CCD.csv file
        const fallback = [
            // Glucose (Glc) - Hexose
            ['glucose', 'D', 'alpha', 'Pyr', 'GLC'],
            ['glucose', 'D', 'beta', 'Pyr', 'BGC'],
            ['glucose', 'L', 'beta', 'Pyr', 'Z8T'],
            ['glucose', 'L', 'beta', 'Fur', 'A1AIO'],
            
            // Mannose (Man) - Hexose  
            ['mannose', 'D', 'alpha', 'Pyr', 'MAN'],
            ['mannose', 'D', 'beta', 'Pyr', 'BMA'],
            
            // Galactose (Gal) - Hexose
            ['galactose', 'D', 'alpha', 'Pyr', 'GLA'],
            ['galactose', 'D', 'beta', 'Pyr', 'GAL'],
            ['galactose', 'D', 'beta', 'Fur', 'GLZ'],
            ['galactose', 'L', 'alpha', 'Pyr', 'GXL'],
            ['galactose', 'L', 'beta', 'Pyr', 'GIV'],
            
            // Fucose (Fuc) - DeoxyHexose
            ['fucose', 'D', 'alpha', 'Pyr', 'FCA'],
            ['fucose', 'D', 'beta', 'Pyr', 'FCB'],
            ['fucose', 'D', 'beta', 'Fur', 'GYE'],
            ['fucose', 'L', 'alpha', 'Pyr', 'FUC'],
            ['fucose', 'L', 'beta', 'Pyr', 'FUL'],
            
            // Xylose (Xyl) - Pentose (CORRECTED)
            ['xylose', 'D', 'alpha', 'Pyr', 'XYS'],
            ['xylose', 'D', 'beta', 'Pyr', 'XYP'],
            ['xylose', 'D', 'beta', 'Fur', 'XYZ'],
            ['xylose', 'L', 'alpha', 'Pyr', 'HSY'],
            ['xylose', 'L', 'beta', 'Pyr', 'LXC'],
            
            // GlcNAc - HexNAc
            ['GlcNAc', 'D', 'alpha', 'Pyr', 'NDG'],
            ['GlcNAc', 'D', 'beta', 'Pyr', 'NAG'],
            
            // GalNAc - HexNAc  
            ['GalNAc', 'D', 'alpha', 'Pyr', 'A2G'],
            ['GalNAc', 'D', 'beta', 'Pyr', 'NGA'],
            ['GalNAc', 'L', 'alpha', 'Pyr', 'YYQ'],
            
            // Sialic acid - N-acetylneuraminic acid (Neu5Ac) (CORRECTED)
            ['sialic', 'D', 'alpha', 'Pyr', 'SIA'],
            ['sialic', 'D', 'beta', 'Pyr', 'SLB'],
            ['Neu5Ac', 'D', 'alpha', 'Pyr', 'SIA'],
            ['Neu5Ac', 'D', 'beta', 'Pyr', 'SLB'],
            ['N-acetylneuraminic acid', 'D', 'alpha', 'Pyr', 'SIA'],
            ['N-acetylneuraminic acid', 'D', 'beta', 'Pyr', 'SLB'],
            
            // Legacy glucosamine/galactosamine entries for compatibility
            ['glucosamine', 'D', 'beta', 'Pyr', 'NAG'],
            ['galactosamine', 'D', 'beta', 'Pyr', 'A2G']
        ];

        for (const [sugar, dorL, anomeric, ring, ccd] of fallback) {
            const key = this.createMappingKey(sugar, dorL, anomeric, ring);
            this.ccdMapping.set(key, { ccd, stereochemistry: dorL, anomeric, ring });
            
            // Only set simple key for the first occurrence (usually alpha)
            const simpleKey = sugar.toLowerCase();
            if (!this.ccdMapping.has(simpleKey)) {
                this.ccdMapping.set(simpleKey, { ccd, stereochemistry: dorL, anomeric, ring });
            }
        }
    }

    /**
     * Convert GlycoCT format to CCD codes and bonded atom pairs
     * Enhanced version using comprehensive mapping
     */
    convertGlycoCTToCCD(glycoCT) {
        try {
            const parsed = this.parseGlycoCT(glycoCT);
            const ccdCodes = [];
            const bondedAtomPairs = [];
            
            
            // Convert only base residues to CCD codes, incorporating substituent information
            const baseResidues = parsed.residues.filter(r => r.type === 'base' || !r.type || r.residueType === 'b');
            
            
            for (const residue of baseResidues) {
                
                // Check if this residue has N-acetyl modification by looking at linkages
                const hasNAcetyl = this.hasNAcetylSubstituent(residue, parsed);
                
                // Create a modified residue for mapping if it has N-acetyl
                let mappingResidue = { ...residue };
                if (hasNAcetyl && (residue.sugarName === 'glucose' || residue.sugarName === 'galactose')) {
                    mappingResidue.sugarName = residue.sugarName === 'glucose' ? 'GlcNAc' : 'GalNAc';
                    mappingResidue.hasNAcetyl = true;
                }
                
                const ccdCode = this.mapResidueToCCD(mappingResidue);
                if (ccdCode && ccdCode !== 'none') {
                    ccdCodes.push(ccdCode);
                }
            }
            
            // Convert linkages to bonded atom pairs
            for (const linkage of parsed.linkages) {
                const bondPair = this.createBondedAtomPair(linkage, parsed.residues);
                if (bondPair) {
                    bondedAtomPairs.push(bondPair);
                }
            }
            
            return {
                ccdCodes: ccdCodes,
                bondedAtomPairs: bondedAtomPairs
            };
            
        } catch (error) {
            return {
                ccdCodes: ['UNK'],
                bondedAtomPairs: []
            };
        }
    }

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
                    // Check if this is a substituent (s:) or base residue (b:)
                    if (trimmed.match(/^\d+s:/)) {
                        // This is a substituent in the RES section
                        const substituent = this.parseSubstituent(trimmed);
                        if (substituent) substituents.push(substituent);
                    } else {
                        // This is a base residue
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

    parseResidue(line) {
        // Enhanced residue parsing
        // Example: 1b:b-dglc-HEX-1:5
        const match = line.match(/^(\d+)([bs]):(.+)$/);
        if (!match) {
            return null;
        }
        
        const [, id, type, description] = match;
        
        // Mark the residue type for filtering later
        const residueType = type; // 'b' for base, 's' for substituent
        
        // Parse the description for more details
        const parts = description.split('-');
        let sugarName = 'unknown';
        let stereochemistry = 'D';
        let anomeric = 'beta';
        
        // Extract sugar information from description
        if (parts.length >= 2) {
            // Handle complex sugar names like 'gro-dgal' in sialic acid (Neu5Ac)
            if (parts.length >= 3 && parts[1] === 'dgro' && parts[2] === 'dgal') {
                // This is sialic acid: a-dgro-dgal-NON-2:6
                stereochemistry = 'D'; // Neuraminic acid is D-form
                sugarName = 'gro-dgal';  // Keep the compound name
            } else {
                // Standard sugar format: a-dglc-HEX-1:5
                const sugarPart = parts[1]; // e.g., 'dglc'
                stereochemistry = sugarPart.charAt(0).toUpperCase(); // 'd' or 'l'
                sugarName = sugarPart.substring(1); // 'glc'
            }
            
            // Map common abbreviations
            const nameMap = {
                'glc': 'glucose',
                'gal': 'galactose',
                'man': 'mannose',
                'fuc': 'fucose',
                'xyl': 'xylose',
                'neu': 'sialic',
                'neu5ac': 'sialic',  // Map neu5ac code to sialic
                'neuraminic': 'sialic',
                'n-acetylneuraminic': 'sialic',
                'glcn': 'glucosamine',
                'galn': 'galactosamine',
                'glcnac': 'GlcNAc',  // Map glcnac code to GlcNAc
                'gro-dgal': 'sialic',  // Map correct sialic code to sialic
                'gro-gal-non': 'sialic'  // Legacy support
            };
            const originalSugar = sugarName;
            sugarName = nameMap[sugarName] || sugarName;
        }
        
        // Determine anomeric configuration from first part  
        if (parts[0]) {
            // After splitting by '-', parts[0] will be just 'a' or 'b'
            if (parts[0] === 'a') {
                anomeric = 'alpha';
            } else if (parts[0] === 'b') {
                anomeric = 'beta';
            } else {
                // Fallback to 'b' in the line identifier (e.g., "1b:")
                anomeric = 'beta'; // Default
            }
        }
        
        // Extract ring form from the last part (e.g., "1:5" for pyranose, "1:4" for furanose)
        let ring = 'Pyr'; // Default to pyranose
        if (parts.length >= 4) {
            const ringPart = parts[3]; // e.g., "1:5"
            if (ringPart === '1:4') {
                ring = 'Fur'; // Furanose
            } else if (ringPart === '1:5') {
                ring = 'Pyr'; // Pyranose
            } else {
            }
        }
        
        
        return {
            id: parseInt(id),
            type: type,
            residueType: residueType, // 'b' for base, 's' for substituent  
            sugarName: sugarName,
            stereochemistry: stereochemistry,
            anomeric: anomeric,
            ring: ring,
            description: description,
            originalLine: line
        };
    }

    parseLinkage(line) {
        // Example: 1:1o(4+1)2d or 1:1d(2+1)2n (for N-acetyl linkages)
        const match = line.match(/^(\d+):(\d+)([don])\((\d+)\+(\d+)\)(\d+)([don]?)$/);
        if (!match) {
            return null;
        }
        
        const [, linkId, donorRes, donorAnomer, donorPos, acceptorPos, acceptorRes, acceptorAnomer] = match;
        
        return {
            id: parseInt(linkId),
            donor: {
                residueId: parseInt(donorRes),
                position: parseInt(donorPos),
                anomer: donorAnomer
            },
            acceptor: {
                residueId: parseInt(acceptorRes),
                position: parseInt(acceptorPos),
                anomer: acceptorAnomer
            },
            linkageType: `${donorPos}-${acceptorPos}`
        };
    }

    parseSubstituent(line) {
        // Example: 1s:n-acetyl
        const match = line.match(/^(\d+)s:(.+)$/);
        if (!match) return null;
        
        const [, id, name] = match;
        return {
            id: parseInt(id),
            name: name,
            type: 'substituent'
        };
    }

    hasNAcetylSubstituent(baseResidue, parsed) {
        
        // Look for N-acetyl substituents in the substituents array
        const nAcetylSubstituents = parsed.substituents.filter(sub => sub.name === 'n-acetyl');
        
        // Check linkages to see if any N-acetyl is linked to this base residue
        for (const linkage of parsed.linkages) {
            
            // Look for linkages where the donor is our base residue and acceptor is N-acetyl
            if (linkage.donor && linkage.donor.residueId === baseResidue.id) {
                const acceptorId = linkage.acceptor.residueId;
                const linkedSubstituent = nAcetylSubstituents.find(sub => sub.id === acceptorId);
                
                if (linkedSubstituent) {
                    return true;
                }
            }
        }
        
        return false;
    }

    mapResidueToCCD(residue) {
        
        // Check if this is a base sugar with N-acetyl substituent (GlcNAc/GalNAc)
        let effectiveSugarName = residue.sugarName;
        if (residue.hasNAcetyl) {
            // Convert glucose + N-acetyl → GlcNAc, galactose + N-acetyl → GalNAc
            if (residue.sugarName === 'glucose') {
                effectiveSugarName = 'GlcNAc';
            } else if (residue.sugarName === 'galactose') {
                effectiveSugarName = 'GalNAc';
            }
        }
        
        // Try comprehensive mapping first
        const key = this.createMappingKey(
            effectiveSugarName, 
            residue.stereochemistry, 
            residue.anomeric, 
            residue.ring
        );
        
        let mapping = this.ccdMapping.get(key);
        
        // Debug: Show all available keys that contain the sugar name
        if (!mapping) {
            const relatedKeys = Array.from(this.ccdMapping.keys())
                .filter(k => k.includes(residue.sugarName.toLowerCase()))
                .slice(0, 10);
            
            relatedKeys.forEach(relatedKey => {
                const relatedMapping = this.ccdMapping.get(relatedKey);
            });
        }
        
        // Debug: Check if we're looking for the right sugar name
        if (effectiveSugarName.toLowerCase() === 'glcnac' || residue.sugarName === 'glucosamine') {
            
            // Show matching entries
            const matchingEntries = Array.from(this.ccdMapping.entries())
                .filter(([k, v]) => k.toLowerCase().includes('glcnac') || v.monosaccharide?.includes('GlcNAc') || v.ccd === 'NDG' || v.ccd === 'NAG')
                .slice(0, 15);
            
            matchingEntries.forEach(([k, v]) => {
            });
        }
        
        // Try simplified lookup if exact match not found
        if (!mapping) {
            const simpleKey = residue.sugarName.toLowerCase();
            mapping = this.ccdMapping.get(simpleKey);
        }
        
        // Try even more variations
        if (!mapping) {
            const variations = [
                residue.sugarName.toLowerCase(),
                residue.sugarName.substring(0, 3).toLowerCase(),
                this.getCommonAbbreviation(residue.sugarName)
            ];
            
            for (const variant of variations) {
                mapping = this.ccdMapping.get(variant);
                if (mapping) {
                    break;
                }
            }
        }
        
        // Debug: Show a few sample keys from mapping
        if (!mapping && this.ccdMapping.size > 0) {
            //     Array.from(this.ccdMapping.keys()).slice(0, 10));
        }
        
        if (mapping) {
            return mapping.ccd;
        }
        
        return 'UNK';
    }

    getCommonAbbreviation(sugarName) {
        const abbrevMap = {
            'glucose': 'glc',
            'galactose': 'gal',
            'mannose': 'man',
            'fucose': 'fuc',
            'xylose': 'xyl',
            'glucosamine': 'glcnac',
            'galactosamine': 'galnac',
            'sialic': 'neu5ac'
        };
        return abbrevMap[sugarName.toLowerCase()] || sugarName.substring(0, 3);
    }

    isSubstituentLinkedToResidue(substituent, residue, parsed) {
        // For now, assume N-acetyl substituents are linked to residues in order
        // In a full implementation, this would check LIN section for substituent linkages
        return true; // Simplified assumption
    }

    createBondedAtomPair(linkage, residues) {
        const donorResidue = residues.find(r => r.id === linkage.donor.residueId);
        const acceptorResidue = residues.find(r => r.id === linkage.acceptor.residueId);
        
        if (!donorResidue || !acceptorResidue) return null;
        
        return {
            atom1: {
                chainId: 'G', // Glycan chain
                residueIndex: linkage.donor.residueId - 1,
                atomName: `C${linkage.donor.position}`
            },
            atom2: {
                chainId: 'G',
                residueIndex: linkage.acceptor.residueId - 1,
                atomName: `O${linkage.acceptor.position}`
            }
        };
    }

    /**
     * Convert GlycoCT to a ligand entry for AlphaFold3 JSON
     */
    convertGlycoCTToLigand(glycoCT) {
        const converted = this.convertGlycoCTToCCD(glycoCT);
        
        return {
            ligand: {
                id: 'G',
                ccdCodes: converted.ccdCodes
            }
        };
    }

    /**
     * Get human-readable description of converted glycan
     */
    describeGlycan(glycoCT) {
        try {
            const parsed = this.parseGlycoCT(glycoCT);
            const converted = this.convertGlycoCTToCCD(glycoCT);
            
            const description = `Glycan with ${parsed.residues.length} residue(s): ${converted.ccdCodes.join(', ')}. ${parsed.linkages.length} linkage(s).`;
            return description;
        } catch (error) {
            return 'Unknown glycan structure';
        }
    }
}

// Initialize the enhanced converter
let enhancedGlycanConverter = null;

// Override the global conversion functions
window.convertGlycoCTToCCD = function(glycoCT) {
    if (!enhancedGlycanConverter) {
        // Use the original function as fallback
        return window.originalConvertGlycoCTToCCD ? window.originalConvertGlycoCTToCCD(glycoCT) : {ccdCodes: ['UNK'], bondedAtomPairs: []};
    }
    return enhancedGlycanConverter.convertGlycoCTToCCD(glycoCT);
};

window.convertGlycoCTToLigand = function(glycoCT) {
    
    if (!window.enhancedGlycoCTParser) {
        return { ligand: { id: 'G', ccdCodes: ['UNK'] } };
    }
    
    const result = convertGlycoCTToEnhancedLigand(glycoCT, "G");
    
    // Log successful conversion to debug panel
    if (window.app && window.app.addToDebugLog && result.ligand) {
        const ccdCount = result.ligand.ligand?.ccdCodes?.length || 0;
        const bondCount = result.bondedAtomPairs?.length || 0;
        window.app.addToDebugLog('SUCCESS', `Glycan conversion completed: ${ccdCount} CCD codes, ${bondCount} bonds`);
    }
    
    // Return in old format for compatibility
    return result.ligand;
};

window.describeGlycan = function(glycoCT) {
    if (!enhancedGlycanConverter) {
        return 'Enhanced converter loading...';
    }
    return enhancedGlycanConverter.describeGlycan(glycoCT);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        enhancedGlycanConverter = new EnhancedGlycanConverter();
        window.enhancedGlycanConverter = enhancedGlycanConverter; // Make it globally accessible
    }, 1000);
});
