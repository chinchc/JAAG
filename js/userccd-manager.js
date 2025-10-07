/**
 * UserCCD Management System
 * Handles CCD mmCIF input for AlphaFold3 custom molecules
 */

// Global array to track active UserCCD components
window.activeUserCCDs = window.activeUserCCDs || [];

/**
 * Parse and normalize userCCD input
 * Converts double quotes to single quotes and line breaks to \n
 * @param {string} input - Raw userCCD input
 * @returns {string} - Normalized single-line string
 */
function parseUserCCDInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    
    // Convert double quotes to single quotes
    let normalized = input.replace(/"/g, "'");
    
    // Convert line breaks to \n and make it a single line
    normalized = normalized
        .replace(/\r\n/g, '\\n')  // Windows line endings
        .replace(/\r/g, '\\n')   // Mac line endings
        .replace(/\n/g, '\\n');  // Unix line endings
    
    // Clean up any multiple consecutive \n
    normalized = normalized.replace(/\\n\\n+/g, '\\n');
    
    return normalized;
}

/**
 * Add userCCD to JSON
 */
function addUserCCDToJSON() {
    
    try {
        const userCCDInput = document.getElementById('userCCDInput');
        const componentIdInput = document.getElementById('userCCDId');
        const inlineRadio = document.getElementById('inlineUserCCD');
        const fileRadio = document.getElementById('fileUserCCD');
        const filePathInput = document.getElementById('userCCDPath');
        
        if (!userCCDInput || !componentIdInput) {
            throw new Error('Required input elements not found');
        }
        
        const componentId = componentIdInput.value.trim();
        const isInline = inlineRadio.checked;
        const isFile = fileRadio.checked;
        
        if (!componentId) {
            throw new Error('Please enter a Component ID');
        }
        
        // Validate component ID (alphanumeric with hyphens allowed)
        if (!/^[A-Z0-9-]{1,10}$/.test(componentId)) {
            throw new Error('Component ID must be 1-10 uppercase letters, numbers, or hyphens');
        }
        
        let userCCDData = {};
        
        if (isInline) {
            const ccdContent = userCCDInput.value.trim();
            if (!ccdContent) {
                throw new Error('Please enter CCD mmCIF content');
            }
            
            // Basic validation - check for required fields
            if (!ccdContent.includes('_chem_comp.id')) {
                throw new Error('Invalid CCD mmCIF format. Must contain _chem_comp.id');
            }
            
            // Parse and normalize the input
            const normalizedContent = parseUserCCDInput(ccdContent);
            userCCDData.userCCD = normalizedContent;
        } else if (isFile) {
            const filePath = filePathInput.value.trim();
            if (!filePath) {
                throw new Error('Please enter a file path for userCCDPath');
            }
            
            userCCDData.userCCDPath = filePath;
        } else {
            throw new Error('Please select either inline or file method');
        }
        
        // Check if app is initialized
        if (!window.app) {
            throw new Error('Application not ready. Please wait a moment and try again.');
        }
        
        // Add to app's userCCD storage
        if (!window.app.userCCDs) {
            window.app.userCCDs = {};
        }
        
        // Store the userCCD data
        window.app.userCCDs[componentId] = userCCDData;
        
        // Track this userCCD
        trackUserCCD({
            componentId: componentId,
            method: isInline ? 'inline' : 'file',
            content: isInline ? 'CCD mmCIF data' : userCCDData.userCCDPath,
            timestamp: Date.now()
        });
        
        if (window.app.showSuccess) {
            window.app.showSuccess(`userCCD '${componentId}' added successfully`);
        }
        
        // Auto-increment component ID for next input
        const nextComponentId = getNextComponentId(componentId);
        componentIdInput.value = nextComponentId;
        
        // Clear the input content
        userCCDInput.value = '';
        if (isFile) {
            filePathInput.value = '';
        }
        
        // Auto-expand section when new data is added
        expandActiveUserCCDSection();
        
        // Generate JSON to include the userCCD data
        if (window.app.generateJSON) {
            window.app.generateJSON();
        }
        
    } catch (error) {
        if (window.app && window.app.showError) {
            window.app.showError('Error adding userCCD: ' + error.message);
        } else {
            alert('Error adding userCCD: ' + error.message);
        }
    }
}

/**
 * Track a userCCD component
 * @param {Object} userCCDData - The userCCD component data
 */
function trackUserCCD(userCCDData) {
    
    // Check if already tracked (prevent duplicates)
    const existingIndex = window.activeUserCCDs.findIndex(u => 
        u.componentId === userCCDData.componentId
    );
    
    if (existingIndex !== -1) {
        // Update existing
        window.activeUserCCDs[existingIndex] = userCCDData;
    } else {
        // Add new
        window.activeUserCCDs.push(userCCDData);
    }
    
    updateActiveUserCCDsDisplay();
}

/**
 * Remove a userCCD
 * @param {string} componentId - Component ID to remove
 */
function removeUserCCD(componentId) {
    
    // Remove from app.userCCDs
    if (window.app && window.app.userCCDs && window.app.userCCDs[componentId]) {
        delete window.app.userCCDs[componentId];
    }
    
    // Remove from tracking
    const componentIndex = window.activeUserCCDs.findIndex(u => u.componentId === componentId);
    if (componentIndex !== -1) {
        window.activeUserCCDs.splice(componentIndex, 1);
    }
    
    // Update display
    updateActiveUserCCDsDisplay();
    
    // Regenerate JSON
    if (window.app && window.app.generateJSON) {
        window.app.generateJSON();
    }
    
    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`userCCD '${componentId}' removed`);
    }
}

/**
 * Clear all userCCD components
 */
function clearAllUserCCDs() {
    if (window.activeUserCCDs.length === 0) {
        return;
    }
    
    const count = window.activeUserCCDs.length;
    const confirmed = confirm(`Remove all ${count} userCCD component(s)? This cannot be undone.`);
    
    if (!confirmed) {
        return;
    }
    
    
    // Clear from app.userCCDs
    if (window.app && window.app.userCCDs) {
        window.app.userCCDs = {};
    }
    
    // Clear tracking
    window.activeUserCCDs = [];
    
    // Update display
    updateActiveUserCCDsDisplay();
    
    // Regenerate JSON
    if (window.app && window.app.generateJSON) {
        window.app.generateJSON();
    }
    
    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Removed all ${count} userCCD component(s)`);
    }
}

/**
 * Update the active userCCDs display
 */
function updateActiveUserCCDsDisplay() {
    const listContainer = document.getElementById('activeUserCCDsList');
    const badge = document.getElementById('userCCDBadge');

    if (!listContainer) {
        return;
    }

    // Filter out automatic userCCDs - only show manual ones
    const manualUserCCDs = window.activeUserCCDs.filter(userCCD =>
        !userCCD.source || (
            userCCD.source !== 'automatic' &&
            userCCD.source !== 'automatic-ligand' &&
            userCCD.method !== 'automatic' &&
            userCCD.method !== 'automatic-ligand' &&
            userCCD.method !== 'automatic-sugardrawer'
        )
    );

    // Update badge
    if (badge) {
        if (manualUserCCDs.length > 0) {
            badge.textContent = manualUserCCDs.length;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }

    if (manualUserCCDs.length === 0) {
        listContainer.innerHTML = '<div class="text-muted">No manual userCCD added yet.</div>';
        return;
    }
    
    // Generate list HTML
    const userCCDsHTML = manualUserCCDs.map(userCCD => {
        const contentDisplay = userCCD.method === 'inline'
            ? 'Inline CCD mmCIF'
            : userCCD.content;

        const timeDisplay = new Date(userCCD.timestamp).toLocaleTimeString();

        return `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center">
                        <strong class="me-3">${userCCD.componentId}</strong>
                        <code class="small bg-light px-2 py-1 rounded me-2">${contentDisplay}</code>
                        <span class="badge bg-secondary small">${userCCD.method}</span>
                        <small class="text-muted ms-2">${timeDisplay}</small>
                    </div>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeUserCCD('${userCCD.componentId}')" title="Remove this userCCD component">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    listContainer.innerHTML = userCCDsHTML;
}


/**
 * Clear UserCCD input fields
 */
function clearUserCCDInput() {
    const userCCDInput = document.getElementById('userCCDInput');
    const filePathInput = document.getElementById('userCCDPath');
    const inlineRadio = document.getElementById('inlineUserCCD');
    const fileRadio = document.getElementById('fileUserCCD');

    if (userCCDInput) {
        userCCDInput.value = '';
    }
    if (filePathInput) {
        filePathInput.value = '';
    }

    // Re-enable both radio buttons and reset to file (default)
    if (inlineRadio && fileRadio) {
        inlineRadio.disabled = false;
        fileRadio.disabled = false;
        fileRadio.checked = true;

        // Trigger container toggle
        const event = new Event('change');
        fileRadio.dispatchEvent(event);
    }


    if (window.app && window.app.showSuccess) {
        window.app.showSuccess('userCCD input cleared');
    }
}

/**
 * Get next component ID (increment ABC -> ABD -> ABE, etc.)
 */
function getNextComponentId(currentId) {
    if (!currentId) return 'ABC';
    
    // Convert to array of characters
    const chars = currentId.split('');
    
    // Increment from right to left
    for (let i = chars.length - 1; i >= 0; i--) {
        if (chars[i] === 'Z') {
            chars[i] = 'A';
        } else if (chars[i] === '9') {
            chars[i] = '0';
        } else if (/[A-Y]/.test(chars[i])) {
            chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
            return chars.join('');
        } else if (/[0-8]/.test(chars[i])) {
            chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
            return chars.join('');
        }
    }
    
    // If we get here, all characters were at their max (ZZZ or 999)
    // Add a new character at the beginning
    return 'A' + chars.join('');
}

// Handle radio button changes for inline vs file selection
document.addEventListener('DOMContentLoaded', function() {
    const inlineRadio = document.getElementById('inlineUserCCD');
    const fileRadio = document.getElementById('fileUserCCD');
    const inlineContainer = document.getElementById('inlineUserCCDContainer');
    const fileContainer = document.getElementById('fileUserCCDContainer');
    const userCCDInput = document.getElementById('userCCDInput');
    const userCCDPath = document.getElementById('userCCDPath');

    function toggleContainers() {
        if (inlineRadio && fileRadio && inlineContainer && fileContainer) {
            if (inlineRadio.checked) {
                inlineContainer.style.display = 'block';
                fileContainer.style.display = 'none';
            } else if (fileRadio.checked) {
                inlineContainer.style.display = 'none';
                fileContainer.style.display = 'block';
            }
        }
        updateRadioButtonStates();
    }

    function updateRadioButtonStates() {
        if (!inlineRadio || !fileRadio || !userCCDInput || !userCCDPath) return;

        const hasInlineContent = userCCDInput.value.trim().length > 0;
        const hasFileContent = userCCDPath.value.trim().length > 0;

        // If inline has content, disable file radio (unless file is currently selected)
        if (hasInlineContent && !fileRadio.checked) {
            fileRadio.disabled = true;
        } else if (!hasInlineContent) {
            fileRadio.disabled = false;
        }

        // If file has content, disable inline radio (unless inline is currently selected)
        if (hasFileContent && !inlineRadio.checked) {
            inlineRadio.disabled = true;
        } else if (!hasFileContent) {
            inlineRadio.disabled = false;
        }
    }

    // Add event listeners for radio buttons
    if (inlineRadio && fileRadio) {
        inlineRadio.addEventListener('change', toggleContainers);
        fileRadio.addEventListener('change', toggleContainers);
    }

    // Add event listeners for input changes to handle locking
    if (userCCDInput) {
        userCCDInput.addEventListener('input', updateRadioButtonStates);
    }

    if (userCCDPath) {
        userCCDPath.addEventListener('input', updateRadioButtonStates);
    }

    // Initialize the display
    toggleContainers();
    updateRadioButtonStates();
    updateActiveUserCCDsDisplay();
});

/**
 * Find all CCD codes currently used in sequences
 * @returns {Set} - Set of CCD codes in use
 */
function getAllUsedCCDCodes() {
    const usedCCDs = new Set();
    
    if (!window.app) {
        return usedCCDs;
    }
    
    // Check sequences for ligand CCD codes
    if (window.app.sequences) {
        for (const sequence of window.app.sequences) {
            if (sequence.type === 'ligand' && sequence.data && sequence.data.ligand && sequence.data.ligand.ccdCodes) {
                for (const ccdCode of sequence.data.ligand.ccdCodes) {
                    usedCCDs.add(ccdCode);
                }
            }
        }
    }
    
    // Check active glycans for CCD codes
    if (window.app.activeGlycans) {
        for (const glycan of window.app.activeGlycans) {
            if (glycan.ccdCodes) {
                for (const ccdCode of glycan.ccdCodes) {
                    usedCCDs.add(ccdCode);
                }
            }
        }
    }
    
    // Check glycan userCCDs that might be currently active
    if (window.app.glycanUserCCDs) {
        const glycanUserCCDIds = Object.keys(window.app.glycanUserCCDs);
        for (const ccdId of glycanUserCCDIds) {
            // Check if this glycan userCCD is referenced anywhere
            if (window.app.sequences) {
                for (const sequence of window.app.sequences) {
                    if (sequence.type === 'ligand' && sequence.data && sequence.data.ligand && sequence.data.ligand.ccdCodes) {
                        if (sequence.data.ligand.ccdCodes.includes(ccdId)) {
                            usedCCDs.add(ccdId);
                        }
                    }
                }
            }
            
            // Check if referenced in active glycans
            if (window.app.activeGlycans) {
                for (const glycan of window.app.activeGlycans) {
                    if (glycan.ccdCodes && glycan.ccdCodes.includes(ccdId)) {
                        usedCCDs.add(ccdId);
                    }
                }
            }
        }
    }
    
    return usedCCDs;
}

/**
 * Clean up unused userCCDs from the JSON
 * Removes userCCD entries that are no longer referenced by any sequence
 */
function cleanupUnusedUserCCDs() {
    if (!window.app) {
        return 0;
    }
    
    
    // Get all CCD codes currently in use
    const usedCCDs = getAllUsedCCDCodes();
    
    let removedCount = 0;
    const unusedUserCCDs = [];
    
    // Check regular userCCDs
    if (window.app.userCCDs) {
        const currentUserCCDs = Object.keys(window.app.userCCDs);
        
        for (const userCCDId of currentUserCCDs) {
            if (!usedCCDs.has(userCCDId)) {
                unusedUserCCDs.push({id: userCCDId, type: 'main'});
            }
        }
    }
    
    // Check glycan userCCDs
    if (window.app.glycanUserCCDs) {
        const currentGlycanUserCCDs = Object.keys(window.app.glycanUserCCDs);
        
        for (const userCCDId of currentGlycanUserCCDs) {
            if (!usedCCDs.has(userCCDId)) {
                // Check if it's not also in main userCCDs (avoid duplicate removal)
                const alreadyMarked = unusedUserCCDs.some(item => item.id === userCCDId);
                if (!alreadyMarked) {
                    unusedUserCCDs.push({id: userCCDId, type: 'glycan'});
                }
            }
        }
    }
    
    if (unusedUserCCDs.length === 0) {
        return 0;
    }
    
    
    // Remove unused userCCDs
    for (const unused of unusedUserCCDs) {
        const unusedId = unused.id;
        
        // Remove from main userCCDs if exists
        if (window.app.userCCDs && window.app.userCCDs[unusedId]) {
            delete window.app.userCCDs[unusedId];
        }
        
        // Remove from glycan userCCDs if exists
        if (window.app.glycanUserCCDs && window.app.glycanUserCCDs[unusedId]) {
            delete window.app.glycanUserCCDs[unusedId];
        }
        
        removedCount++;
        
        // Remove from tracking display if it exists
        if (window.activeUserCCDs) {
            const index = window.activeUserCCDs.findIndex(ccd => ccd.id === unusedId);
            if (index !== -1) {
                window.activeUserCCDs.splice(index, 1);
            }
        }
    }
    
    // Update display
    updateActiveUserCCDsDisplay();
    
    
    // Cleanup completed silently
    
    return removedCount;
}

/**
 * Auto-cleanup userCCDs after ligand removal
 * This should be called whenever a ligand is removed
 */
function autoCleanupUserCCDs() {
    return cleanupUnusedUserCCDs();
}

// Export functions for global use
window.parseUserCCDInput = parseUserCCDInput;
window.addUserCCDToJSON = addUserCCDToJSON;
window.trackUserCCD = trackUserCCD;
window.removeUserCCD = removeUserCCD;
window.clearAllUserCCDs = clearAllUserCCDs;
window.getAllUsedCCDCodes = getAllUsedCCDCodes;
window.cleanupUnusedUserCCDs = cleanupUnusedUserCCDs;
/**
 * Auto-expand Active UserCCD Components section when data is present
 */
function expandActiveUserCCDSection() {
    if (window.app && window.app.userCCDs && Object.keys(window.app.userCCDs).length > 0) {
        const collapseElement = document.getElementById('activeUserCCDCollapse');
        if (collapseElement && !collapseElement.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, { show: true });
        }
    }
}

window.autoCleanupUserCCDs = autoCleanupUserCCDs;
window.clearUserCCDInput = clearUserCCDInput;
window.updateActiveUserCCDsDisplay = updateActiveUserCCDsDisplay;
window.expandActiveUserCCDSection = expandActiveUserCCDSection;
