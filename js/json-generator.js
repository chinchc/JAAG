// JSON generation and validation for AlphaFold3

/**
 * Enhanced JSON generation with proper sequence data integration
 */
AlphaFold3Generator.prototype.buildAlphaFold3JSON = async function() {
    const jobName = document.getElementById('jobName').value || 'Untitled_Job';
    const version = parseInt(document.getElementById('version').value);
    // Get model seeds from multiple seeds input
    const modelSeedsInput = document.getElementById('modelSeedsMultiple').value || '1';

    // Parse model seeds
    const modelSeeds = modelSeedsInput.split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    
    if (modelSeeds.length === 0) {
        throw new Error('At least one model seed is required');
    }

    // Update all sequence data with current DOM state before processing
    if (typeof window.updateSequenceData === 'function') {
        for (const seq of this.sequences) {
            await window.updateSequenceData(seq.id, seq.type);
        }
    } else {
    }
    
    // Build sequences array from sequence data
    const sequences = [];
    const glycosylationResults = [];
    
    for (const seq of this.sequences) {
        if (seq.type === 'ligand') {
        }
        
        if (seq.data && Object.keys(seq.data).length > 0) {

            // NEW APPROACH: Check if this sequence has an array of chain IDs (multimer)
            const seqType = Object.keys(seq.data)[0]; // protein, ligand, rna, dna
            const seqInfo = seq.data[seqType];
            const isMultimer = Array.isArray(seqInfo.id);

            if (isMultimer) {

                // For multimers, add the single entry with array of chain IDs
                const seqData = this.validateSequenceData(seq.data);
                if (seqData) {
                    sequences.push(seqData);

                    // Process glycosylation sites for protein multimers
                    if (seq.type === 'protein') {
                        const hasManualSites = seq.data._glycosylationSites && seq.data._glycosylationSites.length > 0;
                        const hasSequonSites = seq.data._sequonSites && seq.data._sequonSites.length > 0;

                        if (hasManualSites || hasSequonSites) {

                            // Process glycosylation sites for each chain ID in the multimer
                            for (const chainId of seqInfo.id) {
                                try {
                                    const glycoResult = await processGlycosylationSites(seq.data._proteinSequenceId, chainId, chainId);
                                    if (glycoResult.ligands.length > 0 || glycoResult.bonds.length > 0) {
                                        glycosylationResults.push(glycoResult);
                                    }
                                } catch (error) {
                                }
                            }
                        }
                    }
                }
            } else {
                // Single sequence
                const seqData = this.validateSequenceData(seq.data);
                if (seqData) {
                    sequences.push(seqData);
                    
                    // Process glycosylation sites if this is a protein
                    const hasManualSites = seq.data._glycosylationSites && seq.data._glycosylationSites.length > 0;
                    const hasSequonSites = seq.data._sequonSites && seq.data._sequonSites.length > 0;
                    
                    if (seq.type === 'protein' && (hasManualSites || hasSequonSites)) {
                        try {
                            const glycoResult = await processGlycosylationSites(seq.data._proteinSequenceId, seqData.protein.id);
                            if (glycoResult.ligands.length > 0 || glycoResult.bonds.length > 0) {
                                glycosylationResults.push(glycoResult);
                            }
                        } catch (error) {
                        }
                    }
                }
            }
        } else {
        }
    }
    
    // Add glycan ligands from glycosylation sites with consolidation for multimer counts
    const allGlycanLigands = [];
    for (const glycoResult of glycosylationResults) {
        allGlycanLigands.push(...glycoResult.ligands);
    }

    // Consolidate identical glycans that come from multimer counts (same site, same structure, different chains)
    const consolidatedGlycanLigands = this.consolidateMultimerGlycans(allGlycanLigands);
    sequences.push(...consolidatedGlycanLigands);
    

    const jsonData = {
        name: jobName,
        modelSeeds: modelSeeds,
        dialect: 'alphafold3',
        version: version,
        sequences: sequences
    };
    

    // No global description field - descriptions are now per-sequence

    // Add bonded atom pairs if any are valid
    const validBonds = [];
    
    // Collect manual bondedAtomPairs from UI and glycan-generated ones
    for (const bond of window.app.bondedAtomPairs) {
        if (Array.isArray(bond) && bond.length === 2) {
            // Direct array format from glycan conversion: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
            validBonds.push(bond);
        } else if (bond.data) {
            // UI-generated bonds with data wrapper
            if (Array.isArray(bond.data) && bond.data.length === 2) {
                // New format: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
                validBonds.push(bond.data);
            } else if (bond.data.atom1 && bond.data.atom2) {
                // Legacy format - convert to new format
                const convertedBond = [
                    [bond.data.atom1.chainId, bond.data.atom1.residueIndex + 1, bond.data.atom1.atomName],
                    [bond.data.atom2.chainId, bond.data.atom2.residueIndex + 1, bond.data.atom2.atomName]
                ];
                validBonds.push(convertedBond);
            }
        }
    }
    
    // Collect bondedAtomPairs from glycan sequences
    this.sequences.forEach(seq => {
        if (seq.type === 'ligand' && seq.bondedAtomPairs && Array.isArray(seq.bondedAtomPairs)) {
            seq.bondedAtomPairs.forEach(bond => {
                validBonds.push(bond);
            });
        }
    });
    
    // Add bonds from glycosylation sites
    for (const glycoResult of glycosylationResults) {
        if (glycoResult.bonds && glycoResult.bonds.length > 0) {
            validBonds.push(...glycoResult.bonds);
        }
    }
    
    if (validBonds.length > 0) {
        jsonData.bondedAtomPairs = validBonds;
    }

    // Add UserCCD data if available
    const allUserCCDs = { ...this.userCCDs };
    
    // Add userCCD data from glycosylation sites
    if (window.app.glycanUserCCDs && Object.keys(window.app.glycanUserCCDs).length > 0) {
        Object.assign(allUserCCDs, window.app.glycanUserCCDs);
    }
    
    if (allUserCCDs && Object.keys(allUserCCDs).length > 0) {
        
        // Check if we have inline userCCD data or file paths
        const inlineUserCCDs = [];
        let userCCDPath = null;
        
        Object.keys(allUserCCDs).forEach(componentId => {
            const userData = allUserCCDs[componentId];
            if (userData.userCCD) {
                // Inline userCCD data
                inlineUserCCDs.push(userData.userCCD);
            } else if (userData.userCCDPath) {
                // File-based userCCD - only one path supported by AlphaFold3
                if (!userCCDPath) {
                    userCCDPath = userData.userCCDPath;
                } else {
                }
            }
        });
        
        // Add inline userCCD data (concatenated)
        if (inlineUserCCDs.length > 0) {
            // Convert escaped \n back to actual line breaks for JSON output
            const processedUserCCDs = inlineUserCCDs.map(content => 
                content.replace(/\\n/g, '\n')
            );
            jsonData.userCCD = processedUserCCDs.join('\n\n');
        }
        
        // Add userCCDPath (only one supported)
        if (userCCDPath) {
            jsonData.userCCDPath = userCCDPath;
        }
    }
    
    // Legacy: Also check for old userCCDPath element (for backward compatibility)
    const userCCDPathElement = document.getElementById('userCCDPath');
    if (userCCDPathElement && userCCDPathElement.value && !jsonData.userCCDPath) {
        jsonData.userCCDPath = userCCDPathElement.value;
    }

    const unpairedMsaPathElement = document.getElementById('unpairedMsaPath');
    if (unpairedMsaPathElement && unpairedMsaPathElement.value) {
        jsonData.unpairedMsaPath = unpairedMsaPathElement.value;
    }

    const pairedMsaPathElement = document.getElementById('pairedMsaPath');
    if (pairedMsaPathElement && pairedMsaPathElement.value) {
        jsonData.pairedMsaPath = pairedMsaPathElement.value;
    }

    const mmcifPathElement = document.getElementById('mmcifPath');
    if (mmcifPathElement && mmcifPathElement.value) {
        jsonData.mmcifPath = mmcifPathElement.value;
    }

    return jsonData;
};

/**
 * Validate and clean sequence data before adding to JSON
 */
AlphaFold3Generator.prototype.validateSequenceData = function(sequenceData) {
    const seqType = Object.keys(sequenceData)[0];
    const seqInfo = sequenceData[seqType];
    
    // Check if sequence has required fields - allow placeholder entries
    switch (seqType) {
        case 'protein':
            // Allow placeholder entries with default values
            if (!seqInfo.id && !seqInfo.sequence) {
                seqInfo.id = 'A';
                seqInfo.sequence = '';
            }
            if (!seqInfo.id) seqInfo.id = 'A';
            if (!seqInfo.sequence) seqInfo.sequence = '';
            
            // Validate sequence if it's not empty
            if (seqInfo.sequence) {
                const cleanSeq = seqInfo.sequence.replace(/\s/g, '').toUpperCase();
                
                // Check for completely invalid characters (not amino acids at all)
                if (!/^[ACDEFGHIKLMNPQRSTVWYXBZJOU]*$/i.test(cleanSeq)) {
                    // Remove completely invalid characters, keep valid ones and warned ones
                    seqInfo.sequence = cleanSeq.replace(/[^ACDEFGHIKLMNPQRSTVWYXBZJOU]/gi, '');
                }
                
                // Warn about problematic amino acids but don't remove them
                const problematicChars = cleanSeq.match(/[BJOUXZ]/g);
                if (problematicChars) {
                }
            }
            break;
            
        case 'rna':
            // Allow placeholder entries with default values
            if (!seqInfo.id && !seqInfo.sequence) {
                seqInfo.id = 'R';
                seqInfo.sequence = '';
            }
            if (!seqInfo.id) seqInfo.id = 'R';
            if (!seqInfo.sequence) seqInfo.sequence = '';
            // Validate RNA sequence if not empty
            if (seqInfo.sequence && !/^[ACGU]+$/i.test(seqInfo.sequence)) {
                seqInfo.sequence = ''; // Clear invalid sequence
            }
            break;
            
        case 'dna':
            // Allow placeholder entries with default values
            if (!seqInfo.id && !seqInfo.sequence) {
                seqInfo.id = 'D';
                seqInfo.sequence = '';
            }
            if (!seqInfo.id) seqInfo.id = 'D';
            if (!seqInfo.sequence) seqInfo.sequence = '';
            
            // Validate DNA sequence if not empty
            if (seqInfo.sequence && !/^[ACGT]+$/i.test(seqInfo.sequence)) {
                seqInfo.sequence = ''; // Clear invalid sequence
            }
            break;
            
        case 'ligand':
            // Allow placeholder entries with default values
            if (!seqInfo.id) seqInfo.id = 'L';
            
            
            // Only set default empty array if truly no data exists
            if (!seqInfo.ccdCodes && !seqInfo.smiles) {
                seqInfo.ccdCodes = []; // Default empty array
            }
            break;
            
        default:
            return null;
    }
    
    // Clean up internal properties before returning
    const cleanedData = JSON.parse(JSON.stringify(sequenceData));
    Object.keys(cleanedData).forEach(key => {
        if (key.startsWith('_') || key === 'inputType') {
            delete cleanedData[key];
        }
    });

    // Also clean up nested objects like ligand
    if (cleanedData.ligand) {
        Object.keys(cleanedData.ligand).forEach(key => {
            if (key.startsWith('_') || key === 'inputType') {
                delete cleanedData.ligand[key];
            }
        });
    }
    
    // Preserve additional fields that were added during data building
    // (modifications, MSA data, etc.)
    return cleanedData;
};

/**
 * Enhanced JSON validation with detailed error reporting
 */
AlphaFold3Generator.prototype.validateJSON = function(jsonData) {
    const status = document.getElementById('validationStatus');
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!jsonData.name) {
        errors.push('Job name is required');
    }
    
    if (!jsonData.modelSeeds || jsonData.modelSeeds.length === 0) {
        errors.push('At least one model seed is required');
    } else {
        // Validate model seeds are positive integers
        const invalidSeeds = jsonData.modelSeeds.filter(seed => !Number.isInteger(seed) || seed <= 0);
        if (invalidSeeds.length > 0) {
            errors.push(`Invalid model seeds: ${invalidSeeds.join(', ')}`);
        }
    }
    
    if (!jsonData.sequences || jsonData.sequences.length === 0) {
        errors.push('At least one sequence is required');
    } else {
        // Validate sequences
        const sequenceValidation = this.validateSequences(jsonData.sequences);
        errors.push(...sequenceValidation.errors);
        warnings.push(...sequenceValidation.warnings);
    }

    // Validate version
    if (!jsonData.version || ![1, 2, 3, 4].includes(jsonData.version)) {
        errors.push('Version must be 1, 2, 3, or 4');
    }

    // Validate dialect
    if (jsonData.dialect !== 'alphafold3') {
        errors.push('Dialect must be "alphafold3"');
    }

    // Validate bonded atom pairs
    if (jsonData.bondedAtomPairs) {
        const bondValidation = this.validateBondedAtomPairs(jsonData.bondedAtomPairs);
        errors.push(...bondValidation.errors);
        warnings.push(...bondValidation.warnings);
    }

    // Update status display
    this.updateValidationStatus(status, errors, warnings);
    
    return {
        valid: errors.length === 0,
        errors: errors,
        warnings: warnings
    };
};

/**
 * Validate sequence data in detail
 */
AlphaFold3Generator.prototype.validateSequences = function(sequences) {
    const errors = [];
    const warnings = [];
    const usedChainIds = new Set();

    for (let i = 0; i < sequences.length; i++) {
        const seq = sequences[i];
        const seqType = Object.keys(seq)[0];
        const seqData = seq[seqType];
        
        // Check for duplicate chain IDs
        if (seqData.id) {
            if (usedChainIds.has(seqData.id)) {
                errors.push(`Duplicate chain ID: ${seqData.id}`);
            } else {
                usedChainIds.add(seqData.id);
            }
        }
        
        // Validate sequence-specific requirements
        switch (seqType) {
            case 'protein':
                if (seqData.sequence && seqData.sequence.length > 2700) {
                    warnings.push(`Protein ${seqData.id} is very long (${seqData.sequence.length} residues)`);
                }
                // Removed modification warning - PTM validation is handled elsewhere
                if (seqData.templates && seqData.templates.length > 0) {
                    // Validate template structure
                    const templateValidation = this.validateProteinTemplates(seqData.templates, seqData.id);
                    errors.push(...templateValidation.errors);
                    warnings.push(...templateValidation.warnings);
                }
                break;
                
            case 'ligand':
                // Ligand validation - CCD codes are assumed valid
                break;
        }
    }

    return { errors, warnings };
};

/**
 * Validate bonded atom pairs in AlphaFold3 format: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
 */
AlphaFold3Generator.prototype.validateBondedAtomPairs = function(bondedAtomPairs) {
    const errors = [];
    const warnings = [];

    for (let i = 0; i < bondedAtomPairs.length; i++) {
        const bond = bondedAtomPairs[i];
        
        // Check if bond is an array with exactly 2 elements
        if (!Array.isArray(bond) || bond.length !== 2) {
            errors.push(`Bonded atom pair ${i + 1} must be an array with exactly 2 atoms`);
            continue;
        }
        
        // Validate first atom (bond[0])
        const atom1 = bond[0];
        if (!Array.isArray(atom1) || atom1.length !== 3) {
            errors.push(`Bonded atom pair ${i + 1} first atom must be an array [EntityID, ResidueID, AtomName]`);
        } else {
            const [entityId1, residueId1, atomName1] = atom1;
            if (!entityId1 || typeof entityId1 !== 'string') {
                errors.push(`Bonded atom pair ${i + 1} first atom has invalid EntityID`);
            }
            if (typeof residueId1 !== 'number' || residueId1 < 1) {
                errors.push(`Bonded atom pair ${i + 1} first atom has invalid ResidueID (must be positive number)`);
            }
            if (!atomName1 || typeof atomName1 !== 'string') {
                errors.push(`Bonded atom pair ${i + 1} first atom has invalid AtomName`);
            }
        }
        
        // Validate second atom (bond[1])
        const atom2 = bond[1];
        if (!Array.isArray(atom2) || atom2.length !== 3) {
            errors.push(`Bonded atom pair ${i + 1} second atom must be an array [EntityID, ResidueID, AtomName]`);
        } else {
            const [entityId2, residueId2, atomName2] = atom2;
            if (!entityId2 || typeof entityId2 !== 'string') {
                errors.push(`Bonded atom pair ${i + 1} second atom has invalid EntityID`);
            }
            if (typeof residueId2 !== 'number' || residueId2 < 1) {
                errors.push(`Bonded atom pair ${i + 1} second atom has invalid ResidueID (must be positive number)`);
            }
            if (!atomName2 || typeof atomName2 !== 'string') {
                errors.push(`Bonded atom pair ${i + 1} second atom has invalid AtomName`);
            }
        }
    }

    return { errors, warnings };
};

/**
 * Validate protein templates structure
 */
AlphaFold3Generator.prototype.validateProteinTemplates = function(templates, proteinId) {
    const errors = [];
    const warnings = [];
    
    for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const templateRef = `${proteinId} template ${i + 1}`;
        
        // Check for required fields
        if (!template.queryIndices || !template.templateIndices) {
            errors.push(`${templateRef} missing required indices`);
            continue;
        }
        
        // Check for mutually exclusive source fields
        const hasPath = !!template.mmcifPath;
        const hasInline = !!template.mmcif;
        
        if (!hasPath && !hasInline) {
            errors.push(`${templateRef} missing template source (mmcifPath or mmcif required)`);
        } else if (hasPath && hasInline) {
            errors.push(`${templateRef} has both mmcifPath and mmcif (mutually exclusive)`);
        }
        
        // Validate indices arrays
        if (!Array.isArray(template.queryIndices) || template.queryIndices.length === 0) {
            errors.push(`${templateRef} queryIndices must be a non-empty array`);
        } else {
            // Check if all elements are non-negative integers
            const invalidQuery = template.queryIndices.filter(idx => !Number.isInteger(idx) || idx < 0);
            if (invalidQuery.length > 0) {
                errors.push(`${templateRef} queryIndices contains invalid values: ${invalidQuery.join(', ')}`);
            }
        }
        
        if (!Array.isArray(template.templateIndices) || template.templateIndices.length === 0) {
            errors.push(`${templateRef} templateIndices must be a non-empty array`);
        } else {
            // Check if all elements are non-negative integers
            const invalidTemplate = template.templateIndices.filter(idx => !Number.isInteger(idx) || idx < 0);
            if (invalidTemplate.length > 0) {
                errors.push(`${templateRef} templateIndices contains invalid values: ${invalidTemplate.join(', ')}`);
            }
        }
        
        // Validate indices alignment
        if (template.queryIndices && template.templateIndices && 
            template.queryIndices.length !== template.templateIndices.length) {
            warnings.push(`${templateRef} queryIndices and templateIndices have different lengths`);
        }
        
        // Validate mmcif path format if present
        if (template.mmcifPath && typeof template.mmcifPath !== 'string') {
            errors.push(`${templateRef} mmcifPath must be a string`);
        }
        
        // Validate mmcif data format if present
        if (template.mmcif && typeof template.mmcif !== 'string') {
            errors.push(`${templateRef} mmcif must be a string`);
        }
    }
    
    return { errors, warnings };
};


/**
 * Update validation status display with colors and icons
 */
AlphaFold3Generator.prototype.updateValidationStatus = function(statusElement, errors, warnings) {
    let icon, className, message;
    
    if (errors.length === 0 && warnings.length === 0) {
        icon = 'fas fa-check-circle text-success';
        className = 'text-success small';
        message = 'Valid AlphaFold3 JSON';
    } else if (errors.length === 0) {
        icon = 'fas fa-exclamation-triangle text-warning';
        className = 'text-warning small';
        message = `Valid with ${warnings.length} warning(s): ${warnings.slice(0, 2).join('; ')}`;
        if (warnings.length > 2) message += '...';
    } else {
        icon = 'fas fa-times-circle text-danger';
        className = 'text-danger small';
        message = `${errors.length} error(s): ${errors.slice(0, 2).join('; ')}`;
        if (errors.length > 2) message += '...';
    }
    
    statusElement.innerHTML = `<i class="${icon} me-1"></i>${message}`;
    statusElement.className = className;
    
    // Store full validation details for tooltip or detailed view
    statusElement.title = [...errors, ...warnings].join('\n');
};

// generateJSON function removed - using the version from app.js with proper debugging

/**
 * Format JSON with basic syntax highlighting
 */
AlphaFold3Generator.prototype.formatJSONWithHighlighting = function(jsonData) {
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Basic syntax highlighting (simple approach)
    return jsonString
        .replace(/(".*?"):/g, '<span style="color: #0066cc; font-weight: bold;">$1</span>:')
        .replace(/: (".*?")/g, ': <span style="color: #009900;">$1</span>')
        .replace(/: (\d+)/g, ': <span style="color: #ff6600;">$1</span>')
        .replace(/: (true|false|null)/g, ': <span style="color: #cc6600;">$1</span>');
};

/**
 * Copy JSON with improved feedback
 */
AlphaFold3Generator.prototype.copyJSON = function() {
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonText = jsonOutput.textContent || jsonOutput.innerText;
    
    if (jsonText && jsonText !== 'Click "Generate" to create AlphaFold3 JSON' && !jsonText.startsWith('Error:')) {
        navigator.clipboard.writeText(jsonText).then(() => {
            this.showSuccess('JSON copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(jsonText);
        });
    } else {
        this.showError('No valid JSON to copy');
    }
};

/**
 * Fallback copy method for older browsers
 */
AlphaFold3Generator.prototype.fallbackCopyToClipboard = function(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            this.showSuccess('JSON copied to clipboard!');
        } else {
            this.showError('Failed to copy JSON');
        }
    } catch (err) {
        this.showError('Failed to copy JSON');
    }

    document.body.removeChild(textArea);
};

/**
 * Enhanced download with validation check
 */
AlphaFold3Generator.prototype.downloadJSON = function() {
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonText = jsonOutput.textContent || jsonOutput.innerText;
    
    if (jsonText && jsonText !== 'Click "Generate" to create AlphaFold3 JSON' && !jsonText.startsWith('Error:')) {
        // Use the formatted text from display to preserve formatting
        try {
            // Download the already-formatted JSON text as displayed
            const cleanJSON = jsonText;
            
            const jobName = document.getElementById('jobName').value || 'alphafold3_input';
            const filename = `${jobName.replace(/[^a-z0-9]/gi, '_')}.json`;
            
            const blob = new Blob([cleanJSON], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess(`JSON downloaded as ${filename}`);
        } catch (error) {
            this.showError('Invalid JSON format - cannot download');
        }
    } else {
        this.showError('No valid JSON to download');
    }
};

/**
 * Consolidate identical glycans that come from multimer counts
 * Only groups glycans with the same base chain ID (same site) and same structure
 */
AlphaFold3Generator.prototype.consolidateMultimerGlycans = function(glycanLigands) {
    // Group glycans by base glycan ID + structure + description
    // Look for multimer patterns: GLYCANA+SIGA, GLYCANA+SIGB (same base glycan, different protein chains)
    const groupingMap = new Map();

    for (const ligand of glycanLigands) {
        const chainId = ligand.ligand.id;
        const ccdCodes = ligand.ligand.ccdCodes.join(',');
        const description = ligand.ligand.description || '';

        // Extract base glycan ID by removing the protein chain suffix
        // Pattern: GLYCANAAA = GLYCANA (base) + AA (protein chain)
        // Pattern: GLYCANBAA = GLYCANB (base) + AA (protein chain)
        let baseGlycanId = chainId;
        let proteinChainId = '';

        // Look for protein chain patterns at the end (typically 2-4 uppercase letters)
        // Try from shortest to longest potential protein chain suffix
        for (let suffixLen = 2; suffixLen <= Math.min(4, chainId.length - 1); suffixLen++) {
            const potentialProteinChain = chainId.slice(-suffixLen);
            const potentialBase = chainId.slice(0, -suffixLen);

            // Check if this looks like a valid protein chain (all uppercase, reasonable length)
            // and the base ends with a letter (typical glycan naming)
            if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                potentialBase.length >= 7 &&  // GLYCANA is 7 chars minimum
                /[A-Z]$/.test(potentialBase)) {
                baseGlycanId = potentialBase;
                proteinChainId = potentialProteinChain;
                break;
            }
        }

        const groupKey = `${baseGlycanId}|${description}`;

        if (!groupingMap.has(groupKey)) {
            groupingMap.set(groupKey, {
                baseGlycanId: baseGlycanId,
                ligands: [],
                ccdCodes: ligand.ligand.ccdCodes,
                description: ligand.ligand.description,
                proteinChains: new Set()
            });
        }

        const group = groupingMap.get(groupKey);
        group.ligands.push(ligand);
        if (proteinChainId) {
            group.proteinChains.add(proteinChainId);
        }
    }

    // Create consolidated ligand entries
    const consolidatedLigands = [];

    for (const [groupKey, group] of groupingMap) {
        // Only consolidate if we have multiple protein chains for the same base glycan
        if (group.proteinChains.size > 1) {
            // Consolidate into single entry with multiple chain IDs
            const chainIds = group.ligands.map(l => l.ligand.id);
            const consolidatedLigand = {
                ligand: {
                    id: chainIds,
                    ccdCodes: group.ccdCodes
                }
            };

            if (group.description) {
                consolidatedLigand.ligand.description = group.description;
            }

            consolidatedLigands.push(consolidatedLigand);
        } else {
            // Keep as separate entries (different glycosylation sites or single protein chain)
            for (const ligand of group.ligands) {
                consolidatedLigands.push(ligand);
            }
        }
    }

    return consolidatedLigands;
};
