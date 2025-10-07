// Main application controller
class AlphaFold3Generator {
    constructor() {
        this.sequences = [];
        this.bondedAtomPairs = [];
        this.glycanData = null;
        this.glycanUserCCDs = {};
        this.sequenceCounter = 0;
        this.bondCounter = 0;
        
        this.init();
    }

    init() {
        // Initialize the application
        this.setupEventListeners();
        this.loadSugarDrawer();
        
        // Generate initial JSON
        setTimeout(() => {
            this.generateJSON();
        }, 100);
    }

    setupEventListeners() {
        // Auto-generate JSON when inputs change (using event delegation)
        document.body.addEventListener('input', (event) => {
            // Check if the changed element is an input we care about
            if (event.target.matches('input, select, textarea')) {
                this.debounceGenerate();
            }
        });
        
        // Also listen for change events
        document.body.addEventListener('change', (event) => {
            if (event.target.matches('input, select, textarea')) {
                this.debounceGenerate();
            }
        });
    }

    debounceGenerate() {
        clearTimeout(this.generateTimeout);
        this.generateTimeout = setTimeout(() => {
            this.generateJSON();
        }, 500);
    }

    loadSugarDrawer() {
        // SugarDrawer now only available via popup modal
        // No embedded container initialization needed
    }

    async generateJSON() {
        try {
            // Call the enhanced JSON generator from json-generator.js (not the old app.js version)
            const jsonData = await this.buildAlphaFold3JSON();
            
            // Custom formatting to keep PTM modifications on single lines
            let jsonString = JSON.stringify(jsonData, null, 2);

            // Replace multi-line PTM formatting with single-line formatting
            jsonString = jsonString.replace(
                /{\s+"ptmType":\s+"([^"]+)",\s+"ptmPosition":\s+(\d+)\s+}/gs,
                '{"ptmType": "$1", "ptmPosition": $2}'
            );

            // Replace multi-line array formatting for indices with single-line formatting
            jsonString = jsonString.replace(
                /"queryIndices":\s*\[\s*([^\]]+?)\s*\]/gs,
                (match, content) => {
                    const cleanContent = content.replace(/\s+/g, ' ').trim();
                    return `"queryIndices": [${cleanContent}]`;
                }
            );
            jsonString = jsonString.replace(
                /"templateIndices":\s*\[\s*([^\]]+?)\s*\]/gs,
                (match, content) => {
                    const cleanContent = content.replace(/\s+/g, ' ').trim();
                    return `"templateIndices": [${cleanContent}]`;
                }
            );

            // Replace multi-line modelSeeds formatting with single-line formatting
            jsonString = jsonString.replace(
                /"modelSeeds":\s*\[\s*([^\]]+?)\s*\]/gs,
                (match, content) => {
                    const cleanContent = content.replace(/\s+/g, ' ').trim();
                    return `"modelSeeds": [${cleanContent}]`;
                }
            );

            // Replace multi-line ccdCodes formatting with single-line formatting
            jsonString = jsonString.replace(
                /"ccdCodes":\s*\[\s*([^\]]+?)\s*\]/gs,
                (match, content) => {
                    const cleanContent = content.replace(/\s+/g, ' ').trim();
                    return `"ccdCodes": [${cleanContent}]`;
                }
            );

            // Replace multi-line id arrays formatting with single-line formatting
            jsonString = jsonString.replace(
                /"id":\s*\[\s*([^\]]+?)\s*\]/gs,
                (match, content) => {
                    const cleanContent = content.replace(/\s+/g, ' ').trim();
                    return `"id": [${cleanContent}]`;
                }
            );

            // Replace multi-line bondedAtomPairs formatting with single-line formatting
            // Use bracket counting to properly match the complete bondedAtomPairs array
            function findBondedAtomPairs(str) {
                const startPattern = /"bondedAtomPairs":\s*\[/;
                const match = str.match(startPattern);
                if (!match) return null;

                const startIndex = match.index + match[0].length - 1; // Position of opening bracket
                let bracketCount = 0;
                let endIndex = startIndex;

                for (let i = startIndex; i < str.length; i++) {
                    if (str[i] === '[') {
                        bracketCount++;
                    } else if (str[i] === ']') {
                        bracketCount--;
                        if (bracketCount === 0) {
                            endIndex = i;
                            break;
                        }
                    }
                }

                if (bracketCount === 0) {
                    const fullMatch = str.substring(match.index, endIndex + 1);
                    const arrayContent = str.substring(startIndex, endIndex + 1);
                    return { fullMatch, arrayContent, startIndex: match.index, endIndex: endIndex + 1 };
                }
                return null;
            }

            const bondedAtomPairsMatch = findBondedAtomPairs(jsonString);
            if (bondedAtomPairsMatch) {

                try {
                    // Parse the array content directly
                    const bondArray = JSON.parse(bondedAtomPairsMatch.arrayContent);

                    // Format each bond pair as a compact single line
                    const formattedPairs = bondArray.map((bond, index) => {
                        if (Array.isArray(bond) && bond.length === 2) {
                            // Each bond should be [["EntityID", ResidueID, "AtomName"], ["EntityID", ResidueID, "AtomName"]]
                            const formattedBond = JSON.stringify(bond).replace(/\s+/g, '');
                            return formattedBond;
                        } else {
                            return JSON.stringify(bond);
                        }
                    });

                    const replacement = `"bondedAtomPairs": [\n  ${formattedPairs.join(',\n  ')}\n]`;

                    // Replace the original bondedAtomPairs section with the formatted version
                    jsonString = jsonString.substring(0, bondedAtomPairsMatch.startIndex) +
                                replacement +
                                jsonString.substring(bondedAtomPairsMatch.endIndex);
                } catch (parseError) {

                    // Fallback: Use regex to extract individual bond pairs
                    const atomArrayRegex = /\[\s*"[^"]*",\s*\d+,\s*"[^"]*"\s*\]/gs;
                    const atomArrays = bondedAtomPairsMatch.arrayContent.match(atomArrayRegex);

                    if (atomArrays && atomArrays.length > 0 && atomArrays.length % 2 === 0) {
                        const pairs = [];
                        for (let i = 0; i < atomArrays.length; i += 2) {
                            const atom1 = atomArrays[i].replace(/\s+/g, '');
                            const atom2 = atomArrays[i + 1].replace(/\s+/g, '');
                            pairs.push(`[${atom1},${atom2}]`);
                        }
                        const replacement = `"bondedAtomPairs": [\n  ${pairs.join(',\n  ')}\n]`;

                        // Replace the original bondedAtomPairs section with the formatted version
                        jsonString = jsonString.substring(0, bondedAtomPairsMatch.startIndex) +
                                    replacement +
                                    jsonString.substring(bondedAtomPairsMatch.endIndex);
                    } else {
                    }
                }
            }

            const outputElement = document.getElementById('jsonOutput');

            if (outputElement) {
                outputElement.textContent = jsonString;
            }

        } catch (error) {
            this.showError('JSON Generation Error: ' + error.message);
        }
    }

    // buildAlphaFold3JSON is now implemented in json-generator.js as a prototype method

    copyJSON() {
        const jsonText = document.getElementById('jsonOutput').textContent;
        if (jsonText && jsonText !== 'Click "Generate" to create AlphaFold3 JSON') {
            navigator.clipboard.writeText(jsonText).then(() => {
                this.showSuccess('JSON copied to clipboard!');
            }).catch(() => {
                this.showError('Failed to copy JSON');
            });
        }
    }

    downloadJSON() {
        const jsonText = document.getElementById('jsonOutput').textContent;
        if (jsonText && jsonText !== 'Click "Generate" to create AlphaFold3 JSON') {
            const jobName = document.getElementById('jobName').value || 'alphafold3_input';
            const filename = `${jobName.replace(/[^a-z0-9]/gi, '_')}.json`;
            
            const blob = new Blob([jsonText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess(`JSON downloaded as ${filename}`);
        }
    }

    showSuccess(message) {
        this.showToast(message, 'success');
        this.addToDebugLog('SUCCESS', message);
    }

    showError(message) {
        this.showToast(message, 'danger');
        this.addToDebugLog('ERROR', message);
    }

    showWarning(message) {
        this.showToast(message, 'warning');
        this.addToDebugLog('WARNING', message);
    }

    showInfo(message) {
        this.showToast(message, 'info');
        this.addToDebugLog('INFO', message);
    }

    addToDebugLog(level, message) {
        const debugLog = document.getElementById('debugLog');
        if (!debugLog) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `debug-entry ${level.toLowerCase()}`;
        
        let icon, color;
        switch(level) {
            case 'ERROR':
                icon = '❌';
                color = '#dc3545';
                break;
            case 'WARNING':
                icon = '⚠️';
                color = '#ffc107';
                break;
            case 'SUCCESS':
                icon = '✅';
                color = '#28a745';
                break;
            default:
                icon = 'ℹ️';
                color = '#17a2b8';
        }
        
        logEntry.innerHTML = `
            <span style="color: ${color}; font-weight: bold;">[${timestamp}] ${icon} ${level}:</span>
            <span style="margin-left: 8px;">${message}</span>
        `;
        
        // Clear placeholder text if this is the first real entry
        if (debugLog.children.length === 1 && debugLog.children[0].classList.contains('text-muted')) {
            debugLog.innerHTML = '';
        }
        
        debugLog.appendChild(logEntry);
        debugLog.scrollTop = debugLog.scrollHeight; // Auto-scroll to bottom
    }

    showToast(message, type) {
        // Create or get the toast container
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed';
            toastContainer.style.cssText = 'bottom: 20px; right: 20px; z-index: 1060; display: flex; flex-direction: column-reverse; gap: 10px; max-width: 350px;';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show`;
        toast.style.cssText = 'margin: 0; min-width: 300px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: none; animation: slideInRight 0.3s ease-out;';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="me-2">
                    ${this.getToastIcon(type)}
                </div>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // Add to container
        toastContainer.appendChild(toast);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);

        // Handle manual dismiss
        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }

    getToastIcon(type) {
        switch(type) {
            case 'success':
                return '<i class="fas fa-check-circle text-success"></i>';
            case 'danger':
                return '<i class="fas fa-exclamation-circle text-danger"></i>';
            case 'warning':
                return '<i class="fas fa-exclamation-triangle text-warning"></i>';
            case 'info':
                return '<i class="fas fa-info-circle text-info"></i>';
            default:
                return '<i class="fas fa-bell"></i>';
        }
    }

}

// Global functions for HTML onclick handlers
function generateJSON() {
    app.generateJSON();
}

function copyJSON() {
    app.copyJSON();
}

function downloadJSON() {
    app.downloadJSON();
}


function clearGlycan() {
    document.getElementById('glycoCTOutput').value = '';
    app.glycanData = null;
    app.showSuccess('Glycan data cleared');
}

function exportGlycoCT() {
    // Placeholder for actual GlycoCT export
    const sampleGlycoCT = `RES
1b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
2s:n-acetyl
3b:b-dglc-HEX-1:5
4s:n-acetyl
LIN
1:1d(2+1)2n
2:1o(4+1)3d
3:3d(2+1)4n`;
    
    document.getElementById('glycoCTOutput').value = sampleGlycoCT;
    app.showSuccess('Sample GlycoCT exported (placeholder)');
}

function addGlycanToJSON() {
    // This function is now handled by SugarDrawer integration
    // Fallback for simple glycan builder only
    let glycoCT = document.getElementById('glycoCTOutput')?.value || 
                  document.getElementById('currentGlycoCT')?.value;
    
    if (!glycoCT) {
        app.showError('No GlycoCT data to add. Please use SugarDrawer to create glycan structures.');
        return;
    }

    // Validate GlycoCT structure before processing
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoCT);
        if (!validation.valid) {
            app.showError(`Invalid GlycoCT structure: ${validation.error}`);
            return;
        }
    }

    // Convert GlycoCT to ligand entry using enhanced parser
    try {
        const enhancedResult = convertGlycoCTToEnhancedLigand(glycoCT, "G");
        
        const sequenceEntry = {
            id: `glycan_${Date.now()}`,
            type: 'ligand',
            data: enhancedResult.ligand,
            bondedAtomPairs: enhancedResult.bondedAtomPairs
        };
        
        app.sequences.push(sequenceEntry);
        app.showSuccess('Glycan added to sequences');
        app.generateJSON();
        
    } catch (error) {
        app.showError('Error converting glycan structure: ' + error.message);
    }
    
}

function simulateGlycanDraw() {
    // Simulate drawing a glycan structure
    const sampleGlycoCT = `RES
1b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
2s:n-acetyl
3b:b-dglc-HEX-1:5
4s:n-acetyl
LIN
1:1d(2+1)2n
2:1o(4+1)3d
3:3d(2+1)4n`;
    
    document.getElementById('glycoCTOutput').value = sampleGlycoCT;
    app.showSuccess('Simulated glycan structure drawn');
}

/**
 * Update the page title with the job name
 * @param {string} jobName - The job name to append to title
 */
function updatePageTitle(jobName) {
    const baseTitle = 'JAAG';
    if (jobName && jobName.trim() !== '') {
        document.title = `${baseTitle} - ${jobName}`;
    } else {
        document.title = baseTitle;
    }
}

/**
 * Validate job name input - only allow letters, numbers, hyphens, and underscores
 * @param {HTMLInputElement} input - The job name input element
 */
function validateJobName(input) {
    // Remove any invalid characters and update the input value
    const validValue = input.value.replace(/[^a-zA-Z0-9_-]/g, '');

    // If the value changed, update the input and show feedback
    if (input.value !== validValue) {
        input.value = validValue;

        // Add visual feedback
        input.classList.add('border-warning');
        setTimeout(() => {
            input.classList.remove('border-warning');
        }, 1000);

        // Show user notification if app is available
        if (window.app && window.app.showInfo) {
            window.app.showInfo('Invalid characters removed from job name. Only letters, numbers, hyphens, and underscores are allowed.');
        }
    }

    // Update page title with the job name
    updatePageTitle(validValue);

    // Additional validation for JSON generation
    if (validValue.length === 0) {
        input.classList.add('border-danger');
    } else {
        input.classList.remove('border-danger');
    }
}


/**
 * Generate multiple random seeds based on user input
 */
function generateMultipleSeeds() {
    const seedCountInput = document.getElementById('seedCount');
    const seedTypeSelect = document.getElementById('seedType');
    const multipleSeedsInput = document.getElementById('modelSeedsMultiple');

    let count = parseInt(seedCountInput.value);

    // Validate and auto-correct input
    if (!count || count < 1) {
        seedCountInput.value = 1;
        count = 1;
    } else if (count > 99999) {
        seedCountInput.value = 99999;
        count = 99999;
    }

    const seedType = seedTypeSelect.value;
    const seeds = [];

    if (seedType === 'consecutive') {
        // Generate consecutive seeds starting from 1
        for (let i = 1; i <= count; i++) {
            seeds.push(i);
        }
    } else {
        // Generate unique random seeds
        const min = 1;
        const max = 4294967295;

        while (seeds.length < count) {
            const randomSeed = Math.floor(Math.random() * (max - min + 1)) + min;
            // Ensure uniqueness
            if (!seeds.includes(randomSeed)) {
                seeds.push(randomSeed);
            }
        }
    }

    // Set the generated seeds in the input field with clean formatting
    multipleSeedsInput.value = seeds.join(', ');

    // Trigger JSON update
    if (window.app) {
        window.app.debounceGenerate();
    }
}

/**
 * Validate and auto-correct seed count input
 */
function validateSeedCountInput(input) {
    let value = parseInt(input.value);

    // Auto-correct values outside the valid range
    if (value < 1) {
        input.value = 1;
    } else if (value > 99999) {
        input.value = 99999;
    }
}

/**
 * Validate multiple seeds input
 */
function validateMultipleSeedsInput(input) {
    // Light validation during typing - just trigger JSON update
    if (window.app) {
        window.app.debounceGenerate();
    }
}

function cleanupMultipleSeedsInput(input) {
    let value = input.value.trim();

    if (!value) {
        return;
    }

    // Split by comma and validate each seed
    const seeds = value.split(',');
    const validSeeds = [];
    const min = 1;
    const max = 4294967295;

    for (let seed of seeds) {
        seed = seed.trim();

        // Skip empty values
        if (seed === '') continue;

        // Remove non-numeric characters
        seed = seed.replace(/[^0-9]/g, '');

        const numValue = parseInt(seed);

        if (numValue && numValue >= min && numValue <= max) {
            validSeeds.push(numValue);
        }
    }

    // Clean up and format the input with proper spacing
    if (validSeeds.length > 0) {
        input.value = validSeeds.join(', ');
    } else if (value && validSeeds.length === 0) {
        // If user entered something but all invalid, clear the field
        input.value = '';
    }

    // Trigger JSON update after cleanup
    if (window.app) {
        window.app.debounceGenerate();
    }
}


// Test function for toast stacking (can be removed in production)
function testToastStacking() {
    if (window.app) {
        window.app.showSuccess('Success message - this is a success notification!');
        setTimeout(() => window.app.showWarning('Warning message - this is a warning!'), 500);
        setTimeout(() => window.app.showError('Error message - this is an error!'), 1000);
        setTimeout(() => window.app.showInfo('Info message - this is just information.'), 1500);
        setTimeout(() => window.app.showSuccess('Another success - toasts should stack nicely!'), 2000);
    }
}

// Debug function to test regex patterns
function debugRegexPatterns() {
    const testLine = '6:4o(-1+1)7d';
    const regex1 = /[do]\(0\+[0-9]+\)|[do]\([0-9]+\+0\)|[do]\(-[0-9]+\+[0-9]+\)|[do]\([0-9]+\+-[0-9]+\)/;
    const regex2 = /^[0-9]+:[0-9]+[don]\([1-9][0-9]*\+[1-9][0-9]*\)[0-9]+[don]/;

    if (window.app) {
        window.app.showInfo(`Testing line: "${testLine}"`);
        window.app.showInfo(`Regex1 (negative detection): ${regex1.test(testLine)}`);
        window.app.showInfo(`Regex2 (positive validation): ${regex2.test(testLine)}`);
    }

}

// Test function for GlycoCT validation (can be removed in production)
function testGlycoCTValidation() {
    const problematicGlycoCT = `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:b-dglc-HEX-1:5
7b:b-dgal-HEX-1:5
8b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
9b:a-dman-HEX-1:5
10b:b-dglc-HEX-1:5
11b:b-dgal-HEX-1:5
12b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
13s:n-acetyl
14s:n-acetyl
15s:n-acetyl
16s:n-acetyl
17s:n-acetyl
18s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:6o(4+1)7d
7:7o(6+2)8d
8:4o(3+1)9d
9:9o(2+1)10d
10:10o(-1+1)11d
11:11o(6+2)12d
12:1d(2+1)13n
13:3d(2+1)14n
14:6d(2+1)15n
15:8d(5+1)16n
16:10d(2+1)17n
17:12d(5+1)18n`;

    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(problematicGlycoCT);

        if (validation.valid) {
            if (window.app) window.app.showError('❌ BUG: Structure should NOT be valid - it contains (-1) position!');
        } else {
            if (window.app) window.app.showSuccess(`✅ CORRECT: Validation properly rejected: ${validation.error}`);
        }
        // Analysis for debugging:
    } else {
        if (window.app) window.app.showError('Validation function not available');
    }
}

// Make functions globally accessible
window.updatePageTitle = updatePageTitle;
window.validateJobName = validateJobName;
window.generateMultipleSeeds = generateMultipleSeeds;
window.validateSeedCountInput = validateSeedCountInput;
window.validateMultipleSeedsInput = validateMultipleSeedsInput;
window.cleanupMultipleSeedsInput = cleanupMultipleSeedsInput;
window.testToastStacking = testToastStacking;
window.testGlycoCTValidation = testGlycoCTValidation;
window.debugRegexPatterns = debugRegexPatterns;

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AlphaFold3Generator();
    // Make app globally accessible
    window.app = app;

    // Generate and set a random seed as default
    const modelSeedsInput = document.getElementById('modelSeedsMultiple');
    if (modelSeedsInput && !modelSeedsInput.value) {
        const min = 1;
        const max = 4294967295; // Maximum 32-bit unsigned integer
        const randomSeed = Math.floor(Math.random() * (max - min + 1)) + min;
        modelSeedsInput.value = randomSeed;

        // Trigger JSON update to include the default seed
        if (window.app) {
            window.app.debounceGenerate();
        }
    }

    // Add event listener for Advanced Settings collapse toggle
    const advancedFunctionsButton = document.querySelector('[data-bs-target="#advancedFunctionsCollapse"]');
    const advancedFunctionsCollapse = document.getElementById('advancedFunctionsCollapse');

    if (advancedFunctionsButton && advancedFunctionsCollapse) {
        advancedFunctionsCollapse.addEventListener('show.bs.collapse', function() {
            const icon = advancedFunctionsButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-chevron-down me-1';
            }
        });

        advancedFunctionsCollapse.addEventListener('hide.bs.collapse', function() {
            const icon = advancedFunctionsButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-chevron-right me-1';
            }
        });
    }
});

