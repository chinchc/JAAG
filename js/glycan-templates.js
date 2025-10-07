// Glycan Templates Database System

/**
 * Glycan template database - populated from Excel file
 * Structure: { name: "Template Name", glycoct: "GlycoCT structure" }
 */
const GLYCAN_TEMPLATES = [
    // Templates will be loaded from Excel data only
];

/**
 * Glycan Template Manager Class
 */
class GlycanTemplateManager {
    constructor() {
        this.templates = [...GLYCAN_TEMPLATES];
        this.selectedTemplate = null;
    }

    /**
     * Get all available templates
     * @returns {Array} Array of template objects
     */
    getAllTemplates() {
        return this.templates;
    }

    /**
     * Get template by name
     * @param {string} name - Template name
     * @returns {Object|null} Template object or null if not found
     */
    getTemplateByName(name) {
        return this.templates.find(template => template.name === name) || null;
    }

    /**
     * Add new template to database
     * @param {string} name - Template name
     * @param {string} glycoct - GlycoCT structure
     */
    addTemplate(name, glycoct) {
        const newTemplate = { name, glycoct };
        this.templates.push(newTemplate);
        return newTemplate;
    }

    /**
     * Search templates by name (case-insensitive partial match)
     * @param {string} query - Search query
     * @returns {Array} Matching templates
     */
    searchTemplates(query) {
        const lowerQuery = query.toLowerCase();
        return this.templates.filter(template => 
            template.name.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Load templates from Excel data
     * @param {Array} excelData - Array of {name, glycoct} objects
     */
    loadFromExcelData(excelData) {
        this.templates = [...GLYCAN_TEMPLATES]; // Keep built-in templates
        
        excelData.forEach(row => {
            if (row.name && row.glycoct) {
                this.addTemplate(row.name.trim(), row.glycoct.trim());
            }
        });
        
    }

    /**
     * Get template options for dropdown
     * @returns {Array} Array of {value, text} objects for select options
     */
    getTemplateOptions() {
        const options = [
            { value: '', text: 'Select a glycan template...' }
        ];
        
        this.templates.forEach(template => {
            options.push({
                value: template.name,
                text: template.name
            });
        });
        
        return options;
    }
}

/**
 * Create template selector UI
 * @param {string} containerId - ID of container element
 * @param {Function} onTemplateSelect - Callback when template is selected
 */
function createTemplateSelector(containerId, onTemplateSelect) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    const templateManager = window.glycanTemplateManager || new GlycanTemplateManager();
    const options = templateManager.getTemplateOptions();

    // Generate unique IDs for this selector instance
    const selectId = `${containerId}_select`;
    
    const selectorHTML = `
        <div class="row align-items-start mb-3">
            <div class="col-md-5">
                <label for="${selectId}" class="form-label">
                    Glycan Templates
                </label>
                <select class="form-select" id="${selectId}" onchange="applySelectedTemplate('${selectId}')">
                    ${options.map(opt =>
                        `<option value="${opt.value}">${opt.text}</option>`
                    ).join('')}
                </select>
                <small class="text-muted">Select a predefined glycan structure to auto-fill GlycoCT (optional)</small>
            </div>
            <div class="col-md-2 text-center" style="padding-top: 2.2rem;">
                <span class="text-muted">or</span>
            </div>
            <div class="col-md-5">
                <div class="d-flex align-items-center gap-1 mb-1">
                    <label class="form-label mb-0">Apply GlycoCT to all</label>
                    <button type="button" class="btn btn-outline-primary btn-sm"
                            style="padding: 1px 4px; font-size: 10px;"
                            onclick="drawAndApplyToAll('${selectId}')"
                            title="Open SugarDrawer to draw glycan structure">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
                <textarea class="form-control" id="${selectId}_glycoct" rows="2"
                          placeholder="Import GlycoCT from SugarDrawer or paste GlycoCT from database"
                          oninput="applyGlycoCTToAllSequons('${selectId}', this.value)"></textarea>
            </div>
        </div>
    `;

    container.innerHTML = selectorHTML;

    // Setup event listener
    const selectElement = document.getElementById(selectId);
    if (selectElement && onTemplateSelect) {
        selectElement.addEventListener('change', function() {
            if (this.value) {
                const template = templateManager.getTemplateByName(this.value);
                onTemplateSelect(template);
            }
        });
    }

}

/**
 * Apply selected template to GlycoCT input
 * Now supports multiple template selectors on the same page
 */
function applySelectedTemplate(selectorId = 'glycanTemplateSelect') {
    // Find the specific selector (could be in different sequence sections)
    const selectElement = document.getElementById(selectorId) || 
                          document.querySelector(`select[id*="TemplateSelect"]:last-of-type`);
    
    if (!selectElement || !selectElement.value) {
        alert('Please select a template first');
        return;
    }

    const templateManager = window.glycanTemplateManager || new GlycanTemplateManager();
    const template = templateManager.getTemplateByName(selectElement.value);

    if (!template) {
        return;
    }

    // Also populate the "Apply GlycoCT to all" textarea if it exists
    const glycoctTextarea = document.getElementById(`${selectorId}_glycoct`);
    if (glycoctTextarea) {
        glycoctTextarea.value = template.glycoct;
    }

    // Try to find the sequence ID from the selector ID
    let sequenceId = null;
    if (selectorId !== 'glycanTemplateSelect') {
        // Extract sequence ID from selector ID (format: seqID_templateSelector)
        const match = selectorId.match(/^(.+)_templateSelector$/);
        if (match) {
            sequenceId = match[1];
        }
    }
    
    // Find GlycoCT input fields and populate them
    let glycoctInputs = [];
    
    if (sequenceId) {
        // Look for inputs in the SEQUON section only (not glycosylation sites)
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);
        if (sequonContainer) {
            glycoctInputs = Array.from(sequonContainer.querySelectorAll('textarea'))
                .filter(input => input.placeholder && 
                    (input.placeholder.includes('GlycoCT') || 
                     input.placeholder.includes('glycoCT') ||
                     input.id.includes('glycoct')));
        }
    }
    
    // If no specific inputs found, search in sequon containers only (not glycosylation sites)
    if (glycoctInputs.length === 0) {
        const sequonContainers = document.querySelectorAll('[id*="_sequonSites"]');
        glycoctInputs = [];
        
        sequonContainers.forEach(container => {
            const sequonInputs = Array.from(container.querySelectorAll('textarea'))
                .filter(input => input.placeholder && input.placeholder.includes('GlycoCT'));
            glycoctInputs.push(...sequonInputs);
        });
    }

    if (glycoctInputs.length === 0) {
        // If no existing input found, try to find sequon sites to populate
        
        const targetContainer = sequenceId ? 
            document.getElementById(`${sequenceId}_sequonSites`) :
            document.querySelector('[id*="_sequonSites"]');
            
        if (targetContainer) {
            // Look for existing sequon sites with GlycoCT inputs
            const sequonInputs = targetContainer.querySelectorAll('textarea[placeholder*="GlycoCT"]');
            if (sequonInputs.length > 0) {
                // Apply template to all sequon GlycoCT inputs
                sequonInputs.forEach(input => {
                    input.value = template.glycoct;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            } else {
                // Show message about needing to detect sequons first
                if (window.app && window.app.showInfo) {
                    window.app.showInfo('Please click "Detect Sequons" first to create glycosylation sites, then apply the template.');
                } else {
                    alert('Please click "Detect Sequons" first to create glycosylation sites, then apply the template.');
                }
            }
        }
        
        // Show success message
        if (window.app && window.app.showSuccess) {
            window.app.showSuccess(`Template ready: ${template.name}. Detect sequons to apply.`);
        }
        
        // Keep the selection to show which template was selected
        // selectElement.value = ''; // Removed to keep template selection visible
        return;
    }

    // Apply to all found GlycoCT inputs
    glycoctInputs.forEach((input, index) => {
        input.value = template.glycoct;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Applied template: ${template.name}`);
    }

    // Keep the selection to show which template was applied
    // selectElement.value = ''; // Removed to keep template selection visible
}

/**
 * Open SugarDrawer and apply the drawn structure to all sequons
 */
function drawAndApplyToAll(selectorId) {
    // Copy the EXACT logic from applySelectedTemplate function, but for SugarDrawer

    // Try to find the sequence ID from the selector ID (handle _select suffix)
    let sequenceId = null;
    if (selectorId !== 'glycanTemplateSelect') {
        // Extract sequence ID from selector ID (format: seqID_templateSelector or seqID_templateSelector_select)
        const match = selectorId.match(/^(.+)_templateSelector(?:_select)?$/);
        if (match) {
            sequenceId = match[1];
        }
    }


    // Store context for the SugarDrawer callback
    window.drawAndApplyContext = { sequenceId, selectorId };

    // Set up message listener for SugarDrawer
    const messageHandler = async function(event) {

        if (event.data && event.data.type === 'SUGARDRAWER_ONE_CLICK_EXPORT' && event.data.glycoct) {

            const glycoct = event.data.glycoct.trim();

            // Validate the GlycoCT structure before export
            if (typeof validateGlycoCTStructure === 'function') {
                const validation = validateGlycoCTStructure(glycoct);
                if (!validation.valid) {
                    // Show validation error messages
                    if (window.app && window.app.showWarning) {
                        if (validation.issues && validation.issues.length > 0) {
                            window.app.showWarning(`Cannot export glycan:`);
                            validation.issues.forEach((issue, index) => {
                                setTimeout(() => {
                                    window.app.showWarning(issue);
                                }, (index + 1) * 400);
                            });
                        } else {
                            window.app.showWarning(`Cannot export glycan: ${validation.error}`);
                        }
                    }
                    return; // Exit early without exporting
                }
            }

            // Validate CCD codes exist before export
            if (typeof convertGlycoCTToEnhancedLigand === 'function') {
                try {
                    await convertGlycoCTToEnhancedLigand(glycoct, 'TEST');
                } catch (error) {
                    // CCD mapping failed - don't export
                    if (window.app && window.app.showWarning) {
                        window.app.showWarning(`Cannot export glycan: ${error.message}`);
                    }
                    return; // Exit early without exporting
                }
            }

            // Apply using EXACT same logic as template function
            const textareaId = `${window.drawAndApplyContext.selectorId}_glycoct`;
            applyDrawnGlycanLikeTemplate(glycoct, window.drawAndApplyContext.sequenceId, textareaId);

            // Also populate the GlycoCT textarea
            const glycoctTextarea = document.getElementById(textareaId);
            if (glycoctTextarea) {
                glycoctTextarea.value = glycoct;
            }

            // Send message to SugarDrawer to clear canvas after successful export
            const sugarDrawerFrame = document.getElementById('sugarDrawerPopupFrame');
            if (sugarDrawerFrame && sugarDrawerFrame.contentWindow) {
                sugarDrawerFrame.contentWindow.postMessage({ type: 'SUGARDRAWER_CLEAR_CANVAS' }, '*');
            }

            // Clean up
            window.removeEventListener('message', messageHandler);
            delete window.drawAndApplyContext;

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('sugarDrawerPopupModal'));
            if (modal) {
                modal.hide();
            }
        } else {
        }
    };

    window.addEventListener('message', messageHandler);

    // Create temp textarea and open SugarDrawer
    const tempTextareaId = `drawAndApply_${Date.now()}`;
    const tempTextarea = document.createElement('textarea');
    tempTextarea.id = tempTextareaId;
    tempTextarea.style.display = 'none';
    document.body.appendChild(tempTextarea);

    // Cleanup after timeout
    setTimeout(() => {
        if (tempTextarea.parentNode) tempTextarea.parentNode.removeChild(tempTextarea);
        window.removeEventListener('message', messageHandler);
        delete window.drawAndApplyContext;
    }, 300000);

    window.openSugarDrawerPopup(tempTextareaId);
}

/**
 * Troubleshooting function to debug Draw & Apply to all
 */
function troubleshootDrawAndApply(selectorId) {

    // Test sequence ID extraction
    let sequenceId = null;
    if (selectorId !== 'glycanTemplateSelect') {
        const match = selectorId.match(/^(.+)_templateSelector(?:_select)?$/);
        if (match) {
            sequenceId = match[1];
        }
    }

    // Test finding sequon container
    if (sequenceId) {
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);

        if (sequonContainer) {
            const allTextareas = sequonContainer.querySelectorAll('textarea');
            allTextareas.forEach((ta, i) => {
            });

            const glycoctTextareas = Array.from(allTextareas)
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('glycoCT') ||
                     input.id.includes('glycoct')));
        }
    }

    // Test fallback search
    const sequonContainers = document.querySelectorAll('[id*="_sequonSites"]');

    let allGlycoctInputs = [];
    sequonContainers.forEach(container => {
        const sequonInputs = Array.from(container.querySelectorAll('textarea'))
            .filter(input => input.placeholder && input.placeholder.includes('GlyCoCT'));
        allGlycoctInputs.push(...sequonInputs);
    });

    // Test final fallback
    const targetContainer = sequenceId ?
        document.getElementById(`${sequenceId}_sequonSites`) :
        document.querySelector('[id*="_sequonSites"]');

    if (targetContainer) {
        const finalSequonInputs = targetContainer.querySelectorAll('textarea[placeholder*="GlyCoCT"]');
        finalSequonInputs.forEach((input, i) => {
        });
    }
}

// Make it available globally for console access
window.troubleshootDrawAndApply = troubleshootDrawAndApply;

/**
 * Apply drawn glycan exactly like template function (copied logic)
 */
function applyDrawnGlycanLikeTemplate(glycoCT, sequenceId) {
    // Validate the GlycoCT structure before applying
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoCT);
        if (!validation.valid) {
            // Show validation error messages
            if (window.app && window.app.showError) {
                let errorMessage = 'Invalid GlycoCT structure:\n';
                if (validation.issues && validation.issues.length > 0) {
                    errorMessage += validation.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n');
                } else {
                    errorMessage += validation.error;
                }
                window.app.showError(errorMessage);
            }
            return; // Don't apply invalid GlycoCT
        }
    }

    // Find GlyCoCT input fields and populate them (COPIED FROM applySelectedTemplate)
    let glycoctInputs = [];

    if (sequenceId) {
        // Look for inputs in the SEQUON section only (not glycosylation sites)
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);
        if (sequonContainer) {
            glycoctInputs = Array.from(sequonContainer.querySelectorAll('textarea'))
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('glycoCT') ||
                     input.placeholder.includes('Import GlyCoCT') ||
                     input.id.includes('glycoct') ||
                     input.id.includes('glycan')));
        }
    }

    // If no specific inputs found, search in sequon containers only (not glycosylation sites)
    if (glycoctInputs.length === 0) {
        const sequonContainers = document.querySelectorAll('[id*="_sequonSites"]');
        glycoctInputs = [];

        sequonContainers.forEach(container => {
            const sequonInputs = Array.from(container.querySelectorAll('textarea'))
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('Import GlyCoCT') ||
                     input.id.includes('glycan')));
            glycoctInputs.push(...sequonInputs);
        });
    }

    if (glycoctInputs.length === 0) {
        // If no existing input found, try to find sequon sites to populate
        const targetContainer = sequenceId ?
            document.getElementById(`${sequenceId}_sequonSites`) :
            document.querySelector('[id*="_sequonSites"]');

        if (targetContainer) {
            // Look for existing sequon sites with GlyCoCT inputs
            const sequonInputs = targetContainer.querySelectorAll('textarea[placeholder*="GlyCoCT"]');
            if (sequonInputs.length > 0) {
                // Apply drawn glycan to all sequon GlyCoCT inputs
                sequonInputs.forEach(input => {
                    input.value = glycoCT;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                if (window.app && window.app.showSuccess) {
                    window.app.showSuccess(`Applied drawn glycan to ${sequonInputs.length} sequon(s)`);
                }
            } else {
                // Show message about needing to detect sequons first
                if (window.app && window.app.showInfo) {
                    window.app.showInfo('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
                } else {
                    alert('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
                }
            }
        }
        return;
    }

    // Apply to all found GlyCoCT inputs (EXACT same as template)
    glycoctInputs.forEach((input, index) => {
        input.value = glycoCT;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Applied drawn glycan to ${glycoctInputs.length} sequon(s)`);
    }
}

/**
 * Apply GlyCoCT directly to sequons (legacy function)
 */
function applyGlyCoCTDirectlyToSequons(glycoCT, sequenceId) {

    if (!glycoCT || !glycoCT.trim()) {
        if (window.app && window.app.showError) {
            window.app.showError('No glycan structure received from SugarDrawer');
        }
        return;
    }

    // Find GlyCoCT input fields EXACTLY like the template function
    let glycoctInputs = [];

    if (sequenceId) {
        // Look for inputs in the SEQUON section only (not glycosylation sites)
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);
        if (sequonContainer) {
            glycoctInputs = Array.from(sequonContainer.querySelectorAll('textarea'))
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('glycoCT') ||
                     input.placeholder.includes('Import GlyCoCT') ||
                     input.id.includes('glycoct') ||
                     input.id.includes('glycan')));
        }
    }

    // If no specific inputs found, search in sequon containers only (not glycosylation sites)
    if (glycoctInputs.length === 0) {
        const sequonContainers = document.querySelectorAll('[id*="_sequonSites"]');
        glycoctInputs = [];

        sequonContainers.forEach(container => {
            const sequonInputs = Array.from(container.querySelectorAll('textarea'))
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('Import GlyCoCT') ||
                     input.id.includes('glycan')));
            glycoctInputs.push(...sequonInputs);
        });
    }

    if (glycoctInputs.length === 0) {
        // If no existing input found, try to find sequon sites to populate (like template function)
        const targetContainer = sequenceId ?
            document.getElementById(`${sequenceId}_sequonSites`) :
            document.querySelector('[id*="_sequonSites"]');

        if (targetContainer) {
            // Look for existing sequon sites with GlyCoCT inputs
            const sequonInputs = targetContainer.querySelectorAll('textarea[placeholder*="GlyCoCT"]');
            if (sequonInputs.length > 0) {
                // Apply template to all sequon GlyCoCT inputs
                sequonInputs.forEach(input => {
                    input.value = glycoCT;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                if (window.app && window.app.showSuccess) {
                    window.app.showSuccess(`Applied drawn glycan structure to ${sequonInputs.length} sequon(s)`);
                }
                return;
            } else {
                // Show message about needing to detect sequons first
                if (window.app && window.app.showInfo) {
                    window.app.showInfo('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
                } else {
                    alert('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
                }
                return;
            }
        }
    } else {
        // Apply to found inputs
        glycoctInputs.forEach(input => {
            input.value = glycoCT;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        if (window.app && window.app.showSuccess) {
            window.app.showSuccess(`Applied drawn glycan structure to ${glycoctInputs.length} sequon(s)`);
        }
    }
}

/**
 * Apply GlyCoCT to all sequon inputs (legacy function - keeping for compatibility)
 */
function applyGlyCoCTToAllSequons(glycoCT, sequenceId) {

    if (!glycoCT || !glycoCT.trim()) {
        if (window.app && window.app.showError) {
            window.app.showError('No glycan structure received from SugarDrawer');
        }
        return;
    }

    // Validate the GlycoCT structure before applying to all sequons
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoCT);
        if (!validation.valid) {
            // Note: Cannot display inline errors here as we don't have a specific textarea ID
            // This function is called from SugarDrawer export
            if (window.app && window.app.showError) {
                let errorMessage = 'Invalid GlycoCT structure:\n';
                if (validation.issues && validation.issues.length > 0) {
                    errorMessage += validation.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n');
                } else {
                    errorMessage += validation.error;
                }
                window.app.showError(errorMessage);
            }
            return; // Don't apply invalid GlycoCT
        }
    }

    // Find GlyCoCT input fields and populate them
    let glycoctInputs = [];

    if (sequenceId) {
        // Look for inputs in the SEQUON section only (not glycosylation sites)
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);
        if (sequonContainer) {
            const allTextareas = Array.from(sequonContainer.querySelectorAll('textarea'));

            glycoctInputs = allTextareas.filter(input => input.placeholder &&
                    (input.placeholder.includes('GlyCoCT') ||
                     input.placeholder.includes('glycoCT') ||
                     input.id.includes('glycoct')));
        }
    }

    // If no specific inputs found, search in sequon containers only (not glycosylation sites)
    if (glycoctInputs.length === 0) {
        const sequonContainers = document.querySelectorAll('[id*="_sequonSites"]');
        glycoctInputs = [];

        sequonContainers.forEach(container => {
            const allTextareas = Array.from(container.querySelectorAll('textarea'));

            const sequonInputs = allTextareas.filter(input => input.placeholder && input.placeholder.includes('GlyCoCT'));
            glycoctInputs.push(...sequonInputs);
        });
    }

    if (glycoctInputs.length === 0) {
        // If no existing input found, show message about needing to detect sequons first
        if (window.app && window.app.showInfo) {
            window.app.showInfo('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
        } else {
            alert('Please click "Detect Sequons" first to create glycosylation sites, then try drawing again.');
        }
        return;
    }

    // Apply the drawn GlyCoCT to all sequon inputs
    glycoctInputs.forEach((input, index) => {
        input.value = glycoCT;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Applied drawn glycan structure to ${glycoctInputs.length} sequon(s)`);
    } else {
        alert(`Applied drawn glycan structure to ${glycoctInputs.length} sequon(s)`);
    }
}

/**
 * Initialize glycan template system
 */
function initGlycanTemplates() {
    
    if (!window.glycanTemplateManager) {
        window.glycanTemplateManager = new GlycanTemplateManager();
    }
    
}

// Export functions globally
window.GlycanTemplateManager = GlycanTemplateManager;
window.createTemplateSelector = createTemplateSelector;
window.applySelectedTemplate = applySelectedTemplate;
window.drawAndApplyToAll = drawAndApplyToAll;
window.applyGlyCoCTToAllSequons = applyGlyCoCTToAllSequons;
window.initGlycanTemplates = initGlycanTemplates;

/**
 * Load template data from Excel/CSV format
 * Call this function with your Excel data to populate the template database
 * 
 * Example usage:
 * loadGlycanTemplateData([
 *   { name: "High Mannose 5", glycoct: "RES\n1b:b-dman-HEX-1:5\n..." },
 *   { name: "Complex Biantennary", glycoct: "RES\n1b:b-dglc-HEX-1:5\n..." }
 * ]);
 */
function loadGlycanTemplateData(excelData) {
    
    if (!window.glycanTemplateManager) {
        window.glycanTemplateManager = new GlycanTemplateManager();
    }
    
    window.glycanTemplateManager.loadFromExcelData(excelData);
    
    // Refresh any existing template selectors
    refreshAllTemplateSelectors();
    
}

/**
 * Refresh all template selectors on the page to include new templates
 */
function refreshAllTemplateSelectors() {
    // Find all template selector containers
    const containers = document.querySelectorAll('[id*="_templateSelector"]');
    
    containers.forEach(container => {
        if (container.innerHTML.trim() !== '') {
            // Recreate the selector
            const containerId = container.id;
            window.createTemplateSelector(containerId);
        }
    });
    
}

/**
 * Helper function to convert Excel CSV export to the required format
 * Assumes CSV format: "Glycan Name","GlycoCT Structure"
 */
function parseGlycanTemplatesFromCSV(csvText) {
    const lines = csvText.split('\n');
    const templates = [];
    
    // Skip header row if it exists
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing (handles quoted fields)
        const match = line.match(/^"([^"]+)","(.+)"$/) || line.match(/^([^,]+),(.+)$/);
        if (match) {
            const name = match[1].trim();
            const glycoct = match[2].replace(/\\n/g, '\n').trim(); // Convert \n to actual newlines
            
            if (name && glycoct) {
                templates.push({ name, glycoct });
            }
        }
    }
    
    return templates;
}

/**
 * Apply GlycoCT from textarea to all sequons
 * @param {string} selectorId - The template selector ID
 * @param {string} glycoct - The GlycoCT structure to apply
 */
function applyGlycoCTToAllSequons(selectorId, glycoct) {
    // Extract sequence ID from selector ID
    let sequenceId = null;
    if (selectorId !== 'glycanTemplateSelect') {
        const match = selectorId.match(/^(.+)_templateSelector(?:_select)?$/);
        if (match) {
            sequenceId = match[1];
        }
    }

    if (!sequenceId) {
        return;
    }

    // If glycoct is empty, clear all sequon inputs
    if (!glycoct || !glycoct.trim()) {
        const sequonContainer = document.getElementById(`${sequenceId}_sequonSites`);
        if (sequonContainer) {
            const glycoctInputs = Array.from(sequonContainer.querySelectorAll('textarea'))
                .filter(input => input.placeholder &&
                    (input.placeholder.includes('GlycoCT') ||
                     input.placeholder.includes('glycoCT') ||
                     input.id.includes('glycoct')));

            glycoctInputs.forEach(input => {
                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        return;
    }

    // Validate the GlycoCT structure before applying
    if (typeof validateGlycoCTStructure === 'function') {
        const validation = validateGlycoCTStructure(glycoct.trim());
        if (!validation.valid) {
            // Display validation errors inline below the textarea
            const textareaId = `${selectorId}_glycoct`;
            if (typeof displayGlycoCTValidationErrors === 'function') {
                displayGlycoCTValidationErrors(textareaId, validation);
            }
            return; // Don't apply invalid GlycoCT
        }
    }

    // Clear any previous validation errors if validation passed
    const textareaId = `${selectorId}_glycoct`;
    if (typeof displayGlycoCTValidationErrors === 'function') {
        displayGlycoCTValidationErrors(textareaId, { valid: true });
    }

    // Apply the GlycoCT to all sequon sites using the same logic
    applyDrawnGlycanLikeTemplate(glycoct.trim(), sequenceId);
}

// Export the new functions
window.loadGlycanTemplateData = loadGlycanTemplateData;
window.parseGlycanTemplatesFromCSV = parseGlycanTemplatesFromCSV;
window.refreshAllTemplateSelectors = refreshAllTemplateSelectors;
window.applyGlycoCTToAllSequons = applyGlycoCTToAllSequons;

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    initGlycanTemplates();
});

