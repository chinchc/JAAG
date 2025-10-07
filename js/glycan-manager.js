/**
 * Simple Glycan Management System
 * Tracks active glycan chains and provides removal functionality
 */

// Global array to track active glycans
window.activeGlycans = window.activeGlycans || [];

/**
 * Add a glycan to tracking when it's added to JSON
 * @param {Object} glycanData - The glycan data
 * @param {string} glycanData.chainId - Chain ID (e.g., "GLYCANA")
 * @param {string} glycanData.sequenceId - Internal sequence ID
 * @param {Array} glycanData.ccdCodes - Array of CCD codes
 * @param {number} glycanData.bondCount - Number of bonded atom pairs
 * @param {string} glycanData.source - Source ("sugardrawer" or "glycoct-input")
 */
function trackGlycan(glycanData) {
    
    // Check if already tracked (prevent duplicates)
    const existingIndex = window.activeGlycans.findIndex(g => 
        g.chainId === glycanData.chainId || g.sequenceId === glycanData.sequenceId
    );
    
    if (existingIndex !== -1) {
        // Update existing
        window.activeGlycans[existingIndex] = glycanData;
    } else {
        // Add new
        window.activeGlycans.push(glycanData);
    }
    
    
    // Auto-expand section when new data is added
    expandActiveGlycansSection();
}

/**
 * Remove a glycan from JSON and tracking
 * @param {string} chainId - Chain ID to remove
 */
function removeGlycan(chainId) {
    
    // Find the glycan to remove
    const glycanIndex = window.activeGlycans.findIndex(g => g.chainId === chainId);
    if (glycanIndex === -1) {
        return;
    }
    
    const glycan = window.activeGlycans[glycanIndex];
    
    // Remove from app.sequences (where the JSON data lives)
    if (window.app && window.app.sequences) {
        const sequenceIndex = window.app.sequences.findIndex(seq => 
            seq.id === glycan.sequenceId || 
            (seq.type === 'ligand' && seq.data && seq.data.ligand && seq.data.ligand.id === chainId)
        );
        
        if (sequenceIndex !== -1) {
            window.app.sequences.splice(sequenceIndex, 1);
        }
    }
    
    // Remove from tracking
    window.activeGlycans.splice(glycanIndex, 1);
    
    // Update display
    
    // Auto-cleanup unused userCCDs
    if (window.autoCleanupUserCCDs) {
        window.autoCleanupUserCCDs();
    }
    
    // Regenerate JSON
    if (window.app && window.app.generateJSON) {
        window.app.generateJSON();
    }
    
    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Removed glycan chain: ${chainId}`);
    }
}

/**
 * Clear all glycans
 */
function clearAllGlycans() {
    if (window.activeGlycans.length === 0) {
        return;
    }
    
    const count = window.activeGlycans.length;
    const confirmed = confirm(`Remove all ${count} glycan chains? This cannot be undone.`);
    
    if (!confirmed) {
        return;
    }
    
    
    // Remove all ligand sequences from app.sequences
    if (window.app && window.app.sequences) {
        window.app.sequences = window.app.sequences.filter(seq => seq.type !== 'ligand');
    }
    
    // Clear tracking
    window.activeGlycans = [];
    
    // Update display
    
    // Reset SugarDrawer chain ID to start fresh
    const sugarDrawerChainId = document.getElementById('glycanChainId');
    if (sugarDrawerChainId) {
        sugarDrawerChainId.value = 'GLYCANA';
    }
    
    // Auto-cleanup unused userCCDs
    if (window.autoCleanupUserCCDs) {
        window.autoCleanupUserCCDs();
    }
    
    // Regenerate JSON
    if (window.app && window.app.generateJSON) {
        window.app.generateJSON();
    }
    
    // Show success message
    if (window.app && window.app.showSuccess) {
        window.app.showSuccess(`Removed all ${count} glycan chains`);
    }
}



/**
 * Get next glycan chain ID following the pattern GLYCAN + A-Z, then AA-AB etc.
 */
function getNextGlycanChainId(currentChainId) {
    
    const prefix = 'GLYCAN';
    if (!currentChainId.startsWith(prefix)) {
        return 'GLYCANA';
    }
    
    const suffix = currentChainId.substring(prefix.length);
    
    if (!suffix) {
        return prefix + 'A';
    }
    
    const nextSuffix = getNextLetterSequence(suffix);
    const nextChainId = prefix + nextSuffix;
    
    return nextChainId;
}

/**
 * Get next letter sequence (A->B, Z->AA, AZ->BA)
 */
function getNextLetterSequence(current) {
    const letters = current.split('').reverse();
    
    for (let i = 0; i < letters.length; i++) {
        if (letters[i] < 'Z') {
            letters[i] = String.fromCharCode(letters[i].charCodeAt(0) + 1);
            for (let j = 0; j < i; j++) {
                letters[j] = 'A';
            }
            return letters.reverse().join('');
        }
    }
    
    return 'A' + 'A'.repeat(letters.length);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        });
} else {
}

/**
 * Update the active glycans count badge
 */
function updateActiveGlycansCountBadge() {
    const countBadge = document.getElementById('activeGlycansCount');
    if (countBadge) {
        const count = window.activeGlycans.length;
        countBadge.textContent = count;

        // Only show badge when there are glycans, hide when count is 0
        if (count > 0) {
            countBadge.className = 'badge ms-2 bg-secondary';
            countBadge.style.display = 'inline';
        } else {
            countBadge.style.display = 'none';
        }

    }
}

/**
 * Update glycan description in the sequence data
 */
function updateGlycanDescription(chainId, description) {

    // Find and update the sequence data
    if (window.app && window.app.sequences) {
        const sequence = window.app.sequences.find(seq =>
            (seq.type === 'ligand' && seq.data && seq.data.ligand && seq.data.ligand.id === chainId)
        );

        if (sequence && sequence.data && sequence.data.ligand) {
            sequence.data.ligand.description = description;

            // Auto-regenerate JSON
            if (window.app && window.app.generateJSON) {
                setTimeout(() => {
                    window.app.generateJSON();
                }, 100);
            }
        } else {
        }
    }
}

/**
 * Auto-expand Active Glycan Chains section when data is present
 */
function expandActiveGlycansSection() {
    if (window.activeGlycans && window.activeGlycans.length > 0) {
        const collapseElement = document.getElementById('activeGlycansCollapse');
        if (collapseElement && !collapseElement.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, { show: true });
        }
    }
}

// Export functions for global use
window.trackGlycan = trackGlycan;
window.removeGlycan = removeGlycan;
window.clearAllGlycans = clearAllGlycans;
window.updateGlycanDescription = updateGlycanDescription;
window.getNextGlycanChainId = getNextGlycanChainId;
window.expandActiveGlycansSection = expandActiveGlycansSection;
