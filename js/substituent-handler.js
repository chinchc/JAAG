/**
 * GlycoCT Substituent Handler
 * Handles sulfate, phosphate, acetyl, and methyl substituents in glycan structures
 */


// Substituent definitions with their CCD codes and bonding atoms
const SUBSTITUENTS = {
    'sulfate': {
        ccdCode: 'SO4-2',
        bondingAtom: 'S',
        userCCDFile: 'SO4-2.txt',
        glycoctSymbol: 's',
        needsUserCCD: true
    },
    'phosphate': {
        ccdCode: 'PO4-2', 
        bondingAtom: 'P',
        userCCDFile: 'PO4-2.txt',
        glycoctSymbol: 'p',
        needsUserCCD: true
    },
    'acetyl': {
        ccdCode: 'ACE',
        bondingAtom: 'C',
        userCCDFile: null,
        glycoctSymbol: 'ac',
        needsUserCCD: false
    },
    'methyl': {
        ccdCode: '74C',
        bondingAtom: 'C', 
        userCCDFile: null,
        glycoctSymbol: 'me',
        needsUserCCD: false
    },
    'n-sulfate': {
        ccdCodes: ['NH4', 'SO4-2'], // Two components
        bondingAtoms: ['N', 'S'],   // NH4 bonds via N, SO4-2 bonds via S
        userCCDFiles: ['NH4.txt', 'SO4-2.txt'],
        glycoctSymbol: 'ns',
        needsUserCCD: true,
        specialBond: { from: 'N', to: 'S', fromComponent: 'NH4', toComponent: 'SO4-2' } // N-S bond between components
    }
};

// Store userCCD data for substituents that need it (embedded to avoid CORS issues)
const SUBSTITUENT_USERCCD_DATA = {
    'NH4': `data_NH4\n#\n_chem_comp.id NH4\n_chem_comp.name 'AMMONIUM ION'\n_chem_comp.type NON-POLYMER\n_chem_comp.pdbx_type HETAI\n_chem_comp.formula 'H4 N'\n_chem_comp.mon_nstd_parent_comp_id ?\n_chem_comp.pdbx_synonyms ?\n_chem_comp.pdbx_formal_charge 1\n_chem_comp.pdbx_initial_date 1999-07-08\n_chem_comp.pdbx_modified_date 2011-06-04\n_chem_comp.pdbx_ambiguous_flag N\n_chem_comp.pdbx_release_status REL\n_chem_comp.pdbx_replaced_by ?\n_chem_comp.pdbx_replaces ?\n_chem_comp.formula_weight 18.038\n_chem_comp.one_letter_code ?\n_chem_comp.three_letter_code NH4\n_chem_comp.pdbx_model_coordinates_details ?\n_chem_comp.pdbx_model_coordinates_missing_flag N\n_chem_comp.pdbx_ideal_coordinates_details ?\n_chem_comp.pdbx_ideal_coordinates_missing_flag N\n_chem_comp.pdbx_model_coordinates_db_code 1EHB\n_chem_comp.pdbx_subcomponent_list ?\n_chem_comp.pdbx_processing_site RCSB\n#\nloop_\n_chem_comp_atom.comp_id\n_chem_comp_atom.atom_id\n_chem_comp_atom.alt_atom_id\n_chem_comp_atom.type_symbol\n_chem_comp_atom.charge\n_chem_comp_atom.pdbx_align\n_chem_comp_atom.pdbx_aromatic_flag\n_chem_comp_atom.pdbx_leaving_atom_flag\n_chem_comp_atom.pdbx_stereo_config\n_chem_comp_atom.pdbx_backbone_atom_flag\n_chem_comp_atom.pdbx_n_terminal_atom_flag\n_chem_comp_atom.pdbx_c_terminal_atom_flag\n_chem_comp_atom.model_Cartn_x\n_chem_comp_atom.model_Cartn_y\n_chem_comp_atom.model_Cartn_z\n_chem_comp_atom.pdbx_model_Cartn_x_ideal\n_chem_comp_atom.pdbx_model_Cartn_y_ideal\n_chem_comp_atom.pdbx_model_Cartn_z_ideal\n_chem_comp_atom.pdbx_component_atom_id\n_chem_comp_atom.pdbx_component_comp_id\n_chem_comp_atom.pdbx_ordinal\nNH4 N N N 1 1 N N N N N N 25.326 -15.017 -26.848 0.000 0.000 0.000 N NH4 1\nNH4 H1 H1 H 0 1 N N N N N N 25.861 -15.875 -26.848 0.943 0.000 0.333 H1 NH4 2\nNH4 H2 H2 H 0 1 N N N N N N 24.791 -14.159 -26.848 -0.471 0.817 0.333 H2 NH4 3\nNH4 H3 H3 H 0 1 N N N N N N 26.122 -14.159 -26.848 -0.471 -0.817 0.333 H3 NH4 4\nNH4 H4 H4 H 0 1 N N N N N N 24.530 -15.875 -26.848 -0.471 0.000 -0.999 H4 NH4 5\n#\nloop_\n_chem_comp_bond.comp_id\n_chem_comp_bond.atom_id_1\n_chem_comp_bond.atom_id_2\n_chem_comp_bond.value_order\n_chem_comp_bond.pdbx_aromatic_flag\n_chem_comp_bond.pdbx_stereo_config\n_chem_comp_bond.pdbx_ordinal\nNH4 N H1 SING N N 1\nNH4 N H2 SING N N 2\nNH4 N H3 SING N N 3\nNH4 N H4 SING N N 4`,
    
    'SO4-2': `data_SO4-2\n#\n_chem_comp.id SO4\n_chem_comp.name 'SULFATE ION'\n_chem_comp.type NON-POLYMER\n_chem_comp.pdbx_type HETAI\n_chem_comp.formula 'O4 S'\n_chem_comp.mon_nstd_parent_comp_id ?\n_chem_comp.pdbx_synonyms ?\n_chem_comp.pdbx_formal_charge -2\n_chem_comp.pdbx_initial_date 1999-07-08\n_chem_comp.pdbx_modified_date 2011-06-04\n_chem_comp.pdbx_ambiguous_flag N\n_chem_comp.pdbx_release_status REL\n_chem_comp.pdbx_replaced_by ?\n_chem_comp.pdbx_replaces SUL\n_chem_comp.formula_weight 96.063\n_chem_comp.one_letter_code ?\n_chem_comp.three_letter_code SO4\n_chem_comp.pdbx_model_coordinates_details ?\n_chem_comp.pdbx_model_coordinates_missing_flag N\n_chem_comp.pdbx_ideal_coordinates_details ?\n_chem_comp.pdbx_ideal_coordinates_missing_flag N\n_chem_comp.pdbx_model_coordinates_db_code 1BXO\n_chem_comp.pdbx_subcomponent_list ?\n_chem_comp.pdbx_processing_site RCSB\n#\nloop_\n_chem_comp_atom.comp_id\n_chem_comp_atom.atom_id\n_chem_comp_atom.alt_atom_id\n_chem_comp_atom.type_symbol\n_chem_comp_atom.charge\n_chem_comp_atom.pdbx_align\n_chem_comp_atom.pdbx_aromatic_flag\n_chem_comp_atom.pdbx_leaving_atom_flag\n_chem_comp_atom.pdbx_stereo_config\n_chem_comp_atom.pdbx_backbone_atom_flag\n_chem_comp_atom.pdbx_n_terminal_atom_flag\n_chem_comp_atom.pdbx_c_terminal_atom_flag\n_chem_comp_atom.model_Cartn_x\n_chem_comp_atom.model_Cartn_y\n_chem_comp_atom.model_Cartn_z\n_chem_comp_atom.pdbx_model_Cartn_x_ideal\n_chem_comp_atom.pdbx_model_Cartn_y_ideal\n_chem_comp_atom.pdbx_model_Cartn_z_ideal\n_chem_comp_atom.pdbx_component_atom_id\n_chem_comp_atom.pdbx_component_comp_id\n_chem_comp_atom.pdbx_ordinal\nSO4 S S S 0 1 N N N N N N 16.485 34.924 5.575 0.000 0.000 0.000 S SO4 1\nSO4 O1 O1 O 0 1 N N N N N N 17.741 34.891 4.826 0.000 -1.201 -0.850 O1 SO4 2\nSO4 O3 O3 O -1 1 N N N N N N 15.440 35.551 4.401 -1.201 0.000 0.850 O3 SO4 4\nSO4 O4 O4 O -1 1 N N N N N N 16.141 33.720 5.930 1.201 0.000 0.850 O4 SO4 5\n#\nloop_\n_chem_comp_bond.comp_id\n_chem_comp_bond.atom_id_1\n_chem_comp_bond.atom_id_2\n_chem_comp_bond.value_order\n_chem_comp_bond.pdbx_aromatic_flag\n_chem_comp_bond.pdbx_stereo_config\n_chem_comp_bond.pdbx_ordinal\nSO4 S O1 DOUB N N 1\nSO4 S O3 SING N N 3\nSO4 S O4 SING N N 4`,
    
    'PO4-2': `data_PO4-2\n#\n_chem_comp.id PO4\n_chem_comp.name 'PHOSPHATE ION'\n_chem_comp.type NON-POLYMER\n_chem_comp.pdbx_type HETAI\n_chem_comp.formula 'O4 P'\n_chem_comp.mon_nstd_parent_comp_id ?\n_chem_comp.pdbx_synonyms ?\n_chem_comp.pdbx_formal_charge -3\n_chem_comp.pdbx_initial_date 1999-07-08\n_chem_comp.pdbx_modified_date 2011-06-04\n_chem_comp.pdbx_ambiguous_flag N\n_chem_comp.pdbx_release_status REL\n_chem_comp.pdbx_replaced_by ?\n_chem_comp.pdbx_replaces IPS\n_chem_comp.formula_weight 94.971\n_chem_comp.one_letter_code ?\n_chem_comp.three_letter_code PO4\n_chem_comp.pdbx_model_coordinates_details ?\n_chem_comp.pdbx_model_coordinates_missing_flag N\n_chem_comp.pdbx_ideal_coordinates_details ?\n_chem_comp.pdbx_ideal_coordinates_missing_flag N\n_chem_comp.pdbx_model_coordinates_db_code 1IXG\n_chem_comp.pdbx_subcomponent_list ?\n_chem_comp.pdbx_processing_site EBI\n#\nloop_\n_chem_comp_atom.comp_id\n_chem_comp_atom.atom_id\n_chem_comp_atom.alt_atom_id\n_chem_comp_atom.type_symbol\n_chem_comp_atom.charge\n_chem_comp_atom.pdbx_align\n_chem_comp_atom.pdbx_aromatic_flag\n_chem_comp_atom.pdbx_leaving_atom_flag\n_chem_comp_atom.pdbx_stereo_config\n_chem_comp_atom.pdbx_backbone_atom_flag\n_chem_comp_atom.pdbx_n_terminal_atom_flag\n_chem_comp_atom.pdbx_c_terminal_atom_flag\n_chem_comp_atom.model_Cartn_x\n_chem_comp_atom.model_Cartn_y\n_chem_comp_atom.model_Cartn_z\n_chem_comp_atom.pdbx_model_Cartn_x_ideal\n_chem_comp_atom.pdbx_model_Cartn_y_ideal\n_chem_comp_atom.pdbx_model_Cartn_z_ideal\n_chem_comp_atom.pdbx_component_atom_id\n_chem_comp_atom.pdbx_component_comp_id\n_chem_comp_atom.pdbx_ordinal\nPO4 P P P 0 1 N N N N N N 29.995 23.516 13.249 0.000 0.000 0.000 P PO4 1\nPO4 O1 O1 O 0 1 N N N N N N 31.092 22.988 14.164 0.000 -1.288 -0.911 O1 PO4 2\nPO4 O3 O3 O -1 1 N N N N N N 29.646 22.518 12.126 -1.288 0.000 0.911 O3 PO4 4\nPO4 O4 O4 O -1 1 N N N N N N 28.727 23.744 14.161 1.288 0.000 0.911 O4 PO4 5\n#\nloop_\n_chem_comp_bond.comp_id\n_chem_comp_bond.atom_id_1\n_chem_comp_bond.atom_id_2\n_chem_comp_bond.value_order\n_chem_comp_bond.pdbx_aromatic_flag\n_chem_comp_bond.pdbx_stereo_config\n_chem_comp_bond.pdbx_ordinal\nPO4 P O1 DOUB N N 1\nPO4 P O3 SING N N 3\nPO4 P O4 SING N N 4`
};

class SubstituentHandler {
    constructor() {
        this.loadSubstituentUserCCDs();
    }

    /**
     * Load userCCD data for substituents that need it
     */
    async loadSubstituentUserCCDs() {
        // UserCCD data is now embedded in the SUBSTITUENT_USERCCD_DATA constant
        // to avoid CORS issues when loading from file:// URLs
    }

    /**
     * Parse GlycoCT string to detect substituents
     * @param {string} glycoctString - The GlycoCT string to parse
     * @returns {Object} - Detected substituents and their positions
     */
    parseSubstituents(glycoctString) {
        
        const substituents = [];
        const lines = glycoctString.split('\n');
        
        let resSection = [];
        let linSection = [];
        let currentSection = null;
        
        // Parse the GlycoCT sections
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === 'RES') {
                currentSection = 'RES';
                continue;
            } else if (trimmedLine === 'LIN') {
                currentSection = 'LIN'; 
                continue;
            } else if (trimmedLine === 'REP' || trimmedLine === 'ALT') {
                currentSection = null;
                continue;
            }
            
            if (currentSection === 'RES' && trimmedLine) {
                resSection.push(trimmedLine);
            } else if (currentSection === 'LIN' && trimmedLine) {
                linSection.push(trimmedLine);
            }
        }
        
        
        // Parse RES section to find substituents
        for (let i = 0; i < resSection.length; i++) {
            const resLine = resSection[i];
            const match = resLine.match(/^(\d+)(s):(.+)$/);
            
            if (match) {
                const [, resNum, type, substituentName] = match;
                
                // Check if it's a known substituent
                const substituent = this.identifySubstituent(substituentName);
                if (substituent) {
                    // Handle multi-component substituents like n-sulfate
                    if (substituent.isMultiComponent && substituent.ccdCodes) {
                        // Add multiple components for n-sulfate
                        for (let i = 0; i < substituent.ccdCodes.length; i++) {
                            substituents.push({
                                resNum: parseInt(resNum),
                                type: type,
                                name: substituentName,
                                ccdCode: substituent.ccdCodes[i],
                                bondingAtom: substituent.bondingAtoms[i],
                                needsUserCCD: substituent.needsUserCCD,
                                isMultiComponent: true,
                                componentIndex: i,
                                totalComponents: substituent.ccdCodes.length,
                                specialBond: substituent.specialBond
                            });
                        }
                    } else {
                        // Single component substituent
                        substituents.push({
                            resNum: parseInt(resNum),
                            type: type,
                            name: substituentName,
                            ccdCode: substituent.ccdCode,
                            bondingAtom: substituent.bondingAtom,
                            needsUserCCD: substituent.needsUserCCD
                        });
                    }
                }
            }
        }
        
        return {
            substituents: substituents,
            resSection: resSection,
            linSection: linSection
        };
    }

    /**
     * Identify a substituent by name and return its properties
     * @param {string} substituentName - Name from GlycoCT
     * @returns {Object|null} - Substituent properties or null if not found
     */
    identifySubstituent(substituentName) {
        const normalizedName = substituentName.toLowerCase().replace(/[-_\s]/g, '');
        
        // Skip n-acetyl substituents as they're already embedded in NAG/NDG
        if (normalizedName === 'nacetyl' || normalizedName === 'n-acetyl') {
            return null;
        }
        
        // First check for exact glycoctSymbol matches (most specific)
        for (const [key, substituent] of Object.entries(SUBSTITUENTS)) {
            if (normalizedName === substituent.glycoctSymbol) {
                if (key === 'n-sulfate') {
                    return {
                        ...substituent,
                        isMultiComponent: true
                    };
                }
                return substituent;
            }
        }
        
        // Then check for name matches (less specific, but order matters)
        // Process n-sulfate first to avoid sulfate matching
        const orderedKeys = ['n-sulfate', 'sulfate', 'phosphate', 'acetyl', 'methyl'];
        for (const key of orderedKeys) {
            if (SUBSTITUENTS[key]) {
                const substituent = SUBSTITUENTS[key];
                const normalizedKey = key.replace(/[-_\s]/g, '');
                if (normalizedName === normalizedKey || normalizedName.includes(normalizedKey)) {
                    if (key === 'n-sulfate') {
                        return {
                            ...substituent,
                            isMultiComponent: true
                        };
                    }
                    return substituent;
                }
            }
        }
        
        return null;
    }

    /**
     * Generate substituent data to be combined with base glycan
     * @param {Array} substituents - Array of detected substituents
     * @param {string} baseChainId - Base chain ID to build from
     * @returns {Object} - Substituent CCD codes, bonds, and userCCD requirements
     */
    generateSubstituentLigands(substituents, baseChainId) {
        
        const additionalBonds = [];
        const requiredUserCCDs = new Set();
        const substituentCCDs = [];
        
        // Track multi-component groups for special bonding
        const multiComponentGroups = new Map();
        
        for (let i = 0; i < substituents.length; i++) {
            const substituent = substituents[i];
            
            
            // Add substituent CCD code to be included in the base ligand
            substituentCCDs.push(substituent.ccdCode);
            
            // Add userCCD requirement if needed (skip NH4)
            if (substituent.needsUserCCD && SUBSTITUENT_USERCCD_DATA[substituent.ccdCode] && substituent.ccdCode !== 'NH4') {
                requiredUserCCDs.add(substituent.ccdCode);
            }
            
            // Track multi-component groups for special bonding
            if (substituent.isMultiComponent) {
                const groupKey = `${substituent.name}_${substituent.resNum}`;
                if (!multiComponentGroups.has(groupKey)) {
                    multiComponentGroups.set(groupKey, []);
                }
                // Position in final CCD array: 1 (base) + current substituent count + 1 (1-based)
                // Before push: substituentCCDs.length is current count
                // After push: this substituent will be at position 1 + substituentCCDs.length + 1
                const positionInFinalArray = substituentCCDs.length + 2; // +1 for base, +1 for 1-based indexing
                multiComponentGroups.get(groupKey).push({
                    substituent,
                    positionInFinalArray: positionInFinalArray
                });
            }
            
            // Generate bondedAtomPairs (substituent to base glycan)
            // This creates bonds within the same ligand sequence
            // Format: [residue_index_1, atom_name_1, residue_index_2, atom_name_2]
            const bond = [
                [baseChainId, 1, 'O1'], // Base glycan attachment point (placeholder)
                [baseChainId, substituentCCDs.length + 4, substituent.bondingAtom] // Substituent position in combined ligand
            ];
            
            additionalBonds.push(bond);
        }
        
        // Generate special bonds for multi-component substituents (like N-S bond in n-sulfate)
        for (const [groupKey, components] of multiComponentGroups.entries()) {
            if (components.length === 2 && components[0].substituent.specialBond) {
                const specialBond = components[0].substituent.specialBond;
                
                // Find the positions of NH4 and SO4-2 in the ligand
                const fromComponent = components.find(c => c.substituent.ccdCode === specialBond.fromComponent);
                const toComponent = components.find(c => c.substituent.ccdCode === specialBond.toComponent);
                
                if (fromComponent && toComponent) {
                    const nsBond = [
                        [baseChainId, fromComponent.positionInFinalArray, specialBond.from], // NH4 position + N atom
                        [baseChainId, toComponent.positionInFinalArray, specialBond.to]     // SO4-2 position + S atom
                    ];
                    additionalBonds.push(nsBond);
                }
            }
        }
        
        return {
            substituentCCDs: substituentCCDs,
            bondedAtomPairs: additionalBonds,
            requiredUserCCDs: Array.from(requiredUserCCDs)
        };
    }

    /**
     * Generate a unique chain ID for a substituent
     * @param {string} baseChainId - Base glycan chain ID
     * @param {number} index - Substituent index
     * @returns {string} - Unique chain ID
     */
    generateSubstituentChainId(baseChainId, index) {
        // Generate chain IDs like GLYCANAS1, GLYCANAS2, etc.
        return `${baseChainId}S${index + 1}`;
    }

    /**
     * Get required userCCD data for detected substituents
     * @param {Array} requiredCCDs - Array of CCD codes that need userCCD
     * @returns {Object} - Object with userCCD data
     */
    getRequiredUserCCDs(requiredCCDs) {
        const userCCDs = {};
        
        for (const ccdCode of requiredCCDs) {
            if (SUBSTITUENT_USERCCD_DATA[ccdCode]) {
                userCCDs[ccdCode] = {
                    userCCD: SUBSTITUENT_USERCCD_DATA[ccdCode]
                };
            }
        }
        
        return userCCDs;
    }

    /**
     * Parse GlycoCT structure completely, maintaining RES order
     * @param {string} glycoctString - GlycoCT input string
     * @returns {Object} - Complete structure with RES and LIN in order
     */
    parseGlycoCTForSubstituents(glycoctString) {
        
        const lines = glycoctString.split('\n');
        let resSection = [];
        let linSection = [];
        let currentSection = null;
        
        // Parse sections
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === 'RES') {
                currentSection = 'RES';
                continue;
            } else if (trimmedLine === 'LIN') {
                currentSection = 'LIN';
                continue;
            } else if (trimmedLine === 'REP' || trimmedLine === 'ALT') {
                currentSection = null;
                continue;
            }
            
            if (currentSection === 'RES' && trimmedLine) {
                resSection.push(trimmedLine);
            } else if (currentSection === 'LIN' && trimmedLine) {
                linSection.push(trimmedLine);
            }
        }
        
        
        // Parse all RES entries in order
        const orderedEntries = [];
        const substituents = [];
        
        for (let i = 0; i < resSection.length; i++) {
            const resLine = resSection[i];
            const substituentMatch = resLine.match(/^(\d+)(s):(.+)$/);
            const baseMatch = resLine.match(/^(\d+)(b):(.+)$/);
            
            if (substituentMatch) {
                const [, resNum, type, substituentName] = substituentMatch;
                const substituent = this.identifySubstituent(substituentName);
                
                if (substituent) {
                    // Handle multi-component substituents like n-sulfate
                    if (substituent.isMultiComponent && substituent.ccdCodes) {
                        // Add multiple entries for each component
                        for (let i = 0; i < substituent.ccdCodes.length; i++) {
                            orderedEntries.push({
                                position: parseInt(resNum),
                                type: 'substituent',
                                name: substituentName,
                                ccdCode: substituent.ccdCodes[i],
                                bondingAtom: substituent.bondingAtoms[i],
                                needsUserCCD: substituent.needsUserCCD,
                                isMultiComponent: true,
                                componentIndex: i,
                                totalComponents: substituent.ccdCodes.length,
                                specialBond: substituent.specialBond
                            });
                        }
                    } else {
                        orderedEntries.push({
                            position: parseInt(resNum),
                            type: 'substituent',
                            name: substituentName,
                            ccdCode: substituent.ccdCode,
                            needsUserCCD: substituent.needsUserCCD,
                            bondingAtom: substituent.bondingAtom
                        });
                    }
                    substituents.push({
                        resNum: parseInt(resNum),
                        type: type,
                        name: substituentName,
                        ccdCode: substituent.ccdCode,
                        bondingAtom: substituent.bondingAtom,
                        needsUserCCD: substituent.needsUserCCD
                    });
                } else {
                }
            } else if (baseMatch) {
                const [, resNum] = baseMatch;
                
                // Parse base residue information for special case detection
                // Format: a-dglc-HEX-1:5 (anomeric-stereochemistrysugar-ringtype-bond:ringsize)
                const sugarMatch = resLine.match(/([ab])-([dl])(\w+)-([A-Z]+)-\d+:(\d+)/);
                let baseInfo = { resLine: resLine };
                
                if (sugarMatch) {
                    const [, anomeric, stereochemistry, sugarName, ringType, ringSize] = sugarMatch;
                    // Map ring types
                    let ring = 'Pyr'; // Default to pyranose
                    if (ringType === 'HEX' && ringSize === '5') ring = 'Pyr';
                    else if (ringType === 'HEX' && ringSize === '4') ring = 'Fur';
                    else if (ringType === 'PEN' && ringSize === '4') ring = 'Fur';
                    else if (ringType === 'PEN' && ringSize === '5') ring = 'Pyr';
                    
                    // Map sugar names
                    let fullSugarName = sugarName.toLowerCase();
                    if (fullSugarName === 'glc') fullSugarName = 'glucose';
                    else if (fullSugarName === 'gal') fullSugarName = 'galactose'; 
                    else if (fullSugarName === 'man') fullSugarName = 'mannose';
                    else if (fullSugarName === 'fru') fullSugarName = 'fructose';
                    
                    baseInfo = {
                        ...baseInfo,
                        anomeric: anomeric,
                        stereochemistry: stereochemistry.toUpperCase(),
                        sugarName: fullSugarName,
                        ring: ring,
                        ringSize: ringSize
                    };
                }
                
                orderedEntries.push({
                    position: parseInt(resNum),
                    type: 'base',
                    ...baseInfo
                });
            }
        }
        
        return {
            orderedEntries: orderedEntries.sort((a, b) => a.position - b.position),
            substituents: substituents,
            linSection: linSection,
            resSection: resSection
        };
    }

    /**
     * Map RES position to CCD sequence position
     * @param {number} resPosition - Original RES position (1-based)
     * @param {Array} orderedEntries - Ordered entries from parsing
     * @returns {number} - CCD sequence position (1-based) or -1 if not found
     */
    mapResPositionToCCDPosition(resPosition, orderedEntries) {
        let ccdPosition = 1;
        
        for (const entry of orderedEntries) {
            if (entry.position === resPosition) {
                return ccdPosition;
            }
            // Only count entries that will appear in the final CCD sequence
            if (entry.type === 'base' || entry.type === 'substituent') {
                ccdPosition++;
            }
        }
        
        return -1; // Not found
    }

    /**
     * Map a specific entry to its CCD sequence position
     * This accounts for multiple substituents at the same RES position
     * @param {Object} targetEntry - The specific entry to find
     * @param {Array} orderedEntries - Ordered entries from parsing
     * @returns {number} - CCD sequence position (1-based) or -1 if not found
     */
    mapEntryToCCDPosition(targetEntry, orderedEntries) {
        let ccdPosition = 1;
        
        for (const entry of orderedEntries) {
            // Check if this is the exact entry we're looking for
            if (entry === targetEntry || 
                (entry.position === targetEntry.position && 
                 entry.type === targetEntry.type && 
                 entry.ccdCode === targetEntry.ccdCode)) {
                return ccdPosition;
            }
            // Only count entries that will appear in the final CCD sequence
            if (entry.type === 'base' || entry.type === 'substituent') {
                ccdPosition++;
            }
        }
        
        return -1; // Not found
    }

    /**
     * Generate complete structure with substituents in correct RES order
     * @param {Object} parseResult - Full parse result
     * @param {string} chainId - Chain ID
     * @param {Array} baseCCDs - Base CCD codes from enhanced parser
     * @returns {Object} - Complete structure data
     */
    async generateCompleteStructure(parseResult, chainId, baseCCDs = []) {
        
        const combinedCCDs = [];
        const substituentCCDs = [];
        const requiredUserCCDs = new Set();
        const bondedAtomPairs = [];
        
        // Check for special case: glucose + n-sulfate = GNS
        // Check all glucose base entries, not just the first one
        const glucoseEntries = parseResult.orderedEntries.filter(e => 
            e.type === 'base' && e.sugarName === 'glucose');
        const nSulfateEntries = parseResult.orderedEntries.filter(e => 
            e.type === 'substituent' && e.name === 'n-sulfate');
        
        
        // Check each glucose residue for GNS special case
        for (const baseEntry of glucoseEntries) {
            for (const nSulfateEntry of nSulfateEntries) {
                
                // Check linkage position - must be at C2 (position 2) for GNS
                let isCorrectLinkage = false;
                
                for (const linLine of parseResult.linSection) {
                    const match = linLine.match(/^(\d+):(\d+)([od])\((\d+)\+(\d+)\)(\d+)([nd])$/);
                    if (match) {
                        const [, linkId, donorRes, donorType, donorPos, acceptorPos, acceptorRes, acceptorType] = match;
                        
                        // Check if this linkage connects this glucose residue at position 2 to this n-sulfate residue
                        if (parseInt(donorRes) === baseEntry.position && 
                            parseInt(acceptorRes) === nSulfateEntry.position && 
                            parseInt(donorPos) === 2) {
                            isCorrectLinkage = true;
                            break;
                        }
                    }
                }
                
                const isGlucose = baseEntry.sugarName === 'glucose';
                const isDStereo = baseEntry.stereochemistry === 'D';
                const isAlpha = baseEntry.anomeric === 'a';
                const isPyr = baseEntry.ring === 'Pyr';
                
                
                if (isGlucose && isDStereo && isAlpha && isPyr && isCorrectLinkage) {
                    
                    // Mark the special case for later processing
                    
                    // Store the special case info to be used in normal processing
                    if (!parseResult.specialCases) {
                        parseResult.specialCases = new Map();
                    }
                    parseResult.specialCases.set(baseEntry.position, {
                        type: 'GNS',
                        ccdCode: 'GNS',
                        nSulfatePosition: nSulfateEntry.position
                    });
                    // Only mark the n-sulfate as processed, not all substituents of this residue
                    parseResult.specialCases.set(nSulfateEntry.position, {
                        type: 'PROCESSED_N_SULFATE',
                        ccdCode: null
                    });
                    
                    break; // Exit the inner loop since we found the special case
                }
            }
        }
        
        
        // Build CCD sequence in RES order with special case handling
        for (const entry of parseResult.orderedEntries) {
            if (entry.type === 'substituent') {
                // Check if this substituent is part of a special case
                if (parseResult.specialCases && parseResult.specialCases.has(entry.position)) {
                    const specialCase = parseResult.specialCases.get(entry.position);
                    if (specialCase.type === 'PROCESSED_N_SULFATE') {
                        continue; // Skip only n-sulfate components as they're embedded in GNS
                    }
                }
                
                // Add this substituent (it's either not part of a special case, or it's a different type)
                combinedCCDs.push(entry.ccdCode);
                substituentCCDs.push(entry.ccdCode);
                
                if (entry.needsUserCCD && entry.ccdCode !== 'NH4') {
                    requiredUserCCDs.add(entry.ccdCode);
                }
            } else if (entry.type === 'base') {
                // Check if this base residue has a special case
                if (parseResult.specialCases && parseResult.specialCases.has(entry.position)) {
                    const specialCase = parseResult.specialCases.get(entry.position);
                    if (specialCase.type === 'GNS') {
                        combinedCCDs.push('GNS');
                        substituentCCDs.push('GNS');
                    }
                } else {
                    // Get CCD code from enhanced parser result
                    const baseIndex = parseResult.orderedEntries.filter(e =>
                        e.type === 'base' && e.position <= entry.position).length - 1;
                    if (baseIndex >= 0 && baseIndex < baseCCDs.length) {
                        combinedCCDs.push(baseCCDs[baseIndex]);
                    }
                }
            }
        }
        
        // Parse LIN section for bonds involving substituents
        for (const linLine of parseResult.linSection) {
            const match = linLine.match(/^(\d+):(\d+)([od])\((\d+)\+(\d+)\)(\d+)([nd])$/);
            if (match) {
                const [, linkId, donor, donorType, donorPos, acceptorPos, acceptor, acceptorType] = match;
                
                // Check if this link involves the specific n-sulfate that's part of a GNS special case
                const donorSpecialCase = parseResult.specialCases?.get(parseInt(donor));
                const acceptorSpecialCase = parseResult.specialCases?.get(parseInt(acceptor));
                
                if ((donorSpecialCase?.type === 'PROCESSED_N_SULFATE') || (acceptorSpecialCase?.type === 'PROCESSED_N_SULFATE')) {
                    continue;
                }
                
                // Also skip bonds involving the glucose that became GNS, but only if the other end is the n-sulfate
                if (donorSpecialCase?.type === 'GNS' && parseInt(acceptor) === donorSpecialCase.nSulfatePosition) {
                    continue;
                }
                if (acceptorSpecialCase?.type === 'GNS' && parseInt(donor) === acceptorSpecialCase.nSulfatePosition) {
                    continue;
                }
                
                // Check if this link involves a substituent
                const donorEntry = parseResult.orderedEntries.find(e => e.position === parseInt(donor));
                const acceptorEntry = parseResult.orderedEntries.find(e => e.position === parseInt(acceptor));
                
                
                if (donorEntry?.type === 'substituent' || acceptorEntry?.type === 'substituent') {
                    
                    // Generate bond between base residue and substituent
                    // Need to map RES positions to final CCD sequence positions
                    const donorCCDPos = this.mapResPositionToCCDPosition(parseInt(donor), parseResult.orderedEntries);
                    const acceptorCCDPos = this.mapResPositionToCCDPosition(parseInt(acceptor), parseResult.orderedEntries);
                    
                    
                    let donorAtom, acceptorAtom;
                    
                    // For substituent bonds, the format is usually: base_residue -> substituent
                    if (acceptorEntry?.type === 'substituent') {
                        // Base residue (donor) -> Substituent (acceptor)
                        donorAtom = `O${donorPos}`; // e.g., O4 from base residue
                        acceptorAtom = acceptorEntry.bondingAtom; // S for sulfate, P for phosphate
                    } else if (donorEntry?.type === 'substituent') {
                        // Substituent (donor) -> Base residue (acceptor) - less common
                        donorAtom = donorEntry.bondingAtom; // S for sulfate, P for phosphate
                        acceptorAtom = `O${acceptorPos}`; // e.g., O4 from base residue
                    }
                    
                    
                    if (donorCCDPos !== -1 && acceptorCCDPos !== -1 && donorAtom && acceptorAtom) {
                        const bond = [
                            [chainId, donorCCDPos, donorAtom],
                            [chainId, acceptorCCDPos, acceptorAtom]
                        ];
                        bondedAtomPairs.push(bond);
                    } else {
                    }
                } else {
                }
            } else {
            }
        }
        
        // Generate special bonds for multi-component substituents (like N-S bond in n-sulfate)
        const multiComponentGroups = new Map();
        
        // Group multi-component substituents by name and position, but skip n-sulfate special cases
        for (const entry of parseResult.orderedEntries) {
            if (entry.type === 'substituent' && entry.isMultiComponent) {
                // Skip multi-component bonds only for n-sulfate that's part of GNS special case
                if (parseResult.specialCases && parseResult.specialCases.has(entry.position)) {
                    const specialCase = parseResult.specialCases.get(entry.position);
                    if (specialCase.type === 'PROCESSED_N_SULFATE') {
                        continue;
                    }
                }
                const groupKey = `${entry.name}_${entry.position}`;
                if (!multiComponentGroups.has(groupKey)) {
                    multiComponentGroups.set(groupKey, []);
                }
                
                // Find the CCD position for this specific entry (not just by RES position)
                const ccdPosition = this.mapEntryToCCDPosition(entry, parseResult.orderedEntries);
                
                multiComponentGroups.get(groupKey).push({
                    substituent: entry,
                    positionInFinalArray: ccdPosition
                });
            }
        }
        
        // Generate special bonds between components
        for (const [groupKey, components] of multiComponentGroups.entries()) {
            if (components.length === 2 && components[0].substituent.specialBond) {
                const specialBond = components[0].substituent.specialBond;
                
                // Find the positions of NH4 and SO4-2 in the ligand
                const fromComponent = components.find(c => c.substituent.ccdCode === specialBond.fromComponent);
                const toComponent = components.find(c => c.substituent.ccdCode === specialBond.toComponent);
                
                if (fromComponent && toComponent) {
                    const nsBond = [
                        [chainId, fromComponent.positionInFinalArray, specialBond.from], // NH4 position + N atom
                        [chainId, toComponent.positionInFinalArray, specialBond.to]     // SO4-2 position + S atom
                    ];
                    bondedAtomPairs.push(nsBond);
                }
            }
        }
        
        // Filter orderedEntries to exclude special case entries that shouldn't be in final merge
        const filteredOrderedEntries = parseResult.orderedEntries.filter(entry => {
            if (parseResult.specialCases && parseResult.specialCases.has(entry.position)) {
                const specialCase = parseResult.specialCases.get(entry.position);
                if (specialCase.type === 'PROCESSED_N_SULFATE') {
                    return false; // Exclude this entry from the final merge
                }
            }
            return true; // Keep this entry
        });
        
        
        // Create a mapping from RES position to final CCD position using filtered entries
        const resPosToCCDPos = new Map();
        let ccdPos = 1;
        for (const entry of filteredOrderedEntries) {
            resPosToCCDPos.set(entry.position, ccdPos);
            ccdPos++;
        }
        
        // Recalculate bonds using the new position mapping
        const correctedBonds = [];
        for (const bond of bondedAtomPairs) {
            const [donorInfo, acceptorInfo] = bond;
            const [chainId1, oldDonorPos, donorAtom] = donorInfo;
            const [chainId2, oldAcceptorPos, acceptorAtom] = acceptorInfo;
            
            
            // Find what entries were at the old positions in the original sequence
            let donorEntry = null;
            let acceptorEntry = null;
            let currentPos = 1;
            
            for (const entry of parseResult.orderedEntries) {
                if (entry.type === 'base' || entry.type === 'substituent') {
                    if (currentPos === oldDonorPos) {
                        donorEntry = entry;
                    }
                    if (currentPos === oldAcceptorPos) {
                        acceptorEntry = entry;
                    }
                    currentPos++;
                }
            }
            
            if (!donorEntry || !acceptorEntry) {
                continue;
            }
            
            
            // Find new positions in filtered sequence
            const newDonorPos = resPosToCCDPos.get(donorEntry.position);
            const newAcceptorPos = resPosToCCDPos.get(acceptorEntry.position);
            
            if (newDonorPos && newAcceptorPos) {
                const correctedBond = [
                    [chainId1, newDonorPos, donorAtom],
                    [chainId2, newAcceptorPos, acceptorAtom]
                ];
                correctedBonds.push(correctedBond);
            } else {
            }
        }
        
        return {
            combinedCCDs: combinedCCDs,
            substituentCCDs: substituentCCDs,
            bondedAtomPairs: correctedBonds, // Use corrected bonds
            requiredUserCCDs: Array.from(requiredUserCCDs),
            orderedEntries: filteredOrderedEntries // Use filtered entries instead of original
        };
    }

    /**
     * Process GlycoCT with substituent handling
     * @param {string} glycoctString - GlycoCT input string
     * @param {string} chainId - Base chain ID
     * @returns {Object} - Enhanced result with substituent handling
     */
    async processGlycoCTWithSubstituents(glycoctString, chainId) {

        // Parse the complete GlycoCT structure
        const parseResult = this.parseGlycoCTForSubstituents(glycoctString);

        if (parseResult.substituents.length === 0) {
            return null;
        }

        // Get base CCD codes from enhanced parser first
        let baseCCDs = [];
        if (window.convertGlycoCTToEnhancedLigand) {
            try {
                const baseResult = await window.convertGlycoCTToEnhancedLigand(glycoctString, chainId);
                baseCCDs = baseResult.ligand?.ligand?.ccdCodes || [];
            } catch (error) {
                console.warn('Failed to get base CCDs:', error);
            }
        }

        // Generate complete structure
        const structureResult = await this.generateCompleteStructure(parseResult, chainId, baseCCDs);
        
        // Get required userCCD data
        const userCCDs = this.getRequiredUserCCDs(structureResult.requiredUserCCDs);
        
        return {
            substituents: parseResult.substituents,
            substituentCCDs: structureResult.substituentCCDs,
            combinedCCDs: structureResult.combinedCCDs,
            additionalBonds: structureResult.bondedAtomPairs,
            requiredUserCCDs: userCCDs,
            orderedEntries: structureResult.orderedEntries // Use filtered entries from structureResult
        };
    }
}

// Create global instance
try {
    window.substituentHandler = new SubstituentHandler();
} catch (error) {
}

// Export for use in other modules
window.SubstituentHandler = SubstituentHandler;
window.SUBSTITUENTS = SUBSTITUENTS;

/**
 * Global utility function to merge substituents into CCD list in correct RES order
 * @param {Array} baseCCDs - Original CCD codes from enhanced glycoct parser
 * @param {Array} orderedEntries - Ordered entries from substituent parsing
 * @returns {Array} - Combined CCD codes in correct RES order
 */
function mergeSubstituentsInResOrder(baseCCDs, orderedEntries) {
    
    const result = [];
    let baseCCDIndex = 0;
    
    // Process entries in RES position order
    for (const entry of orderedEntries) {
        if (entry.type === 'base') {
            // Add next base CCD
            if (baseCCDIndex < baseCCDs.length) {
                result.push(baseCCDs[baseCCDIndex]);
                baseCCDIndex++;
            }
        } else if (entry.type === 'substituent') {
            // Add substituent CCD
            result.push(entry.ccdCode);
        }
    }
    
    return result;
}

window.mergeSubstituentsInResOrder = mergeSubstituentsInResOrder;

