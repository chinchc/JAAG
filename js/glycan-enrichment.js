/**
 * Glycan Lookup Module
 * Handles back-conversion from CCD and bonded atom pairs to GlycoCT
 * and looks up glycan data from various databases
 */

/**
 * Main function to lookup glycan data by searching databases
 */
async function enrichGlycanData() {
    try {
        // Get current JSON data
        const jsonOutput = document.getElementById('jsonOutput');
        const jsonText = jsonOutput.textContent || jsonOutput.innerText;

        if (!jsonText || jsonText === 'Click "Generate" to create AlphaFold3 JSON' || jsonText.startsWith('Error:')) {
            throw new Error('Please generate JSON first');
        }

        const jsonData = JSON.parse(jsonText);

        // Show loading state
        showEnrichmentStatus('Fetching data from glycoinformatics databases. This may take up to a minute depending on server response times.', 'info');

        // Extract glycan sequences from JSON
        const glycanSequences = extractGlycanSequences(jsonData);

        if (glycanSequences.length === 0) {
            throw new Error('No glycan sequences found in the current JSON');
        }

        // Process each glycan sequence with deduplication (read-only, no JSON modification)
        let enrichedCount = 0;
        const glycoCTCache = new Map(); // Cache GlyCoCT -> database results

        for (const glycan of glycanSequences) {
            try {
                // Extract GlyCoCT for this glycan to check for duplicates
                const glycoCTForDedup = await extractGlyCoCTForGlycan(glycan);

                if (glycoCTForDedup && glycoCTCache.has(glycoCTForDedup)) {
                    // Use cached database results but still update UI for this specific glycan
                    const cachedResults = glycoCTCache.get(glycoCTForDedup);
                    const sequenceWithChainId = {
                        ...glycan.sequenceRef,
                        chainId: glycan.chainId,
                        id: glycan.chainId
                    };
                    updateSequenceDescription(sequenceWithChainId, cachedResults, glycan.type);
                    enrichedCount++;
                    continue;
                }

                // Do full lookup and cache results
                const databaseResults = await enrichSingleGlycan(glycan, jsonData);

                if (glycoCTForDedup && databaseResults) {
                    glycoCTCache.set(glycoCTForDedup, databaseResults);
                }

                enrichedCount++;
                showEnrichmentStatus(`Looked up ${enrichedCount}/${glycanSequences.length} glycans...`, 'info');
            } catch (error) {
                // Silent failure
            }
        }

        // Only update UI fields - JSON will be regenerated automatically by UI changes
        showEnrichmentStatus(`Successfully looked up ${enrichedCount}/${glycanSequences.length} glycans`, 'success');

    } catch (error) {
        showEnrichmentStatus(`Error: ${error.message}`, 'error');
    }
}

/**
 * Extract glycan sequences from the JSON data (ligands only)
 */
function extractGlycanSequences(jsonData) {
    const glycans = [];

    if (jsonData.sequences && Array.isArray(jsonData.sequences)) {
        jsonData.sequences.forEach((sequence, index) => {
            // Check for standalone ligand sequence (most common case)
            if (sequence.ligand && sequence.ligand.ccdCodes) {
                const ligandChainId = sequence.ligand.id;


                // Handle both string and array chain IDs
                let chainIdToCheck;
                if (Array.isArray(ligandChainId)) {
                    // For arrays, use the first chain ID for type detection
                    chainIdToCheck = ligandChainId[0];
                } else {
                    chainIdToCheck = ligandChainId;
                }

                // Determine ligand type based on chain ID pattern
                if (chainIdToCheck && chainIdToCheck.startsWith('GLYCAN')) {
                    // This is a sequon/manual glycosylation-generated ligand (GLYCANA, GLYCANB, etc.)
                    // For arrays, we need to process each chain ID separately
                    if (Array.isArray(ligandChainId)) {
                        ligandChainId.forEach((chainId, chainIndex) => {
                            glycans.push({
                                id: `ligand_${index}_${chainIndex}`,
                                type: 'glycosylation_ligand',
                                ccdCodes: sequence.ligand.ccdCodes,
                                chainId: chainId, // Use individual chain ID
                                sequenceRef: sequence.ligand,
                                parentSequence: sequence
                            });
                        });
                    } else {
                        glycans.push({
                            id: `ligand_${index}`,
                            type: 'glycosylation_ligand', // New type for sequon/manual glycans
                            ccdCodes: sequence.ligand.ccdCodes,
                            chainId: ligandChainId,
                            sequenceRef: sequence.ligand,  // Reference the ligand object directly
                            parentSequence: sequence       // Keep reference to parent sequence object
                        });
                    }
                } else {
                    // Check if this is a true standalone glycan ligand (user-added with glycoCT)
                    let hasSpecificGlycoCTInput = false;
                    const ligandInputs = document.querySelectorAll('textarea[id$="_glycoCT"]');

                    // Handle both single chain ID and array of chain IDs
                    const chainIdsToCheck = Array.isArray(ligandChainId) ? ligandChainId : [ligandChainId];

                    for (const chainId of chainIdsToCheck) {
                        for (const input of ligandInputs) {
                            const sequenceId = input.id.replace('_glycoCT', '');
                            const chainIdInput = document.getElementById(`${sequenceId}_id`);
                            const inputChainId = chainIdInput?.value;


                            // For multimers, the chain IDs might be derived (LIGA -> LIGAA, LIGAB, LIGAC)
                            // So also check if the input chain ID is a prefix of our chain ID
                            if (inputChainId && (
                                inputChainId === chainId || // Exact match
                                (Array.isArray(ligandChainId) && chainId.startsWith(inputChainId)) // Multimer match
                            )) {
                                // Also check if the GlyCoCT field actually contains valid data
                                const glycoCTValue = input.value.trim();
                                if (glycoCTValue && glycoCTValue.length > 0) {
                                    hasSpecificGlycoCTInput = true;
                                    break;
                                } else {
                                }
                            }
                        }
                        if (hasSpecificGlycoCTInput) break;
                    }

                    // Check if this ligand should be skipped - skip pure CCD ligands (no GlyCoCT data)
                    // Pure CCD ligands have ccdCodes but no GlyCoCT input anywhere
                    const hasCcdCodes = sequence.ligand?.ccdCodes && sequence.ligand.ccdCodes.length > 0;

                    if (hasCcdCodes && !hasSpecificGlycoCTInput) {
                        return; // Skip this ligand completely
                    }

                    if (hasSpecificGlycoCTInput) {
                        // This is a true user-added glycan ligand with GlyCoCT input

                        // For standalone ligands, create only one glycan object regardless of count
                        // (unlike sequons where each needs individual processing)
                        glycans.push({
                            id: `ligand_${index}`,
                            type: 'standalone_ligand',
                            ccdCodes: sequence.ligand.ccdCodes,
                            chainId: Array.isArray(ligandChainId) ?
                                // For arrays, use the base chain ID by removing the last character (LIGAA -> LIGA)
                                (ligandChainId[0].length > 1 ? ligandChainId[0].slice(0, -1) : ligandChainId[0]) :
                                ligandChainId, // Use base chain ID for UI matching
                            sequenceRef: sequence.ligand,  // Reference the ligand object directly
                            parentSequence: sequence,      // Keep reference to parent sequence object
                            allChainIds: ligandChainId     // Keep all chain IDs for reference
                        });
                    } else {
                        // This is a user-added CCD ligand, skip enrichment
                    }
                }
            }
            // Check for protein with embedded ligands (ligandChain.ligand format)
            else if (sequence.ligandChain && sequence.ligandChain.ligand) {
                glycans.push({
                    id: `ligand_${index}`,
                    type: 'legacy_ligand',
                    ccd: sequence.ligandChain.ligand,
                    sequenceRef: sequence
                });
            }
            // Check for protein with glycosylation sites (embedded in protein sequence)
            else if (sequence.protein && sequence._glycosylationSites) {
                sequence._glycosylationSites.forEach((site, siteIndex) => {
                    if (site.glycoct || site.ccdCodes) {
                        glycans.push({
                            id: `glycosite_${index}_${siteIndex}`,
                            type: 'protein_glycosite',
                            ccdCodes: site.ccdCodes,
                            chainId: site.chainId || `${sequence.protein.id}_${site.position}`,
                            sequenceRef: site,         // Reference the glycosylation site object
                            parentSequence: sequence,  // Keep reference to parent protein sequence
                            position: site.position
                        });
                    } else {
                    }
                });
            } else if (sequence.protein) {
            }
        });
    }

    return glycans;
}

/**
 * Extract GlyCoCT for a glycan (for deduplication purposes)
 */
async function extractGlyCoCTForGlycan(glycan) {
    // Reuse the same logic as enrichSingleGlycan but only return the GlyCoCT
    let glycoCT = null;

    // First try: Look for GlyCoCT in active glycans tracking (most specific)
    if (window.activeGlycans && window.activeGlycans.length > 0) {
        const activeGlycan = window.activeGlycans.find(g => g.chainId === glycan.chainId);
        if (activeGlycan && activeGlycan.glycoCT) {
            glycoCT = activeGlycan.glycoCT;
        }
    }

    // Second try: Look for GlyCoCT in sequon UI inputs (for protein glycosites and glycosylation ligands)
    if (!glycoCT && (glycan.type === 'protein_glycosite' || glycan.type === 'glycosylation_ligand')) {
        // Extract base glycan ID for multimer matching (remove protein chain suffix)
        let baseGlycanId = glycan.chainId;
        if (glycan.chainId) {
            // Use same logic as JSON generator to extract base glycan ID
            for (let suffixLen = 2; suffixLen <= Math.min(4, glycan.chainId.length - 1); suffixLen++) {
                const potentialProteinChain = glycan.chainId.slice(-suffixLen);
                const potentialBase = glycan.chainId.slice(0, -suffixLen);

                if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                    potentialBase.length >= 7 &&
                    /[A-Z]$/.test(potentialBase)) {
                    baseGlycanId = potentialBase;
                    break;
                }
            }
        }

        const allSequonInputs = document.querySelectorAll('textarea[id*="sequon"][id*="glycan"]');
        for (const input of allSequonInputs) {
            const inputId = input.id.replace('_glycan', '_chainId');
            const chainIdInput = document.getElementById(inputId);
            if (chainIdInput) {
                const sequonChainId = chainIdInput.value.trim();
                // Try exact match first, then base glycan ID match for multimers
                if (sequonChainId === glycan.chainId || sequonChainId === baseGlycanId) {
                    glycoCT = input.value.trim();
                    if (glycoCT) break;
                }
            }
        }
    }

    // Third try: Look for GlyCoCT in manual glycosylation site UI inputs
    if (!glycoCT && (glycan.type === 'protein_glycosite' || glycan.type === 'glycosylation_ligand')) {
        // Extract base glycan ID for multimer matching (remove protein chain suffix)
        let baseGlycanId = glycan.chainId;
        if (glycan.chainId) {
            // Use same logic as JSON generator to extract base glycan ID
            for (let suffixLen = 2; suffixLen <= Math.min(4, glycan.chainId.length - 1); suffixLen++) {
                const potentialProteinChain = glycan.chainId.slice(-suffixLen);
                const potentialBase = glycan.chainId.slice(0, -suffixLen);

                if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                    potentialBase.length >= 7 &&
                    /[A-Z]$/.test(potentialBase)) {
                    baseGlycanId = potentialBase;
                    break;
                }
            }
        }

        const allGlycoInputs = document.querySelectorAll('textarea[id*="glyco_"][id*="glycan"]');
        for (const input of allGlycoInputs) {
            const inputId = input.id.replace('_glycan', '_chainId');
            const chainIdInput = document.getElementById(inputId);
            if (chainIdInput) {
                const glycoChainId = chainIdInput.value.trim();
                // Try exact match first, then base glycan ID match for multimers
                if (glycoChainId === glycan.chainId || glycoChainId === baseGlycanId) {
                    glycoCT = input.value.trim();
                    if (glycoCT) break;
                }
            }
        }
    }

    // Fourth try: Look for GlyCoCT in standalone ligand input fields
    if (!glycoCT && glycan.type === 'standalone_ligand') {
        const ligandInputs = document.querySelectorAll('textarea[id$="_glycoCT"]');
        for (const input of ligandInputs) {
            const sequenceId = input.id.replace('_glycoCT', '');
            const chainIdInput = document.getElementById(`${sequenceId}_id`);
            const inputChainId = chainIdInput?.value;

            if (inputChainId && (
                inputChainId === glycan.chainId ||
                (Array.isArray(glycan.chainId) && glycan.chainId.includes(inputChainId)) ||
                glycan.chainId.startsWith(inputChainId)
            )) {
                glycoCT = input.value.trim();
                if (glycoCT) break;
            }
        }
    }

    return glycoCT;
}

/**
 * Enrich a single glycan with database information (read-only analysis)
 */
async function enrichSingleGlycan(glycan, jsonData) {

    // Step 1: Try to get GlycoCT from multiple sources
    let glycoCT = null;

    // First try: Look for GlycoCT in active glycans tracking (most specific)
    if (window.activeGlycans && window.activeGlycans.length > 0) {
        const activeGlycan = window.activeGlycans.find(g => g.chainId === glycan.chainId);
        if (activeGlycan && activeGlycan.glycoCT) {
            glycoCT = activeGlycan.glycoCT;
        }
    }

    // Second try: Look for GlycoCT in sequon UI inputs (for protein glycosites and glycosylation ligands)
    if (!glycoCT && (glycan.type === 'protein_glycosite' || glycan.type === 'glycosylation_ligand')) {
        // Extract base glycan ID for multimer matching (remove protein chain suffix)
        let baseGlycanId = glycan.chainId;
        if (glycan.chainId) {
            // Use same logic as JSON generator to extract base glycan ID
            for (let suffixLen = 2; suffixLen <= Math.min(4, glycan.chainId.length - 1); suffixLen++) {
                const potentialProteinChain = glycan.chainId.slice(-suffixLen);
                const potentialBase = glycan.chainId.slice(0, -suffixLen);

                if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                    potentialBase.length >= 7 &&
                    /[A-Z]$/.test(potentialBase)) {
                    baseGlycanId = potentialBase;
                    break;
                }
            }
        }

        // Try to find the sequon input that matches this glycan's chain ID (exact or base)
        const allSequonInputs = document.querySelectorAll('textarea[id*="sequon"][id*="glycan"]');
        for (const input of allSequonInputs) {
            // Check if the corresponding chain ID field matches our glycan's chain ID
            const inputId = input.id.replace('_glycan', '_chainId');
            const chainIdInput = document.getElementById(inputId);
            if (chainIdInput) {
                const sequonChainId = chainIdInput.value.trim();
                // Try exact match first, then base glycan ID match for multimers
                if (sequonChainId === glycan.chainId || sequonChainId === baseGlycanId) {
                    glycoCT = input.value.trim();
                    if (glycoCT) {
                        break;
                    }
                }
            }
        }
    }

    // Third try: Look for GlyCoCT in manual glycosylation site UI inputs (for protein glycosites and glycosylation ligands)
    if (!glycoCT && (glycan.type === 'protein_glycosite' || glycan.type === 'glycosylation_ligand')) {
        // Extract base glycan ID for multimer matching (remove protein chain suffix)
        let baseGlycanId = glycan.chainId;
        if (glycan.chainId) {
            // Use same logic as JSON generator to extract base glycan ID
            for (let suffixLen = 2; suffixLen <= Math.min(4, glycan.chainId.length - 1); suffixLen++) {
                const potentialProteinChain = glycan.chainId.slice(-suffixLen);
                const potentialBase = glycan.chainId.slice(0, -suffixLen);

                if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                    potentialBase.length >= 7 &&
                    /[A-Z]$/.test(potentialBase)) {
                    baseGlycanId = potentialBase;
                    break;
                }
            }
        }

        // Try to find the manual glyco input that matches this glycan's chain ID (exact or base)
        const allGlycoInputs = document.querySelectorAll('textarea[id*="glyco_"][id*="glycan"]');
        for (const input of allGlycoInputs) {
            // Check if the corresponding chain ID field matches our glycan's chain ID
            const inputId = input.id.replace('_glycan', '_chainId');
            const chainIdInput = document.getElementById(inputId);
            if (chainIdInput) {
                const glycoChainId = chainIdInput.value.trim();
                // Try exact match first, then base glycan ID match for multimers
                if (glycoChainId === glycan.chainId || glycoChainId === baseGlycanId) {
                    glycoCT = input.value.trim();
                    if (glycoCT) {
                        break;
                    }
                }
            }
        }
    }

    // Fourth try: Look for GlycoCT in glycosylation site data (legacy)
    if (!glycoCT && glycan.type === 'protein_glycosite' && glycan.sequenceRef && glycan.sequenceRef.glycoct) {
        glycoCT = glycan.sequenceRef.glycoct;
    }

    // Fifth try: Look for GlycoCT in standalone ligand input fields
    if (!glycoCT && glycan.type === 'standalone_ligand') {
        // Find the ligand sequence input by looking for textarea with sequenceId_glycoCT pattern
        const ligandInputs = document.querySelectorAll('textarea[id$="_glycoCT"]');

        for (const input of ligandInputs) {
            // Check if this input belongs to our ligand by checking the chain ID
            const sequenceId = input.id.replace('_glycoCT', '');
            const chainIdInput = document.getElementById(`${sequenceId}_id`);

            if (chainIdInput) {
                const inputChainId = chainIdInput.value;

                // Match single chain ID, array inclusion, or prefix match for multimers
                if (inputChainId === glycan.chainId ||
                    (Array.isArray(glycan.chainId) && glycan.chainId.includes(inputChainId)) ||
                    glycan.chainId.startsWith(inputChainId)) { // Multimer prefix match (LIGA matches LIGAA)
                    glycoCT = input.value.trim();
                    if (glycoCT) {
                        break;
                    }
                }
            }
        }
    }

    // Sixth try: Use stored GlycoCT from SugarDrawer (fallback only)
    if (!glycoCT && window.lastSugarDrawerGlycoCT) {
        glycoCT = window.lastSugarDrawerGlycoCT;
    }

    // Seventh try: Use a default sample structure for testing
    if (!glycoCT) {
        // For now, let's create a fallback enrichment that doesn't require GlycoCT
        const databaseInfo = {
            glytoucan: {
                found: false,
                description: 'No GlyTouCan ID found - please re-add glycan using SugarDrawer'
            }
        };
        // Create sequenceWithChainId object for fallback too
        const sequenceWithChainIdFallback = Object.assign({}, glycan.sequenceRef);
        sequenceWithChainIdFallback.chainId = glycan.chainId;
        sequenceWithChainIdFallback.id = glycan.chainId;

        updateSequenceDescription(sequenceWithChainIdFallback, databaseInfo, glycan.type);
        return databaseInfo;
    }


    // Step 2: Search databases
    const databaseInfo = await searchGlycanDatabases(glycoCT);

    // Step 3: Update only the description field (no JSON structure changes)

    // For all glycan types, we need to ensure individual chain IDs are used for description updates
    // Create a clean object, explicitly setting chainId and id
    const sequenceWithChainId = Object.assign({}, glycan.sequenceRef);
    sequenceWithChainId.chainId = glycan.chainId;  // Explicitly set chainId
    sequenceWithChainId.id = glycan.chainId;       // Explicitly set id
    updateSequenceDescription(sequenceWithChainId, databaseInfo, glycan.type);

    // Return database results for caching
    return databaseInfo;
}



/**
 * Search glycan databases using the same approach as SugarDrawer
 */
async function searchGlycanDatabases(glycoCT) {
    const results = {
        glygen: null,
        glytoucan: null,
        glyconnect: null,
        analysis: null
    };

    try {
        // Analyze the GlycoCT structure
        results.analysis = analyzeGlycoCTStructure(glycoCT);
    } catch (error) {
        // Silent failure
    }

    try {
        // Search GlyTouCan using SugarDrawer's approach
        results.glytoucan = await searchGlyTouCanLikeSugarDrawer(glycoCT);
    } catch (error) {
        results.glytoucan = {
            found: false,
            searchUrl: 'https://glytoucan.org/Structures/structureSearch',
            description: 'Search GlyTouCan repository manually'
        };
    }

    try {
        // Search GlyGen using GlycoCT structure search
        results.glygen = await searchGlyGenWithGlycoCT(glycoCT);
    } catch (error) {
        results.glygen = {
            found: false,
            searchUrl: 'https://www.glygen.org/search',
            description: 'Search GlyGen database manually'
        };
    }

    return results;
}

/**
 * Search GlyGen using GlycoCT structure via job API
 */
async function searchGlyGenWithGlycoCT(glycoCT) {
    try {
        // Step 1: Submit job
        const jobResponse = await fetch('https://api.glygen.org/job/addnew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jobtype: "structure_search",
                parameters: {
                    seq: glycoCT,
                    align: "wholeglycan"
                }
            })
        });

        if (!jobResponse.ok) {
            throw new Error(`GlyGen job submission error: ${jobResponse.status}`);
        }

        const jobData = await jobResponse.json();
        const jobId = jobData.jobid || jobData.id;

        if (!jobId) {
            throw new Error('No job ID returned from GlyGen API');
        }

        // Step 2: Poll for job completion
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout
        let jobResult = null;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second

            const statusResponse = await fetch('https://api.glygen.org/job/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobid: jobId
                })
            });

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                if (statusData.status === 'finished') {
                    jobResult = statusData;
                    break;
                }
            }
            attempts++;
        }

        if (!jobResult) {
            throw new Error('Job timeout or failed to complete');
        }

        // Step 3: Get glycan list results
        const listResponse = await fetch('https://api.glygen.org/glycan/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: jobResult.list_id,
                filters: [
                    {
                        id: "by_sequence_details",
                        operator: "OR",
                        selected: ["Fully defined"]
                    }
                ],
                columns: []
            })
        });

        if (!listResponse.ok) {
            throw new Error(`GlyGen list API error: ${listResponse.status}`);
        }

        const listData = await listResponse.json();

        if (listData && listData.results && listData.results.length > 0) {
            const firstResult = listData.results[0];
            return {
                found: true,
                glygen_id: firstResult.glytoucan_ac,
                url: `https://www.glygen.org/glycan/${firstResult.glytoucan_ac}`,
                description: `GlyGen ID: ${firstResult.glytoucan_ac}`,
                mass: firstResult.mass,
                hit_score: firstResult.hit_score,
                byonic: firstResult.byonic
            };
        } else {
            return {
                found: false,
                searchUrl: 'https://www.glygen.org/search',
                description: 'No matching structures found in GlyGen'
            };
        }
    } catch (error) {
        return {
            found: false,
            searchUrl: 'https://www.glygen.org/search',
            description: 'Error searching GlyGen database with GlycoCT'
        };
    }
}


/**
 * Search GlyTouCan using the same approach as SugarDrawer
 */
async function searchGlyTouCanLikeSugarDrawer(glycoCT) {
    try {
        // Step 1: Convert GlycoCT to WURCS using the same API as SugarDrawer
        const encodedGlycoCT = encodeURIComponent(glycoCT);
        const apiUrl = `https://api.glycosmos.org/glycanformatconverter/2.10.0/glycoct2wurcs/${encodedGlycoCT}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`GlycoSmos API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.id && data.WURCS) {
            return {
                found: true,
                id: data.id,
                wurcs: data.WURCS,
                url: `https://glytoucan.org/Structures/Glycans/${data.id}`,
                description: `GlyTouCan ID: ${data.id}`
            };
        } else {
            return {
                found: false,
                searchUrl: 'https://glytoucan.org/Structures/structureSearch',
                description: 'No GlyTouCan ID found for this structure'
            };
        }

    } catch (error) {
        throw error;
    }
}

/**
 * Analyze GlycoCT structure to extract useful information
 */
function analyzeGlycoCTStructure(glycoCT) {
    const analysis = {
        monosaccharides: [],
        composition: {},
        molecularFormula: '',
        estimatedMass: 0,
        linkageCount: 0
    };

    try {
        const lines = glycoCT.split('\n').map(line => line.trim()).filter(line => line);

        // Count residues and extract composition
        for (const line of lines) {
            if (line.startsWith('RES') || line.startsWith('LIN')) {
                continue; // Skip section headers
            }

            // Parse residue lines (e.g., "1b:b-dglc-HEX-1:5")
            const residueMatch = line.match(/^\d+[a-z]:[a-z]-[a-z]([a-z]+)-([A-Z]+)-/);
            if (residueMatch) {
                const [, sugarPart, type] = residueMatch;

                // Map common sugar abbreviations to full names
                const sugarMap = {
                    'glc': 'Glucose',
                    'man': 'Mannose',
                    'gal': 'Galactose',
                    'fuc': 'Fucose',
                    'xyl': 'Xylose',
                    'neu': 'NeuAc'
                };

                const sugarName = sugarMap[sugarPart] || sugarPart.toUpperCase();

                analysis.monosaccharides.push({
                    sugar: sugarName,
                    type: type,
                    line: line
                });

                // Count composition by sugar type
                if (!analysis.composition[sugarName]) {
                    analysis.composition[sugarName] = 0;
                }
                analysis.composition[sugarName]++;
            }

            // Parse modification lines (e.g., "9s:n-acetyl")
            const modMatch = line.match(/^\d+s:(.*)/);
            if (modMatch) {
                const modification = modMatch[1];
                if (!analysis.composition['Modifications']) {
                    analysis.composition['Modifications'] = [];
                }
                analysis.composition['Modifications'].push(modification);
            }
        }

        // Count linkages (LIN section)
        const linSection = glycoCT.indexOf('LIN');
        if (linSection !== -1) {
            const linLines = glycoCT.substring(linSection).split('\n').filter(line =>
                line.trim() && !line.startsWith('LIN') && line.includes(':')
            );
            analysis.linkageCount = linLines.length;
        }

        // Generate composition summary
        const compositionParts = [];
        for (const [sugar, count] of Object.entries(analysis.composition)) {
            if (sugar !== 'Modifications') {
                compositionParts.push(`${sugar}${count > 1 ? count : ''}`);
            }
        }
        analysis.molecularFormula = compositionParts.join(', ');

        return analysis;

    } catch (error) {
        return analysis;
    }
}

/**
 * Update UI description fields with database search results (read-only for JSON)
 */
function updateSequenceDescription(sequence, databaseInfo, glycanType) {

    let enrichedDescription = '';
    const descriptions = [];

    // Add GlyTouCan information if found
    if (databaseInfo.glytoucan?.found) {
        descriptions.push(`GlyTouCan ID: ${databaseInfo.glytoucan.id} (${databaseInfo.glytoucan.url})`);
    }

    // Add GlyGen information if found
    if (databaseInfo.glygen?.found) {
        descriptions.push(`GlyGen ID: ${databaseInfo.glygen.glygen_id} (${databaseInfo.glygen.url})`);
    }

    // Combine descriptions or provide fallback
    if (descriptions.length > 0) {
        enrichedDescription = descriptions.join(' | ');
    } else {
        enrichedDescription = 'No database matches found for this structure';
    }


    // DO NOT modify the JSON sequence object - only update UI fields
    // The JSON will be regenerated from UI inputs automatically
    updateDescriptionInputBox(sequence, enrichedDescription, glycanType);

}

/**
 * Update the description input box in the UI
 */
function updateDescriptionInputBox(sequence, lookupInfo, glycanType) {

    // Try to find the description input based on sequence reference
    let descriptionInput = null;

    // Strategy 1: Look for glycan chain description input by chain ID
    // Get the chain ID based on sequence type and glycan type
    let chainId;
    if (glycanType === 'protein_glycosite') {
        chainId = sequence.chainId; // For protein glycosites, use the chainId field
    } else if (glycanType === 'glycosylation_ligand') {
        chainId = sequence.chainId; // For glycosylation ligands (sequon/manual), use chainId
    } else {
        chainId = sequence.id || sequence.chainId; // For standalone ligands, use id or chainId
    }

    // Extract base glycan ID for UI field matching (remove protein chain suffix)
    let baseGlycanId = chainId;
    if (chainId) {
        // Use same logic as JSON generator to extract base glycan ID
        for (let suffixLen = 2; suffixLen <= Math.min(4, chainId.length - 1); suffixLen++) {
            const potentialProteinChain = chainId.slice(-suffixLen);
            const potentialBase = chainId.slice(0, -suffixLen);

            if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                potentialBase.length >= 7 &&
                /[A-Z]$/.test(potentialBase)) {
                baseGlycanId = potentialBase;
                break;
            }
        }
    }

    if (baseGlycanId) {
        const glycanDescriptionId = `glycan_${baseGlycanId}_description`;
        descriptionInput = document.getElementById(glycanDescriptionId);

        if (descriptionInput) {
        } else {
            // No description input found for this glycan
        }
    } else {
    }

    // Strategy 2: Look for sequon description input (for protein glycosylation sites and glycosylation ligands)
    if (!descriptionInput && (glycanType === 'protein_glycosite' || glycanType === 'glycosylation_ligand')) {
        // Find sequon description inputs that match the pattern: sequon_seq_X_TIMESTAMP_INDEX_description
        const allInputs = document.querySelectorAll('textarea[id*="sequon"][id*="description"]');

        // Try to match the specific sequon based on chain ID or position
        if (allInputs.length > 0) {
            // Look for a sequon that matches this glycan's chain ID
            let matchedInput = null;

            // Strategy 2a: Try to find sequon with matching base chain ID
            if (baseGlycanId) {
                for (const input of allInputs) {
                    // Check if the corresponding chain ID field has our glycan's base chain ID
                    const inputId = input.id.replace('_description', '_chainId');
                    const chainIdInput = document.getElementById(inputId);
                    const fieldValue = chainIdInput?.value;
                    const fieldPlaceholder = chainIdInput?.placeholder;

                    // Match by value if it exists, otherwise match by placeholder
                    const matchValue = fieldValue || fieldPlaceholder;
                    if (chainIdInput && matchValue === baseGlycanId) {
                        matchedInput = input;
                        break;
                    }
                }
            }

            // Strategy 2b: If no chain ID match, try matching by position (for protein glycosites)
            if (!matchedInput && sequence.position) {
                for (const input of allInputs) {
                    // Check if the corresponding position field matches
                    const inputId = input.id.replace('_description', '_position');
                    const positionInput = document.getElementById(inputId);
                    if (positionInput && parseInt(positionInput.value) === sequence.position) {
                        matchedInput = input;
                        break;
                    }
                }
            }

            // Strategy 2c: For both types, require exact matches to prevent cross-contamination
            if (!matchedInput) {
                // Could not find matching input for this sequence
            }

            if (matchedInput) {
                descriptionInput = matchedInput;
            }
        } else {
        }
    }

    // Strategy 3: Look for standalone ligand description input (for standalone ligands ONLY)
    if (!descriptionInput && glycanType === 'standalone_ligand' && chainId) {
        // Find the ligand description input by looking for textarea with sequenceId_description pattern
        const ligandDescInputs = document.querySelectorAll('textarea[id$="_description"]');

        for (const input of ligandDescInputs) {
            // Check if this input belongs to our ligand by checking the chain ID
            const sequenceId = input.id.replace('_description', '');
            const chainIdInput = document.getElementById(`${sequenceId}_id`);

            if (chainIdInput) {
                const inputChainId = chainIdInput.value;

                // Match single chain ID, array inclusion, or prefix match for multimers
                if (inputChainId === chainId ||
                    (Array.isArray(chainId) && chainId.includes(inputChainId)) ||
                    (typeof chainId === 'string' && chainId.startsWith(inputChainId))) { // Multimer prefix match (LIGA matches LIGAA)
                    descriptionInput = input;
                    break;
                }
            }
        }
    } else if (!descriptionInput && glycanType === 'standalone_ligand') {
    } else if (!descriptionInput && glycanType !== 'standalone_ligand') {
    }

    // Strategy 4: Look for manual glycosylation site description input (for protein glycosites and glycosylation ligands)
    if (!descriptionInput && (glycanType === 'protein_glycosite' || glycanType === 'glycosylation_ligand')) {
        // Find manual glycosylation site description inputs that match the pattern: glyco_seq_X_TIMESTAMP_description
        const allInputs = document.querySelectorAll('textarea[id*="glyco_"][id*="description"]');

        if (allInputs.length > 0) {
            // Try to match the specific manual glycosylation site based on chain ID
            let matchedInput = null;

            // Strategy 4a: Try to find manual glyco site with matching chain ID (exact or base)
            if (chainId) {
                // Extract base glycan ID for multimer matching (remove protein chain suffix)
                let baseGlycanId = chainId;
                if (chainId) {
                    // Use same logic as JSON generator to extract base glycan ID
                    for (let suffixLen = 2; suffixLen <= Math.min(4, chainId.length - 1); suffixLen++) {
                        const potentialProteinChain = chainId.slice(-suffixLen);
                        const potentialBase = chainId.slice(0, -suffixLen);

                        if (/^[A-Z]{2,4}$/.test(potentialProteinChain) &&
                            potentialBase.length >= 7 &&
                            /[A-Z]$/.test(potentialBase)) {
                            baseGlycanId = potentialBase;
                            break;
                        }
                    }
                }

                for (const input of allInputs) {
                    // Check if the corresponding chain ID field has our glycan's chain ID
                    const inputId = input.id.replace('_description', '_chainId');
                    const chainIdInput = document.getElementById(inputId);
                    if (chainIdInput) {
                        const glycoChainId = chainIdInput.value.trim();
                        // Try exact match first, then base glycan ID match for multimers
                        if (glycoChainId === chainId || glycoChainId === baseGlycanId) {
                            matchedInput = input;
                            break;
                        }
                    }
                }
            }

            // Strategy 4b: For glycosylation ligands, only use exact matches (no fallback)
            if (!matchedInput && glycanType === 'glycosylation_ligand') {
            } else if (!matchedInput) {
                // For protein glycosites, use first available as fallback
                matchedInput = allInputs[0];
            }

            if (matchedInput) {
                descriptionInput = matchedInput;
            }
        } else {
        }
    }

    // NO FALLBACK to protein descriptions - only update glycan-specific fields

    // Update input and JSON only if we found glycan-specific input
    if (descriptionInput) {
        const currentValue = descriptionInput.value || '';

        // Check if this lookup info is already present to prevent duplicates
        if (currentValue.includes(lookupInfo)) {
            return;
        }

        const newValue = currentValue ? `${currentValue} | ${lookupInfo}` : lookupInfo;

        descriptionInput.value = newValue;

        // Trigger input events to ensure UI listeners update JSON automatically
        descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
        descriptionInput.dispatchEvent(new Event('change', { bubbles: true }));

    } else {

        // Show a notification to the user that enrichment was completed but UI wasn't updated
        showEnrichmentStatus(`✅ Lookup completed: ${lookupInfo} (no UI field found to update)`, 'success');
    }
}

/**
 * Show enrichment status to user
 */
function showEnrichmentStatus(message, type = 'info') {

    // Update validation status area
    const statusElement = document.getElementById('validationStatus');
    if (statusElement) {
        let icon = 'fa-info-circle';
        let className = 'text-muted';

        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                className = 'text-success';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                className = 'text-danger';
                break;
            case 'info':
                icon = 'fa-spinner fa-spin';
                className = 'text-primary';
                break;
        }

        statusElement.innerHTML = `<i class="fas ${icon} me-1"></i>${message}`;
        statusElement.className = `small ${className}`;
    }

    // Show temporary toast notification using the app's toast system
    if (type === 'success' || type === 'error') {
        if (window.app) {
            // Map 'error' to 'danger' for consistency with app's toast system
            const toastType = type === 'error' ? 'danger' : type;
            window.app.showToast(message, toastType);
        }
    }
}


// Make the function globally available
window.enrichGlycanData = enrichGlycanData;
