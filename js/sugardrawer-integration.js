// SugarDrawer Integration Module
// This module handles integration with the official SugarDrawer component
// Based on research from GitLab: https://gitlab.com/glycoinfo/sugardrawer/sugardrawer

class SugarDrawerIntegration {
    constructor() {
        this.isLoaded = false;
        this.instance = null;
        this.callbacks = {
            onStructureChange: null,
            onExport: null
        };
    }

    // Initialize SugarDrawer - this will be the main integration point
    async initialize(containerId, options = {}) {
        
        const container = document.getElementById(containerId);
        if (!container) {
            return false;
        }

        // Show the integrated interface with iframe
        this.showIntegrationPlaceholder(container, options);
        
        // Setup postMessage communication for data exchange
        this.setupPostMessageCommunication();
        
        // Wait for iframe to load before enabling communication
        setTimeout(() => {
            this.isLoaded = true;
        }, 2000);
        
        return true;
    }

    showIntegrationPlaceholder(container, options) {
        container.innerHTML = `
            <div class="sugardrawer-integration">
                <div class="row mb-3">
                    <div class="col-12">
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body p-0" style="height: 675px; overflow: hidden;">
                                <iframe 
                                    id="sugarDrawerFrame"
                                    src="sugardrawer/dist/index.html"
                                    width="100%" 
                                    height="700"
                                    frameborder="0"
                                    style="border-radius: 0 0 8px 8px; transform: scale(0.75); transform-origin: top left; width: 133.33%; height: 900px;">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>
                .sugardrawer-integration {
                    background: white;
                    border-radius: 8px;
                }
                
                #sugarDrawerFrame {
                    display: block;
                    border: none;
                    overflow: hidden;
                }
                
                .sugardrawer-integration .card-body {
                    overflow: hidden;
                }
            </style>
        `;
        
        // Initialize chain ID with unified function
        setTimeout(() => {
            const chainIdInput = document.getElementById('glycanChainId');
            if (chainIdInput && !chainIdInput.value) {
                const initialChainId = window.generateNextGlycanChainId ? window.generateNextGlycanChainId() : 'GLYCANA';
                chainIdInput.value = initialChainId;
            }
        }, 100);
    }

    // Export current structure to GlycoCT
    exportGlycoCT() {
        if (this.instance && this.instance.exportGlycoCT) {
            return this.instance.exportGlycoCT();
        }
        
        // Fallback to current system
        return document.getElementById('glycoCTOutput')?.value || '';
    }

    // Import structure from GlycoCT
    importGlycoCT(glycoct) {
        if (this.instance && this.instance.importGlycoCT) {
            return this.instance.importGlycoCT(glycoct);
        }
        
        return false;
    }

    // Clear current structure
    clear() {
        if (this.instance && this.instance.clear) {
            this.instance.clear();
        }
    }

    // Get current structure data
    getStructure() {
        if (this.instance && this.instance.getStructure) {
            return this.instance.getStructure();
        }
        return null;
    }

    // Setup postMessage communication with SugarDrawer iframe
    setupPostMessageCommunication() {
        window.addEventListener('message', (event) => {

            // Security check - ensure message is from SugarDrawer (local or remote)
            if (event.origin === null ||
                event.origin === 'null' ||  // Handle string "null"
                event.origin === 'https://pages.glycosmos.org' ||
                (event.origin && event.origin.startsWith('http://127.0.0.1')) ||
                (event.origin && event.origin.startsWith('http://localhost')) ||
                (event.origin && event.origin.includes('ngrok-free.app'))) {
                // Origin accepted
            } else {
                return;
            }

            // Check if popup handlers are active - if so, let them handle popup-specific messages
            const isPopupActive = window.popupMessageHandler !== undefined;
            const isPopupMessage = event.data.type === 'SUGARDRAWER_ONE_CLICK_EXPORT';


            if (isPopupActive && isPopupMessage) {
                // Let the popup handler deal with this message, not the global integration handler
                return;
            }

            // Handle different message types
            if (event.data.type === 'glycan_export') {
                this.handleGlycanExport(event.data);
            } else if (event.data.type === 'glycan_structure_change') {
                this.handleStructureChange(event.data);
            } else if (event.data.type === 'SUGARDRAWER_ADD_TO_JSON') {
                this.handleAddToJSON(event.data);
            } else if (event.data.type === 'SUGARDRAWER_ONE_CLICK_EXPORT') {
                this.handleOneClickExport(event.data);
            } else if (event.data.type === 'SUGARDRAWER_NOTIFICATION') {
                this.handleNotification(event.data);
            }
        });

    }

    // Handle glycan export data from SugarDrawer
    handleGlycanExport(data) {

        // Update the display fields
        if (data.glycoct) {
            document.getElementById('extractedGlycoCT').value = data.glycoct;
        }
        if (data.wurcs) {
            document.getElementById('extractedWURCS').value = data.wurcs;
        }

        // Also update the legacy field for compatibility
        if (data.glycoct) {
            document.getElementById('glycoCTOutput').value = data.glycoct;
        }

        // Show success message
        if (window.app) {
            window.app.showSuccess('Glycan structure extracted successfully!');
        }
    }

    // Handle structure change events
    handleStructureChange(data) {
        // This could be used for real-time updates if needed
    }

    // Handle Export GlycoCT & Add to JSON request from SugarDrawer
    async handleAddToJSON(data) {
        
        try {
            const { glycoct, requestChainId } = data;

            if (!glycoct) {
                throw new Error('No GlycoCT data received from SugarDrawer');
            }

            // Validate GlycoCT structure before processing
            if (typeof validateGlycoCTStructure === 'function') {
                const validation = validateGlycoCTStructure(glycoct);
                if (!validation.valid) {
                    throw new Error(`Invalid GlycoCT structure: ${validation.error}`);
                }
            }

            // Store the GlycoCT for potential database enrichment
            window.lastSugarDrawerGlycoCT = glycoct;

            // Generate next available chain ID automatically
            const currentChainId = window.generateNextGlycanChainId ? window.generateNextGlycanChainId() : 'GLYCANA';

            
            // Check if app is initialized
            if (!window.app) {
                throw new Error('Application not ready. Please wait a moment and try again.');
            }
            
            // Validate chain ID (letters only, no numbers)
            if (!/^[A-Z]+$/.test(currentChainId)) {
                throw new Error('Chain ID must contain only uppercase letters (A-Z).');
            }

            // Use the enhanced conversion logic with bondedAtomPairs
            const enhancedResult = await convertGlycoCTToEnhancedLigand(glycoct, currentChainId);
            
            // Process substituents if substituent handler is available
            let substituentResult = null;
            
            if (window.substituentHandler) {
                substituentResult = await window.substituentHandler.processGlycoCTWithSubstituents(glycoct, currentChainId);
                
                if (substituentResult) {
                    // Note: userCCDs will be processed after special case check
                    
                    // Handle substituent CCD codes - check for special cases first
                    if (substituentResult.combinedCCDs && substituentResult.combinedCCDs.length > 0) {
                        // Check if this contains any special cases (like GNS)
                        const specialCases = ['GNS']; // Add other special cases here as needed
                        const hasSpecialCases = substituentResult.combinedCCDs.some(ccd => specialCases.includes(ccd));
                        
                        if (hasSpecialCases) {
                            const originalCCDs = enhancedResult.ligand.ligand.ccdCodes || [];
                            const reorderedCCDs = mergeSubstituentsInResOrder(originalCCDs, substituentResult.orderedEntries);
                            enhancedResult.ligand.ligand.ccdCodes = reorderedCCDs;
                        } else {
                            const originalCCDs = enhancedResult.ligand.ligand.ccdCodes || [];
                            const reorderedCCDs = mergeSubstituentsInResOrder(originalCCDs, substituentResult.orderedEntries);
                            enhancedResult.ligand.ligand.ccdCodes = reorderedCCDs;
                        }
                    } else if (substituentResult.orderedEntries && substituentResult.substituentCCDs.length > 0) {
                        // Fallback for cases where combinedCCDs is not available
                        const originalCCDs = enhancedResult.ligand.ligand.ccdCodes || [];
                        const reorderedCCDs = mergeSubstituentsInResOrder(originalCCDs, substituentResult.orderedEntries);
                        enhancedResult.ligand.ligand.ccdCodes = reorderedCCDs;
                    }
                }
            } else {
            }
            
            // Combine base bonds with substituent bonds
            let allBondedAtomPairs = enhancedResult.bondedAtomPairs || [];
            
            // Check if we have a special case first
            const hasSpecialCase = substituentResult && substituentResult.combinedCCDs && 
                                  substituentResult.combinedCCDs.length === 1 && 
                                  ['GNS'].includes(substituentResult.combinedCCDs[0]);
            
            if (hasSpecialCase) {
                // For special cases like GNS, we don't add substituent bonds since it's a single unified molecule
            } else if (substituentResult && substituentResult.additionalBonds) {
                allBondedAtomPairs = allBondedAtomPairs.concat(substituentResult.additionalBonds);
            }
            
            // Process userCCDs after special case handling
            if (substituentResult && substituentResult.requiredUserCCDs && Object.keys(substituentResult.requiredUserCCDs).length > 0) {
                // For mixed cases, we still need to add userCCDs for the non-special-case components
                if (!window.app.userCCDs) {
                    window.app.userCCDs = {};
                }
                
                // Merge required userCCDs and track them as automatic
                Object.assign(window.app.userCCDs, substituentResult.requiredUserCCDs);

                // Also track these userCCDs as automatic for display filtering
                if (window.trackUserCCD) {
                    Object.keys(substituentResult.requiredUserCCDs).forEach(userCCDId => {
                        window.trackUserCCD({
                            componentId: userCCDId,
                            method: 'automatic-sugardrawer',
                            content: `Auto-loaded from SugarDrawer`,
                            source: 'automatic'
                        });
                    });
                }
            }
            
            const sequenceEntry = {
                id: `glycan_${Date.now()}`,
                type: 'ligand',
                data: enhancedResult.ligand,
                bondedAtomPairs: allBondedAtomPairs
            };
            
            
            // Initialize sequences array if it doesn't exist
            if (!window.app.sequences) {
                window.app.sequences = [];
            }
            
            window.app.sequences.push(sequenceEntry);
            
            // Track this glycan for removal functionality
            if (window.trackGlycan) {
                // Include substituent information if available
                const substituentInfo = substituentResult ? {
                    hasSubstituents: true,
                    substituentCount: substituentResult.substituents.length,
                    substituentTypes: substituentResult.substituents.map(s => s.ccdCode)
                } : { hasSubstituents: false };
                
                window.trackGlycan({
                    chainId: currentChainId,
                    sequenceId: sequenceEntry.id,
                    ccdCodes: enhancedResult.ligand.ligand.ccdCodes,
                    bondCount: allBondedAtomPairs.length,
                    source: 'sugardrawer',
                    glycoCT: glycoct, // Store GlycoCT for enrichment
                    ...substituentInfo
                });
            }
            
            window.app.showSuccess(`Glycan structure added from SugarDrawer (Chain ID: ${currentChainId})`);
            
            // Generate JSON
            try {
                window.app.generateJSON();
            } catch (error) {
                window.app.showError('Error generating JSON: ' + error.message);
            }
            
        } catch (error) {
            if (window.app) {
                window.app.showError('Error adding glycan to JSON: ' + error.message);
            } else {
                alert('Error adding glycan to JSON: ' + error.message);
            }
        }
    }

    // Handle notification messages from SugarDrawer
    handleNotification(data) {

        const { message, notificationType } = data;

        if (window.app) {
            if (notificationType === 'success') {
                window.app.showSuccess(message);
            } else if (notificationType === 'error') {
                window.app.showError(message);
            } else {
                // Default to success for unknown types
                window.app.showSuccess(message);
            }
        } else {
            // Fallback to console if app is not available
        }
    }

    // Handle one-click export and close from SugarDrawer popup
    handleOneClickExport(data) {
        if (!data.glycoct) {
            if (window.app && window.app.showError) {
                window.app.showError('No GlycoCT data received from SugarDrawer');
            }
            return;
        }

        // Update the display fields
        if (data.glycoct) {
            const extractedField = document.getElementById('extractedGlycoCT');
            if (extractedField) {
                extractedField.value = data.glycoct;
            }

            const legacyField = document.getElementById('glycoCTOutput');
            if (legacyField) {
                legacyField.value = data.glycoct;
            }
        }

        // Show success message
        if (window.app) {
            window.app.showSuccess('GlycoCT structure extracted successfully!');
        }

        // If this was called from a popup context, also handle the close action
        if (data.requestClose) {
            // For integrated instances, we don't need to close anything
            // The export action is sufficient
        }
    }

    // Request data from SugarDrawer iframe
    requestGlycanData() {
        
        // Check localStorage first (bookmarklet data)
        if (this.checkBookmarkletData()) {
            return; // Success from bookmarklet
        }
        
        // Try to automatically extract from iframe
        if (this.autoExtractFromIframe()) {
            return; // Success, no need for manual process
        }
        
        // Fallback to manual process if auto-extraction fails
        this.showVisualExtractionGuide();
        setTimeout(() => {
            this.showManualExtractionDialog();
        }, 1000);
    }

    // Check for bookmarklet extracted data in localStorage
    checkBookmarkletData() {
        try {
            const extractedData = localStorage.getItem('glycoct_extracted');
            if (extractedData && this.validateGlycoCTData(extractedData)) {
                
                // Update the fields
                document.getElementById('extractedGlycoCT').value = extractedData;
                document.getElementById('glycoCTOutput').value = extractedData;

                // Clear the localStorage
                localStorage.removeItem('glycoct_extracted');

                
                if (window.app) {
                    window.app.showSuccess('GlycoCT structure loaded from bookmarklet extraction!');
                }

                return true;
            }
        } catch (error) {
        }
        return false;
    }

    // Automatically extract GlycoCT from SugarDrawer iframe
    autoExtractFromIframe() {
        try {
            const iframe = document.getElementById('sugarDrawerFrame');
            if (!iframe || !iframe.contentDocument) {
                return false;
            }

            // Look for the textarea inside #textform
            const textform = iframe.contentDocument.getElementById('textform');
            if (!textform) {
                return false;
            }

            const textarea = textform.querySelector('textarea[data-reactroot]');
            if (!textarea) {
                return false;
            }

            const glycoct = textarea.value.trim();
            if (!glycoct) {
                return false;
            }

            // Validate the extracted data
            if (!this.validateGlycoCTData(glycoct)) {
                return false;
            }

            // Success! Update the fields
            document.getElementById('extractedGlycoCT').value = glycoct;
            document.getElementById('glycoCTOutput').value = glycoct;

            
            if (window.app) {
                window.app.showSuccess('GlycoCT structure automatically extracted from SugarDrawer!');
            }

            return true;

        } catch (error) {
            return false;
        }
    }

    // Validate extracted GlycoCT data
    validateGlycoCTData(glycoct) {
        if (!glycoct || typeof glycoct !== 'string') {
            return false;
        }

        // Use the comprehensive validation function from sequences.js
        if (typeof validateGlycoCTStructure === 'function') {
            const validation = validateGlycoCTStructure(glycoct);
            if (!validation.valid) {
                if (window.app) {
                    window.app.showError(`GlycoCT Validation Error: ${validation.error}`);
                }
                return false;
            }
            return true;
        }

        // Fallback validation if the comprehensive function is not available
        const lines = glycoct.split('\n').map(line => line.trim()).filter(line => line);
        const hasRES = lines.some(line => line === 'RES');

        return hasRES;
    }

    // Show visual extraction guide
    showVisualExtractionGuide() {
        // Highlight the iframe briefly to draw attention
        const iframe = document.getElementById('sugarDrawerFrame');
        if (iframe) {
            iframe.style.border = '3px solid #0d6efd';
            iframe.style.borderRadius = '8px';
            
            setTimeout(() => {
                iframe.style.border = 'none';
                iframe.style.borderRadius = '0 0 8px 8px';
            }, 3000);
        }
        
        // Show instructional toast
        if (window.app) {
            window.app.showSuccess('🎯 Look for the GRAY export buttons at the bottom of SugarDrawer above!');
        }
    }

}

// Global instance
window.sugarDrawerIntegration = new SugarDrawerIntegration();

// Global helper functions
function initializeSugarDrawer(containerId, options = {}) {
    return window.sugarDrawerIntegration.initialize(containerId, options);
}

// Add glycan from the new simplified input to JSON
/**
 * Generate the next GLYCAN chain ID in sequence: GLYCANA → GLYCANB → ... → GLYCANZ → GLYCANAA → GLYCANAB → etc.
 */
function getNextGlycanChainId(currentId) {
    // Extract the suffix after GLYCAN
    const prefix = 'GLYCAN';
    if (!currentId.startsWith(prefix)) {
        return 'GLYCANA'; // Default if current ID doesn't match pattern
    }
    
    const suffix = currentId.substring(prefix.length);
    if (!suffix) {
        return 'GLYCANA'; // If just "GLYCAN", start with A
    }
    
    // Convert suffix to next value (A→B, B→C, ..., Z→AA, AA→AB, etc.)
    function incrementSuffix(str) {
        const chars = str.split('');
        let carry = true;
        
        // Process from right to left
        for (let i = chars.length - 1; i >= 0 && carry; i--) {
            if (chars[i] === 'Z') {
                chars[i] = 'A';
                // Carry continues
            } else {
                chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
                carry = false;
            }
        }
        
        // If we still have carry, add a new 'A' at the beginning
        if (carry) {
            chars.unshift('A');
        }
        
        return chars.join('');
    }
    
    const nextSuffix = incrementSuffix(suffix);
    return prefix + nextSuffix;
}


// Debug function to check app status
function debugAppStatus() {
    // Debug function - implementation removed to clean up console
}

