// Sequence management functionality

function addSequence(type) {
    // Check if app is ready
    if (!window.app) {
        alert('Application not ready. Please wait a moment and try again.');
        return;
    }

    const container = document.getElementById('sequencesContainer');
    const sequenceId = `seq_${++window.app.sequenceCounter}`;
    
    // Create sequence object
    const sequence = {
        type: type,
        id: sequenceId,
        data: {}
    };
    
    // Generate HTML based on sequence type
    let html = '';
    
    switch (type) {
        case 'protein':
            html = createProteinSequenceHTML(sequenceId);
            break;
        case 'rna':
            html = createRNASequenceHTML(sequenceId);
            break;
        case 'dna':
            html = createDNASequenceHTML(sequenceId);
            break;
        case 'ligand':
            html = createLigandSequenceHTML(sequenceId);
            break;
    }
    
    // Clear placeholder if this is the first sequence
    if (window.app.sequences.length === 0) {
        container.innerHTML = '';
    }
    
    // Add to DOM
    const sequenceDiv = document.createElement('div');
    sequenceDiv.className = 'sequence-item card mb-3';
    sequenceDiv.id = `sequence_${sequenceId}`;
    sequenceDiv.innerHTML = html;
    container.appendChild(sequenceDiv);
    
    // Add to sequences array
    if (window.app) {
        window.app.sequences.push(sequence);
    } else {
        return;
    }
    
    // Setup event listeners for this sequence
    setupSequenceListeners(sequenceId, type);
    
    // Set automatic chain ID
    const chainIdInput = document.getElementById(`${sequenceId}_id`);
    if (chainIdInput) {
        const nextChainId = generateNextChainId(type);
        chainIdInput.value = nextChainId;
        chainIdInput.placeholder = nextChainId;
        // Update the badge immediately
        updateChainIdBadge(sequenceId, nextChainId);
    }
    
    // Initialize glycan template selector for protein sequences
    if (type === 'protein' && window.createTemplateSelector) {
        const templateContainerId = `${sequenceId}_templateSelector`;
        
        setTimeout(() => {
            window.createTemplateSelector(templateContainerId, function(template) {
                // Template selection will be handled by the applySelectedTemplate function
            });
        }, 100); // Small delay to ensure DOM is ready
    }
    
    // Initialize ligand input visibility if this is a ligand
    if (type === 'ligand') {
        toggleLigandInputs(sequenceId);
    }
    
    // Initialize sequence data immediately with default values
    
    // Update bonded atom pairs section visibility
    updateBondedAtomPairsVisibility();

    // Refresh bonded atom pair dropdowns
    refreshBondedAtomPairDropdowns();

    // Auto-generate JSON
    if (window.app) {
        window.app.debounceGenerate();
    }

    // Auto-scroll to the newly added sequence
    setTimeout(() => {
        const newSequenceElement = document.getElementById(`sequence_${sequenceId}`);
        if (newSequenceElement) {
            newSequenceElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, 150); // Small delay to ensure DOM is fully rendered
}

function createProteinSequenceHTML(sequenceId) {
    return `
        <div class="card-header d-flex justify-content-between align-items-center">
            <button class="btn btn-link text-start p-0 d-flex align-items-center" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${sequenceId}_collapse" 
                    aria-expanded="true" 
                    aria-controls="${sequenceId}_collapse"
                    style="text-decoration: none; color: inherit;">
                <span>Protein Sequence</span>
                <span class="badge bg-secondary ms-2" id="${sequenceId}_chainBadge">-</span>
                <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSequence('${sequenceId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="collapse show" id="${sequenceId}_collapse">
            <div class="card-body">
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">Chain ID*</label>
                    <input type="text" class="form-control" id="${sequenceId}_id" placeholder="" oninput="validateChainId(this); updateSequenceDataSync('${sequenceId}', 'protein');">

                    <label class="form-label mt-3">Count</label>
                    <input type="number" class="form-control" id="${sequenceId}_count" value="1" min="1" onchange="updateMultimerChains('${sequenceId}')">
                </div>
                <div class="col-md-10">
                    <label class="form-label">Protein Sequence*</label>
                    <div class="d-flex align-items-center mb-2">
                        <label class="form-label me-3 mb-0">UniProt Import (optional)</label>
                        <div class="input-group" style="max-width: 280px;">
                            <input type="text" class="form-control" id="${sequenceId}_uniprotId"
                                placeholder="UniProt ID (e.g., P20273)" style="text-transform: uppercase;"
                                oninput="this.value = this.value.toUpperCase()">
                            <button class="btn btn-outline-primary" type="button"
                                onclick="fetchUniProtSequence('${sequenceId}')" title="Fetch sequence from UniProt">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                    <textarea class="form-control" id="${sequenceId}_sequence" rows="3"
                        placeholder="Enter amino acid sequence (single letter codes) or use UniProt ID above"
                        oninput="validateProteinSequence(this); updateGlycosylationHighlighting('${sequenceId}'); updateSequenceDataSync('${sequenceId}', 'protein');" style="text-transform: uppercase;"></textarea>
                    <div id="${sequenceId}_sequenceWarning" class="text-danger mt-1" style="display: none;">
                        <small><i class="fas fa-exclamation-triangle me-1"></i>Invalid amino acid codes detected: <span id="${sequenceId}_invalidChars"></span></small>
                    </div>
                </div>
            </div>
            
            <!-- Description -->
            <div class="row mt-3">
                <div class="col-12">
                    <label for="${sequenceId}_description" class="form-label">Description (optional)</label>
                    <textarea class="form-control" id="${sequenceId}_description" rows="1" placeholder="Optional description for this protein sequence"></textarea>
                </div>
            </div>
            
            <!-- N-glycosylation based on sequon -->
            <div class="row mt-3">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <button class="btn btn-link text-start p-0 flex-grow-1"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_sequonCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_sequonCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <span>
                                    Auto N-glycosylation based on sequon
                                    <span id="${sequenceId}_sequonSitesBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                    <i class="fas fa-chevron-down ms-2"></i>
                                </span>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detectAndPopulateSequons('${sequenceId}')">
                                <i class="fas fa-search me-1"></i>Detect Sequons
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_sequonCollapse">
                            <div class="card-body">
                                <div class="mb-2">
                                    <small class="text-dark">
                                        <i class="fas fa-info-circle me-1"></i>
                                        This section automatically detects N-glycosylation sequons (N-X-S/T where X≠P) in your protein sequence.
                                        All sites use asparagine ND2 atom for glycan attachment.
                                    </small>
                                </div>

                                <!-- Glycan Template Selector -->
                                <div id="${sequenceId}_templateSelector" class="mb-3" style="display: none;"></div>

                                <div id="${sequenceId}_sequonSites" class="sequon-container">
                                    <small class="text-muted">Click "Detect Sequons" to automatically find N-glycosylation sites</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual Glycosylation Sites -->
            <div class="row mt-3">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <button class="btn btn-link text-start p-0 flex-grow-1"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_glycosylationCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_glycosylationCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <span>
                                    Manual Glycosylation Sites
                                    <span id="${sequenceId}_glycoSitesBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                    <i class="fas fa-chevron-down ms-2"></i>
                                </span>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addGlycosylationSite('${sequenceId}')">
                                <i class="fas fa-plus me-1"></i>Add Site
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_glycosylationCollapse">
                            <div class="card-body">
                                <div id="${sequenceId}_glycosylationSites" class="glycosylation-container">
                                    <small class="text-muted">No glycosylation sites defined</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Multimer chain display -->
            <div id="${sequenceId}_multimerChains" style="display: none;" class="mt-2">
                <small class="text-muted">Generated Chain IDs: <span id="${sequenceId}_chainList"></span></small>
            </div>
            
            <!-- Advanced Functions -->
            <div class="mt-3">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="toggleAdvancedFunctions('${sequenceId}')" id="${sequenceId}_advancedToggle">
                    <i class="fas fa-chevron-right me-1"></i>Advanced Functions
                </button>
                
                <div id="${sequenceId}_advancedSection" style="display: none;" class="mt-3 p-3 border rounded bg-light">
                    <!-- Modified Residues -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button type="button" class="btn btn-link text-start p-0 flex-grow-1"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_ptmCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_ptmCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <label class="form-label mb-0">Modified Residues</label>
                                <span id="${sequenceId}_ptmBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addPTM('${sequenceId}')">
                                <i class="fas fa-plus me-1"></i>Add modification
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_ptmCollapse">
                            <div id="${sequenceId}_ptms" class="ptm-container">
                                <small class="text-muted">No modification defined</small>
                            </div>
                        </div>
                    </div>

                    <!-- Separator Line -->
                    <hr class="my-3" style="border-top: 1px solid #adb5bd;">

                    <!-- User MSA -->
                    <div class="mb-3">
                        <button type="button" class="btn btn-link text-start p-0 w-100 mb-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#${sequenceId}_msaCollapse"
                                aria-expanded="false"
                                aria-controls="${sequenceId}_msaCollapse"
                                style="text-decoration: none; color: inherit;">
                            <label class="form-label mb-0">User MSA</label>
                            <span id="${sequenceId}_msaBadge" class="badge bg-secondary ms-2" style="display: none;">Data</span>
                            <i class="fas fa-chevron-down ms-2"></i>
                        </button>
                        <div class="collapse" id="${sequenceId}_msaCollapse">
                            <small class="text-muted d-block mb-2">Choose MSA input method</small>

                            <!-- MSA Input Type Selection -->
                            <div class="mb-2">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypeAuto" value="auto" checked onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypeAuto">
                                        <small>Automatic</small>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypePath" value="path" onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypePath">
                                        <small>File Paths</small>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypeDirect" value="direct" onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypeDirect">
                                        <small>Direct Data</small>
                                    </label>
                                </div>
                            </div>

                            <!-- MSA File Paths -->
                            <div id="${sequenceId}_msaPathSection" class="row mb-2" style="display: none;">
                                <div class="col-md-6">
                                    <label class="form-label">Unpaired MSA Path</label>
                                    <input type="text" class="form-control form-control-sm" id="${sequenceId}_unpairedMsaPath" placeholder="Path/to/unpaired/MSA/file">
                                    <small class="text-muted">A3M format file path</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Paired MSA Path</label>
                                    <input type="text" class="form-control form-control-sm" id="${sequenceId}_pairedMsaPath" placeholder="Path/to/paired/MSA/file">
                                    <small class="text-muted">Leave empty to use only unpaired</small>
                                </div>
                            </div>

                            <!-- Direct MSA Data -->
                            <div id="${sequenceId}_msaDirectSection" class="row mb-2" style="display: none;">
                                <div class="col-md-6">
                                    <label class="form-label">Unpaired MSA (A3M)</label>
                                    <textarea class="form-control form-control-sm" id="${sequenceId}_unpairedMsa" rows="3" placeholder="Paste A3M format MSA data here"></textarea>
                                    <small class="text-muted">First sequence must match query sequence</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Paired MSA (A3M)</label>
                                    <textarea class="form-control form-control-sm" id="${sequenceId}_pairedMsa" rows="3" placeholder="Optional paired MSA data"></textarea>
                                    <small class="text-muted">Leave empty to use only unpaired</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Separator Line -->
                    <hr class="my-3" style="border-top: 1px solid #adb5bd;">

                    <!-- Structural Templates -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button type="button" class="btn btn-link text-start p-0 flex-grow-1"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_templatesCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_templatesCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <label class="form-label mb-0">Structural Templates</label>
                                <span id="${sequenceId}_templatesBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addTemplate('${sequenceId}')">
                                <i class="fas fa-plus me-1"></i>Add Template
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_templatesCollapse">
                            <small class="text-muted d-block mb-2">Define structural templates to guide protein folding</small>
                            <div id="${sequenceId}_templates" class="template-container">
                                <small class="text-muted">No templates defined</small>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    `;
}

function createRNASequenceHTML(sequenceId) {
    return `
        <div class="card-header d-flex justify-content-between align-items-center">
            <button class="btn btn-link text-start p-0 d-flex align-items-center" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${sequenceId}_collapse" 
                    aria-expanded="true" 
                    aria-controls="${sequenceId}_collapse"
                    style="text-decoration: none; color: inherit;">
                <span>RNA Sequence</span>
                <span class="badge bg-secondary ms-2" id="${sequenceId}_chainBadge">-</span>
                <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSequence('${sequenceId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="collapse show" id="${sequenceId}_collapse">
            <div class="card-body">
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">Chain ID*</label>
                    <input type="text" class="form-control" id="${sequenceId}_id" placeholder="" oninput="validateChainId(this); updateSequenceDataSync('${sequenceId}', 'ligand');">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-control" id="${sequenceId}_count" value="1" min="1" onchange="updateMultimerChains('${sequenceId}')">
                </div>
                <div class="col-md-8">
                    <label class="form-label">RNA Sequence*</label>
                    <textarea class="form-control" id="${sequenceId}_sequence" rows="2"
                        placeholder="Enter RNA sequence (A, U, G, C)"
                        oninput="validateRNASequence(this); updateSequenceDataSync('${sequenceId}', 'rna');"></textarea>
                    <div class="text-danger small mt-1" id="${sequenceId}_sequenceWarning" style="display: none;">
                        <small><i class="fas fa-exclamation-triangle me-1"></i>Invalid nucleotide codes detected: <span id="${sequenceId}_invalidChars"></span></small>
                    </div>
                </div>
            </div>
            
            <!-- Multimer chain display -->
            <div id="${sequenceId}_multimerChains" style="display: none;" class="mt-2">
                <small class="text-muted">Generated Chain IDs: <span id="${sequenceId}_chainList"></span></small>
            </div>
            
            <!-- Description -->
            <div class="row mt-3">
                <div class="col-12">
                    <label for="${sequenceId}_description" class="form-label">Description (optional)</label>
                    <textarea class="form-control" id="${sequenceId}_description" rows="1" placeholder="Optional description for this RNA sequence"></textarea>
                </div>
            </div>
            
            <!-- Advanced Functions -->
            <div class="mt-3">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="toggleAdvancedFunctions('${sequenceId}')" id="${sequenceId}_advancedToggle">
                    <i class="fas fa-chevron-right me-1"></i>Advanced Functions
                </button>

                <div id="${sequenceId}_advancedSection" style="display: none;" class="mt-3 p-3 border rounded bg-light">
                    <!-- RNA Modifications -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button type="button" class="btn btn-link text-start p-0 flex-grow-1"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_modificationsCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_modificationsCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <label class="form-label mb-0">RNA Modifications</label>
                                <span id="${sequenceId}_modificationsBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addRNAModification('${sequenceId}')">
                                <i class="fas fa-plus me-1"></i>Add Modification
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_modificationsCollapse">
                            <div id="${sequenceId}_modifications" class="modification-container">
                                <small class="text-muted">No modifications defined</small>
                            </div>
                        </div>
                    </div>

                    <!-- Separator Line -->
                    <hr class="my-3" style="border-top: 1px solid #adb5bd;">

                    <!-- User MSA -->
                    <div class="mb-3">
                        <button type="button" class="btn btn-link text-start p-0 w-100 mb-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#${sequenceId}_msaCollapse"
                                aria-expanded="false"
                                aria-controls="${sequenceId}_msaCollapse"
                                style="text-decoration: none; color: inherit;">
                            <label class="form-label mb-0">User MSA</label>
                            <span id="${sequenceId}_msaBadge" class="badge bg-secondary ms-2" style="display: none;">Data</span>
                            <i class="fas fa-chevron-down ms-2"></i>
                        </button>
                        <div class="collapse" id="${sequenceId}_msaCollapse">
                            <small class="text-muted d-block mb-2">Choose MSA input method</small>

                            <!-- MSA Input Type Selection -->
                            <div class="mb-2">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypeAuto" value="auto" checked onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypeAuto">
                                        <small>Automatic</small>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypePath" value="path" onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypePath">
                                        <small>File Path</small>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="${sequenceId}_msaInputType" id="${sequenceId}_msaTypeDirect" value="direct" onchange="toggleMSAInput('${sequenceId}')">
                                    <label class="form-check-label" for="${sequenceId}_msaTypeDirect">
                                        <small>Direct Data</small>
                                    </label>
                                </div>
                            </div>

                            <!-- MSA File Path -->
                            <div id="${sequenceId}_msaPathSection" class="mb-2" style="display: none;">
                                <label class="form-label">Unpaired MSA Path</label>
                                <input type="text" class="form-control form-control-sm" id="${sequenceId}_unpairedMsaPath" placeholder="Path/to/unpaired/MSA/file">
                                <small class="text-muted">A3M format file path</small>
                            </div>

                            <!-- Direct MSA Data -->
                            <div id="${sequenceId}_msaDirectSection" class="mb-2" style="display: none;">
                                <label class="form-label">Unpaired MSA (A3M)</label>
                                <textarea class="form-control form-control-sm" id="${sequenceId}_unpairedMsa" rows="3" placeholder="Paste A3M format MSA data here"></textarea>
                                <small class="text-muted">First sequence must match query sequence</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}

function createDNASequenceHTML(sequenceId) {
    return `
        <div class="card-header d-flex justify-content-between align-items-center">
            <button class="btn btn-link text-start p-0 d-flex align-items-center" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${sequenceId}_collapse" 
                    aria-expanded="true" 
                    aria-controls="${sequenceId}_collapse"
                    style="text-decoration: none; color: inherit;">
                <span>DNA Sequence</span>
                <span class="badge bg-secondary ms-2" id="${sequenceId}_chainBadge">-</span>
                <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSequence('${sequenceId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="collapse show" id="${sequenceId}_collapse">
            <div class="card-body">
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">Chain ID*</label>
                    <input type="text" class="form-control" id="${sequenceId}_id" placeholder="" oninput="validateChainId(this); updateSequenceDataSync('${sequenceId}', 'ligand');">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-control" id="${sequenceId}_count" value="1" min="1" onchange="updateMultimerChains('${sequenceId}')">
                </div>
                <div class="col-md-8">
                    <label class="form-label">DNA Sequence*</label>
                    <textarea class="form-control" id="${sequenceId}_sequence" rows="2"
                        placeholder="Enter DNA sequence (A, T, G, C)"
                        oninput="validateDNASequence(this); updateSequenceDataSync('${sequenceId}', 'dna');"></textarea>
                    <div class="text-danger small mt-1" id="${sequenceId}_sequenceWarning" style="display: none;">
                        <small><i class="fas fa-exclamation-triangle me-1"></i>Invalid nucleotide codes detected: <span id="${sequenceId}_invalidChars"></span></small>
                    </div>
                </div>
            </div>
            
            <!-- Multimer chain display -->
            <div id="${sequenceId}_multimerChains" style="display: none;" class="mt-2">
                <small class="text-muted">Generated Chain IDs: <span id="${sequenceId}_chainList"></span></small>
            </div>
            
            <!-- Description -->
            <div class="row mt-3">
                <div class="col-12">
                    <label for="${sequenceId}_description" class="form-label">Description (optional)</label>
                    <textarea class="form-control" id="${sequenceId}_description" rows="1" placeholder="Optional description for this DNA sequence"></textarea>
                </div>
            </div>
            
            <!-- Advanced Functions -->
            <div class="mt-3">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="toggleAdvancedFunctions('${sequenceId}')" id="${sequenceId}_advancedToggle">
                    <i class="fas fa-chevron-right me-1"></i>Advanced Functions
                </button>

                <div id="${sequenceId}_advancedSection" style="display: none;" class="mt-3 p-3 border rounded bg-light">
                    <!-- DNA Modifications -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button type="button" class="btn btn-link text-start p-0 flex-grow-1"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${sequenceId}_modificationsCollapse"
                                    aria-expanded="false"
                                    aria-controls="${sequenceId}_modificationsCollapse"
                                    style="text-decoration: none; color: inherit;">
                                <label class="form-label mb-0">DNA Modifications</label>
                                <span id="${sequenceId}_modificationsBadge" class="badge bg-secondary ms-2" style="display: none;">0</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addDNAModification('${sequenceId}')">
                                <i class="fas fa-plus me-1"></i>Add Modification
                            </button>
                        </div>
                        <div class="collapse" id="${sequenceId}_modificationsCollapse">
                            <div id="${sequenceId}_modifications" class="modification-container">
                                <small class="text-muted">No modifications defined</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}

function createLigandSequenceHTML(sequenceId) {
    return `
        <div class="card-header d-flex justify-content-between align-items-center">
            <button class="btn btn-link text-start p-0 d-flex align-items-center" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${sequenceId}_collapse" 
                    aria-expanded="true" 
                    aria-controls="${sequenceId}_collapse"
                    style="text-decoration: none; color: inherit;">
                <span>Ligand</span>
                <span class="badge bg-secondary ms-2" id="${sequenceId}_chainBadge">-</span>
                <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSequence('${sequenceId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="collapse show" id="${sequenceId}_collapse">
            <div class="card-body">
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">Chain ID*</label>
                    <input type="text" class="form-control" id="${sequenceId}_id" placeholder="" oninput="validateChainId(this); updateSequenceDataSync('${sequenceId}', 'ligand');">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Input Type</label>
                    <select class="form-select" id="${sequenceId}_ligandType" onchange="toggleLigandInputs('${sequenceId}')">
                        <option value="glycan" selected>Glycan</option>
                        <option value="ccd">CCD Codes</option>
                        <option value="smiles">SMILES</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <div id="${sequenceId}_glycanInput">
                        <div class="d-flex align-items-center mb-1">
                            <label class="form-label mb-0 me-2">GlycoCT Data*</label>
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                    style="padding: 1px 4px; font-size: 10px;"
                                    onclick="openSugarDrawerPopup('${sequenceId}_glycoCT')"
                                    title="Open SugarDrawer to draw glycan structure">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <textarea class="form-control" id="${sequenceId}_glycoCT" rows="2" placeholder="Import GlycoCT from SugarDrawer or paste GlycoCT from database" oninput="updateSequenceDataSync('${sequenceId}', 'ligand')"></textarea>
                    </div>
                    <div id="${sequenceId}_ccdInput" style="display:none;">
                        <label class="form-label">CCD Codes*</label>
                        <input type="text" class="form-control" id="${sequenceId}_ccdCodes" placeholder="ATP,MG (comma-separated)" style="text-transform: uppercase;" oninput="this.value = this.value.toUpperCase()">
                    </div>
                    <div id="${sequenceId}_smilesInput" style="display:none;">
                        <label class="form-label">SMILES String*</label>
                        <input type="text" class="form-control" id="${sequenceId}_smiles" placeholder="Enter SMILES notation">
                    </div>
                </div>
            </div>

            <!-- Ligand count and description -->
            <div class="row mt-3">
                <div class="col-md-3">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-control" id="${sequenceId}_count" value="1" min="1" onchange="updateLigandMultimer('${sequenceId}')">
                </div>
                <div class="col-md-9">
                    <label for="${sequenceId}_description" class="form-label">Description (optional)</label>
                    <textarea class="form-control" id="${sequenceId}_description" rows="1" placeholder="Optional description for this ligand"></textarea>
                </div>
            </div>

            <!-- Multimer chains info -->
            <div class="row mt-2">
                <div class="col-12">
                    <div id="${sequenceId}_multimerChains" style="display:none;">
                        <small class="text-muted">
                            <i class="fas fa-link me-1"></i>
                            Multiple ligands will be created with chain IDs: <span id="${sequenceId}_chainList"></span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}

function setupSequenceListeners(sequenceId, type) {
    // Add event listeners for all inputs in this sequence
    const sequenceElement = document.getElementById(`sequence_${sequenceId}`);
    const inputs = sequenceElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            app.debounceGenerate();
        });
    });
    
    // Add special listeners for protein multimer functionality
    if (type === 'protein') {
        const chainIdInput = document.getElementById(`${sequenceId}_id`);
        const countInput = document.getElementById(`${sequenceId}_count`);
        
        if (chainIdInput) {
            chainIdInput.addEventListener('input', () => {
                updateMultimerChains(sequenceId);
            });
        }
        
        if (countInput) {
            countInput.addEventListener('change', () => {
                updateMultimerChains(sequenceId);
            });
        }
    }
}

// Synchronous wrapper for HTML event handlers
function updateSequenceDataSync(sequenceId, type) {
    updateSequenceData(sequenceId, type).catch(error => {
        if (window.app && window.app.addToDebugLog) {
            window.app.addToDebugLog('ERROR', `Failed to update sequence data: ${error.message}`);
        }
    });
}

async function updateSequenceData(sequenceId, type) {
    const sequence = app.sequences.find(seq => seq.id === sequenceId);
    if (!sequence) return;
    
    // Always allow updating sequence data when user changes inputs
    
    // Get common fields - check if DOM elements exist first
    const idElement = document.getElementById(`${sequenceId}_id`);
    const sequenceElement = document.getElementById(`${sequenceId}_sequence`);
    
    if (!idElement) {
        return;
    }
    
    const id = idElement.value;
    const sequenceValue = sequenceElement?.value;
    
    // Update chain ID badge
    updateChainIdBadge(sequenceId, id);
    
    // Build sequence data based on type
    switch (type) {
        case 'protein':
            sequence.data = buildProteinData(sequenceId, id, sequenceValue);
            break;
        case 'rna':
            sequence.data = buildRNAData(sequenceId, id, sequenceValue);
            break;
        case 'dna':
            sequence.data = buildDNAData(sequenceId, id, sequenceValue);
            break;
        case 'ligand':
            // Always rebuild ligand data from form to ensure GlycoCT input is processed
            sequence.data = await buildLigandData(sequenceId, id);
            break;
    }

    // Refresh bonded atom pair dropdowns when sequence data changes
    refreshBondedAtomPairDropdowns();
}

function updateChainIdBadge(sequenceId, chainId) {
    const badge = document.getElementById(`${sequenceId}_chainBadge`);
    if (badge) {
        badge.textContent = chainId || '-';
        // Change badge color based on whether chain ID is set
        if (chainId && chainId.trim()) {
            badge.className = 'badge bg-secondary ms-2';
        } else {
            badge.className = 'badge bg-secondary ms-2';
        }
    }
}

function buildProteinData(sequenceId, id, sequence) {
    // Check if this is a multimer
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    const count = parseInt(document.getElementById(`${sequenceId}_count`).value) || 1;
    
    if (count > 1 && sequenceObj && sequenceObj.multimerChainIds) {
        // Build single protein entry with array of chain IDs for multimers
        const proteinData = { protein: {} };

        // Use array of chain IDs instead of duplicating entries
        proteinData.protein.id = sequenceObj.multimerChainIds;
        if (sequence) proteinData.protein.sequence = sequence.replace(/\s/g, '').toUpperCase();

        // Add description if provided
        const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
        if (description) proteinData.protein.description = description;

        // Add PTMs if any
        const ptms = collectPTMs(sequenceId);
        if (ptms.length > 0) {
            proteinData.protein.modifications = ptms;
        }

        // Add MSA data if provided
        addMSADataToProtein(sequenceId, proteinData.protein);

        // Add templates if any
        const templates = collectTemplates(sequenceId);
        if (templates.length > 0) {
            proteinData.protein.templates = templates;
        }

        // Add glycosylation sites (applies to all chains in the multimer)
        const manualSites = collectGlycosylationSites(sequenceId);
        const sequonSites = collectSequonSites(sequenceId);

        // Remove duplicates between manual and sequon sites
        const deduplicatedSites = deduplicateGlycosylationSites(manualSites, sequonSites);
        const totalSites = deduplicatedSites.manual.length + deduplicatedSites.sequon.length;

        if (totalSites > 0) {
            proteinData._glycosylationSites = deduplicatedSites.manual;
            proteinData._sequonSites = deduplicatedSites.sequon;
            proteinData._proteinSequenceId = sequenceId;
            proteinData._proteinChainIds = sequenceObj.multimerChainIds; // Store all chain IDs for multimer
        }

        return proteinData;
    } else {
        // Single chain protein
        const data = { protein: {} };
        
        if (id) data.protein.id = id;
        if (sequence) data.protein.sequence = sequence.replace(/\s/g, '').toUpperCase();
        
        // Add description if provided
        const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
        if (description) data.protein.description = description;
        
        // Add PTMs if any
        const ptms = collectPTMs(sequenceId);
        if (ptms.length > 0) {
            data.protein.modifications = ptms;
        }
        
        // Add MSA data if provided
        addMSADataToProtein(sequenceId, data.protein);
        
        // Add templates if any
        const templates = collectTemplates(sequenceId);
        if (templates.length > 0) {
            data.protein.templates = templates;
        }
        
        // Store glycosylation sites for later processing during JSON generation (internal only)
        const manualSites = collectGlycosylationSites(sequenceId);
        const sequonSites = collectSequonSites(sequenceId);

        // Remove duplicates between manual and sequon sites
        const deduplicatedSites = deduplicateGlycosylationSites(manualSites, sequonSites);
        const totalSites = deduplicatedSites.manual.length + deduplicatedSites.sequon.length;

        if (totalSites > 0) {
            data._glycosylationSites = deduplicatedSites.manual;
            data._sequonSites = deduplicatedSites.sequon;
            data._proteinSequenceId = sequenceId;
        }
        
        return data;
    }
}

function buildRNAData(sequenceId, id, sequence) {
    // Check if this is a multimer
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    const count = parseInt(document.getElementById(`${sequenceId}_count`).value) || 1;

    const data = { rna: {} };

    if (count > 1 && sequenceObj && sequenceObj.multimerChainIds) {
        // Use array of chain IDs instead of duplicating entries
        data.rna.id = sequenceObj.multimerChainIds;
    } else {
        // Single chain
        if (id) data.rna.id = id;
    }

    if (sequence) data.rna.sequence = sequence.replace(/\s/g, '').toUpperCase();

    // Add description if provided
    const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
    if (description) data.rna.description = description;

    // Add modifications if any
    const modifications = collectRNAModifications(sequenceId);
    if (modifications.length > 0) {
        data.rna.modifications = modifications;
    }

    // Add MSA data based on input type selection
    const autoRadio = document.getElementById(`${sequenceId}_msaTypeAuto`);
    const pathRadio = document.getElementById(`${sequenceId}_msaTypePath`);
    const directRadio = document.getElementById(`${sequenceId}_msaTypeDirect`);

    if (pathRadio && pathRadio.checked) {
        const unpairedMsaPath = document.getElementById(`${sequenceId}_unpairedMsaPath`)?.value?.trim();
        if (unpairedMsaPath) data.rna.unpairedMsaPath = unpairedMsaPath;
    } else if (directRadio && directRadio.checked) {
        const unpairedMsa = document.getElementById(`${sequenceId}_unpairedMsa`)?.value?.trim();
        if (unpairedMsa) data.rna.unpairedMsa = unpairedMsa;
    }

    return data;
}

function buildDNAData(sequenceId, id, sequence) {
    // Check if this is a multimer
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    const count = parseInt(document.getElementById(`${sequenceId}_count`).value) || 1;

    const data = { dna: {} };

    if (count > 1 && sequenceObj && sequenceObj.multimerChainIds) {
        // Use array of chain IDs instead of duplicating entries
        data.dna.id = sequenceObj.multimerChainIds;
    } else {
        // Single chain
        if (id) data.dna.id = id;
    }

    if (sequence) data.dna.sequence = sequence.replace(/\s/g, '').toUpperCase();

    // Add description if provided
    const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
    if (description) data.dna.description = description;

    // Add modifications if any
    const modifications = collectDNAModifications(sequenceId);
    if (modifications.length > 0) {
        data.dna.modifications = modifications;
    }

    // DNA sequences do not support MSA

    return data;
}

async function buildLigandData(sequenceId, id) {
    // Check if this is a multimer
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    const count = parseInt(document.getElementById(`${sequenceId}_count`).value) || 1;
    
    if (count > 1 && sequenceObj && sequenceObj.multimerChainIds) {
        // Build single ligand entry with array of chain IDs for multimers
        const ligandData = { ligand: {} };

        // Use array of chain IDs instead of duplicating entries
        ligandData.ligand.id = sequenceObj.multimerChainIds;

        // Process ligand type data
        await addLigandTypeData(sequenceId, ligandData.ligand);

        // Add description if provided (put at end for consistent JSON order)
        const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
        if (description) ligandData.ligand.description = description;

        return ligandData;
    } else {
        // Single chain ligand
        const data = { ligand: {} };

        if (id) data.ligand.id = id;

        // Process ligand type data
        await addLigandTypeData(sequenceId, data.ligand);

        // Add description if provided (put at end for consistent JSON order)
        const description = document.getElementById(`${sequenceId}_description`)?.value?.trim();
        if (description) data.ligand.description = description;
        
        if (window.app && window.app.addToDebugLog && data.ligand.ccdCodes && data.ligand.ccdCodes.length > 0) {
            window.app.addToDebugLog('SUCCESS', `Ligand data created with ${data.ligand.ccdCodes.length} CCD codes`);
        }
        
        return data;
    }
}

async function addLigandTypeData(sequenceId, ligandObj) {
    // Check if ligand type element exists
    const ligandTypeElement = document.getElementById(`${sequenceId}_ligandType`);
    if (!ligandTypeElement) {
        return;
    }
    
    const ligandType = ligandTypeElement.value;

    // Store the input type in the ligand object for reference
    ligandObj.inputType = ligandType;

    switch (ligandType) {
        case 'ccd':
            const ccdCodesElement = document.getElementById(`${sequenceId}_ccdCodes`);
            if (ccdCodesElement && ccdCodesElement.value) {
                const rawCodes = ccdCodesElement.value.split(',').map(code => code.trim().toUpperCase());
                // Apply automatic CCD replacements (SIA → SIA-2, SLB → SLB-2, NGC → NGC-2, NGE → NGE-2)
                ligandObj.ccdCodes = await applyLigandCCDReplacements(rawCodes);
            }
            break;
        case 'smiles':
            const smilesElement = document.getElementById(`${sequenceId}_smiles`);
            if (smilesElement && smilesElement.value) {
                ligandObj.smiles = smilesElement.value;
            }
            break;
        case 'glycan':
            const glycoCTElement = document.getElementById(`${sequenceId}_glycoCT`);

            if (glycoCTElement && glycoCTElement.value) {
                // Validate the GlycoCT structure before processing
                if (typeof validateGlycoCTStructure === 'function') {
                    const validation = validateGlycoCTStructure(glycoCTElement.value);
                    if (!validation.valid) {
                        // Display validation errors inline
                        displayGlycoCTValidationErrors(`${sequenceId}_glycoCT`, validation);
                        return; // Exit early without processing
                    }
                }

                // Clear any previous validation errors if validation passed
                displayGlycoCTValidationErrors(`${sequenceId}_glycoCT`, { valid: true });

                try {
                    // Handle both single chain and multimer cases
                    const chainIds = Array.isArray(ligandObj.id) ? ligandObj.id : [ligandObj.id || 'L'];

                    // Convert using the first chain ID to get CCD codes (same for all chains)
                    const converted = await convertGlycoCTToEnhancedLigand(glycoCTElement.value, chainIds[0]);

                    // Process substituents if substituent handler is available
                    let finalCCDs = converted.ligand?.ligand?.ccdCodes || [];
                    let additionalBonds = converted.bondedAtomPairs || [];

                    if (window.substituentHandler) {
                        const substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(glycoCTElement.value, chainIds[0]);

                        if (substituentResult) {
                            // Check if combinedCCDs contains base sugars (proper merge) or just substituents (bug)
                            const hasBaseSugars = substituentResult.combinedCCDs?.some(ccd =>
                                ['NDG', 'GAL', 'GLC', 'MAN', 'FUC', 'GLB', 'ARA', 'RIB', 'XYL', 'GNS', 'IDR'].includes(ccd));

                            if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0 && hasBaseSugars) {
                                // Use combined CCDs (includes both base sugars and substituents properly merged)
                                finalCCDs = substituentResult.combinedCCDs;
                            } else if (substituentResult.substituentCCDs && substituentResult.substituentCCDs.length > 0) {
                                // Fallback: manually merge base + substituents using mergeSubstituentsInResOrder
                                if (window.mergeSubstituentsInResOrder && substituentResult.orderedEntries) {
                                    finalCCDs = window.mergeSubstituentsInResOrder(finalCCDs, substituentResult.orderedEntries);
                                } else {
                                    // Simple append fallback
                                    finalCCDs = finalCCDs.concat(substituentResult.substituentCCDs);
                                }
                            }

                            // Add substituent bonds
                            if (substituentResult.additionalBonds) {
                                additionalBonds = additionalBonds.concat(substituentResult.additionalBonds);
                            }

                            // Handle required userCCDs
                            if (substituentResult.requiredUserCCDs && Object.keys(substituentResult.requiredUserCCDs).length > 0) {
                                if (!window.app.userCCDs) {
                                    window.app.userCCDs = {};
                                }
                                Object.assign(window.app.userCCDs, substituentResult.requiredUserCCDs);
                            }
                        }
                    }

                    // Set CCD codes from conversion (with substituent enhancement)
                    if (finalCCDs && finalCCDs.length > 0) {
                        ligandObj.ccdCodes = finalCCDs;
                        if (window.app && window.app.addToDebugLog) {
                            window.app.addToDebugLog('SUCCESS', `Ligand CCD codes set: ${ligandObj.ccdCodes.join(', ')}`);
                        }
                    } else {
                        if (window.app && window.app.addToDebugLog) {
                            window.app.addToDebugLog('ERROR', 'Failed to extract CCD codes from glycan conversion');
                        }
                    }

                    // Add bonded atom pairs if they exist (always enabled)
                    if (additionalBonds && additionalBonds.length > 0) {
                        // Remove existing glycan-generated bonds for these chain IDs to prevent duplicates
                        for (const chainId of chainIds) {
                            window.app.bondedAtomPairs = window.app.bondedAtomPairs.filter(bond => {
                                // Keep manual bonds (objects with id property)
                                if (bond.id !== undefined) {
                                    return true;
                                }
                                // Remove glycan bonds that match this ligand's chain
                                if (Array.isArray(bond) && bond[0] && bond[1]) {
                                    return !(bond[0][0] === chainId && bond[1][0] === chainId);
                                }
                                return true;
                            });
                        }
                        // For multimers, generate bondedAtomPairs for each chain ID
                        for (const chainId of chainIds) {
                            // Create bondedAtomPairs with the specific chain ID for this ligand instance
                            const chainSpecificBonds = additionalBonds.map(bond => {
                                // Replace the chain ID in each bond pair
                                return [
                                    [chainId, bond[0][1], bond[0][2]], // [chainId, residueId, atomName]
                                    [chainId, bond[1][1], bond[1][2]]  // [chainId, residueId, atomName]
                                ];
                            });

                            window.app.bondedAtomPairs.push(...chainSpecificBonds);
                        }

                    } else {
                    }
                } catch (error) {
                    // Fallback: just leave the field empty or show error
                }
            } else {
                // GlycoCT is empty - remove any glycan-generated bonds for this ligand's chain IDs
                const chainIds = Array.isArray(ligandObj.id) ? ligandObj.id : [ligandObj.id || 'L'];
                for (const chainId of chainIds) {
                    window.app.bondedAtomPairs = window.app.bondedAtomPairs.filter(bond => {
                        // Keep manual bonds (objects with id property)
                        if (bond.id !== undefined) {
                            return true;
                        }
                        // Remove glycan bonds that match this ligand's chain
                        if (Array.isArray(bond) && bond[0] && bond[1]) {
                            return !(bond[0][0] === chainId && bond[1][0] === chainId);
                        }
                        return true;
                    });
                }
            }
            break;
    }
}

// Placeholder functions for modifications

function collectRNAModifications(sequenceId) {
    const modifications = [];
    const container = document.getElementById(`${sequenceId}_modifications`);

    if (container) {
        const modCards = container.querySelectorAll('[id^="rnamod_"]');
        modCards.forEach(card => {
            const modId = card.id;
            const position = parseInt(document.getElementById(`${modId}_position`)?.value);
            const type = document.getElementById(`${modId}_type`)?.value?.trim();

            if (position && type && position > 0) {
                modifications.push({
                    modType: type.toUpperCase(),
                    modPosition: position
                });
            }
        });
    }

    return modifications;
}

function collectDNAModifications(sequenceId) {
    const modifications = [];
    const container = document.getElementById(`${sequenceId}_modifications`);

    if (container) {
        const modCards = container.querySelectorAll('[id^="dnamod_"]');
        modCards.forEach(card => {
            const modId = card.id;
            const position = parseInt(document.getElementById(`${modId}_position`)?.value);
            const type = document.getElementById(`${modId}_type`)?.value?.trim();

            if (position && type && position > 0) {
                modifications.push({
                    modType: type.toUpperCase(),
                    modPosition: position
                });
            }
        });
    }

    return modifications;
}

/**
 * Clean up bonded atom pairs by removing bonds for chain IDs that don't exist in the JSON output
 */
function cleanupOrphanedBondedAtomPairs() {
    if (!window.app || !window.app.bondedAtomPairs || window.app.bondedAtomPairs.length === 0) {
        return;
    }

    // Get all valid chain IDs from the current JSON output
    const validChainIds = new Set();

    if (app.sequences) {
        app.sequences.forEach(seq => {
            if (seq.data) {
                // Check protein sequences
                if (seq.data.protein && seq.data.protein.id) {
                    if (Array.isArray(seq.data.protein.id)) {
                        seq.data.protein.id.forEach(id => validChainIds.add(id));
                    } else {
                        validChainIds.add(seq.data.protein.id);
                    }
                }
                // Check RNA sequences
                if (seq.data.rna && seq.data.rna.id) {
                    if (Array.isArray(seq.data.rna.id)) {
                        seq.data.rna.id.forEach(id => validChainIds.add(id));
                    } else {
                        validChainIds.add(seq.data.rna.id);
                    }
                }
                // Check DNA sequences
                if (seq.data.dna && seq.data.dna.id) {
                    if (Array.isArray(seq.data.dna.id)) {
                        seq.data.dna.id.forEach(id => validChainIds.add(id));
                    } else {
                        validChainIds.add(seq.data.dna.id);
                    }
                }
                // Check ligand sequences
                if (seq.data.ligand && seq.data.ligand.id) {
                    if (Array.isArray(seq.data.ligand.id)) {
                        seq.data.ligand.id.forEach(id => validChainIds.add(id));
                    } else {
                        validChainIds.add(seq.data.ligand.id);
                    }
                }
            }
        });
    }

    // Filter out bonds that reference non-existent chain IDs
    window.app.bondedAtomPairs = window.app.bondedAtomPairs.filter(bond => {
        // Keep manual bonds (objects with id property)
        if (bond.id !== undefined) {
            return true;
        }
        // For glycan bonds (arrays), check if both chain IDs exist
        if (Array.isArray(bond) && bond[0] && bond[1]) {
            const chain1 = bond[0][0];
            const chain2 = bond[1][0];
            return validChainIds.has(chain1) && validChainIds.has(chain2);
        }
        return true;
    });
}

function removeSequence(sequenceId) {
    // Remove from DOM
    const element = document.getElementById(`sequence_${sequenceId}`);
    if (element) {
        element.remove();
    }

    // Remove from sequences array
    app.sequences = app.sequences.filter(seq => seq.id !== sequenceId);

    // Clean up orphaned bonded atom pairs after removing sequence
    cleanupOrphanedBondedAtomPairs();

    // Show placeholder if no sequences left
    const container = document.getElementById('sequencesContainer');
    if (app.sequences.length === 0) {
        container.innerHTML = '<p class="text-muted">Click the buttons above to add sequences</p>';
    }

    // Update bonded atom pairs section visibility
    updateBondedAtomPairsVisibility();

    // Refresh bonded atom pair dropdowns
    refreshBondedAtomPairDropdowns();

    // Auto-cleanup unused userCCDs after sequence removal
    if (window.autoCleanupUserCCDs) {
        window.autoCleanupUserCCDs();
    }

    // Regenerate JSON
    app.debounceGenerate();
}

function updateLigandMultimer(sequenceId) {
    const countInput = document.getElementById(`${sequenceId}_count`);
    const chainIdInput = document.getElementById(`${sequenceId}_id`);
    const multimerDiv = document.getElementById(`${sequenceId}_multimerChains`);
    const chainListSpan = document.getElementById(`${sequenceId}_chainList`);

    if (!countInput || !chainIdInput || !multimerDiv || !chainListSpan) return;

    // Clean up old bondedAtomPairs before updating
    cleanupSequenceBondedAtomPairs(sequenceId);

    const count = parseInt(countInput.value) || 1;
    const baseId = chainIdInput.value || 'L';
    
    if (count > 1) {
        // Show multimer display
        multimerDiv.style.display = 'block';
        
        // Generate ligand chain IDs (using different prefix to avoid conflicts)
        const chainIds = generateLigandChainIds(baseId, count);
        chainListSpan.textContent = chainIds.join(', ');
        
        // Store the generated chain IDs for JSON generation
        const sequence = app.sequences.find(seq => seq.id === sequenceId);
        if (sequence) {
            sequence.multimerChainIds = chainIds;
        }
    } else {
        // Hide multimer display
        multimerDiv.style.display = 'none';
        
        // Clear stored chain IDs
        const sequence = app.sequences.find(seq => seq.id === sequenceId);
        if (sequence) {
            delete sequence.multimerChainIds;
        }
    }
    
    // Update sequence data to reflect multimer changes

    // Refresh bonded atom pair dropdowns
    refreshBondedAtomPairDropdowns();

    // Regenerate JSON
    app.debounceGenerate();
}

function toggleLigandInputs(sequenceId) {
    const typeElement = document.getElementById(`${sequenceId}_ligandType`);
    const type = typeElement ? typeElement.value : 'ccd';
    
    // Hide all input types
    const ccdInput = document.getElementById(`${sequenceId}_ccdInput`);
    const smilesInput = document.getElementById(`${sequenceId}_smilesInput`);
    const glycanInput = document.getElementById(`${sequenceId}_glycanInput`);
    
    if (ccdInput) ccdInput.style.display = 'none';
    if (smilesInput) smilesInput.style.display = 'none';
    if (glycanInput) glycanInput.style.display = 'none';
    
    // Show selected input type
    const targetInput = document.getElementById(`${sequenceId}_${type}Input`);
    if (targetInput) {
        targetInput.style.display = 'block';
    }
    
    // Update sequence data
}

// Functions for adding PTMs, modifications, and templates
function addTemplate(sequenceId) {
    // Expand the templates section
    const templatesCollapse = document.getElementById(`${sequenceId}_templatesCollapse`);
    if (templatesCollapse && !templatesCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(templatesCollapse, { show: true });
    }

    const container = document.getElementById(`${sequenceId}_templates`);
    const templateId = `template_${sequenceId}_${Date.now()}`;

    // Clear placeholder if this is the first template
    const placeholder = container.querySelector('.text-muted');
    if (placeholder && placeholder.textContent === 'No templates defined') {
        container.innerHTML = '';
    }
    
    const templateHTML = `
        <div class="card mb-2" id="${templateId}">
            <div class="card-body py-2">
                <div class="row">
                    <!-- Template Source Selection -->
                    <div class="col-12 mb-3">
                        <label class="form-label">Template Source*</label>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="${templateId}_sourceType" 
                                           id="${templateId}_sourceTypePath" value="mmcifPath" checked 
                                           onchange="toggleTemplateSource('${templateId}')">
                                    <label class="form-check-label" for="${templateId}_sourceTypePath">
                                        mmCIF File Path
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="${templateId}_sourceType" 
                                           id="${templateId}_sourceTypeInline" value="mmcif" 
                                           onchange="toggleTemplateSource('${templateId}')">
                                    <label class="form-check-label" for="${templateId}_sourceTypeInline">
                                        Inline mmCIF Data
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- mmCIF File Path Input -->
                    <div class="col-12 mb-3" id="${templateId}_pathSection">
                        <label class="form-label">mmCIF File Path*</label>
                        <input type="text" class="form-control form-control-sm" id="${templateId}_mmcifPath" 
                               placeholder="path/to/template.cif" onchange="updateTemplateData('${sequenceId}')">
                        <small class="text-muted">Path to the structural template mmCIF file</small>
                    </div>
                    
                    <!-- Inline mmCIF Data Input -->
                    <div class="col-12 mb-3" id="${templateId}_inlineSection" style="display: none;">
                        <label class="form-label">mmCIF Data*</label>
                        <textarea class="form-control form-control-sm" id="${templateId}_mmcif" rows="6" 
                                  placeholder="Paste mmCIF format data here..." onchange="updateTemplateData('${sequenceId}')"></textarea>
                        <small class="text-muted">Inline mmCIF structural data</small>
                    </div>
                    
                    <!-- Mapping Indices -->
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Query Indices*</label>
                        <input type="text" class="form-control form-control-sm" id="${templateId}_queryIndices" 
                               placeholder="0,1,2,4,5,6" onchange="updateTemplateData('${sequenceId}')">
                        <small class="text-muted">Comma-separated indices for query sequence</small>
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Template Indices*</label>
                        <input type="text" class="form-control form-control-sm" id="${templateId}_templateIndices" 
                               placeholder="0,1,2,3,4,8" onchange="updateTemplateData('${sequenceId}')">
                        <small class="text-muted">Comma-separated indices for template sequence</small>
                    </div>
                    
                    <!-- Remove Button -->
                    <div class="col-12">
                        <button type="button" class="btn btn-outline-danger btn-sm" 
                                onclick="removeTemplate('${templateId}', '${sequenceId}')">
                            <i class="fas fa-trash me-1"></i>Remove Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', templateHTML);
    
    // Setup event listeners for the new template
    setupTemplateListeners(templateId, sequenceId);
    
    // Update sequence data
    updateSequenceData(sequenceId, 'protein');
    app.debounceGenerate();
}

function toggleTemplateSource(templateId) {
    const pathRadio = document.getElementById(`${templateId}_sourceTypePath`);
    const inlineRadio = document.getElementById(`${templateId}_sourceTypeInline`);
    const pathSection = document.getElementById(`${templateId}_pathSection`);
    const inlineSection = document.getElementById(`${templateId}_inlineSection`);
    
    if (pathRadio && pathRadio.checked) {
        pathSection.style.display = 'block';
        inlineSection.style.display = 'none';
    } else if (inlineRadio && inlineRadio.checked) {
        pathSection.style.display = 'none';
        inlineSection.style.display = 'block';
    }
    
    // Extract sequenceId from templateId
    const sequenceId = templateId.split('_')[1];
    updateTemplateData(sequenceId);
}

function setupTemplateListeners(templateId, sequenceId) {
    const inputs = document.querySelectorAll(`#${templateId} input, #${templateId} textarea`);
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateSequenceData(sequenceId, 'protein');
            app.debounceGenerate();
        });
    });
}

function updateTemplateData(sequenceId) {
    app.debounceGenerate();
}

function removeTemplate(templateId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(templateId);
    if (element) {
        element.remove();
    }
    
    // Show placeholder if no templates left
    const container = document.getElementById(`${sequenceId}_templates`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">No templates defined</small>';
    }
    
    // Update sequence data
    updateSequenceData(sequenceId, 'protein');
    app.debounceGenerate();
}

function collectTemplates(sequenceId) {
    const templates = [];
    const container = document.getElementById(`${sequenceId}_templates`);


    if (container) {
        const templateCards = container.querySelectorAll('[id^="template_"]');

        templateCards.forEach(card => {
            const templateId = card.id;
            const template = {};


            // Get source type
            const pathRadio = document.getElementById(`${templateId}_sourceTypePath`);
            const inlineRadio = document.getElementById(`${templateId}_sourceTypeInline`);

            if (pathRadio && pathRadio.checked) {
                const mmcifPath = document.getElementById(`${templateId}_mmcifPath`)?.value?.trim();
                if (mmcifPath) {
                    template.mmcifPath = mmcifPath;
                }
            } else if (inlineRadio && inlineRadio.checked) {
                const mmcifData = document.getElementById(`${templateId}_mmcif`)?.value?.trim();
                if (mmcifData) {
                    template.mmcif = mmcifData;
                }
            }

            // Get indices
            const queryIndicesStr = document.getElementById(`${templateId}_queryIndices`)?.value?.trim();
            const templateIndicesStr = document.getElementById(`${templateId}_templateIndices`)?.value?.trim();


            if (queryIndicesStr && templateIndicesStr) {
                try {
                    const queryIndices = queryIndicesStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                    const templateIndices = templateIndicesStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

                    if (queryIndices.length > 0 && templateIndices.length > 0) {
                        template.queryIndices = queryIndices;
                        template.templateIndices = templateIndices;
                    }
                } catch (error) {
                }
            }


            // Include templates with any data (relaxed validation)
            if (template.mmcifPath || template.mmcif || template.queryIndices || template.templateIndices) {
                templates.push(template);
            } else {
            }
        });
    } else {
    }


    // Update the templates badge
    updateTemplatesBadge(sequenceId, templates.length);

    return templates;
}
function addPTM(sequenceId) {
    // Expand the PTM section
    const ptmCollapse = document.getElementById(`${sequenceId}_ptmCollapse`);
    if (ptmCollapse && !ptmCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(ptmCollapse, { show: true });
    }

    const container = document.getElementById(`${sequenceId}_ptms`);
    const ptmId = `ptm_${sequenceId}_${Date.now()}`;

    // Clear placeholder if this is the first PTM
    const placeholder = container.querySelector('.text-muted');
    if (placeholder && placeholder.textContent === 'No modification defined') {
        container.innerHTML = '';
    }
    
    const ptmHTML = `
        <div class="card mb-2" id="${ptmId}">
            <div class="card-body py-2">
                <div class="row align-items-start">
                    <div class="col-md-4">
                        <label class="form-label mb-1">Position*</label>
                        <input type="number" class="form-control form-control-sm" id="${ptmId}_position" 
                               placeholder="1" min="1" onchange="updatePTMMarking('${sequenceId}')">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label mb-1">Modification (Replace original residue)*</label>
                        <input type="text" class="form-control form-control-sm" id="${ptmId}_type" 
                               placeholder="Only single CCD (e.g., HY3, P1L) " style="text-transform: uppercase;" 
                               oninput="validateCCDCode(this)" onchange="updatePTMMarking('${sequenceId}')">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-outline-danger btn-sm mt-3" 
                                onclick="removePTM('${ptmId}', '${sequenceId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', ptmHTML);
    
    // Setup event listeners for the new PTM
    const positionInput = document.getElementById(`${ptmId}_position`);
    const typeInput = document.getElementById(`${ptmId}_type`);
    
    [positionInput, typeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                app.debounceGenerate();
            });
        }
    });
    
    // Update sequence data
    updateSequenceData(sequenceId, 'protein');
    app.debounceGenerate();
}

function removePTM(ptmId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(ptmId);
    if (element) {
        element.remove();
    }
    
    // Show placeholder if no PTMs left
    const container = document.getElementById(`${sequenceId}_ptms`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">No modification defined</small>';
    }
    
    // Update sequence data and marking
    updatePTMMarking(sequenceId);
    updateSequenceData(sequenceId, 'protein');
    app.debounceGenerate();
}

function validateCCDCode(input) {
    // Convert to uppercase and remove invalid characters
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Update input value
    if (input.value !== value) {
        input.value = value;
    }
}

function collectPTMs(sequenceId) {
    const ptms = [];
    const container = document.getElementById(`${sequenceId}_ptms`);
    
    if (container) {
        const ptmCards = container.querySelectorAll('[id^="ptm_"]');
        ptmCards.forEach(card => {
            const ptmId = card.id;
            const position = parseInt(document.getElementById(`${ptmId}_position`)?.value);
            const type = document.getElementById(`${ptmId}_type`)?.value?.trim();
            
            if (position && type && position > 0) {
                ptms.push({
                    ptmType: type.toUpperCase(),
                    ptmPosition: position
                });
            }
        });
    }
    
    return ptms;
}

function updatePTMMarking(sequenceId) {
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) return;
    
    // Get current PTMs
    const ptms = collectPTMs(sequenceId);
    const sequence = sequenceInput.value.toUpperCase();

    // Update PTM badge
    updatePTMBadge(sequenceId, ptms.length);
    
    if (ptms.length > 0 && sequence) {
        // Get modified positions
        const modifiedPositions = ptms.map(ptm => ptm.ptmPosition);
        sequenceInput.dataset.modifiedPositions = JSON.stringify(modifiedPositions);
        sequenceInput.classList.add('has-modifications');
        
        // Update the visual marking considering PTMs, glycosylation, and sequons
        const glycosylatedPositions = sequenceInput?.dataset.glycosylatedPositions ?
            JSON.parse(sequenceInput.dataset.glycosylatedPositions) : [];
        const sequonPositions = sequenceInput?.dataset.sequonPositions ?
            JSON.parse(sequenceInput.dataset.sequonPositions) : [];
        updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, modifiedPositions);
    } else {
        sequenceInput.classList.remove('has-modifications');
        delete sequenceInput.dataset.modifiedPositions;
        
        // Check if we still have glycosylation or sequons to show
        const glycosylatedPositions = sequenceInput?.dataset.glycosylatedPositions ?
            JSON.parse(sequenceInput.dataset.glycosylatedPositions) : [];
        const sequonPositions = sequenceInput?.dataset.sequonPositions ?
            JSON.parse(sequenceInput.dataset.sequonPositions) : [];
        if (glycosylatedPositions.length > 0 || sequonPositions.length > 0) {
            updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, []);
        } else {
            updateSequenceVisualization(sequenceId);
        }
    }
}

function updateSequenceVisualMarking(sequenceId, sequence, modifiedPositions) {
    // Update the main visualization div to include PTM marking
    const vizDiv = document.getElementById(`${sequenceId}_sequenceViz`);
    if (!vizDiv || !sequence) return;

    // Simple sequence display with PTM highlighting and spacing every 10 residues
    const residuesPerLine = 50;
    let allLines = '';

    for (let lineStart = 0; lineStart < sequence.length; lineStart += residuesPerLine) {
        const lineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let sequenceLine = '';

        // Build sequence line
        for (let i = lineStart; i < lineEnd; i++) {
            const position = i + 1;
            const char = sequence[i];
            const isModified = modifiedPositions.includes(position);

            // Sequence line with PTM highlighting
            if (isModified) {
                sequenceLine += `<span style="background: #ffeb3b; color: #d32f2f; font-weight: bold; padding: 0px 1px; border-radius: 2px;" title="Modified residue at position ${position}">${char}</span>`;
            } else {
                sequenceLine += char;
            }

            // Add space every 10 residues for readability
            if (position % 10 === 0 && i < lineEnd - 1) {
                sequenceLine += ' ';
            }
        }

        // Build zeros line with exact same logic, but handling multi-digit positions
        // Always build for full residuesPerLine even if actual line is shorter
        const fullLineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let zerosLine = '';
        let positionOverrideDigits = [];
        let positionMarkers = []; // Track which characters are part of position numbers

        for (let i = lineStart; i < lineStart + residuesPerLine; i++) {
            const position = i + 1;
            const isActualSequence = i < fullLineEnd;

            // Check if we're in the middle of a multi-digit position number
            if (positionOverrideDigits.length > 0) {
                const digit = positionOverrideDigits.shift();
                zerosLine += digit;
                positionMarkers.push(true); // This character is part of a position number
            } else if (isActualSequence && (position - 1) % 10 === 0) { // positions 1, 11, 21, 31, etc.
                const posStr = position.toString();
                zerosLine += posStr[0]; // Add first digit
                positionMarkers.push(true); // This character is part of a position number
                if (posStr.length > 1) {
                    positionOverrideDigits = posStr.substring(1).split(''); // Store remaining digits
                }
            } else {
                zerosLine += '0';
                positionMarkers.push(false); // All standalone zeros should be replaceable
            }

            // Add space every 10 residues for readability - same logic as sequence
            if (position % 10 === 0 && i < lineStart + residuesPerLine - 1) {
                zerosLine += ' ';
                positionMarkers.push(false); // Space character
            }
        }

        // Replace only standalone zeros with non-breaking spaces
        let finalZerosLine = '';
        for (let i = 0; i < zerosLine.length; i++) {
            if (zerosLine[i] === '0' && !positionMarkers[i]) {
                finalZerosLine += '&nbsp;';
            } else {
                finalZerosLine += zerosLine[i];
            }
        }
        zerosLine = finalZerosLine;

        // Add zeros line first
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #007bff;">${zerosLine}</div>`;
        // Then add sequence line
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #333;">${sequenceLine}</div>`;
    }
    
    // Build final visualization with PTM info
    const totalLength = sequence.length;
    const modifiedCount = modifiedPositions.length;
    const ptmInfo = modifiedCount > 0 ? `<span style="color: #d32f2f; font-weight: bold;"> | Modified: ${modifiedCount} residues</span>` : '';
    
    const visualization = `
        <div style="color: #666; font-size: 11px; margin-bottom: 6px;">
            <strong>Sequence:</strong>
        </div>
        ${allLines}
        <div style="color: #666; font-size: 11px; margin-top: 6px;">
            <strong>Length:</strong> ${totalLength} residues${ptmInfo}
        </div>
    `;
    
    vizDiv.innerHTML = visualization;
}


function addRNAModification(sequenceId) {
    // Expand the modifications section
    const modificationsCollapse = document.getElementById(`${sequenceId}_modificationsCollapse`);
    if (modificationsCollapse && !modificationsCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(modificationsCollapse, { show: true });
    }

    const container = document.getElementById(`${sequenceId}_modifications`);
    const modId = `rnamod_${sequenceId}_${Date.now()}`;

    // Clear placeholder if this is the first modification
    const placeholder = container.querySelector('.text-muted');
    if (placeholder && placeholder.textContent === 'No modifications defined') {
        container.innerHTML = '';
    }

    const modHTML = `
        <div class="card mb-2" id="${modId}">
            <div class="card-body py-2">
                <div class="row align-items-start">
                    <div class="col-md-4">
                        <label class="form-label mb-1">Position*</label>
                        <input type="number" class="form-control form-control-sm" id="${modId}_position"
                               placeholder="1" min="1" onchange="updateRNAModificationData('${sequenceId}')">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label mb-1">Modification (Replace original nucleotide)*</label>
                        <input type="text" class="form-control form-control-sm" id="${modId}_type"
                               placeholder="CCD code (e.g., PSU, 5MC)" style="text-transform: uppercase;"
                               oninput="validateCCDCode(this)" onchange="updateRNAModificationData('${sequenceId}')">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-outline-danger btn-sm mt-3"
                                onclick="removeRNAModification('${modId}', '${sequenceId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', modHTML);

    // Setup event listeners for the new modification
    const positionInput = document.getElementById(`${modId}_position`);
    const typeInput = document.getElementById(`${modId}_type`);

    [positionInput, typeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                app.debounceGenerate();
            });
        }
    });

    // Update sequence data
    updateSequenceData(sequenceId, 'rna');
    app.debounceGenerate();
}

function removeRNAModification(modId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(modId);
    if (element) {
        element.remove();
    }

    // Show placeholder if no modifications left
    const container = document.getElementById(`${sequenceId}_modifications`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">No modifications defined</small>';
    }

    // Update sequence data
    updateSequenceData(sequenceId, 'rna');
    app.debounceGenerate();
}

function updateRNAModificationData(sequenceId) {
    updateSequenceData(sequenceId, 'rna');
    app.debounceGenerate();
}

function addDNAModification(sequenceId) {
    // Expand the modifications section
    const modificationsCollapse = document.getElementById(`${sequenceId}_modificationsCollapse`);
    if (modificationsCollapse && !modificationsCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(modificationsCollapse, { show: true });
    }

    const container = document.getElementById(`${sequenceId}_modifications`);
    const modId = `dnamod_${sequenceId}_${Date.now()}`;

    // Clear placeholder if this is the first modification
    const placeholder = container.querySelector('.text-muted');
    if (placeholder && placeholder.textContent === 'No modifications defined') {
        container.innerHTML = '';
    }

    const modHTML = `
        <div class="card mb-2" id="${modId}">
            <div class="card-body py-2">
                <div class="row align-items-start">
                    <div class="col-md-4">
                        <label class="form-label mb-1">Position*</label>
                        <input type="number" class="form-control form-control-sm" id="${modId}_position"
                               placeholder="1" min="1" onchange="updateDNAModificationData('${sequenceId}')">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label mb-1">Modification (Replace original nucleotide)*</label>
                        <input type="text" class="form-control form-control-sm" id="${modId}_type"
                               placeholder="CCD code (e.g., 5MC, 6MA)" style="text-transform: uppercase;"
                               oninput="validateCCDCode(this)" onchange="updateDNAModificationData('${sequenceId}')">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-outline-danger btn-sm mt-3"
                                onclick="removeDNAModification('${modId}', '${sequenceId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', modHTML);

    // Setup event listeners for the new modification
    const positionInput = document.getElementById(`${modId}_position`);
    const typeInput = document.getElementById(`${modId}_type`);

    [positionInput, typeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                app.debounceGenerate();
            });
        }
    });

    // Update sequence data
    updateSequenceData(sequenceId, 'dna');
    app.debounceGenerate();
}

function removeDNAModification(modId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(modId);
    if (element) {
        element.remove();
    }

    // Show placeholder if no modifications left
    const container = document.getElementById(`${sequenceId}_modifications`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">No modifications defined</small>';
    }

    // Update sequence data
    updateSequenceData(sequenceId, 'dna');
    app.debounceGenerate();
}

function updateDNAModificationData(sequenceId) {
    updateSequenceData(sequenceId, 'dna');
    app.debounceGenerate();
}

// Helper function to get all available chain IDs
function getAllChainIds() {
    const chainIds = [];

    // Get chain IDs directly from input fields and multimer data
    if (app.sequences) {
        app.sequences.forEach(seq => {
            // First try to get from multimer chain IDs if available
            if (seq.multimerChainIds && Array.isArray(seq.multimerChainIds)) {
                seq.multimerChainIds.forEach(chainId => {
                    if (chainId && !chainIds.includes(chainId)) {
                        chainIds.push(chainId);
                    }
                });
            } else {
                // Otherwise get from the chain ID input field
                const chainIdInput = document.getElementById(`${seq.id}_id`);
                if (chainIdInput && chainIdInput.value) {
                    const chainId = chainIdInput.value.trim();
                    if (chainId && !chainIds.includes(chainId)) {
                        chainIds.push(chainId);
                    }
                }
            }
        });
    }

    // Also collect glycan chain IDs from glycosylation sites
    if (app.sequences) {
        app.sequences.forEach(seq => {
            if (seq.type === 'protein') {
                // Get base glycan chain IDs and generate multimer variations if needed
                const baseGlycanChainIds = [];

                // Get glycan chain IDs from manual glycosylation sites
                const glycosylationSites = document.getElementById(`${seq.id}_glycosylationSites`);
                if (glycosylationSites) {
                    const chainIdInputs = glycosylationSites.querySelectorAll('[id$="_chainId"]');
                    chainIdInputs.forEach(input => {
                        const chainId = input.value.trim();
                        if (chainId && !baseGlycanChainIds.includes(chainId)) {
                            baseGlycanChainIds.push(chainId);
                        }
                    });
                }

                // Get glycan chain IDs from sequon sites
                const sequonSites = document.getElementById(`${seq.id}_sequonSites`);
                if (sequonSites) {
                    const chainIdInputs = sequonSites.querySelectorAll('[id$="_chainId"]');
                    chainIdInputs.forEach(input => {
                        const chainId = input.value.trim();
                        if (chainId && !baseGlycanChainIds.includes(chainId)) {
                            baseGlycanChainIds.push(chainId);
                        }
                    });
                }

                // For each base glycan chain ID, generate variants for multimers
                baseGlycanChainIds.forEach(baseGlycanChainId => {
                    if (seq.multimerChainIds && Array.isArray(seq.multimerChainIds)) {
                        // For multimers, generate glycan chain ID for each protein chain
                        seq.multimerChainIds.forEach(proteinChainId => {
                            const glycanChainId = `${baseGlycanChainId}${proteinChainId}`;
                            if (!chainIds.includes(glycanChainId)) {
                                chainIds.push(glycanChainId);
                            }
                        });
                    } else {
                        // Single chain case - use base glycan chain ID
                        if (!chainIds.includes(baseGlycanChainId)) {
                            chainIds.push(baseGlycanChainId);
                        }
                    }
                });
            }
        });
    }

    return chainIds.sort();
}

// Helper function to get residue count for a specific chain
async function getResidueCountForChain(chainId) {
    if (!app.sequences) return 0;

    // First check regular sequences (proteins, ligands, DNA)
    for (let seq of app.sequences) {
        // Check if this sequence contains the chain ID
        let isThisSequence = false;

        if (seq.multimerChainIds && Array.isArray(seq.multimerChainIds)) {
            // Multimer case - check if chainId is in the array
            isThisSequence = seq.multimerChainIds.includes(chainId);
        } else {
            // Single chain case - check if chain ID matches input field
            const chainIdInput = document.getElementById(`${seq.id}_id`);
            if (chainIdInput && chainIdInput.value) {
                isThisSequence = chainIdInput.value.trim() === chainId;
            }
        }

        if (isThisSequence) {
            // For ligands, count CCD codes if available
            if (seq.type === 'ligand') {
                if (seq.data && seq.data.ligand && seq.data.ligand.ccdCodes && Array.isArray(seq.data.ligand.ccdCodes)) {
                    return seq.data.ligand.ccdCodes.length;
                }
                // If no CCD codes yet, try to get from input field
                const ccdCodesInput = document.getElementById(`${seq.id}_ccdCodes`);
                if (ccdCodesInput && ccdCodesInput.value) {
                    const ccdCodes = ccdCodesInput.value.split(',').map(code => code.trim()).filter(code => code.length > 0);
                    return ccdCodes.length;
                }
                return 0;
            } else {
                // For proteins/DNA, get sequence length
                const sequenceInput = document.getElementById(`${seq.id}_sequence`);
                if (sequenceInput && sequenceInput.value) {
                    return sequenceInput.value.replace(/\s/g, '').length;
                }
            }
        }
    }

    // Check if this is a glycan chain ID from glycosylation sites
    for (let seq of app.sequences) {
        if (seq.type === 'protein') {
            // Helper function to get CCD count from a site
            const getCCDCountFromSite = async (siteId) => {
                // First try the CCD list element (displayed CCD codes)
                const ccdListElement = document.getElementById(`${siteId}_ccdList`);
                if (ccdListElement && ccdListElement.textContent) {
                    const ccdCodes = ccdListElement.textContent.split(',').map(code => code.trim()).filter(code => code.length > 0);
                    if (ccdCodes.length > 0) return ccdCodes.length;
                }

                // If no CCD list, try to perform conversion on-demand
                const glycoCTElement = document.getElementById(`${siteId}_glycan`) || document.getElementById(`${siteId}_glycoCT`);
                const chainIdElement = document.getElementById(`${siteId}_chainId`);

                if (glycoCTElement && glycoCTElement.value && chainIdElement && chainIdElement.value) {
                    try {
                        const glycoCT = glycoCTElement.value.trim();
                        const chainId = chainIdElement.value.trim();

                        // Perform on-demand conversion to get actual CCD count
                        const converted = await convertGlycoCTToEnhancedLigand(glycoCT, chainId);
                        let finalCCDs = converted.ligand?.ligand?.ccdCodes || [];

                        // Apply substituent processing if available
                        if (window.substituentHandler && finalCCDs.length > 0) {
                            try {
                                const substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(glycoCT, chainId);
                                if (substituentResult) {
                                    const hasBaseSugars = substituentResult.combinedCCDs?.some(ccd =>
                                        ['NDG', 'GAL', 'GLC', 'MAN', 'FUC', 'GLB', 'ARA', 'RIB', 'XYL', 'GNS', 'IDR'].includes(ccd));

                                    if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0 && hasBaseSugars) {
                                        finalCCDs = substituentResult.combinedCCDs;
                                    } else if (substituentResult.substituentCCDs && substituentResult.substituentCCDs.length > 0) {
                                        if (window.mergeSubstituentsInResOrder && substituentResult.orderedEntries) {
                                            finalCCDs = window.mergeSubstituentsInResOrder(finalCCDs, substituentResult.orderedEntries);
                                        } else {
                                            finalCCDs = finalCCDs.concat(substituentResult.substituentCCDs);
                                        }
                                    }
                                }
                            } catch (substituentError) {
                                // Continue with base CCD codes if substituent processing fails
                            }
                        }

                        return finalCCDs.length;
                    } catch (error) {
                        // Fallback to rough estimate
                        const glycoCT = glycoCTElement.value;
                        const matches = glycoCT.match(/\bRES\b/g);
                        return matches ? matches.length : 1;
                    }
                }

                return 0;
            };

            // Check manual glycosylation sites
            const glycosylationSites = document.getElementById(`${seq.id}_glycosylationSites`);
            if (glycosylationSites) {
                const chainIdInputs = glycosylationSites.querySelectorAll('[id$="_chainId"]');
                for (let chainIdInput of chainIdInputs) {
                    const baseGlycanChainId = chainIdInput.value.trim();

                    // Check for exact match (single chain case)
                    if (baseGlycanChainId === chainId) {
                        const siteId = chainIdInput.id.replace('_chainId', '');
                        return await getCCDCountFromSite(siteId);
                    }

                    // Check for multimer match (chainId might be baseGlycanChainId + proteinChainId)
                    if (seq.multimerChainIds && Array.isArray(seq.multimerChainIds)) {
                        for (let proteinChainId of seq.multimerChainIds) {
                            const expectedGlycanChainId = `${baseGlycanChainId}${proteinChainId}`;
                            if (expectedGlycanChainId === chainId) {
                                const siteId = chainIdInput.id.replace('_chainId', '');
                                return await getCCDCountFromSite(siteId);
                            }
                        }
                    }
                }
            }

            // Check sequon sites
            const sequonSites = document.getElementById(`${seq.id}_sequonSites`);
            if (sequonSites) {
                const chainIdInputs = sequonSites.querySelectorAll('[id$="_chainId"]');
                for (let chainIdInput of chainIdInputs) {
                    const baseGlycanChainId = chainIdInput.value.trim();

                    // Check for exact match (single chain case)
                    if (baseGlycanChainId === chainId) {
                        const siteId = chainIdInput.id.replace('_chainId', '');
                        return await getCCDCountFromSite(siteId);
                    }

                    // Check for multimer match (chainId might be baseGlycanChainId + proteinChainId)
                    if (seq.multimerChainIds && Array.isArray(seq.multimerChainIds)) {
                        for (let proteinChainId of seq.multimerChainIds) {
                            const expectedGlycanChainId = `${baseGlycanChainId}${proteinChainId}`;
                            if (expectedGlycanChainId === chainId) {
                                const siteId = chainIdInput.id.replace('_chainId', '');
                                return await getCCDCountFromSite(siteId);
                            }
                        }
                    }
                }
            }
        }
    }

    return 0;
}

// Helper function to create chain dropdown options
function createChainDropdownOptions() {
    const chainIds = getAllChainIds();
    let options = '<option value="">Select chain...</option>';
    chainIds.forEach(chainId => {
        options += `<option value="${chainId}">${chainId}</option>`;
    });
    return options;
}


// Function to update residue datalists when chain selection changes
async function updateResidueDropdown(bondId, chainNumber, selectedChainId, clearInput = true) {
    const residueDatalist = document.getElementById(`${bondId}_res${chainNumber}_list`);
    const residueInput = document.getElementById(`${bondId}_res${chainNumber}`);

    if (residueDatalist) {
        const residueCount = await getResidueCountForChain(selectedChainId);
        let options = '';
        for (let i = 1; i <= residueCount; i++) {
            options += `<option value="${i}">`;
        }
        residueDatalist.innerHTML = options;
    }

    // Only clear the residue input when explicitly requested (i.e., when chain changes)
    if (clearInput && residueInput) {
        residueInput.value = '';
    }
}

// Function to refresh all bonded atom pair dropdowns when sequences change
async function refreshBondedAtomPairDropdowns() {
    if (!window.app.bondedAtomPairs) return;

    const chainOptions = createChainDropdownOptions();

    for (const bond of window.app.bondedAtomPairs) {
        // Update chain datalists
        const chain1Datalist = document.getElementById(`${bond.id}_chain1_list`);
        const chain2Datalist = document.getElementById(`${bond.id}_chain2_list`);
        const chain1Input = document.getElementById(`${bond.id}_chain1`);
        const chain2Input = document.getElementById(`${bond.id}_chain2`);

        if (chain1Datalist) {
            chain1Datalist.innerHTML = chainOptions;
            // Update residue dropdown if chain is entered (don't clear input)
            if (chain1Input && chain1Input.value) {
                await updateResidueDropdown(bond.id, '1', chain1Input.value, false);
            }
        }

        if (chain2Datalist) {
            chain2Datalist.innerHTML = chainOptions;
            // Update residue dropdown if chain is entered (don't clear input)
            if (chain2Input && chain2Input.value) {
                await updateResidueDropdown(bond.id, '2', chain2Input.value, false);
            }
        }
    }
}

// Bonded atom pairs functionality
function addBondedAtomPair() {
    const container = document.getElementById('bondedAtomPairsContainer');
    const bondId = `bond_${++app.bondCounter}`;

    // Clear placeholder if this is the first bond
    if (window.app.bondedAtomPairs.length === 0) {
        container.innerHTML = '';
    }

    const chainOptions = createChainDropdownOptions();

    const bondHTML = `
        <div class="card mb-2" id="bond_${bondId}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <label class="form-label">Chain 1</label>
                        <input type="text" class="form-control" id="${bondId}_chain1" placeholder="Enter chain ID" list="${bondId}_chain1_list" oninput="(async () => await updateResidueDropdown('${bondId}', '1', this.value))()">
                        <datalist id="${bondId}_chain1_list">
                            ${chainOptions}
                        </datalist>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Residue 1</label>
                        <input type="number" class="form-control" id="${bondId}_res1" placeholder="Enter residue number" list="${bondId}_res1_list" min="1">
                        <datalist id="${bondId}_res1_list">
                        </datalist>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Atom 1</label>
                        <input type="text" class="form-control" id="${bondId}_atom1" placeholder="O4">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Chain 2</label>
                        <input type="text" class="form-control" id="${bondId}_chain2" placeholder="Enter chain ID" list="${bondId}_chain2_list" oninput="(async () => await updateResidueDropdown('${bondId}', '2', this.value))()">
                        <datalist id="${bondId}_chain2_list">
                            ${chainOptions}
                        </datalist>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Residue 2</label>
                        <input type="number" class="form-control" id="${bondId}_res2" placeholder="Enter residue number" list="${bondId}_res2_list" min="1">
                        <datalist id="${bondId}_res2_list">
                        </datalist>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Atom 2</label>
                        <input type="text" class="form-control" id="${bondId}_atom2" placeholder="C1">
                    </div>
                    <div class="col-12 mt-2">
                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeBondedAtomPair('${bondId}')">
                            <i class="fas fa-trash me-1"></i>Remove Bond
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', bondHTML);
    
    // Add to bonded atom pairs array
    window.app.bondedAtomPairs.push({
        id: bondId,
        data: {}
    });

    // Automatically expand the bonded atom pairs section if collapsed
    const collapseElement = document.getElementById('bondedAtomPairsCollapse');
    if (collapseElement && !collapseElement.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, { show: true });
    }

    // Setup event listeners for both inputs and selects
    const inputs = container.querySelectorAll(`#bond_${bondId} input, #bond_${bondId} select`);
    inputs.forEach(input => {
        const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
        input.addEventListener(eventType, () => {
            updateBondedAtomPair(bondId);
            app.debounceGenerate();
        });
    });
}

function updateBondedAtomPair(bondId) {
    const bond = window.app.bondedAtomPairs.find(b => b.id === bondId);
    if (!bond) return;

    const chain1 = document.getElementById(`${bondId}_chain1`).value;
    const res1 = parseInt(document.getElementById(`${bondId}_res1`).value);
    const atom1 = document.getElementById(`${bondId}_atom1`).value;
    const chain2 = document.getElementById(`${bondId}_chain2`).value;
    const res2 = parseInt(document.getElementById(`${bondId}_res2`).value);
    const atom2 = document.getElementById(`${bondId}_atom2`).value;

    if (chain1 && !isNaN(res1) && atom1 && chain2 && !isNaN(res2) && atom2) {
        // AlphaFold3 format: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
        bond.data = [
            [chain1, res1, atom1],
            [chain2, res2, atom2]
        ];
    } else {
        bond.data = {}; // Clear invalid data
    }
}

function removeBondedAtomPair(bondId) {
    // Remove from DOM
    const element = document.getElementById(`bond_${bondId}`);
    if (element) {
        element.remove();
    }
    
    // Remove from bonded atom pairs array
    window.app.bondedAtomPairs = window.app.bondedAtomPairs.filter(bond => bond.id !== bondId);
    
    // Show placeholder if no bonds left
    const container = document.getElementById('bondedAtomPairsContainer');
    if (window.app.bondedAtomPairs.length === 0) {
        container.innerHTML = '<p class="text-muted">No bondedAtomPairs defined</p>';
    }
    
    // Regenerate JSON
    app.debounceGenerate();
}

// Chain ID validation function
function validateChainId(input) {
    // Convert to uppercase and remove non-alphabetic characters
    let value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Update input value
    if (input.value !== value) {
        input.value = value;
    }
}

// Generate chain ID sequence (A, B, C... Z, AA, AB, etc.)
function generateChainIds(baseId, count) {
    if (count <= 1) return [baseId];
    
    const chains = [];
    
    // Always use alphabetic suffixes for all sequence types
    for (let i = 0; i < count; i++) {
        const suffix = generateAlphabeticSuffix(i);
        chains.push(`${baseId}${suffix}`);
    }
    
    return chains;
}

// Generate alphabetic suffix (A, B, C... Z, AA, AB, AC...)
function generateAlphabeticSuffix(index) {
    let suffix = '';
    let tempIndex = index;
    
    do {
        suffix = String.fromCharCode(65 + (tempIndex % 26)) + suffix;
        tempIndex = Math.floor(tempIndex / 26) - 1;
    } while (tempIndex >= 0);
    
    return suffix;
}

// Generate ligand chain IDs (LIGA, LIGB, LIGC... etc.)
function generateLigandChainIds(baseId, count) {
    if (count <= 1) return [baseId];
    
    const chains = [];
    
    // Always use alphabetic suffixes for all ligand types
    for (let i = 0; i < count; i++) {
        const suffix = generateAlphabeticSuffix(i);
        chains.push(`${baseId}${suffix}`);
    }
    
    return chains;
}

// Clean up bondedAtomPairs related to a specific sequence when count changes
function cleanupSequenceBondedAtomPairs(sequenceId) {
    if (!window.app || !window.app.bondedAtomPairs) return;

    // Find the sequence object to get its current and old chain IDs
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    if (!sequenceObj) return;

    // Get all possible chain IDs that this sequence might have used
    const currentChainIds = sequenceObj.multimerChainIds || [];
    const baseId = document.getElementById(`${sequenceId}_id`)?.value || 'L';

    // Create a set of all possible chain IDs this sequence could have generated
    const possibleChainIds = new Set();

    // Add current chain IDs
    currentChainIds.forEach(id => possibleChainIds.add(id));

    // Add potential old chain IDs (up to reasonable count)
    for (let i = 0; i < 20; i++) {
        const suffix = generateAlphabeticSuffix(i);
        possibleChainIds.add(`${baseId}${suffix}`);
        possibleChainIds.add(baseId); // also include base ID without suffix
    }

    // Remove bondedAtomPairs that reference any of these chain IDs
    const initialCount = window.app.bondedAtomPairs.length;
    window.app.bondedAtomPairs = window.app.bondedAtomPairs.filter(bond => {
        if (Array.isArray(bond) && bond.length === 2) {
            // Direct array format: [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
            const chain1 = bond[0]?.[0];
            const chain2 = bond[1]?.[0];

            // Keep if neither chain ID matches this sequence's possible IDs
            return !possibleChainIds.has(chain1) && !possibleChainIds.has(chain2);
        }
        // Keep other formats as-is
        return true;
    });

    const removedCount = initialCount - window.app.bondedAtomPairs.length;
    if (removedCount > 0) {
    }
}

// Update multimer chains display and data
function updateMultimerChains(sequenceId) {
    const countInput = document.getElementById(`${sequenceId}_count`);
    const chainIdInput = document.getElementById(`${sequenceId}_id`);
    const multimerDiv = document.getElementById(`${sequenceId}_multimerChains`);
    const chainListSpan = document.getElementById(`${sequenceId}_chainList`);

    if (!countInput || !chainIdInput || !multimerDiv || !chainListSpan) return;

    // Clean up old bondedAtomPairs before updating
    cleanupSequenceBondedAtomPairs(sequenceId);

    const count = parseInt(countInput.value) || 1;
    const baseId = chainIdInput.value || 'A';
    
    if (count > 1) {
        // Show multimer display
        multimerDiv.style.display = 'block';
        
        // Generate chain IDs
        const chainIds = generateChainIds(baseId, count);
        chainListSpan.textContent = chainIds.join(', ');
        
        // Store the generated chain IDs for JSON generation
        const sequence = app.sequences.find(seq => seq.id === sequenceId);
        if (sequence) {
            sequence.multimerChainIds = chainIds;
        }
    } else {
        // Hide multimer display
        multimerDiv.style.display = 'none';
        
        // Clear stored chain IDs
        const sequence = app.sequences.find(seq => seq.id === sequenceId);
        if (sequence) {
            delete sequence.multimerChainIds;
        }
    }
    
    // Update sequence data to reflect multimer changes
    const sequenceObj = app.sequences.find(seq => seq.id === sequenceId);
    if (sequenceObj) {
    }

    // Refresh bonded atom pair dropdowns
    refreshBondedAtomPairDropdowns();

    // Trigger JSON regeneration
    app.debounceGenerate();
}

// Generate next available chain ID
function generateNextChainId(type = 'protein') {
    // Get all existing chain IDs from current sequences
    const existingIds = new Set();
    
    // Collect chain IDs from all sequence types
    app.sequences.forEach(seq => {
        const idElement = document.getElementById(`${seq.id}_id`);
        if (idElement && idElement.value) {
            existingIds.add(idElement.value.toUpperCase());
            
            // Also collect multimer chain IDs if any
            if (seq.multimerChainIds) {
                seq.multimerChainIds.forEach(chainId => {
                    existingIds.add(chainId.toUpperCase());
                });
            }
        }
    });
    
    // Generate chain ID based on sequence type
    let num = 0;
    let chainId = '';
    
    if (type === 'ligand') {
        // For ligands, use LIG + alphabetic suffix (LIGA, LIGB, LIGC... LIGAA, LIGAB...)
        do {
            let tempNum = num;
            let suffix = '';

            // Generate alphabetic suffix (A, B, C... AA, AB...)
            do {
                suffix = String.fromCharCode(65 + (tempNum % 26)) + suffix; // A=65
                tempNum = Math.floor(tempNum / 26) - 1;
            } while (tempNum >= 0);

            chainId = `LIG${suffix}`;
            num++;
        } while (existingIds.has(chainId));
    } else {
        // For other sequences, use alphabetic (A, B, C...)
        const startChar = 65; // A
        do {
            chainId = '';
            let tempNum = num;
            
            // Generate alphabetic chain ID (A, B, C... etc.)
            do {
                chainId = String.fromCharCode(startChar + (tempNum % 26)) + chainId;
                tempNum = Math.floor(tempNum / 26) - 1;
            } while (tempNum >= 0);
            
            num++;
        } while (existingIds.has(chainId));
    }
    
    return chainId;
}

// Generate glycan chain IDs (GLYCANA, GLYCANB, GLYCANC... etc.)
function generateNextGlycanChainId() {
    // Get all existing chain IDs from current sequences and glycosylation sites
    const existingIds = new Set();
    
    // Collect chain IDs from all sequence types
    app.sequences.forEach(seq => {
        const idElement = document.getElementById(`${seq.id}_id`);
        if (idElement && idElement.value) {
            existingIds.add(idElement.value.toUpperCase());
            
            // Also collect multimer chain IDs if any
            if (seq.multimerChainIds) {
                seq.multimerChainIds.forEach(chainId => {
                    existingIds.add(chainId.toUpperCase());
                });
            }
        }
    });
    
    // Also collect existing glycan chain IDs from all protein sequences
    app.sequences.forEach(seq => {
        if (seq.type === 'protein') {
            // Collect from manual glycosylation sites
            const glycoContainer = document.getElementById(`${seq.id}_glycosylationSites`);
            if (glycoContainer) {
                const chainIdInputs = glycoContainer.querySelectorAll('input[id$="_chainId"]');
                chainIdInputs.forEach(input => {
                    if (input.value) {
                        existingIds.add(input.value.toUpperCase());
                    }
                });
            }
            
            // Collect from sequon-based sites
            const sequonContainer = document.getElementById(`${seq.id}_sequonSites`);
            if (sequonContainer) {
                const sequonChainIdInputs = sequonContainer.querySelectorAll('input[id$="_chainId"]');
                sequonChainIdInputs.forEach(input => {
                    if (input.value) {
                        existingIds.add(input.value.toUpperCase());
                    }
                });
            }
        }
    });
    
    // Collect chain IDs from SugarDrawer
    const sugarDrawerChainId = document.getElementById('glycanChainId');
    if (sugarDrawerChainId && sugarDrawerChainId.value) {
        existingIds.add(sugarDrawerChainId.value.toUpperCase());
    }
    
    // Collect chain IDs from existing ligand sequences that might be glycans
    app.sequences.forEach(seq => {
        if (seq.type === 'ligand' && seq.data && seq.data.ligand && seq.data.ligand.id) {
            const chainId = seq.data.ligand.id.toUpperCase();
            if (chainId.startsWith('GLYCAN')) {
                existingIds.add(chainId);
            }
        }
    });
    
    // Generate glycan chain ID using GLYCAN + alphabetic suffix
    let num = 0;
    let chainId = '';
    
    do {
        const suffix = generateAlphabeticSuffix(num);
        chainId = `GLYCAN${suffix}`;
        num++;
    } while (existingIds.has(chainId));
    
    return chainId;
}

// Make the function globally available for other modules
window.generateNextGlycanChainId = generateNextGlycanChainId;

// N-glycosylation sequon detection functions
function detectNGlycosylationSequons(sequence) {
    const sequons = [];
    const cleanSequence = sequence.toUpperCase().replace(/\s/g, '');
    
    // Look for N-X-S/T pattern where X is not P
    for (let i = 0; i < cleanSequence.length - 2; i++) {
        const residue1 = cleanSequence[i];     // Must be N
        const residue2 = cleanSequence[i + 1]; // Cannot be P
        const residue3 = cleanSequence[i + 2]; // Must be S or T
        
        if (residue1 === 'N' && residue2 !== 'P' && (residue3 === 'S' || residue3 === 'T')) {
            sequons.push({
                position: i + 1, // Convert to 1-based indexing
                sequon: `${residue1}${residue2}${residue3}`,
                residue1: residue1,
                residue2: residue2,
                residue3: residue3
            });
        }
    }
    
    return sequons;
}

function detectAndPopulateSequons(sequenceId) {
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) {
        return;
    }
    
    const sequence = sequenceInput.value;
    if (!sequence.trim()) {
        if (window.app && window.app.showError) {
            window.app.showError('Please enter a protein sequence first');
        } else {
            alert('Please enter a protein sequence first');
        }
        return;
    }
    
    // Detect sequons
    const sequons = detectNGlycosylationSequons(sequence);
    
    if (sequons.length === 0) {
        alert('No N-glycosylation sequons found in the sequence');
        return;
    }
    
    // Clear existing sequon sites
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    container.innerHTML = '';
    
    // Expand the section if collapsed
    const collapseElement = document.getElementById(`${sequenceId}_sequonCollapse`);
    if (collapseElement && !collapseElement.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, { show: true });
    }
    
    // Create sequon sites
    sequons.forEach((sequon, index) => {
        addSequonSite(sequenceId, sequon, index);
    });
    
    // Update highlighting
    updateSequonHighlighting(sequenceId);
    
    // Show the template selector now that sequons are detected
    const templateSelector = document.getElementById(`${sequenceId}_templateSelector`);
    if (templateSelector) {
        templateSelector.style.display = 'block';
    }
    
    // Update badge to show sequon count
    updateSequonSitesBadge(sequenceId);
    
}

function addSequonSite(sequenceId, sequonData, index) {
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    const siteId = `sequon_${sequenceId}_${Date.now()}_${index}`;
    
    const siteHTML = `
        <div class="card mb-2 border-primary" id="${siteId}">
            <div class="card-body py-2">
                <div class="row">
                    <div class="col-md-2">
                        <label class="form-label mb-1">Position</label>
                        <input type="number" class="form-control" id="${siteId}_position"
                               value="${sequonData.position}" readonly style="background-color: #e7f3ff; height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;">
                        <small class="text-primary">Sequon: ${sequonData.sequon}</small>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label mb-1">Chain ID*</label>
                        <input type="text" class="form-control" id="${siteId}_chainId"
                               placeholder="GLYCANA" oninput="validateChainId(this); updateSequonData('${sequenceId}')"
                               style="text-transform: uppercase; height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;"
                               title="Auto-generated, can be edited">
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center mb-1">
                            <label class="form-label mb-0 me-2">Glycan*</label>
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                    style="padding: 1px 4px; font-size: 10px;"
                                    onclick="openSugarDrawerPopup('${siteId}_glycan')"
                                    title="Open SugarDrawer to draw glycan structure">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <textarea class="form-control" id="${siteId}_glycan" rows="1"
                                  placeholder="Import GlycoCT..." style="min-height: 30px; padding: 2px 6px; resize: vertical;"
                                  oninput="processSequonGlycoCTInput('${siteId}', '${sequenceId}')"></textarea>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label mb-1">Description</label>
                        <textarea class="form-control" id="${siteId}_description" rows="1"
                                  placeholder="Optional description..." style="height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;"
                                  oninput="updateSequonData('${sequenceId}')"></textarea>
                    </div>
                    <div class="col-md-3" style="display: none;">
                        <div class="row">
                            <div class="col-6">
                                <label class="form-label mb-1">Residue Type</label>
                                <input type="text" class="form-control form-control-sm" value="N (Asparagine)" readonly style="background-color: #f8f9fa;">
                            </div>
                            <div class="col-6">
                                <label class="form-label mb-1">Attachment Atom</label>
                                <input type="text" class="form-control form-control-sm" value="ND2" readonly style="background-color: #f8f9fa;">
                            </div>
                        </div>
                        <div class="mt-1">
                            <small class="text-muted"><i class="fas fa-lock me-1"></i>Fixed for N-glycosylation sequons</small>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-outline-danger btn-sm mt-3" 
                                onclick="removeSequonSite('${siteId}', '${sequenceId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', siteHTML);
    
    // Auto-generate chain ID
    const chainId = generateNextGlycanChainId();
    const chainIdInput = document.getElementById(`${siteId}_chainId`);
    if (chainIdInput) {
        chainIdInput.value = chainId;
    }
    
    // Update sequence data
    app.debounceGenerate();
}

function removeSequonSite(siteId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(siteId);
    if (element) {
        element.remove();
    }
    
    // Show placeholder if no sites left
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">Click "Detect Sequons" to automatically find N-glycosylation sites</small>';

        // Hide the template selector when no sequon sites remain
        const templateSelector = document.getElementById(`${sequenceId}_templateSelector`);
        if (templateSelector) {
            templateSelector.style.display = 'none';
        }
    }
    
    // Update highlighting immediately
    updateSequonHighlighting(sequenceId);
    
    // Update badge to show current site count
    updateSequonSitesBadge(sequenceId);

    // Auto-cleanup unused userCCDs after sequon removal
    if (window.autoCleanupUserCCDs) {
        window.autoCleanupUserCCDs();
    }

    // Update sequence data
    app.debounceGenerate();
}

function updateSequonData(sequenceId) {
    updateSequonHighlighting(sequenceId);

    // Refresh bonded atom pair dropdowns since chain IDs might have changed
    refreshBondedAtomPairDropdowns();

    app.debounceGenerate();
}

function updateSequonHighlighting(sequenceId) {
    // Quick highlighting update for sequon sites
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) return;
    
    const sequence = sequenceInput.value.toUpperCase().replace(/\s/g, '');
    if (!sequence) return;
    
    // Collect positions from sequon sites
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    const sequonPositions = [];
    
    if (container) {
        const siteCards = container.querySelectorAll('[id^="sequon_"]');
        siteCards.forEach(card => {
            const siteId = card.id;
            const positionInput = document.getElementById(`${siteId}_position`);
            const position = parseInt(positionInput?.value);
            
            if (position && position > 0 && position <= sequence.length) {
                sequonPositions.push(position);
            }
        });
    }
    
    // Update sequon positions in dataset and trigger combined highlighting
    if (sequonPositions.length > 0) {
        sequenceInput.dataset.sequonPositions = JSON.stringify(sequonPositions);
        sequenceInput.classList.add('has-sequons');
    } else {
        sequenceInput.classList.remove('has-sequons');
        delete sequenceInput.dataset.sequonPositions;
    }
    
    // Trigger combined highlighting update
    const glycosylatedPositions = sequenceInput?.dataset.glycosylatedPositions ? 
        JSON.parse(sequenceInput.dataset.glycosylatedPositions) : [];
    const ptmPositions = sequenceInput?.dataset.modifiedPositions ? 
        JSON.parse(sequenceInput.dataset.modifiedPositions) : [];
    
    updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, ptmPositions);
}

async function processSequonGlycoCTInput(siteId, sequenceId) {
    const glycanTextarea = document.getElementById(`${siteId}_glycan`);
    const chainIdInput = document.getElementById(`${siteId}_chainId`);

    if (!glycanTextarea || !chainIdInput) return;

    const glycoCT = glycanTextarea.value.trim();

    if (glycoCT) {
        try {
            // Validate the GlycoCT structure before processing
            if (typeof validateGlycoCTStructure === 'function') {
                const validation = validateGlycoCTStructure(glycoCT);
                if (!validation.valid) {
                    // Display validation errors inline
                    displayGlycoCTValidationErrors(`${siteId}_glycan`, validation);
                    return; // Exit early without processing
                }
            }

            // Clear any previous validation errors if validation passed
            displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });

            const chainId = chainIdInput.value;
            
            const converted = await convertGlycoCTToEnhancedLigand(glycoCT, chainId);

            // Process substituents if substituent handler is available
            let finalCCDs = converted.ligand?.ligand?.ccdCodes || [];

            if (window.substituentHandler) {
                const substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(glycoCT, chainId);

                if (substituentResult) {
                    // Check if combinedCCDs contains base sugars (proper merge) or just substituents (bug)
                    const hasBaseSugars = substituentResult.combinedCCDs?.some(ccd =>
                        ['NDG', 'GAL', 'GLC', 'MAN', 'FUC', 'GLB', 'ARA', 'RIB', 'XYL', 'GNS', 'IDR'].includes(ccd));

                    if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0 && hasBaseSugars) {
                        // Use combined CCDs (includes both base sugars and substituents properly merged)
                        finalCCDs = substituentResult.combinedCCDs;
                    } else if (substituentResult.substituentCCDs && substituentResult.substituentCCDs.length > 0) {
                        // Fallback: manually merge base + substituents
                        if (window.mergeSubstituentsInResOrder && substituentResult.orderedEntries) {
                            finalCCDs = window.mergeSubstituentsInResOrder(finalCCDs, substituentResult.orderedEntries);
                        } else {
                            // Simple append fallback
                            finalCCDs = finalCCDs.concat(substituentResult.substituentCCDs);
                        }
                    }

                    // Handle required userCCDs
                    if (substituentResult.requiredUserCCDs && Object.keys(substituentResult.requiredUserCCDs).length > 0) {
                        if (!window.app.userCCDs) {
                            window.app.userCCDs = {};
                        }
                        Object.assign(window.app.userCCDs, substituentResult.requiredUserCCDs);
                    }
                }
            }

            if (finalCCDs && finalCCDs.length > 0) {
                // Refresh bonded atom pair dropdowns since glycan chain residue count changed
                refreshBondedAtomPairDropdowns();
            }
        } catch (error) {
            // Clear validation errors on exception
            displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });
        }
    } else {
        // Clear validation errors when input is empty
        displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });
    }

    updateSequonData(sequenceId);
}

// Toggle Advanced Functions section
function toggleAdvancedFunctions(sequenceId) {
    const section = document.getElementById(`${sequenceId}_advancedSection`);
    const toggle = document.getElementById(`${sequenceId}_advancedToggle`);
    const icon = toggle.querySelector('i');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        icon.className = 'fas fa-chevron-down me-1';
        toggle.innerHTML = '<i class="fas fa-chevron-down me-1"></i>Advanced Functions';
    } else {
        section.style.display = 'none';
        icon.className = 'fas fa-chevron-right me-1';
        toggle.innerHTML = '<i class="fas fa-chevron-right me-1"></i>Advanced Functions';
    }
}

// Protein sequence validation function
function validateProteinSequence(textarea) {
    // Remove all non-letter characters and convert to uppercase
    let value = textarea.value.toUpperCase().replace(/[^A-Z]/g, '');
    textarea.value = value;
    
    // Check for invalid amino acid codes (B, J, O, U, X, Z as requested)
    const invalidChars = /[BJOUXZ]/g;
    
    // Extract sequence ID from textarea ID
    const sequenceId = textarea.id.replace('_sequence', '');
    const warningDiv = document.getElementById(`${sequenceId}_sequenceWarning`);
    const invalidCharsSpan = document.getElementById(`${sequenceId}_invalidChars`);
    
    if (!warningDiv || !invalidCharsSpan) return;
    
    // Find invalid characters
    const foundInvalid = value.match(invalidChars);
    
    if (foundInvalid && foundInvalid.length > 0) {
        // Show warning with specific invalid characters
        const uniqueInvalid = [...new Set(foundInvalid)].sort();
        invalidCharsSpan.textContent = uniqueInvalid.join(', ');
        warningDiv.style.display = 'block';
        
        // Add red border to indicate error
        textarea.classList.add('is-invalid');
    } else {
        // Hide warning and remove error styling
        warningDiv.style.display = 'none';
        textarea.classList.remove('is-invalid');
    }
    
    // Update visualization aid and PTM marking when sequence changes
    updateSequenceVisualization(sequenceId);
    updatePTMMarking(sequenceId);
}

// RNA sequence validation function
function validateRNASequence(textarea) {
    // Remove all non-letter characters and convert to uppercase
    let value = textarea.value.toUpperCase().replace(/[^A-Z]/g, '');
    textarea.value = value;

    // Check for invalid nucleotide codes (anything other than A, U, G, C)
    const invalidChars = /[^AUGC]/g;

    // Extract sequence ID from textarea ID
    const sequenceId = textarea.id.replace('_sequence', '');
    const warningDiv = document.getElementById(`${sequenceId}_sequenceWarning`);
    const invalidCharsSpan = document.getElementById(`${sequenceId}_invalidChars`);

    if (!warningDiv || !invalidCharsSpan) return;

    // Find invalid characters
    const foundInvalid = value.match(invalidChars);

    if (foundInvalid && foundInvalid.length > 0) {
        // Show warning with specific invalid characters
        const uniqueInvalid = [...new Set(foundInvalid)].sort();
        invalidCharsSpan.textContent = uniqueInvalid.join(', ');
        warningDiv.style.display = 'block';

        // Add red border to indicate error
        textarea.classList.add('is-invalid');
    } else {
        // Hide warning and remove error styling
        warningDiv.style.display = 'none';
        textarea.classList.remove('is-invalid');
    }
}

// DNA sequence validation function
function validateDNASequence(textarea) {
    // Remove all non-letter characters and convert to uppercase
    let value = textarea.value.toUpperCase().replace(/[^A-Z]/g, '');
    textarea.value = value;

    // Check for invalid nucleotide codes (anything other than A, T, G, C)
    const invalidChars = /[^ATGC]/g;

    // Extract sequence ID from textarea ID
    const sequenceId = textarea.id.replace('_sequence', '');
    const warningDiv = document.getElementById(`${sequenceId}_sequenceWarning`);
    const invalidCharsSpan = document.getElementById(`${sequenceId}_invalidChars`);

    if (!warningDiv || !invalidCharsSpan) return;

    // Find invalid characters
    const foundInvalid = value.match(invalidChars);

    if (foundInvalid && foundInvalid.length > 0) {
        // Show warning with specific invalid characters
        const uniqueInvalid = [...new Set(foundInvalid)].sort();
        invalidCharsSpan.textContent = uniqueInvalid.join(', ');
        warningDiv.style.display = 'block';

        // Add red border to indicate error
        textarea.classList.add('is-invalid');
    } else {
        // Hide warning and remove error styling
        warningDiv.style.display = 'none';
        textarea.classList.remove('is-invalid');
    }
}

// Add MSA data to protein based on selected input type
function addMSADataToProtein(sequenceId, proteinData) {
    const pathRadio = document.getElementById(`${sequenceId}_msaTypePath`);
    const directRadio = document.getElementById(`${sequenceId}_msaTypeDirect`);
    let hasData = false;

    if (pathRadio && pathRadio.checked) {
        // Use MSA file paths
        const unpairedMsaPath = document.getElementById(`${sequenceId}_unpairedMsaPath`).value;
        if (unpairedMsaPath) {
            proteinData.unpairedMsaPath = unpairedMsaPath;
            hasData = true;
        }

        const pairedMsaPath = document.getElementById(`${sequenceId}_pairedMsaPath`).value;
        if (pairedMsaPath) {
            proteinData.pairedMsaPath = pairedMsaPath;
            hasData = true;
        }
    } else if (directRadio && directRadio.checked) {
        // Use direct MSA data
        const unpairedMsa = document.getElementById(`${sequenceId}_unpairedMsa`).value;
        if (unpairedMsa) {
            proteinData.unpairedMsa = unpairedMsa;
            hasData = true;
        }

        const pairedMsa = document.getElementById(`${sequenceId}_pairedMsa`).value;
        if (pairedMsa) {
            proteinData.pairedMsa = pairedMsa;
            hasData = true;
        }
    }
    // If auto radio is selected (default), no MSA data is added (automatic generation)

    // Update MSA badge
    updateMSABadge(sequenceId, hasData);
}


// Toggle MSA input sections based on radio button selection
function toggleMSAInput(sequenceId) {
    const autoRadio = document.getElementById(`${sequenceId}_msaTypeAuto`);
    const pathRadio = document.getElementById(`${sequenceId}_msaTypePath`);
    const directRadio = document.getElementById(`${sequenceId}_msaTypeDirect`);
    
    const pathSection = document.getElementById(`${sequenceId}_msaPathSection`);
    const directSection = document.getElementById(`${sequenceId}_msaDirectSection`);
    
    if (autoRadio && autoRadio.checked) {
        // Hide both sections for automatic MSA generation
        pathSection.style.display = 'none';
        directSection.style.display = 'none';
    } else if (pathRadio && pathRadio.checked) {
        // Show path section, hide direct section
        pathSection.style.display = 'block';
        directSection.style.display = 'none';
    } else if (directRadio && directRadio.checked) {
        // Show direct section, hide path section
        pathSection.style.display = 'none';
        directSection.style.display = 'block';
    }
    
    // Trigger JSON regeneration after MSA toggle
    if (window.app) {
        app.debounceGenerate();
    }
}



// Update sequence visualization with position numbering and spacing
function updateSequenceVisualization(sequenceId) {
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) return;
    
    const sequence = sequenceInput.value.toUpperCase();
    
    // Create or update visualization div
    let vizDiv = document.getElementById(`${sequenceId}_sequenceViz`);
    if (!vizDiv) {
        vizDiv = document.createElement('div');
        vizDiv.id = `${sequenceId}_sequenceViz`;
        vizDiv.style.cssText = `
            margin-top: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
            word-wrap: break-word;
            overflow-wrap: break-word;
        `;
        sequenceInput.parentNode.insertBefore(vizDiv, sequenceInput.nextSibling);
    }
    
    if (!sequence) {
        vizDiv.innerHTML = '<small class="text-muted">Enter sequence to see visualization</small>';
        return;
    }
    
    // Simple sequence display with spacing every 10 residues
    const residuesPerLine = 50;
    let allLines = '';
    
    for (let lineStart = 0; lineStart < sequence.length; lineStart += residuesPerLine) {
        const lineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let sequenceLine = '';

        // Build sequence line
        for (let i = lineStart; i < lineEnd; i++) {
            const position = i + 1;
            const char = sequence[i];

            sequenceLine += char;

            // Add space every 10 residues for readability
            if (position % 10 === 0 && i < lineEnd - 1) {
                sequenceLine += ' ';
            }
        }

        // Build zeros line with exact same logic, but handling multi-digit positions
        // Always build for full residuesPerLine even if actual line is shorter
        const fullLineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let zerosLine = '';
        let positionOverrideDigits = [];
        let positionMarkers = []; // Track which characters are part of position numbers

        for (let i = lineStart; i < lineStart + residuesPerLine; i++) {
            const position = i + 1;
            const isActualSequence = i < fullLineEnd;

            // Check if we're in the middle of a multi-digit position number
            if (positionOverrideDigits.length > 0) {
                const digit = positionOverrideDigits.shift();
                zerosLine += digit;
                positionMarkers.push(true); // This character is part of a position number
            } else if (isActualSequence && (position - 1) % 10 === 0) { // positions 1, 11, 21, 31, etc.
                const posStr = position.toString();
                zerosLine += posStr[0]; // Add first digit
                positionMarkers.push(true); // This character is part of a position number
                if (posStr.length > 1) {
                    positionOverrideDigits = posStr.substring(1).split(''); // Store remaining digits
                }
            } else {
                zerosLine += '0';
                positionMarkers.push(false); // All standalone zeros should be replaceable
            }

            // Add space every 10 residues for readability - same logic as sequence
            if (position % 10 === 0 && i < lineStart + residuesPerLine - 1) {
                zerosLine += ' ';
                positionMarkers.push(false); // Space character
            }
        }

        // Replace only standalone zeros with non-breaking spaces
        let finalZerosLine = '';
        for (let i = 0; i < zerosLine.length; i++) {
            if (zerosLine[i] === '0' && !positionMarkers[i]) {
                finalZerosLine += '&nbsp;';
            } else {
                finalZerosLine += zerosLine[i];
            }
        }
        zerosLine = finalZerosLine;

        // Add zeros line first
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #007bff;">${zerosLine}</div>`;
        // Then add sequence line
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #333;">${sequenceLine}</div>`;
    }
    
    // Build final visualization
    const totalLength = sequence.length;
    const visualization = `
        <div style="color: #666; font-size: 11px; margin-bottom: 6px;">
            <strong>Sequence:</strong>
        </div>
        ${allLines}
        <div style="color: #666; font-size: 11px; margin-top: 6px;">
            <strong>Length:</strong> ${totalLength} residues
        </div>
    `;
    
    vizDiv.innerHTML = visualization;
}

/**
 * Update the visibility of the Bonded Atom Pairs section based on whether ligand sequences exist
 */
function updateBondedAtomPairsVisibility() {
    const dynamicSection = document.getElementById("dynamicBondedAtomPairsSection");
    if (!dynamicSection) return;
    
    // Check if there are any ligand sequences
    const hasLigands = app && app.sequences && app.sequences.some(seq => seq.type === "ligand");
    
    if (hasLigands && !document.getElementById("bondedAtomPairsContainer")) {
        // Show the bonded atom pairs section
        dynamicSection.innerHTML = `
            <div class="mt-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <button class="btn btn-link text-start p-0 d-flex align-items-center" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#bondedAtomPairsCollapse" 
                                aria-expanded="false" 
                                aria-controls="bondedAtomPairsCollapse"
                                style="text-decoration: none; color: inherit;">
                            <span>bondedAtomPairs (Optional)</span>
                            <i class="fas fa-chevron-down ms-2"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="addBondedAtomPair()">
                            <i class="fas fa-plus me-1"></i>Add Bond
                        </button>
                    </div>
                    <div class="collapse" id="bondedAtomPairsCollapse">
                        <div class="card-body">
                            <div class="mb-3">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle me-1"></i>
                                    Format: [["Chain ID", Residue ID, "Atom Name"], ["Chain ID", Residue ID, "Atom Name"]]<br>
                                    Example: [["A", 1, "O4"], ["A", 2, "C1"]] - bonds O4 of residue 1 in chain A to C1 of residue 2 in chain A
                                </small>
                            </div>
                            <div id="bondedAtomPairsContainer">
                                <p class="text-muted">No bondedAtomPairs defined</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (!hasLigands && document.getElementById("bondedAtomPairsContainer")) {
        // Hide the bonded atom pairs section
        dynamicSection.innerHTML = "";
        // Clear any existing bonds
        if (app && window.app.bondedAtomPairs) {
            window.app.bondedAtomPairs = [];
        }
    }
}

// Glycosylation Sites Functions
function addGlycosylationSite(sequenceId) {
    // Automatically expand the glycosylation section if collapsed
    const collapseElement = document.getElementById(`${sequenceId}_glycosylationCollapse`);
    if (collapseElement && !collapseElement.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, { show: true });
    }
    
    const container = document.getElementById(`${sequenceId}_glycosylationSites`);
    const siteId = `glyco_${sequenceId}_${Date.now()}`;
    
    // Clear placeholder if this is the first site
    const placeholder = container.querySelector('.text-muted');
    if (placeholder && placeholder.textContent === 'No glycosylation sites defined') {
        container.innerHTML = '';
    }
    
    const siteHTML = `
        <div class="card mb-2" id="${siteId}">
            <div class="card-body py-2">
                <div class="row">
                    <div class="col-md-2">
                        <label class="form-label mb-1">Position*</label>
                        <input type="number" class="form-control" id="${siteId}_position"
                               placeholder="1" min="1" style="height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;"
                               oninput="autoDetectResidueType('${siteId}', '${sequenceId}'); updateGlycosylationHighlighting('${sequenceId}');">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label mb-1">Residue*</label>
                        <select class="form-select" id="${siteId}_residueType" style="height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;" onchange="updateAtomOptions('${siteId}'); updateGlycosylationData('${sequenceId}')">
                            <option value="">Select...</option>
                            <option value="N">N</option>
                            <option value="S">S</option>
                            <option value="T">T</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label mb-1">Linking Atom*</label>
                        <select class="form-select" id="${siteId}_atom" style="height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important; padding-right: 30px !important; background-color: white;" onchange="updateGlycosylationData('${sequenceId}')">
                            <option value="">Select residue first</option>
                        </select>
                        <input type="text" class="form-control" id="${siteId}_customAtom"
                               placeholder="Custom atom" style="display: none; height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;" 
                               oninput="updateGlycosylationData('${sequenceId}')">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label mb-1">Chain ID*</label>
                        <input type="text" class="form-control" id="${siteId}_chainId"
                               placeholder="GLYCANA" oninput="validateChainId(this); updateGlycosylationData('${sequenceId}')"
                               style="text-transform: uppercase; height: 30px !important; min-height: 30px !important; max-height: 30px !important; padding: 2px 6px !important;"
                               title="Auto-generated, can be edited">
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-start position-relative">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center mb-1">
                                    <label class="form-label mb-0 me-2">Glycan*</label>
                                    <button type="button" class="btn btn-outline-primary btn-sm"
                                            style="padding: 1px 4px; font-size: 10px;"
                                            onclick="openSugarDrawerPopup('${siteId}_glycan')"
                                            title="Open SugarDrawer to draw glycan structure">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                </div>
                                <textarea class="form-control" id="${siteId}_glycan" rows="1"
                                          placeholder="Import GlycoCT..." style="min-height: 30px; padding: 2px 6px; resize: vertical;"
                                          oninput="processGlycoCTInput('${siteId}', '${sequenceId}')"></textarea>
                            </div>
                            <button type="button" class="btn btn-outline-danger btn-sm ms-2"
                                    style="width: 30px; height: 30px; padding: 0; position: absolute; right: -55px; top: 0;"
                                    onclick="removeGlycosylationSite('${siteId}', '${sequenceId}')"
                                    title="Delete this glycosylation site">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label mb-1">Description</label>
                        <textarea class="form-control form-control-sm" id="${siteId}_description" rows="1"
                                  placeholder="Optional description..."
                                  oninput="updateGlycosylationData('${sequenceId}')"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', siteHTML);
    
    // Auto-generate chain ID using the same logic as glycoCT input and SugarDrawer
    const chainId = generateNextGlycanChainId();
    const chainIdInput = document.getElementById(`${siteId}_chainId`);
    if (chainIdInput) {
        chainIdInput.value = chainId;
    }
    
    // Update badge to show site count
    updateGlycosylationSitesBadge(sequenceId);
    
    // Update sequence data
    app.debounceGenerate();
}

function autoDetectResidueType(siteId, sequenceId) {
    const positionInput = document.getElementById(`${siteId}_position`);
    const residueTypeSelect = document.getElementById(`${siteId}_residueType`);
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    
    if (!positionInput || !residueTypeSelect || !sequenceInput) return;
    
    const position = parseInt(positionInput.value);
    const sequence = sequenceInput.value.toUpperCase().replace(/\s/g, '');
    
    if (position && position > 0 && position <= sequence.length && sequence) {
        const residue = sequence[position - 1]; // Convert to 0-based index
        
        // Auto-select residue type based on the amino acid at that position
        switch (residue) {
            case 'N':
                residueTypeSelect.value = 'N';
                break;
            case 'S':
                residueTypeSelect.value = 'S';
                break;
            case 'T':
                residueTypeSelect.value = 'T';
                break;
            default:
                residueTypeSelect.value = 'custom';
                break;
        }
        
        // Update atom options based on the detected residue type
        updateAtomOptions(siteId);
        
    }
}

function updateAtomOptions(siteId) {
    const residueTypeSelect = document.getElementById(`${siteId}_residueType`);
    const atomSelect = document.getElementById(`${siteId}_atom`);
    const customAtomInput = document.getElementById(`${siteId}_customAtom`);
    
    if (!residueTypeSelect || !atomSelect || !customAtomInput) return;
    
    const residueType = residueTypeSelect.value;
    
    // Clear previous options
    atomSelect.innerHTML = '';
    
    switch (residueType) {
        case 'N':
            atomSelect.innerHTML = '<option value="ND2">ND2 (amide)</option>';
            atomSelect.style.display = 'block';
            customAtomInput.style.display = 'none';
            break;
        case 'S':
            atomSelect.innerHTML = '<option value="OG">OG (hydroxyl)</option>';
            atomSelect.style.display = 'block';
            customAtomInput.style.display = 'none';
            break;
        case 'T':
            atomSelect.innerHTML = '<option value="OG1">OG1 (hydroxyl)</option>';
            atomSelect.style.display = 'block';
            customAtomInput.style.display = 'none';
            break;
        case 'custom':
            atomSelect.style.display = 'none';
            customAtomInput.style.display = 'block';
            break;
        default:
            atomSelect.innerHTML = '<option value="">Select residue first</option>';
            atomSelect.style.display = 'block';
            customAtomInput.style.display = 'none';
            break;
    }
}

function removeGlycosylationSite(siteId, sequenceId) {
    // Remove from DOM
    const element = document.getElementById(siteId);
    if (element) {
        element.remove();
    }
    
    // Show placeholder if no sites left
    const container = document.getElementById(`${sequenceId}_glycosylationSites`);
    if (container && container.children.length === 0) {
        container.innerHTML = '<small class="text-muted">No glycosylation sites defined</small>';
    }
    
    // Update highlighting immediately
    updateGlycosylationHighlighting(sequenceId);
    
    // Update badge to show current site count
    updateGlycosylationSitesBadge(sequenceId);

    // Auto-cleanup unused userCCDs after glycosylation site removal
    if (window.autoCleanupUserCCDs) {
        window.autoCleanupUserCCDs();
    }

    // Update sequence data
    app.debounceGenerate();
}

function updateGlycosylationData(sequenceId) {
    updateGlycosylationMarking(sequenceId);

    // Refresh bonded atom pair dropdowns since chain IDs might have changed
    refreshBondedAtomPairDropdowns();

    app.debounceGenerate();
}

function updateGlycosylationHighlighting(sequenceId) {
    // Quick highlighting update that only requires position numbers
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) return;
    
    const sequence = sequenceInput.value.toUpperCase().replace(/\s/g, '');
    if (!sequence) return;
    
    // Collect ALL position numbers from glycosylation sites, even if incomplete
    const container = document.getElementById(`${sequenceId}_glycosylationSites`);
    const glycosylatedPositions = [];
    
    if (container) {
        const siteCards = container.querySelectorAll('[id^="glyco_"]');
        siteCards.forEach(card => {
            const siteId = card.id;
            const positionInput = document.getElementById(`${siteId}_position`);
            const position = parseInt(positionInput?.value);
            
            // Only need valid position number for highlighting
            if (position && position > 0 && position <= sequence.length) {
                glycosylatedPositions.push(position);
            }
        });
    }
    
    // Update highlighting immediately
    if (glycosylatedPositions.length > 0) {
        sequenceInput.dataset.glycosylatedPositions = JSON.stringify(glycosylatedPositions);
        sequenceInput.classList.add('has-glycosylation');
    } else {
        sequenceInput.classList.remove('has-glycosylation');
        delete sequenceInput.dataset.glycosylatedPositions;
    }

    // Get PTM positions and sequon positions as well for combined display
    const ptmPositions = sequenceInput?.dataset.modifiedPositions ?
        JSON.parse(sequenceInput.dataset.modifiedPositions) : [];
    const sequonPositions = sequenceInput?.dataset.sequonPositions ?
        JSON.parse(sequenceInput.dataset.sequonPositions) : [];

    // Use the comprehensive visualization function that handles all highlighting types
    updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, ptmPositions);
}

async function processGlycoCTInput(siteId, sequenceId) {
    const glycanTextarea = document.getElementById(`${siteId}_glycan`);
    const chainIdInput = document.getElementById(`${siteId}_chainId`);

    if (!glycanTextarea || !chainIdInput) return;

    const glycoCT = glycanTextarea.value.trim();

    if (glycoCT) {
        try {
            // Validate the GlycoCT structure before processing
            if (typeof validateGlycoCTStructure === 'function') {
                const validation = validateGlycoCTStructure(glycoCT);
                if (!validation.valid) {
                    // Display validation errors inline
                    displayGlycoCTValidationErrors(`${siteId}_glycan`, validation);
                    return; // Exit early without processing
                }
            }

            // Clear any previous validation errors if validation passed
            displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });
            // Use the chain ID from the input
            const chainId = chainIdInput.value;
            
            // Convert GlycoCT to get CCD codes
            const converted = await convertGlycoCTToEnhancedLigand(glycoCT, chainId);

            // Process substituents if substituent handler is available
            let finalCCDs = converted.ligand?.ligand?.ccdCodes || [];

            if (window.substituentHandler) {
                const substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(glycoCT, chainId);

                if (substituentResult) {
                    // Check if combinedCCDs contains base sugars (proper merge) or just substituents (bug)
                    const hasBaseSugars = substituentResult.combinedCCDs?.some(ccd =>
                        ['NDG', 'GAL', 'GLC', 'MAN', 'FUC', 'GLB', 'ARA', 'RIB', 'XYL', 'GNS', 'IDR'].includes(ccd));

                    if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0 && hasBaseSugars) {
                        // Use combined CCDs (includes both base sugars and substituents properly merged)
                        finalCCDs = substituentResult.combinedCCDs;
                    } else if (substituentResult.substituentCCDs && substituentResult.substituentCCDs.length > 0) {
                        // Fallback: manually merge base + substituents
                        if (window.mergeSubstituentsInResOrder && substituentResult.orderedEntries) {
                            finalCCDs = window.mergeSubstituentsInResOrder(finalCCDs, substituentResult.orderedEntries);
                        } else {
                            // Simple append fallback
                            finalCCDs = finalCCDs.concat(substituentResult.substituentCCDs);
                        }
                    }

                    // Handle required userCCDs
                    if (substituentResult.requiredUserCCDs && Object.keys(substituentResult.requiredUserCCDs).length > 0) {
                        if (!window.app.userCCDs) {
                            window.app.userCCDs = {};
                        }
                        Object.assign(window.app.userCCDs, substituentResult.requiredUserCCDs);
                    }
                }
            }

            if (finalCCDs && finalCCDs.length > 0) {
                // Refresh bonded atom pair dropdowns since glycan chain residue count changed
                refreshBondedAtomPairDropdowns();
            }
        } catch (error) {
            // Set flag to prevent popup close if conversion is in progress
            if (window.ccdConversionInProgress) {
                window.ccdConversionError = true;
            }
            // Clear validation errors on exception
            displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });
        }
    } else {
        // Clear validation errors when input is empty
        displayGlycoCTValidationErrors(`${siteId}_glycan`, { valid: true });
    }

    // Update glycosylation data
    updateGlycosylationData(sequenceId);
}

function updateGlycosylationMarking(sequenceId) {
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    if (!sequenceInput) return;
    
    // Get current glycosylation sites
    const sites = collectGlycosylationSites(sequenceId);
    const sequence = sequenceInput.value.toUpperCase();
    
    if (sites.length > 0 && sequence) {
        // Get glycosylated positions
        const glycosylatedPositions = sites.map(site => site.position);
        sequenceInput.dataset.glycosylatedPositions = JSON.stringify(glycosylatedPositions);
        sequenceInput.classList.add('has-glycosylation');
        
        // Update the visual marking in the main visualization
        const ptmPositions = sequenceInput?.dataset.modifiedPositions ?
            JSON.parse(sequenceInput.dataset.modifiedPositions) : [];
        const sequonPositions = sequenceInput?.dataset.sequonPositions ?
            JSON.parse(sequenceInput.dataset.sequonPositions) : [];
        updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, ptmPositions);
    } else {
        sequenceInput.classList.remove('has-glycosylation');
        delete sequenceInput.dataset.glycosylatedPositions;

        // Check if we still have PTMs or sequons to show
        const ptmPositions = sequenceInput?.dataset.modifiedPositions ?
            JSON.parse(sequenceInput.dataset.modifiedPositions) : [];
        const sequonPositions = sequenceInput?.dataset.sequonPositions ?
            JSON.parse(sequenceInput.dataset.sequonPositions) : [];
        if (ptmPositions.length > 0 || sequonPositions.length > 0) {
            updateSequenceVisualWithSequons(sequenceId, sequence, [], sequonPositions, ptmPositions);
        } else {
            updateSequenceVisualization(sequenceId);
        }
    }
}

function updateSequenceVisualWithGlycosylation(sequenceId, sequence, glycosylatedPositions) {
    // Update the main visualization div to include glycosylation marking
    const vizDiv = document.getElementById(`${sequenceId}_sequenceViz`);
    if (!vizDiv || !sequence) return;

    // Get PTM positions and sequon positions as well
    const sequenceInput = document.getElementById(`${sequenceId}_sequence`);
    const ptmPositions = sequenceInput?.dataset.modifiedPositions ?
        JSON.parse(sequenceInput.dataset.modifiedPositions) : [];
    const sequonPositions = sequenceInput?.dataset.sequonPositions ?
        JSON.parse(sequenceInput.dataset.sequonPositions) : [];

    // Simple sequence display with PTM, glycosylation, and sequon highlighting and spacing every 10 residues
    const residuesPerLine = 50;
    let allLines = '';

    for (let lineStart = 0; lineStart < sequence.length; lineStart += residuesPerLine) {
        const lineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let sequenceLine = '';

        // Build sequence line
        for (let i = lineStart; i < lineEnd; i++) {
            const position = i + 1;
            const char = sequence[i];
            const isModified = ptmPositions.includes(position);
            const isGlycosylated = glycosylatedPositions.includes(position);
            const isSequon = sequonPositions.includes(position);

            // Sequence line with all highlighting types
            let style = '';
            let title = `Position ${position}`;

            if (isModified && isGlycosylated && isSequon) {
                style = 'background: linear-gradient(45deg, #ffeb3b 33%, #4caf50 33%, #4caf50 66%, #2196f3 66%); color: white; font-weight: bold; border-radius: 2px;';
                title = `Modified, glycosylated, and sequon residue at position ${position}`;
            } else if (isModified && isGlycosylated) {
                style = 'background: linear-gradient(45deg, #ffeb3b 50%, #4caf50 50%); color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified and glycosylated residue at position ${position}`;
            } else if (isModified && isSequon) {
                style = 'background: linear-gradient(45deg, #ffeb3b 50%, #2196f3 50%); color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified and sequon residue at position ${position}`;
            } else if (isGlycosylated && isSequon) {
                style = 'background: linear-gradient(45deg, #4caf50 50%, #2196f3 50%); color: white; font-weight: bold; border-radius: 2px;';
                title = `Glycosylated and sequon residue at position ${position}`;
            } else if (isModified) {
                style = 'background: #ffeb3b; color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified residue at position ${position}`;
            } else if (isGlycosylated) {
                style = 'background: #4caf50; color: white; font-weight: bold; border-radius: 2px;';
                title = `Glycosylated residue at position ${position}`;
            } else if (isSequon) {
                style = 'background: #2196f3; color: white; font-weight: bold; border-radius: 2px;';
                title = `N-glycosylation sequon at position ${position}`;
            }

            if (style) {
                sequenceLine += `<span style="${style}" title="${title}">${char}</span>`;
            } else {
                sequenceLine += char;
            }

            if (position % 10 === 0 && i < lineEnd - 1) {
                sequenceLine += ' ';
            }
        }

        // Build zeros line with exact same logic, but handling multi-digit positions
        // Always build for full residuesPerLine even if actual line is shorter
        const fullLineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let zerosLine = '';
        let positionOverrideDigits = [];
        let positionMarkers = []; // Track which characters are part of position numbers

        for (let i = lineStart; i < lineStart + residuesPerLine; i++) {
            const position = i + 1;
            const isActualSequence = i < fullLineEnd;

            // Check if we're in the middle of a multi-digit position number
            if (positionOverrideDigits.length > 0) {
                const digit = positionOverrideDigits.shift();
                zerosLine += digit;
                positionMarkers.push(true); // This character is part of a position number
            } else if (isActualSequence && (position - 1) % 10 === 0) { // positions 1, 11, 21, 31, etc.
                const posStr = position.toString();
                zerosLine += posStr[0]; // Add first digit
                positionMarkers.push(true); // This character is part of a position number
                if (posStr.length > 1) {
                    positionOverrideDigits = posStr.substring(1).split(''); // Store remaining digits
                }
            } else {
                zerosLine += '0';
                positionMarkers.push(false); // All standalone zeros should be replaceable
            }

            // Add space every 10 residues for readability - same logic as sequence
            if (position % 10 === 0 && i < lineStart + residuesPerLine - 1) {
                zerosLine += ' ';
                positionMarkers.push(false); // Space character
            }
        }

        // Replace only standalone zeros with non-breaking spaces
        let finalZerosLine = '';
        for (let i = 0; i < zerosLine.length; i++) {
            if (zerosLine[i] === '0' && !positionMarkers[i]) {
                finalZerosLine += '&nbsp;';
            } else {
                finalZerosLine += zerosLine[i];
            }
        }
        zerosLine = finalZerosLine;

        // Add zeros line first
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #007bff;">${zerosLine}</div>`;
        // Then add sequence line
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #333;">${sequenceLine}</div>`;
    }

    // Build final visualization with all info
    const totalLength = sequence.length;
    const modifiedCount = ptmPositions.length;
    const glycosylatedCount = glycosylatedPositions.length;
    const sequonCount = sequonPositions.length;

    const ptmInfo = modifiedCount > 0 ? `<span style="color: #d32f2f; font-weight: bold;"> | Modified: ${modifiedCount}</span>` : '';
    const sequonInfo = sequonCount > 0 ? `<span style="color: #2196f3; font-weight: bold;"> | N-glycan sequon: ${sequonCount}</span>` : '';
    const glycoInfo = glycosylatedCount > 0 ? `<span style="color: #4caf50; font-weight: bold;"> | Glycosylation: ${glycosylatedCount}</span>` : '';

    const visualization = `
        <div style="color: #666; font-size: 11px; margin-bottom: 6px;">
            <strong>Sequence:</strong>
        </div>
        ${allLines}
        <div style="color: #666; font-size: 11px; margin-top: 6px;">
            <strong>Length:</strong> ${totalLength} residues${sequonInfo}${glycoInfo}${ptmInfo}
        </div>
    `;

    vizDiv.innerHTML = visualization;
}

function updateSequenceVisualWithSequons(sequenceId, sequence, glycosylatedPositions, sequonPositions, ptmPositions) {
    // Update the main visualization div to include all types of highlighting
    const vizDiv = document.getElementById(`${sequenceId}_sequenceViz`);
    if (!vizDiv || !sequence) return;

    // Simple sequence display with PTM, glycosylation, and sequon highlighting
    const residuesPerLine = 50;
    let allLines = '';

    for (let lineStart = 0; lineStart < sequence.length; lineStart += residuesPerLine) {
        const lineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let sequenceLine = '';

        // Build sequence line
        for (let i = lineStart; i < lineEnd; i++) {
            const position = i + 1;
            const char = sequence[i];
            const isModified = ptmPositions.includes(position);
            const isGlycosylated = glycosylatedPositions.includes(position);
            const isSequon = sequonPositions.includes(position);

            // Sequence line with all highlighting types
            let style = '';
            let title = `Position ${position}`;

            if (isModified && isGlycosylated && isSequon) {
                style = 'background: linear-gradient(45deg, #ffeb3b 33%, #4caf50 33%, #4caf50 66%, #2196f3 66%); color: white; font-weight: bold; border-radius: 2px;';
                title = `Modified, glycosylated, and sequon residue at position ${position}`;
            } else if (isModified && isGlycosylated) {
                style = 'background: linear-gradient(45deg, #ffeb3b 50%, #4caf50 50%); color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified and glycosylated residue at position ${position}`;
            } else if (isModified && isSequon) {
                style = 'background: linear-gradient(45deg, #ffeb3b 50%, #2196f3 50%); color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified and sequon residue at position ${position}`;
            } else if (isGlycosylated && isSequon) {
                style = 'background: linear-gradient(45deg, #4caf50 50%, #2196f3 50%); color: white; font-weight: bold; border-radius: 2px;';
                title = `Glycosylated and sequon residue at position ${position}`;
            } else if (isModified) {
                style = 'background: #ffeb3b; color: #d32f2f; font-weight: bold; border-radius: 2px;';
                title = `Modified residue at position ${position}`;
            } else if (isGlycosylated) {
                style = 'background: #4caf50; color: white; font-weight: bold; border-radius: 2px;';
                title = `Glycosylated residue at position ${position}`;
            } else if (isSequon) {
                style = 'background: #2196f3; color: white; font-weight: bold; border-radius: 2px;';
                title = `N-glycosylation sequon at position ${position}`;
            }

            if (style) {
                sequenceLine += `<span style="${style}" title="${title}">${char}</span>`;
            } else {
                sequenceLine += char;
            }

            if (position % 10 === 0 && i < lineEnd - 1) {
                sequenceLine += ' ';
            }
        }

        // Build zeros line with exact same logic, but handling multi-digit positions
        // Always build for full residuesPerLine even if actual line is shorter
        const fullLineEnd = Math.min(lineStart + residuesPerLine, sequence.length);
        let zerosLine = '';
        let positionOverrideDigits = [];
        let positionMarkers = []; // Track which characters are part of position numbers

        for (let i = lineStart; i < lineStart + residuesPerLine; i++) {
            const position = i + 1;
            const isActualSequence = i < fullLineEnd;

            // Check if we're in the middle of a multi-digit position number
            if (positionOverrideDigits.length > 0) {
                const digit = positionOverrideDigits.shift();
                zerosLine += digit;
                positionMarkers.push(true); // This character is part of a position number
            } else if (isActualSequence && (position - 1) % 10 === 0) { // positions 1, 11, 21, 31, etc.
                const posStr = position.toString();
                zerosLine += posStr[0]; // Add first digit
                positionMarkers.push(true); // This character is part of a position number
                if (posStr.length > 1) {
                    positionOverrideDigits = posStr.substring(1).split(''); // Store remaining digits
                }
            } else {
                zerosLine += '0';
                positionMarkers.push(false); // All standalone zeros should be replaceable
            }

            // Add space every 10 residues for readability - same logic as sequence
            if (position % 10 === 0 && i < lineStart + residuesPerLine - 1) {
                zerosLine += ' ';
                positionMarkers.push(false); // Space character
            }
        }

        // Replace only standalone zeros with non-breaking spaces
        let finalZerosLine = '';
        for (let i = 0; i < zerosLine.length; i++) {
            if (zerosLine[i] === '0' && !positionMarkers[i]) {
                finalZerosLine += '&nbsp;';
            } else {
                finalZerosLine += zerosLine[i];
            }
        }
        zerosLine = finalZerosLine;

        // Add zeros line first
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #007bff;">${zerosLine}</div>`;
        // Then add sequence line
        allLines += `<div style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 2px; color: #333;">${sequenceLine}</div>`;
    }
    
    // Build final visualization with all info
    const totalLength = sequence.length;
    const modifiedCount = ptmPositions.length;
    const glycosylatedCount = glycosylatedPositions.length;
    const sequonCount = sequonPositions.length;
    
    const ptmInfo = modifiedCount > 0 ? `<span style="color: #d32f2f; font-weight: bold;"> | Modified: ${modifiedCount}</span>` : '';
    const sequonInfo = sequonCount > 0 ? `<span style="color: #2196f3; font-weight: bold;"> | N-glycan sequon: ${sequonCount}</span>` : '';
    const glycoInfo = glycosylatedCount > 0 ? `<span style="color: #4caf50; font-weight: bold;"> | Glycosylation: ${glycosylatedCount}</span>` : '';

    const visualization = `
        <div style="color: #666; font-size: 11px; margin-bottom: 6px;">
            <strong>Sequence:</strong>
        </div>
        ${allLines}
        <div style="color: #666; font-size: 11px; margin-top: 6px;">
            <strong>Length:</strong> ${totalLength} residues${sequonInfo}${glycoInfo}${ptmInfo}
        </div>
    `;

    vizDiv.innerHTML = visualization;
}

// Update badge indicators for section content
function updateSectionBadges(sequenceId) {
    updateGlycosylationSitesBadge(sequenceId);
    updateSequonSitesBadge(sequenceId);
}

function updateGlycosylationSitesBadge(sequenceId) {
    const container = document.getElementById(`${sequenceId}_glycosylationSites`);
    const badge = document.getElementById(`${sequenceId}_glycoSitesBadge`);
    
    if (!badge) return;
    
    if (container) {
        // Count only the main card containers for glycosylation sites
        const sites = container.querySelectorAll('[id^="glyco_"].card');
        const count = sites.length;
        
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateSequonSitesBadge(sequenceId) {
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    const badge = document.getElementById(`${sequenceId}_sequonSitesBadge`);
    
    if (!badge) return;
    
    if (container) {
        // Count only the main card containers for sequon sites
        const sites = container.querySelectorAll('[id^="sequon_"].card');
        const count = sites.length;
        
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

function collectGlycosylationSites(sequenceId) {
    const sites = [];
    const container = document.getElementById(`${sequenceId}_glycosylationSites`);
    
    if (container) {
        const siteCards = container.querySelectorAll('[id^="glyco_"]');
        siteCards.forEach(card => {
            const siteId = card.id;
            const position = parseInt(document.getElementById(`${siteId}_position`)?.value);
            const residueType = document.getElementById(`${siteId}_residueType`)?.value;
            const atomSelect = document.getElementById(`${siteId}_atom`);
            const customAtomInput = document.getElementById(`${siteId}_customAtom`);
            const chainId = document.getElementById(`${siteId}_chainId`)?.value?.trim();
            const glycanText = document.getElementById(`${siteId}_glycan`)?.value?.trim();
            const description = document.getElementById(`${siteId}_description`)?.value?.trim();
            
            let atom = '';
            if (residueType === 'custom') {
                atom = customAtomInput?.value?.trim();
            } else {
                atom = atomSelect?.value;
            }
            
            if (position && residueType && atom && chainId && glycanText && position > 0) {
                sites.push({
                    position: position,
                    residueType: residueType,
                    atom: atom,
                    chainId: chainId,
                    glycoCT: glycanText,
                    description: description || '' // Include description (can be empty)
                });
            }
        });
    }
    
    return sites;
}

function collectSequonSites(sequenceId) {
    const sites = [];
    const container = document.getElementById(`${sequenceId}_sequonSites`);
    
    if (container) {
        const siteCards = container.querySelectorAll('[id^="sequon_"]');
        siteCards.forEach(card => {
            const siteId = card.id;
            const position = parseInt(document.getElementById(`${siteId}_position`)?.value);
            const chainId = document.getElementById(`${siteId}_chainId`)?.value?.trim();
            const glycanText = document.getElementById(`${siteId}_glycan`)?.value?.trim();
            const description = document.getElementById(`${siteId}_description`)?.value?.trim();
            
            if (position && chainId && glycanText && position > 0) {
                sites.push({
                    position: position,
                    residueType: 'N', // Always N for sequons
                    atom: 'ND2',      // Always ND2 for N-glycosylation
                    chainId: chainId,
                    glycoCT: glycanText,
                    description: description || '' // Include description (can be empty)
                });
            }
        });
    }
    
    return sites;
}

/**
 * Remove duplicate glycosylation sites between manual and sequon-detected sites
 * Priority: Manual sites take precedence over sequon-detected sites
 * @param {Array} manualSites - Sites manually added by user
 * @param {Array} sequonSites - Sites detected by sequon analysis
 * @returns {Object} - Object with deduplicated manual and sequon arrays
 */
function deduplicateGlycosylationSites(manualSites, sequonSites) {

    // Create a set of manual site positions for quick lookup
    const manualPositions = new Set();
    manualSites.forEach(site => {
        const key = `${site.position}-${site.residueType}-${site.atom}`;
        manualPositions.add(key);
    });

    // Filter out sequon sites that duplicate manual sites
    const deduplicatedSequonSites = sequonSites.filter(sequonSite => {
        const key = `${sequonSite.position}-${sequonSite.residueType}-${sequonSite.atom}`;
        const isDuplicate = manualPositions.has(key);

        if (isDuplicate) {
        }

        return !isDuplicate;
    });

    const removedCount = sequonSites.length - deduplicatedSequonSites.length;
    if (removedCount > 0) {

        // Show user notification if app is available
        if (window.app && window.app.showInfo) {
            window.app.showInfo(`Removed ${removedCount} duplicate sequon site(s) that conflict with manual glycosylation sites.`);
        }
    }

    return {
        manual: manualSites,
        sequon: deduplicatedSequonSites
    };
}

async function processGlycosylationSites(sequenceId, proteinChainId, multimerChainId = null) {
    const manualSites = collectGlycosylationSites(sequenceId);
    const sequonSites = collectSequonSites(sequenceId);

    // Remove duplicates between manual and sequon sites
    const deduplicatedSites = deduplicateGlycosylationSites(manualSites, sequonSites);

    // Combine both types of sites after deduplication
    const allSites = [...deduplicatedSites.manual, ...deduplicatedSites.sequon];
    
    const results = {
        ligands: [],
        bonds: []
    };

    if (allSites.length === 0) {
        return results;
    }


    for (let i = 0; i < allSites.length; i++) {
        const site = allSites[i];

        try {
            // Generate unique glycan chain ID for multimers
            let glycanChainId = site.chainId;
            if (multimerChainId) {
                // For multimers, append the protein chain ID to make glycan chain IDs unique
                // e.g., GLYCANA + A = GLYCANAA, GLYCANA + B = GLYCANAB
                glycanChainId = `${site.chainId}${multimerChainId}`;
            }

            // Convert GlycoCT to ligand data
            const converted = await convertGlycoCTToEnhancedLigand(site.glycoCT, glycanChainId);

            // Process substituents if substituent handler is available
            let finalCCDs = converted.ligand?.ligand?.ccdCodes || [];

            if (window.substituentHandler) {
                const substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(site.glycoCT, glycanChainId);

                if (substituentResult) {
                    // Check if combinedCCDs contains base sugars (proper merge) or just substituents (bug)
                    const hasBaseSugars = substituentResult.combinedCCDs?.some(ccd =>
                        ['NDG', 'GAL', 'GLC', 'MAN', 'FUC', 'GLB', 'ARA', 'RIB', 'XYL', 'GNS', 'IDR'].includes(ccd));

                    if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0 && hasBaseSugars) {
                        // Use combined CCDs (includes both base sugars and substituents properly merged)
                        finalCCDs = substituentResult.combinedCCDs;
                    } else if (substituentResult.substituentCCDs && substituentResult.substituentCCDs.length > 0) {
                        // Fallback: manually merge base + substituents
                        if (window.mergeSubstituentsInResOrder && substituentResult.orderedEntries) {
                            finalCCDs = window.mergeSubstituentsInResOrder(finalCCDs, substituentResult.orderedEntries);
                        } else {
                            // Simple append fallback
                            finalCCDs = finalCCDs.concat(substituentResult.substituentCCDs);
                        }
                    }

                    // Handle required userCCDs
                    if (substituentResult.requiredUserCCDs && Object.keys(substituentResult.requiredUserCCDs).length > 0) {
                        if (!window.app.userCCDs) {
                            window.app.userCCDs = {};
                        }
                        Object.assign(window.app.userCCDs, substituentResult.requiredUserCCDs);
                    }
                }
            }

            if (converted && converted.ligand && converted.ligand.ligand && finalCCDs.length > 0) {
                // Add glycan as a ligand
                const glycanLigand = {
                    ligand: {
                        id: glycanChainId,
                        ccdCodes: finalCCDs
                    }
                };

                // Only add description if user provided one (put at end for consistent JSON order)
                if (site.description) {
                    glycanLigand.ligand.description = site.description;
                }

                results.ligands.push(glycanLigand);

                // Add protein-glycan bond
                const proteinGlycanBond = [
                    [proteinChainId, site.position, site.atom],     // Protein attachment point
                    [glycanChainId, 1, 'C1']                        // Glycan anomeric carbon (typically C1)
                ];

                results.bonds.push(proteinGlycanBond);

                // Add internal glycan bonds if any
                if (converted.bondedAtomPairs && converted.bondedAtomPairs.length > 0) {
                    results.bonds.push(...converted.bondedAtomPairs);
                }

                // Add userCCD data if needed
                if (converted.userCCDs && Object.keys(converted.userCCDs).length > 0) {
                    // Store userCCD data in global app for JSON generation
                    if (!window.app.glycanUserCCDs) {
                        window.app.glycanUserCCDs = {};
                    }
                    Object.assign(window.app.glycanUserCCDs, converted.userCCDs);
                }
            } else {
            }
        } catch (error) {
        }
    }

    return results;
}

/**
 * Apply automatic CCD replacements for ligand CCD codes
 * SIA → SIA-2, SLB → SLB-2, NGC → NGC-2, NGE → NGE-2
 */
async function applyLigandCCDReplacements(ccdCodes) {
    const replacements = {
        'SIA': 'SIA-2',
        'SLB': 'SLB-2',
        'NGC': 'NGC-2',
        'NGE': 'NGE-2'
    };
    
    const replacedCodes = [];
    let hasReplacements = false;
    
    for (const code of ccdCodes) {
        if (replacements[code]) {
            replacedCodes.push(replacements[code]);
            hasReplacements = true;
            
            // Load and register the corresponding userCCD data
            await registerLigandUserCCD(replacements[code], code);
        } else {
            replacedCodes.push(code);
        }
    }
    
    if (hasReplacements && window.app && window.app.addToDebugLog) {
        window.app.addToDebugLog('INFO', `Applied automatic CCD replacements: ${ccdCodes.join(', ')} → ${replacedCodes.join(', ')}`);
    }
    
    return replacedCodes;
}

/**
 * Register userCCD data for ligand CCD replacements
 * Adds to both glycanUserCCDs and main userCCDs storage
 */
async function registerLigandUserCCD(newCcdCode, originalCcdCode) {
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
            source: 'automatic-ligand',
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
                method: 'automatic-ligand',
                source: 'automatic-ligand',
                content: `Auto-loaded ${originalCcdCode} replacement for ligand`,
                timestamp: Date.now()
            });
        }
        
        
        // userCCD loaded silently
    } catch (error) {
    }
}

/**
 * Fetch protein sequence from UniProt API
 * @param {string} sequenceId - The sequence container ID
 */
async function fetchUniProtSequence(sequenceId) {
    const uniprotInput = document.getElementById(`${sequenceId}_uniprotId`);
    const sequenceTextarea = document.getElementById(`${sequenceId}_sequence`);

    if (!uniprotInput || !sequenceTextarea) {
        return;
    }

    const uniprotId = uniprotInput.value.trim().toUpperCase();

    // Validate UniProt ID format to prevent SSRF attacks
    if (!uniprotId) {
        if (window.app && window.app.showError) {
            window.app.showError('Please enter a UniProt ID');
        } else {
            alert('Please enter a UniProt ID');
        }
        return;
    }

    // Validate UniProt ID format: 6-10 alphanumeric characters (standard format)
    if (!/^[A-Z0-9]{6,10}$/.test(uniprotId)) {
        if (window.app && window.app.showError) {
            window.app.showError('Please enter a valid UniProt ID (e.g., P20273, Q8WZ42)');
        } else {
            alert('Please enter a valid UniProt ID (e.g., P20273, Q8WZ42)');
        }
        return;
    }

    // Add loading state
    const button = uniprotInput.nextElementSibling;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;

    try {

        // UniProt REST API endpoint for FASTA format
        const url = `https://rest.uniprot.org/uniprotkb/${uniprotId}.fasta`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`UniProt ID "${uniprotId}" not found`);
            } else {
                throw new Error(`Failed to fetch from UniProt: ${response.status} ${response.statusText}`);
            }
        }

        const fastaText = await response.text();

        // Parse FASTA format to extract sequence
        const lines = fastaText.split('\n');
        const sequenceLines = lines.filter(line => !line.startsWith('>') && line.trim());
        const sequence = sequenceLines.join('').replace(/\s/g, '').toUpperCase();

        if (!sequence) {
            throw new Error('No sequence found in UniProt response');
        }

        // Validate that it's a protein sequence
        const validProteinChars = /^[ACDEFGHIKLMNPQRSTVWY]*$/;
        if (!validProteinChars.test(sequence)) {
            throw new Error('Invalid protein sequence format from UniProt');
        }

        // Update the sequence textarea
        sequenceTextarea.value = sequence;

        // Automatically populate description field with UniProt ID
        const descriptionTextarea = document.getElementById(`${sequenceId}_description`);

        if (descriptionTextarea) {
            const currentDescription = descriptionTextarea.value.trim();

            // Only add UniProt ID if description is empty or doesn't already contain it
            if (!currentDescription) {
                const newValue = `UniProt ID: ${uniprotId}`;
                descriptionTextarea.value = newValue;
            } else if (!currentDescription.includes(uniprotId)) {
                const newValue = `${currentDescription} | UniProt ID: ${uniprotId}`;
                descriptionTextarea.value = newValue;
            } else {
            }


            // Trigger input event to ensure any listeners are notified
            descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
        }

        // Trigger validation and updates
        validateProteinSequence(sequenceTextarea);
        updateGlycosylationHighlighting(sequenceId);
        updateSequenceDataSync(sequenceId, 'protein');

        // Show success message
        if (window.app && window.app.showSuccess) {
            window.app.showSuccess(`Successfully imported ${sequence.length} amino acids from UniProt ID: ${uniprotId}`);
        }


    } catch (error) {

        if (window.app && window.app.showError) {
            window.app.showError(`Error fetching UniProt sequence: ${error.message}`);
        } else {
            alert(`Error fetching UniProt sequence: ${error.message}`);
        }
    } finally {
        // Restore button state
        button.innerHTML = originalHTML;
        button.disabled = false;
    }
}

// SugarDrawer Popup Functionality
let popupSugarDrawerInstance = null;
let currentTargetTextareaId = null;

/**
 * Open SugarDrawer popup for drawing glycan structure
 * @param {string} textareaId - The ID of the textarea to populate with GlycoCT
 */
function openSugarDrawerPopup(textareaId) {

    // Store the target textarea ID
    currentTargetTextareaId = textareaId;

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('sugarDrawerPopupModal'));
    modal.show();

    // Initialize SugarDrawer in the popup container
    setTimeout(() => {
        initializePopupSugarDrawer();
    }, 500); // Wait for modal to be fully shown
}

/**
 * Initialize SugarDrawer instance in the popup
 */
function initializePopupSugarDrawer() {
    const container = document.getElementById('sugarDrawerPopupContainer');
    if (!container) {
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    try {

        // Create iframe with scaled SugarDrawer for popup
        container.innerHTML = `
            <div class="sugardrawer-popup-integration">
                <iframe
                    id="sugarDrawerPopupFrame"
                    src="sugardrawer/dist/index.html?popup=true"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    style="border: none; border-radius: 0.375rem; transform: scale(0.9); transform-origin: top left; width: 111%; height: 111%;">
                </iframe>
            </div>

            <style>
                .sugardrawer-popup-integration {
                    background: white;
                    border-radius: 8px;
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                }

                #sugarDrawerPopupFrame {
                    display: block;
                    border: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                /* Hide specific buttons in popup SugarDrawer */
                #sugarDrawerPopupFrame {
                    /* This will be applied via postMessage to the iframe content */
                }
            </style>
        `;


        // Set up postMessage communication for the popup
        setupPopupPostMessageCommunication();

    } catch (error) {
        container.innerHTML = '<div class="alert alert-danger">Error initializing SugarDrawer</div>';
    }
}

/**
 * Setup postMessage communication for popup SugarDrawer
 */
function setupPopupPostMessageCommunication() {
    // Remove any existing listeners for popup
    if (window.popupMessageHandler) {
        window.removeEventListener('message', window.popupMessageHandler);
    }

    // Track validation state to prevent unwanted popup closure
    window.lastValidationFailed = false;

    // Create new handler for popup messages
    window.popupMessageHandler = (event) => {

        // Security check - ensure message is from expected sources
        if (event.origin === null ||
            event.origin === 'null' ||
            event.origin === 'https://pages.glycosmos.org' ||
            (event.origin && event.origin.startsWith('http://127.0.0.1')) ||
            (event.origin && event.origin.startsWith('http://localhost')) ||
            (event.origin && event.origin.includes('ngrok-free.app'))) {

            if (event.data && typeof event.data === 'object') {
                switch (event.data.type) {
                    case 'SUGARDRAWER_READY':
                        break;
                    case 'STRUCTURE_CHANGED':
                        break;
                    case 'EXPORT_RESPONSE':
                        // This will be handled by the export function's listener
                        break;
                    case 'SUGARDRAWER_NOTIFICATION':
                        // Handle automatic export when SugarDrawer copies to clipboard
                        if (event.data.message && event.data.message.includes('copied to clipboard')) {
                            setTimeout(() => {
                                autoExportAfterCopy();
                            }, 100); // Small delay to ensure clipboard is updated
                        }
                        break;
                    case 'SUGARDRAWER_ONE_CLICK_EXPORT':
                        handleOneClickExport(event.data);
                        break;
                    case 'CLOSE_POPUP':
                        if (window.lastValidationFailed) {
                            window.lastValidationFailed = false; // Reset for next attempt
                        } else {
                            closePopupModal();
                        }
                        break;
                }
            }
        }
    };

    // Add the new listener
    window.addEventListener('message', window.popupMessageHandler);
}

/**
 * Auto-export function triggered when SugarDrawer copies to clipboard
 */
function autoExportAfterCopy() {
    if (!currentTargetTextareaId) {
        return;
    }

    const targetTextarea = document.getElementById(currentTargetTextareaId);
    if (!targetTextarea) {
        return;
    }


    // Try to read from clipboard
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(clipboardText => {
            if (clipboardText && clipboardText.trim() && clipboardText.includes('RES')) {

                // Set the GlycoCT in the target textarea
                targetTextarea.value = clipboardText.trim();

                // Trigger the input event to process the GlycoCT
                const inputEvent = new Event('input', { bubbles: true });
                targetTextarea.dispatchEvent(inputEvent);

                // Show success message
                if (window.app && window.app.showSuccess) {
                    window.app.showSuccess('Glycan structure auto-exported from clipboard!');
                }

                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('sugarDrawerPopupModal'));
                if (modal) {
                    modal.hide();
                }

                // Clean up
                currentTargetTextareaId = null;
                popupSugarDrawerInstance = null;

            } else {
            }
        }).catch(error => {
        });
    } else {
    }
}

/**
 * One-click auto-export: Triggers SugarDrawer export and captures result automatically
 */
function exportGlycoCTFromPopup() {
    if (!currentTargetTextareaId) {
        return;
    }

    const targetTextarea = document.getElementById(currentTargetTextareaId);
    if (!targetTextarea) {
        return;
    }


    // Change button to show loading state
    const exportButton = document.getElementById('exportGlycoCTFromPopup');
    const originalButtonHTML = exportButton.innerHTML;
    exportButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Auto-Exporting...';
    exportButton.disabled = true;

    // Step 1: Send a message to SugarDrawer to trigger export
    const iframe = document.getElementById('sugarDrawerPopupFrame');
    if (iframe && iframe.contentWindow) {

        // Try multiple approaches to trigger export
        try {
            // Method 1: Send postMessage to trigger export
            iframe.contentWindow.postMessage({
                action: 'export',
                format: 'glycoct'
            }, '*');

            iframe.contentWindow.postMessage({
                type: 'TRIGGER_EXPORT',
                format: 'glycoct'
            }, '*');

            // Method 2: Try to simulate copy button click in SugarDrawer
            setTimeout(() => {
                iframe.contentWindow.postMessage({
                    action: 'copyGlycoCT'
                }, '*');
            }, 100);

        } catch (error) {
        }
    }

    // Step 2: Set up a monitoring system to capture the export
    let attempts = 0;
    const maxAttempts = 10;
    let lastClipboardContent = '';

    // Get initial clipboard content
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(initialContent => {
            lastClipboardContent = initialContent || '';
            startMonitoring();
        }).catch(() => {
            startMonitoring();
        });
    } else {
        startMonitoring();
    }

    function startMonitoring() {
        const monitor = setInterval(() => {
            attempts++;

            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText().then(currentContent => {
                    // Check if clipboard content has changed and contains GlycoCT
                    if (currentContent &&
                        currentContent !== lastClipboardContent &&
                        currentContent.includes('RES')) {

                        clearInterval(monitor);
                        exportSuccess(currentContent.trim());
                        return;
                    }

                    // If we've tried enough times, stop monitoring
                    if (attempts >= maxAttempts) {
                        clearInterval(monitor);
                        exportFallback();
                    }
                }).catch(error => {
                    if (attempts >= maxAttempts) {
                        clearInterval(monitor);
                        exportFallback();
                    }
                });
            } else {
                if (attempts >= maxAttempts) {
                    clearInterval(monitor);
                    exportFallback();
                }
            }
        }, 500); // Check every 500ms
    }

    function exportSuccess(glycoCT) {
        // Validate the GlycoCT structure before export
        if (typeof validateGlycoCTStructure === 'function') {
            const validation = validateGlycoCTStructure(glycoCT);
            if (!validation.valid) {
                // Show validation error messages instead of success
                if (window.app && window.app.showWarning) {
                    if (validation.issues && validation.issues.length > 0) {
                        // Show main error first
                        window.app.showWarning(`Cannot export glycan:`);
                        // Then show each specific validation issue as separate toasts
                        validation.issues.forEach((issue, index) => {
                            setTimeout(() => {
                                window.app.showWarning(issue);
                            }, (index + 1) * 400); // Stagger the messages
                        });
                    } else {
                        // Fallback to combined message if issues array not available
                        window.app.showWarning(`Cannot export glycan: ${validation.error}`);
                    }
                }
                // Restore button but don't export
                exportButton.innerHTML = originalButtonHTML;
                exportButton.disabled = false;
                return; // Exit early without exporting
            }
        }

        // Set the GlycoCT in the target textarea
        targetTextarea.value = glycoCT;

        // Trigger the input event to process the GlycoCT
        const inputEvent = new Event('input', { bubbles: true });
        targetTextarea.dispatchEvent(inputEvent);

        // Show success message
        if (window.app && window.app.showSuccess) {
            window.app.showSuccess('Glycan structure auto-exported successfully! 🎉');
        }

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('sugarDrawerPopupModal'));
        if (modal) {
            modal.hide();
        }

        // Clean up
        currentTargetTextareaId = null;
        popupSugarDrawerInstance = null;

        // Restore button
        exportButton.innerHTML = originalButtonHTML;
        exportButton.disabled = false;
    }

    function exportFallback() {

        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(clipboardText => {
                if (clipboardText && clipboardText.trim() && clipboardText.includes('RES')) {
                    exportSuccess(clipboardText.trim());
                } else {
                    showFallbackInstructions();
                }
            }).catch(() => {
                showFallbackInstructions();
            });
        } else {
            showFallbackInstructions();
        }
    }

    function showFallbackInstructions() {
        // Restore button
        exportButton.innerHTML = originalButtonHTML;
        exportButton.disabled = false;

        if (window.app && window.app.showInfo) {
            window.app.showInfo('Auto-export didn\'t detect a structure. Please make sure you have drawn a glycan structure, then try: 1) Click "Copy GlycoCT" in SugarDrawer, 2) Click "Auto-Export" again.');
        }
    }
}

/**
 * Handle one-click export from SugarDrawer popup
 */
async function handleOneClickExport(data) {

    if (!data.glycoct) {
        if (window.app && window.app.showError) {
            window.app.showError('No GlycoCT data received from SugarDrawer');
        }
        return;
    }

    if (!currentTargetTextareaId) {
        if (window.app && window.app.showError) {
            window.app.showError('No target field specified for export');
        }
        return;
    }

    const targetTextarea = document.getElementById(currentTargetTextareaId);

    if (!targetTextarea) {
        if (window.app && window.app.showError) {
            window.app.showError('Target field not found');
        }
        return;
    }


    // Validate the GlycoCT structure before export
    const glycoCT = data.glycoct.trim();
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoCT);
        if (!validation.valid) {
            // Show validation error messages instead of success
            if (window.app && window.app.showWarning) {
                if (validation.issues && validation.issues.length > 0) {
                    // Show main error first
                    window.app.showWarning(`Cannot export glycan:`);
                    // Then show each specific validation issue as separate toasts
                    validation.issues.forEach((issue, index) => {
                        setTimeout(() => {
                            window.app.showWarning(issue);
                        }, (index + 1) * 400); // Stagger the messages
                    });
                } else {
                    // Fallback to combined message if issues array not available
                    window.app.showWarning(`Cannot export glycan: ${validation.error}`);
                }
            }
            return; // Exit early without exporting
        }
    }

    // Validate CCD codes exist before export
    if (typeof convertGlycoCTToEnhancedLigand === 'function') {
        try {
            await convertGlycoCTToEnhancedLigand(glycoCT, 'TEST');
        } catch (error) {
            // CCD mapping failed - don't export
            if (window.app && window.app.showWarning) {
                window.app.showWarning(`Cannot export glycan: ${error.message}`);
            }
            return; // Exit early without exporting
        }
    }

    // Simple direct approach - just set the value and close modal
    targetTextarea.value = glycoCT;

    // Trigger input event for any listeners
    const inputEvent = new Event('input', { bubbles: true });
    targetTextarea.dispatchEvent(inputEvent);

    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess('Glycan structure exported successfully');
    }

    // Send message to SugarDrawer to clear canvas after successful export
    const sugarDrawerFrame = document.getElementById('sugarDrawerPopupFrame');
    if (sugarDrawerFrame && sugarDrawerFrame.contentWindow) {
        sugarDrawerFrame.contentWindow.postMessage({ type: 'SUGARDRAWER_CLEAR_CANVAS' }, '*');
    }

    // Close modal directly like the working case
    const modalElement = document.getElementById('sugarDrawerPopupModal');

    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    } else {
        if (modalElement) {
            const newModal = new bootstrap.Modal(modalElement);
            newModal.hide();
        } else {
        }
    }

    // Clean up
    currentTargetTextareaId = null;

}

/**
 * Close the SugarDrawer popup modal
 */
function closePopupModal() {
    try {
        const modal = bootstrap.Modal.getInstance(document.getElementById('sugarDrawerPopupModal'));
        if (modal) {
            modal.hide();
        } else {
            // Fallback - try creating new instance and hiding
            const modalElement = document.getElementById('sugarDrawerPopupModal');
            if (modalElement) {
                const newModal = new bootstrap.Modal(modalElement);
                newModal.hide();
            }
        }

        // Clean up
        currentTargetTextareaId = null;
        popupSugarDrawerInstance = null;

        // No need for popup close message

    } catch (error) {
    }
}

// Badge update functions
function updatePTMBadge(sequenceId, count) {
    const badge = document.getElementById(`${sequenceId}_ptmBadge`);
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateMSABadge(sequenceId, hasData) {
    const badge = document.getElementById(`${sequenceId}_msaBadge`);
    if (badge) {
        if (hasData) {
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateTemplatesBadge(sequenceId, count) {
    const badge = document.getElementById(`${sequenceId}_templatesBadge`);
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

/**
 * Validate GlycoCT structure for undefined linkages and anomers
 */
function validateGlycoCTStructure(glycoct) {
    if (!glycoct || typeof glycoct !== 'string') {
        return { valid: false, error: 'Invalid GlycoCT data' };
    }

    const lines = glycoct.split('\n').map(line => line.trim()).filter(line => line);
    let currentSection = null;
    const issues = [];

    for (const line of lines) {
        if (line === 'RES') {
            currentSection = 'RES';
            continue;
        } else if (line === 'LIN') {
            currentSection = 'LIN';
            continue;
        }

        if (currentSection === 'RES') {
            // Check for undefined anomeric configuration (x instead of a or b)
            if (line.match(/^[0-9]+[a-z]*:x-/)) {
                issues.push('Undefined anomeric configuration detected. Please specify alpha (a) or beta (b) configuration.');
            }

            // Check for very short or incomplete residue definitions
            // Allow for complex modifications and substituent lines
            if (line.length > 0 && line.match(/^[0-9]+[a-z]*:/)) {
                // This is a residue or substituent line, check if it's properly formed
                // Substituent lines: like "13s:n-acetyl"
                if (line.match(/^[0-9]+s:/)) {
                    // This is a substituent line, it's valid if it has content after the colon
                    if (!line.match(/^[0-9]+s:.+/)) {
                        issues.push(`Incomplete substituent definition found.`);
                    }
                } else {
                    // This is a monosaccharide line, check for basic structure
                    // Allow for complex modifications like |6:d or |1:a|2:keto|3:d
                    // Allow hyphenated sugar names like dgro-dgal
                    // DEACTIVATED: May reactivate in future if needed
                    /*
                    if (!line.match(/^[0-9]+[a-z]*:[ab]-[dl]?[a-z-]+-[A-Z]+-[0-9]+:[0-9]+/)) {
                        issues.push(`Incomplete residue definition found. Please ensure all monosaccharides have proper configuration.`);
                    } else {
                    }
                    */
                }
            }
        } else if (currentSection === 'LIN') {
            // Check for undefined linkage positions (0, negative numbers, or invalid positions)
            // More explicit patterns to catch: (-1+1), (4+-1), (0+1), (1+0)
            if (line.match(/\(0\+/) || line.match(/\+0\)/) || line.match(/\(-\d/) || line.match(/\+-\d/)) {
                issues.push('Please specify valid linkage positions');
            }

            // Additional validation: Check that all linkage positions are positive integers
            if (line.match(/^[0-9]+:/)) {
                const linkageMatch = line.match(/^[0-9]+:[0-9]+[don]\((\d+|\-\d+)\+(\d+|\-\d+)\)[0-9]+[don]/);
                if (linkageMatch) {
                    const pos1 = parseInt(linkageMatch[1]);
                    const pos2 = parseInt(linkageMatch[2]);

                    // DEACTIVATED: May reactivate in future if needed
                    /*
                    if (pos1 <= 0 || pos2 <= 0) {
                        issues.push(`Invalid linkage positions found: ${pos1} and ${pos2}. Linkage positions must be positive integers (1, 2, 3, 4, 6, etc.).`);
                    }
                    */
                } else if (!line.match(/^[0-9]+:[0-9]+[don]\([0-9]+\+[0-9]+\)[0-9]+[don]/)) {
                    issues.push(`Invalid linkage format found. Please check the linkage definition format.`);
                }
            }
        }
    }

    // Check if structure has RES section (LIN is now optional)
    const hasRES = lines.some(line => line === 'RES');
    const hasLIN = lines.some(line => line === 'LIN');
    const resCount = lines.filter(line => line.match(/^[0-9]+[a-z]*:/)).length;

    if (!hasRES) {
        issues.push('Missing RES section. Please draw monosaccharides on the canvas.');
    }

    // Only check for linkages if there are multiple residues
    if (resCount > 1) {
        if (!hasLIN) {
            issues.push('Multi-residue structure missing LIN section. Please define linkages between monosaccharides.');
        } else {
            // Check if we have enough linkages for multi-residue structure
            const linCount = lines.filter(line => line.match(/^[0-9]+:[0-9]+[don]\([0-9+\-]+\)[0-9]+[don]/)).length;
            if (linCount === 0) {
                issues.push('Multi-residue structure missing linkages. Please define linkages between monosaccharides.');
            }
        }

        // Enhanced linkage validation for dangling residues
        if (hasLIN) {
            const linkageValidation = validateGlycoCTLinkages(lines);
            if (!linkageValidation.valid) {
                issues.push(linkageValidation.error);
            }
        }
    }
    // Single monosaccharide is valid even without LIN section

    if (issues.length > 0) {
        return {
            valid: false,
            error: issues.join(' '), // Keep for backward compatibility
            issues: issues // New field for individual errors
        };
    }

    return { valid: true };
}

/**
 * Validate GlycoCT linkage completeness - check for dangling residues
 */
function validateGlycoCTLinkages(lines) {
    const residues = new Map();
    const substituents = new Set();
    const linkages = [];

    let currentSection = null;

    // Parse RES section to get all residue numbers
    for (const line of lines) {
        if (line === 'RES') {
            currentSection = 'RES';
            continue;
        } else if (line === 'LIN') {
            currentSection = 'LIN';
            continue;
        }

        if (currentSection === 'RES') {
            const resMatch = line.match(/^([0-9]+)([a-z]*):/);
            if (resMatch) {
                const resNum = parseInt(resMatch[1]);
                const resType = resMatch[2];

                if (resType === 's') {
                    // Substituent
                    substituents.add(resNum);
                } else {
                    // Base residue (monosaccharide)
                    residues.set(resNum, {
                        id: resNum,
                        type: 'monosaccharide',
                        connected: false,
                        isRoot: false
                    });
                }
            }
        } else if (currentSection === 'LIN') {
            // Parse linkage: format like "1:1o(4+1)2d" or "9:1d(2+1)10n"
            const linkMatch = line.match(/^([0-9]+):([0-9]+)([don])\(([0-9]+)\+([0-9]+)\)([0-9]+)([don])/);
            if (linkMatch) {
                const linkId = parseInt(linkMatch[1]);
                const donorRes = parseInt(linkMatch[2]);
                const donorType = linkMatch[3];
                const donorPos = parseInt(linkMatch[4]);
                const acceptorPos = parseInt(linkMatch[5]);
                const acceptorRes = parseInt(linkMatch[6]);
                const acceptorType = linkMatch[7];

                linkages.push({
                    id: linkId,
                    donor: donorRes,
                    acceptor: acceptorRes,
                    donorType: donorType,
                    acceptorType: acceptorType
                });
            }
        }
    }

    // Mark connected residues and find root
    const connectedResidues = new Set();
    const acceptorResidues = new Set();

    for (const linkage of linkages) {
        // Skip substituent linkages (they connect to 'n' type which are substituents)
        if (linkage.acceptorType === 'n') {
            // This is a linkage to a substituent, mark both as connected
            connectedResidues.add(linkage.donor);
            continue;
        }

        // This is a glycosidic linkage between monosaccharides
        connectedResidues.add(linkage.donor);
        connectedResidues.add(linkage.acceptor);
        acceptorResidues.add(linkage.acceptor);
    }

    // Find the root residue (appears as donor but never as acceptor in glycosidic bonds)
    const rootCandidates = [];
    for (const resId of connectedResidues) {
        if (residues.has(resId) && !acceptorResidues.has(resId)) {
            rootCandidates.push(resId);
        }
    }

    // Enhanced validation: Check for residues that appear in RES but have NO linkage information at all
    const unlinkedResidues = [];
    const linkedResidueIds = new Set();

    // Collect all residue IDs that appear in LIN section (either as donor or acceptor)
    for (const linkage of linkages) {
        linkedResidueIds.add(linkage.donor);
        linkedResidueIds.add(linkage.acceptor);
    }

    // Find monosaccharides that don't appear in any linkage at all
    for (const [resId, residue] of residues) {
        if (!linkedResidueIds.has(resId)) {
            unlinkedResidues.push(resId);
        }
    }

    // Priority validation: Check for completely unlinked residues first
    // DEACTIVATED: May reactivate in future if needed
    /*
    if (unlinkedResidues.length > 0) {
        const residueList = unlinkedResidues.join(', ');
        return {
            valid: false,
            error: `Missing linkage information: Monosaccharide residue(s) ${residueList} appear in the RES section but have no linkage defined in the LIN section. Please define how these residues connect to the structure or remove them.`
        };
    }
    */

    // Check for dangling residues (monosaccharides not involved in any glycosidic linkages)
    const danglingResidues = [];
    for (const [resId, residue] of residues) {
        if (!connectedResidues.has(resId)) {
            danglingResidues.push(resId);
        }
    }

    // Secondary validation: Check for dangling residues (connected as donor/acceptor but forming incomplete branches)
    // DEACTIVATED: May reactivate in future if needed
    /*
    if (danglingResidues.length > 0) {
        const residueList = danglingResidues.join(', ');
        return {
            valid: false,
            error: `Incomplete glycan structure: Residue(s) ${residueList} are not properly connected to the main structure. Please define complete linkages for all monosaccharides or remove unconnected residues.`
        };
    }
    */

    // Check for multiple roots (disconnected components)
    // DEACTIVATED: May reactivate in future if needed
    /*
    if (rootCandidates.length > 1) {
        return {
            valid: false,
            error: `Disconnected glycan structure detected: Multiple root residues found (${rootCandidates.join(', ')}). Please ensure all monosaccharides are connected in a single tree structure.`
        };
    }
    */

    // Check if we have a valid tree structure for multi-residue glycans
    const monosaccharideCount = residues.size;
    const glycosidicLinkages = linkages.filter(l => l.acceptorType === 'd' || l.acceptorType === 'o').length;

    if (monosaccharideCount > 1) {
        // For a tree structure, we should have exactly (n-1) glycosidic linkages for n monosaccharides
        // DEACTIVATED: May reactivate in future if needed
        /*
        if (glycosidicLinkages !== monosaccharideCount - 1) {
            return {
                valid: false,
                error: `Invalid glycan topology: Found ${monosaccharideCount} monosaccharides but ${glycosidicLinkages} glycosidic linkages. A valid glycan tree should have exactly ${monosaccharideCount - 1} glycosidic linkages.`
            };
        }
        */

        // Must have exactly one root
        if (rootCandidates.length === 0) {
            return {
                valid: false,
                error: `Invalid glycan structure: No root residue found. The structure appears to form a cycle, which is not supported.`
            };
        }
    }

    return { valid: true };
}

// Troubleshooting function for UniProt description issue
window.debugUniProtDescription = function(sequenceId, uniprotId) {

    if (!sequenceId) {
        // Try to find sequence IDs automatically
        const allSequences = document.querySelectorAll('[id^="sequence_"]');
        allSequences.forEach(seq => {
            const id = seq.id.replace('sequence_', '');
        });
        return;
    }


    // Check if description textarea exists
    const descriptionId = `${sequenceId}_description`;
    const descriptionTextarea = document.getElementById(descriptionId);

    if (descriptionTextarea) {

        if (uniprotId) {
            const testValue = `Test UniProt ID: ${uniprotId}`;
            descriptionTextarea.value = testValue;

            // Test event dispatching
            descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            descriptionTextarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
    } else {

        // Look for similar elements
        const similarElements = document.querySelectorAll(`[id*="${sequenceId}"]`);
        similarElements.forEach(el => {
        });

        const allDescriptions = document.querySelectorAll('[id*="description"]');
        allDescriptions.forEach(el => {
        });
    }

    // Check UniProt input field
    const uniprotInputId = `${sequenceId}_uniprotId`;
    const uniprotInput = document.getElementById(uniprotInputId);
    if (uniprotInput) {
    }

    // Check sequence textarea
    const sequenceTextareaId = `${sequenceId}_sequence`;
    const sequenceTextarea = document.getElementById(sequenceTextareaId);
    if (sequenceTextarea) {
    }

};

/**
 * Display GlycoCT validation errors inline below the textarea
 * @param {string} textareaId - The ID of the textarea element
 * @param {object} validation - Validation result from validateGlycoCTStructure
 */
function displayGlycoCTValidationErrors(textareaId, validation) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    // Find the container to insert errors
    // For manual glycosylation sites: textarea -> flex-grow-1 -> d-flex -> col-md-3
    // We want to insert in the col-md-3
    let insertContainer = textarea.parentElement;
    let searchContainer = insertContainer;

    // Check if we're in a nested structure (manual glycosylation sites)
    if (insertContainer.classList.contains('flex-grow-1')) {
        // Go up to d-flex container, then to col-md-3
        insertContainer = insertContainer.parentElement.parentElement;
        searchContainer = insertContainer;
    }

    // Remove any existing error div from the search container
    const existingError = searchContainer.querySelector('.glycoct-validation-error');
    if (existingError) {
        existingError.remove();
    }

    // If validation passed, nothing to display
    if (!validation || validation.valid) {
        return;
    }

    // Create error message div
    const errorDiv = document.createElement('div');
    errorDiv.className = 'glycoct-validation-error alert alert-danger mt-2 mb-0 py-2 px-3';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.width = '100%';

    // Add title
    const title = document.createElement('strong');
    title.textContent = 'GlycoCT Validation Errors:';
    errorDiv.appendChild(title);

    // Add error list
    const errorList = document.createElement('ul');
    errorList.className = 'mb-0 mt-1 ps-3';

    if (validation.issues && validation.issues.length > 0) {
        validation.issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue;
            errorList.appendChild(li);
        });
    } else if (validation.error) {
        const li = document.createElement('li');
        li.textContent = validation.error;
        errorList.appendChild(li);
    }

    errorDiv.appendChild(errorList);

    // Insert error div at the end of the container
    insertContainer.appendChild(errorDiv);
}

// Make functions globally accessible
window.addSequence = addSequence;
window.fetchUniProtSequence = fetchUniProtSequence;
window.openSugarDrawerPopup = openSugarDrawerPopup;
window.exportGlycoCTFromPopup = exportGlycoCTFromPopup;
window.handleOneClickExport = handleOneClickExport;
window.closePopupModal = closePopupModal;
