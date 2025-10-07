// Simple Glycan Builder - Direct replacement for complex SugarDrawer integration

class SimpleGlycanBuilder {
    constructor() {
        this.glycanStructure = [];
        this.selectedSugar = null;
        this.linkageMode = '1-4';
        this.anomericConfig = 'alpha'; // Default to alpha
        this.stereochemistry = 'D'; // Default to D-form
        this.ringForm = 'Pyr'; // Default to pyranose
        this.sugarCounter = 0;
        this.isInitialized = false;
        this.extendedModeActive = false;
        this.ccdSugars = null; // Will store loaded CCD data
        
        // History tracking for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50; // Limit history to prevent memory issues
    }

    init() {
        this.createInterface();
        this.isInitialized = true;
    }

    createInterface() {
        const container = document.getElementById('sugarDrawerContainer');
        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="simple-glycan-builder">
                <div class="row">
                    <div class="col-md-8">
                        <div class="glycan-canvas-wrapper p-3" style="border: 1px solid #dee2e6; border-radius: 0.375rem; background: white; min-height: 300px;">
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle me-1"></i>
                                    <strong>SNFG-Compliant Glycan Builder</strong> - Use the sugar library to build glycan structures
                                </small>
                            </div>
                            <div id="glycanCanvas" style="position: relative; height: 260px; background: #f8f9fa; border: 1px dashed #ccc; cursor: crosshair;">
                                <div id="canvasPlaceholder" class="d-flex align-items-center justify-content-center h-100 text-muted">
                                    <div class="text-center">
                                        <i class="fas fa-mouse-pointer fa-2x mb-2"></i>
                                        <p>Select a sugar and click here to place it</p>
                                        <small>This replaces the original SugarDrawer with a simplified SNFG-compliant builder</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="controls-panel">
                            <h6><i class="fas fa-cube me-2"></i>Sugar Library (SNFG)</h6>
                            <div class="mb-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="toggleSugarLibraryMode()">
                                    <i class="fas fa-expand me-1" id="libraryToggleIcon"></i>
                                    <span id="libraryToggleText">Show All CCD Sugars</span>
                                </button>
                            </div>
                            
                            <!-- Basic Sugar Library -->
                            <div id="basicSugarLibrary" class="sugar-palette mb-3">
                                <div class="sugar-item" data-sugar="glucose" data-ccd="GLC">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <circle cx="20" cy="20" r="18" fill="#0073e6" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Glc<br><small>Glucose</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="galactose" data-ccd="GAL">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <circle cx="20" cy="20" r="18" fill="#ffcc00" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Gal<br><small>Galactose</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="mannose" data-ccd="MAN">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <circle cx="20" cy="20" r="18" fill="#00b050" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Man<br><small>Mannose</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="fucose" data-ccd="FUC">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <polygon points="20,2 36,36 4,36" fill="#ff0000" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Fuc<br><small>Fucose</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="xylose" data-ccd="XYL">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <polygon points="20,2 24,12 36,12 27,20 31,32 20,25 9,32 13,20 4,12 16,12" fill="#ff9500" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Xyl<br><small>Xylose</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="glucosamine" data-ccd="NAG">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <rect x="4" y="4" width="32" height="32" fill="#0073e6" stroke="#000" stroke-width="2" rx="4"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">GlcNAc<br><small>N-AcGlucosamine</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="galactosamine" data-ccd="NGA">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <rect x="4" y="4" width="32" height="32" fill="#ffcc00" stroke="#000" stroke-width="2" rx="4"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">GalNAc<br><small>N-AcGalactosamine</small></div>
                                </div>
                                <div class="sugar-item" data-sugar="sialic" data-ccd="SIA">
                                    <div class="snfg-icon-container">
                                        <svg width="40" height="40" class="snfg-icon">
                                            <polygon points="20,4 34,20 20,36 6,20" fill="#a349a4" stroke="#000" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div class="sugar-label">Neu5Ac<br><small>Sialic Acid</small></div>
                                </div>
                            </div>
                            
                            <!-- Extended Sugar Library (initially hidden) -->
                            <div id="extendedSugarLibrary" style="display: none;">
                                <div class="text-muted small mb-2">Loading CCD sugar database...</div>
                            </div>
                            
                            <style>
                                .sugar-palette {
                                    display: grid;
                                    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
                                    gap: 8px;
                                }
                                
                                .sugar-item {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    padding: 8px;
                                    border: 2px solid #ddd;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    background: white;
                                }
                                
                                .sugar-item:hover {
                                    border-color: #007bff;
                                    background: #f8f9fa;
                                }
                                
                                .sugar-item.selected {
                                    border-color: #007bff;
                                    background: #e7f1ff;
                                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
                                }
                                
                                .snfg-icon-container {
                                    margin-bottom: 4px;
                                }
                                
                                .snfg-icon {
                                    filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
                                }
                                
                                .sugar-label {
                                    text-align: center;
                                    font-size: 11px;
                                    font-weight: bold;
                                    color: #333;
                                    line-height: 1.2;
                                }
                                
                                .sugar-label small {
                                    font-size: 8px;
                                    color: #666;
                                    font-weight: normal;
                                }
                            </style>

                            <h6><i class="fas fa-atom me-2"></i>Stereochemistry & Configuration</h6>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <small class="text-muted">D/L Form:</small>
                                    <div class="btn-group w-100" role="group">
                                        <button class="btn btn-outline-primary btn-sm stereochemistry-btn active" data-stereochemistry="D">D</button>
                                        <button class="btn btn-outline-primary btn-sm stereochemistry-btn" data-stereochemistry="L">L</button>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Ring Form:</small>
                                    <div class="btn-group w-100" role="group">
                                        <button class="btn btn-outline-primary btn-sm ring-btn active" data-ring="Pyr">Pyr</button>
                                        <button class="btn btn-outline-primary btn-sm ring-btn" data-ring="Fur">Fur</button>
                                    </div>
                                </div>
                            </div>
                            <div class="anomeric-palette mb-3">
                                <small class="text-muted">Anomeric:</small>
                                <div class="btn-group w-100" role="group">
                                    <button class="btn btn-outline-primary btn-sm anomeric-btn active" data-anomeric="alpha">α (alpha)</button>
                                    <button class="btn btn-outline-primary btn-sm anomeric-btn" data-anomeric="beta">β (beta)</button>
                                </div>
                            </div>

                            <h6><i class="fas fa-link me-2"></i>Linkages</h6>
                            <div class="linkage-palette mb-3">
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn active" data-linkage="1-4">1→4</button>
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn" data-linkage="1-3">1→3</button>
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn" data-linkage="1-6">1→6</button>
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn" data-linkage="1-2">1→2</button>
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn" data-linkage="2-3">2→3</button>
                                <button class="btn btn-outline-primary btn-sm m-1 linkage-btn" data-linkage="2-6">2→6</button>
                            </div>

                            <h6><i class="fas fa-tools me-2"></i>Actions</h6>
                            <div class="action-buttons mb-3">
                                <div class="btn-group me-2" role="group">
                                    <button class="btn btn-outline-primary btn-sm" id="undoBtn" disabled>
                                        <i class="fas fa-undo me-1"></i>Undo
                                    </button>
                                    <button class="btn btn-outline-primary btn-sm" id="redoBtn" disabled>
                                        <i class="fas fa-redo me-1"></i>Redo
                                    </button>
                                </div>
                                <button class="btn btn-danger btn-sm me-2" id="clearGlycanBtn">
                                    <i class="fas fa-trash me-1"></i>Clear
                                </button>
                            </div>
                            <div class="export-buttons">
                                <button class="btn btn-outline-primary btn-sm me-2" id="exportGlycanBtn">
                                    <i class="fas fa-download me-1"></i>Export
                                </button>
                                <button class="btn btn-outline-primary btn-sm me-2" id="addToSequenceBtn">
                                    <i class="fas fa-plus me-1"></i>Add to Sequence
                                </button>
                                <button class="btn btn-outline-primary btn-sm" onclick="restoreOriginalDrawer()">
                                    <i class="fas fa-undo me-1"></i>Original
                                </button>
                            </div>

                            <div class="mt-3">
                                <small class="text-muted">
                                    <strong>Instructions:</strong><br>
                                    1. Select α/β configuration<br>
                                    2. Click a sugar to select it<br>
                                    3. Click on canvas to place it<br>
                                    4. Nearby sugars auto-connect<br>
                                    <br>
                                    <strong>Shortcuts:</strong><br>
                                    • Ctrl+Z (⌘+Z): Undo<br>
                                    • Ctrl+Y (⌘+Shift+Z): Redo
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <label for="currentGlycoCT" class="form-label">Current Structure (GlycoCT):</label>
                    <textarea class="form-control" id="currentGlycoCT" rows="4" readonly placeholder="GlycoCT will appear here as you build"></textarea>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Sugar selection items
        document.querySelectorAll('.sugar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const sugarType = item.dataset.sugar;
                this.selectSugar(sugarType, item);
            });
        });

        // Stereochemistry selection buttons
        document.querySelectorAll('.stereochemistry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stereochemistry = e.target.dataset.stereochemistry;
                this.setStereochemistry(stereochemistry, e.target);
            });
        });

        // Ring form selection buttons
        document.querySelectorAll('.ring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ring = e.target.dataset.ring;
                this.setRingForm(ring, e.target);
            });
        });

        // Anomeric selection buttons
        document.querySelectorAll('.anomeric-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const anomeric = e.target.dataset.anomeric;
                this.setAnomericConfig(anomeric, e.target);
            });
        });

        // Linkage selection buttons
        document.querySelectorAll('.linkage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const linkage = e.target.dataset.linkage;
                this.setLinkageMode(linkage, e.target);
            });
        });

        // Canvas clicking
        const canvas = document.getElementById('glycanCanvas');
        canvas.addEventListener('click', (e) => {
            if (this.selectedSugar) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.placeSugar(x, y);
            }
        });

        // Action buttons
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });

        document.getElementById('clearGlycanBtn').addEventListener('click', () => {
            this.clearCanvas();
        });

        document.getElementById('exportGlycanBtn').addEventListener('click', () => {
            this.exportGlycoCT();
        });

        document.getElementById('addToSequenceBtn').addEventListener('click', () => {
            this.addGlycanToSequence();
        });

        // Keyboard shortcuts for undo/redo
        document.addEventListener('keydown', (e) => {
            // Only trigger if we're focused on the glycan builder area
            const glycanArea = document.querySelector('.simple-glycan-builder');
            if (!glycanArea || !glycanArea.contains(e.target)) return;
            
            if (e.ctrlKey || e.metaKey) { // Support both Ctrl (Windows) and Cmd (Mac)
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    this.redo();
                }
            }
        });

        
        // Save initial state
        this.saveState('Initial state');
    }

    // History Management Functions
    saveState(action = 'Action') {
        // Create a deep copy of the current state
        const state = {
            glycanStructure: JSON.parse(JSON.stringify(this.glycanStructure)),
            sugarCounter: this.sugarCounter,
            action: action,
            timestamp: Date.now()
        };

        // Remove any redo history when a new action is performed
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(state);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(1);
            this.historyIndex--;
        }

        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            app.showSuccess(`Undid: ${this.history[this.historyIndex + 1]?.action || 'last action'}`);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            app.showSuccess(`Redid: ${this.history[this.historyIndex].action}`);
        }
    }

    restoreState(state) {
        // Restore the glycan structure
        this.glycanStructure = JSON.parse(JSON.stringify(state.glycanStructure));
        this.sugarCounter = state.sugarCounter;

        // Clear and redraw the canvas
        this.redrawCanvas();
        this.updateGlycoCTOutput();
        this.updateUndoRedoButtons();
    }

    redrawCanvas() {
        const canvas = document.getElementById('glycanCanvas');
        
        // Remove all existing elements
        canvas.querySelectorAll('.sugar-node, .connection-line, .linkage-label').forEach(el => {
            el.remove();
        });

        // Update placeholder
        this.updateCanvasPlaceholder();

        // Redraw all sugars
        for (const sugar of this.glycanStructure) {
            this.drawSugar(sugar);
        }

        // Redraw all connections
        for (const sugar of this.glycanStructure) {
            for (const connection of sugar.connections) {
                const targetSugar = this.glycanStructure.find(s => s.id === connection.to);
                if (targetSugar) {
                    this.drawConnection(sugar, targetSugar);
                }
            }
        }
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');

        // Update undo button
        if (this.historyIndex > 0) {
            undoBtn.disabled = false;
            undoBtn.title = `Undo: ${this.history[this.historyIndex].action}`;
        } else {
            undoBtn.disabled = true;
            undoBtn.title = 'Nothing to undo';
        }

        // Update redo button
        if (this.historyIndex < this.history.length - 1) {
            redoBtn.disabled = false;
            redoBtn.title = `Redo: ${this.history[this.historyIndex + 1].action}`;
        } else {
            redoBtn.disabled = true;
            redoBtn.title = 'Nothing to redo';
        }
    }

    selectSugar(sugarType, button) {
        
        // Update selection states
        document.querySelectorAll('.sugar-item').forEach(item => {
            item.classList.remove('selected');
        });
        button.classList.add('selected');

        this.selectedSugar = sugarType;
        
        // Auto-adjust stereochemistry for naturally L-form sugars
        if (sugarType === 'fucose' && this.stereochemistry === 'D') {
            this.setStereochemistry('L', document.querySelector('[data-stereochemistry="L"]'));
        }
        
        // Update placeholder text
        const placeholder = document.getElementById('canvasPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-crosshairs fa-2x mb-2 text-primary"></i>
                    <p class="text-primary">Click on canvas to place <strong>${this.getSugarDisplayName(sugarType)}</strong></p>
                </div>
            `;
        }

        app.showSuccess(`Selected ${this.getSugarDisplayName(sugarType)} - Click on canvas to place`);
    }

    getSugarDisplayName(sugarType) {
        const names = {
            'glucose': 'Glucose (Glc)',
            'galactose': 'Galactose (Gal)', 
            'mannose': 'Mannose (Man)',
            'fucose': 'Fucose (Fuc)',
            'xylose': 'Xylose (Xyl)',
            'glucosamine': 'N-Acetylglucosamine (GlcNAc)',
            'galactosamine': 'N-Acetylgalactosamine (GalNAc)',
            'sialic': 'Sialic Acid (Neu5Ac)'
        };
        return names[sugarType] || sugarType;
    }

    setStereochemistry(stereochemistry, button) {
        
        // Update button states
        document.querySelectorAll('.stereochemistry-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.stereochemistry = stereochemistry;
        app.showSuccess(`Stereochemistry: ${stereochemistry}-form`);
    }

    setRingForm(ring, button) {
        
        // Update button states
        document.querySelectorAll('.ring-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.ringForm = ring;
        app.showSuccess(`Ring form: ${ring === 'Pyr' ? 'Pyranose' : 'Furanose'}`);
    }

    setAnomericConfig(anomeric, button) {
        
        // Update button states
        document.querySelectorAll('.anomeric-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.anomericConfig = anomeric;
        
        
        app.showSuccess(`Anomeric configuration: ${anomeric}`);
    }

    setLinkageMode(linkage, button) {
        
        // Update button states
        document.querySelectorAll('.linkage-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.linkageMode = linkage;
        app.showSuccess(`Linkage mode: ${linkage}`);
    }

    placeSugar(x, y) {
        if (!this.selectedSugar) return;

        const sugarId = ++this.sugarCounter;
        const sugar = {
            id: sugarId,
            type: this.selectedSugar,
            anomeric: this.anomericConfig,
            stereochemistry: this.stereochemistry,
            ring: this.ringForm,
            x: x,
            y: y,
            connections: []
        };


        this.glycanStructure.push(sugar);
        this.drawSugar(sugar);
        
        // Try to auto-connect to nearby sugars
        this.attemptAutoConnect(sugar);
        
        // Clear selection
        this.selectedSugar = null;
        document.querySelectorAll('.sugar-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Update placeholder
        this.updateCanvasPlaceholder();
        
        // Update GlycoCT output
        this.updateGlycoCTOutput();

        // Save state for undo/redo
        this.saveState(`Added ${this.getSugarDisplayName(sugar.type)}`);

        app.showSuccess(`Placed ${this.getSugarDisplayName(sugar.type)}`);
    }

    drawSugar(sugar) {
        const canvas = document.getElementById('glycanCanvas');
        
        // Create sugar element container
        const sugarElement = document.createElement('div');
        sugarElement.className = 'sugar-node';
        sugarElement.style.cssText = `
            position: absolute;
            left: ${sugar.x - 25}px;
            top: ${sugar.y - 25}px;
            width: 50px;
            height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
        `;
        
        // Add SVG icon
        const svgIcon = this.getSNFGSVG(sugar.type, 40);
        
        // Display sugar with configuration
        const anomericSymbol = sugar.anomeric === 'alpha' ? 'α' : 'β';
        const config = `${anomericSymbol}-${sugar.stereochemistry}-${sugar.ring}`;
        
        sugarElement.innerHTML = `
            <div style="position: relative;">
                ${svgIcon}
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                           font-size: 8px; font-weight: bold; color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
                           text-align: center; line-height: 1; pointer-events: none;">
                    <div>${this.getSugarAbbrev(sugar.type)}</div>
                    <div style="font-size: 6px;">${config}</div>
                </div>
            </div>
        `;
        
        sugarElement.dataset.sugarId = sugar.id;
        canvas.appendChild(sugarElement);
        
        // Hide placeholder if this is the first sugar
        if (this.glycanStructure.length === 1) {
            const placeholder = document.getElementById('canvasPlaceholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    getSugarColor(sugarType) {
        // SNFG compliant colors
        const colors = {
            'glucose': '#0066ff',      // Blue circle
            'galactose': '#ffdd00',    // Yellow circle
            'mannose': '#00aa00',      // Green circle
            'fucose': '#ff0000',       // Red triangle
            'xylose': '#ff6600',       // Orange star
            'glucosamine': '#0066ff',  // Blue square
            'galactosamine': '#ffdd00', // Yellow square
            'sialic': '#8800dd'        // Purple diamond
        };
        return colors[sugarType] || '#666666';
    }

    getSugarShape(sugarType) {
        // SNFG compliant shapes using CSS
        const shapes = {
            'glucose': '50%',     // Circle
            'galactose': '50%',   // Circle  
            'mannose': '50%',     // Circle
            'fucose': 'triangle', // Triangle
            'xylose': 'star',     // Star
            'glucosamine': '8px', // Square
            'galactosamine': '8px', // Square
            'sialic': 'diamond'   // Diamond
        };
        return shapes[sugarType] || '50%';
    }

    getSNFGSVG(sugarType, size = 50) {
        // Generate proper SNFG SVG for canvas display
        const color = this.getSugarColor(sugarType);
        const strokeWidth = 2;
        const radius = (size - strokeWidth * 2) / 2;
        const center = size / 2;
        
        let svgContent = '';
        
        switch (sugarType) {
            case 'glucose':
            case 'galactose':
            case 'mannose':
                svgContent = `<circle cx="${center}" cy="${center}" r="${radius}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
                
            case 'fucose':
                svgContent = `<polygon points="${center},${strokeWidth*2} ${size-strokeWidth*2},${size-strokeWidth*2} ${strokeWidth*2},${size-strokeWidth*2}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
                
            case 'xylose':
                // 5-pointed star
                const outerRadius = radius;
                const innerRadius = radius * 0.4;
                const starPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const r = i % 2 === 0 ? outerRadius : innerRadius;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    starPoints.push(`${x},${y}`);
                }
                svgContent = `<polygon points="${starPoints.join(' ')}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
                
            case 'glucosamine':
            case 'galactosamine':
                const rectSize = size - strokeWidth * 2;
                const rectPos = strokeWidth;
                svgContent = `<rect x="${rectPos}" y="${rectPos}" width="${rectSize}" height="${rectSize}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}" rx="4"/>`;
                break;
                
            case 'sialic':
                // Diamond
                svgContent = `<polygon points="${center},${strokeWidth*2} ${size-strokeWidth*2},${center} ${center},${size-strokeWidth*2} ${strokeWidth*2},${center}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
                
            default:
                svgContent = `<circle cx="${center}" cy="${center}" r="${radius}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
        }
        
        return `<svg width="${size}" height="${size}" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">${svgContent}</svg>`;
    }

    getSugarAbbrev(sugarType) {
        const abbrevs = {
            'glucose': 'Glc',
            'galactose': 'Gal',
            'mannose': 'Man',
            'fucose': 'Fuc',
            'xylose': 'Xyl',
            'glucosamine': 'GlcNAc',
            'galactosamine': 'GalNAc',
            'sialic': 'Neu5Ac'
        };
        return abbrevs[sugarType] || 'Unk';
    }

    attemptAutoConnect(newSugar) {
        // Find nearby sugars (within 100 pixels)
        const nearby = this.glycanStructure.filter(sugar => {
            if (sugar.id === newSugar.id) return false;
            const distance = Math.sqrt(
                Math.pow(sugar.x - newSugar.x, 2) + 
                Math.pow(sugar.y - newSugar.y, 2)
            );
            return distance < 120;
        });

        if (nearby.length > 0) {
            // Connect to the closest sugar
            const closest = nearby.reduce((prev, curr) => {
                const prevDist = Math.sqrt(Math.pow(prev.x - newSugar.x, 2) + Math.pow(prev.y - newSugar.y, 2));
                const currDist = Math.sqrt(Math.pow(curr.x - newSugar.x, 2) + Math.pow(curr.y - newSugar.y, 2));
                return prevDist < currDist ? prev : curr;
            });

            this.connectSugars(closest, newSugar);
        }
    }

    connectSugars(sugar1, sugar2) {
        // Add connection to first sugar
        sugar1.connections.push({
            to: sugar2.id,
            linkage: this.linkageMode
        });

        // Draw connection line
        this.drawConnection(sugar1, sugar2);
    }

    drawConnection(sugar1, sugar2) {
        const canvas = document.getElementById('glycanCanvas');
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        // Calculate line position and rotation
        const deltaX = sugar2.x - sugar1.x;
        const deltaY = sugar2.y - sugar1.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        line.style.cssText = `
            position: absolute;
            left: ${sugar1.x}px;
            top: ${sugar1.y - 1}px;
            width: ${distance}px;
            height: 2px;
            background: #333;
            transform-origin: left center;
            transform: rotate(${angle}deg);
            z-index: 5;
        `;
        
        canvas.appendChild(line);
        
        // Add linkage label
        const label = document.createElement('div');
        label.className = 'linkage-label';
        label.style.cssText = `
            position: absolute;
            left: ${(sugar1.x + sugar2.x) / 2 - 15}px;
            top: ${(sugar1.y + sugar2.y) / 2 - 10}px;
            width: 30px;
            height: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            z-index: 15;
        `;
        label.textContent = this.linkageMode;
        
        canvas.appendChild(label);
    }

    updateCanvasPlaceholder() {
        const placeholder = document.getElementById('canvasPlaceholder');
        if (placeholder) {
            if (this.glycanStructure.length === 0) {
                placeholder.style.display = 'flex';
                placeholder.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-mouse-pointer fa-2x mb-2"></i>
                        <p>Select a sugar and click here to place it</p>
                    </div>
                `;
            } else {
                placeholder.style.display = 'none';
            }
        }
    }

    clearCanvas() {
        const canvas = document.getElementById('glycanCanvas');
        
        // Remove all sugar nodes and connections
        canvas.querySelectorAll('.sugar-node, .connection-line, .linkage-label').forEach(el => {
            el.remove();
        });
        
        // Reset data
        this.glycanStructure = [];
        this.sugarCounter = 0;
        this.selectedSugar = null;
        
        // Clear selection states
        document.querySelectorAll('.sugar-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Show placeholder
        this.updateCanvasPlaceholder();
        
        // Clear GlycoCT output
        document.getElementById('currentGlycoCT').value = '';
        document.getElementById('glycoCTOutput').value = '';
        
        // Save state for undo/redo
        this.saveState('Cleared canvas');
        
        app.showSuccess('Canvas cleared');
    }

    exportGlycoCT() {
        const glycoCT = this.generateGlycoCT();
        
        // Update both possible output fields
        const currentField = document.getElementById('currentGlycoCT');
        const outputField = document.getElementById('glycoCTOutput');
        
        if (currentField) currentField.value = glycoCT;
        if (outputField) outputField.value = glycoCT;
        
        
        if (glycoCT) {
            app.showSuccess('GlycoCT exported to output field');
        } else {
            app.showError('No glycan structure to export');
        }
        
        return glycoCT;
    }

    generateGlycoCT() {
        
        if (this.glycanStructure.length === 0) {
            return '';
        }

        let glycoCT = 'RES\n';
        let residueCounter = 1;
        
        // Generate residue section (base sugars + substituents in RES section)
        for (const sugar of this.glycanStructure) {
            
            const sugarInfo = this.getSugarGlycoCTInfo(sugar.type);
            
            const anomericPrefix = sugar.anomeric === 'alpha' ? 'a' : 'b';
            const stereoPrefix = sugar.stereochemistry === 'D' ? 'd' : 'l';
            const ringConfig = sugar.ring === 'Pyr' ? '1:5' : '1:4'; // Pyranose 1:5, Furanose 1:4
            
            
            // Add base sugar residue
            const residueLine = `${residueCounter}b:${anomericPrefix}-${stereoPrefix}${sugarInfo.code}-${sugarInfo.class}-${ringConfig}`;
            glycoCT += residueLine + '\n';
            residueCounter++;
            
            // Add N-acetyl substituent directly in RES section if needed
            if (sugarInfo.hasNAcetyl) {
                const substituentLine = `${residueCounter}s:n-acetyl`;
                glycoCT += substituentLine + '\n';
                residueCounter++;
            }
        }
        
        // Generate linkage section for both sugar-to-sugar connections and N-acetyl linkages
        const needsLinSection = this.hasConnections() || this.hasNAcetylSubstituents();
        
        if (needsLinSection) {
            glycoCT += 'LIN\n';
            let linkageId = 1;
            let currentResidueId = 1;
            
            // First, add N-acetyl linkages for each sugar
            for (const sugar of this.glycanStructure) {
                const sugarInfo = this.getSugarGlycoCTInfo(sugar.type);
                
                if (sugarInfo.hasNAcetyl) {
                    // N-acetyl linkage: different positions for different sugars
                    const acetylResidueId = currentResidueId + 1;
                    let linkagePosition = 2; // Default position for most sugars
                    
                    // Sialic acid (Neu5Ac) has N-acetyl at position 5
                    if (sugar.type === 'sialic') {
                        linkagePosition = 5;
                    }
                    
                    glycoCT += `${linkageId}:${currentResidueId}d(${linkagePosition}+1)${acetylResidueId}n\n`;
                    linkageId++;
                    currentResidueId += 2; // Skip both sugar and its N-acetyl
                } else {
                    currentResidueId++; // Just the sugar residue
                }
            }
            
            // Then add sugar-to-sugar connections
            for (const sugar of this.glycanStructure) {
                for (const connection of sugar.connections) {
                    const [donorPos, acceptorPos] = connection.linkage.split('-');
                    glycoCT += `${linkageId}:${sugar.id}o(${donorPos}+1)${connection.to}d\n`;
                    linkageId++;
                }
            }
        }

        return glycoCT;
    }

    getSugarGlycoCTInfo(sugarType) {
        
        const sugarInfo = {
            'glucose': { code: 'glc', class: 'HEX', hasNAcetyl: false },
            'galactose': { code: 'gal', class: 'HEX', hasNAcetyl: false }, 
            'mannose': { code: 'man', class: 'HEX', hasNAcetyl: false },
            'fucose': { code: 'fuc', class: 'HEX', hasNAcetyl: false },
            'xylose': { code: 'xyl', class: 'PEN', hasNAcetyl: false },
            'glucosamine': { code: 'glc', class: 'HEX', hasNAcetyl: true }, // N-acetylglucosamine (GlcNAc)
            'galactosamine': { code: 'gal', class: 'HEX', hasNAcetyl: true }, // N-acetylgalactosamine (GalNAc)  
            'GlcNAc': { code: 'glc', class: 'HEX', hasNAcetyl: true }, // N-acetylglucosamine = glucose + N-acetyl
            'sialic': { code: 'gro-dgal', class: 'NON', hasNAcetyl: true }
        };
        
        const result = sugarInfo[sugarType] || { code: 'unk', class: 'HEX', hasNAcetyl: false };
        
        if (!sugarInfo[sugarType]) {
        }
        
        return result;
    }

    hasConnections() {
        return this.glycanStructure.some(sugar => sugar.connections.length > 0);
    }

    hasNAcetylSubstituents() {
        return this.glycanStructure.some(sugar => {
            const sugarInfo = this.getSugarGlycoCTInfo(sugar.type);
            return sugarInfo.hasNAcetyl;
        });
    }

    updateGlycoCTOutput() {
        const glycoCT = this.generateGlycoCT();
        document.getElementById('currentGlycoCT').value = glycoCT;
    }

    addGlycanToSequence() {
        const glycoCT = this.generateGlycoCT();
        
        if (!glycoCT) {
            app.showError('No glycan structure to add');
            return;
        }

        // Use the existing function from the main app
        document.getElementById('glycoCTOutput').value = glycoCT;
        addGlycanToJSON();
    }

    // CCD Sugar Database Functions
    async loadCCDSugars() {
        if (this.ccdSugars) return this.ccdSugars; // Already loaded

        try {
            
            // First try to fetch the CSV file
            let csvText = '';
            let fetchSuccessful = false;
            
            try {
                const response = await fetch('ccd.csv');
                
                if (response.ok) {
                    csvText = await response.text();
                    fetchSuccessful = true;
                } else {
                }
            } catch (fetchError) {
            }
            
            // If fetch failed, use a sample of the data for testing
            if (!fetchSuccessful) {
                csvText = `Class,Monosaccharide,Dor L,alpha OR beta,Pyr OR Fur,CCD
Hexose,Glucose (Glc),D,alpha,Pyr,GLC
Hexose,Glucose (Glc),D,beta,Pyr,BGC
Hexose,Mannose (Man),D,alpha,Pyr,MAN
Hexose,Mannose (Man),D,beta,Pyr,BMA
Hexose,Galactose (Gal),D,alpha,Pyr,GLA
Hexose,Galactose (Gal),D,beta,Pyr,GAL
Pentose,Arabinose (Ara),L,alpha,Pyr,ARA
Pentose,Xylose (Xyl),D,beta,Pyr,XYL
HexNAc,GlcNAc,D,alpha,Pyr,NDG
HexNAc,GlcNAc,D,beta,Pyr,NAG
HexNAc,GalNAc,D,beta,Pyr,NGA
DeoxyHex,Fucose (Fuc),L,alpha,Pyr,FUC
HexA,GlcA,D,beta,Pyr,BDP
HexA,GalA,D,beta,Pyr,GTR`;
            }
            
            
            // Parse CSV data
            const lines = csvText.split('\n');
            
            const headers = lines[0].split(',');
            
            const ccdData = {};
            let processedCount = 0;
            let skippedCount = 0;
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) {
                    skippedCount++;
                    continue;
                }
                if (line.includes('none')) {
                    skippedCount++;
                    continue;
                }
                
                const cols = line.split(',');
                if (cols.length < 6) {
                    skippedCount++;
                    continue;
                }
                
                const [classType, monosaccharide, stereo, anomer, ring, ccdCode] = cols;
                
                if (!classType || classType === '""' || !ccdCode) {
                    skippedCount++;
                    continue;
                }
                
                // Clean up the data
                const cleanClass = classType.replace(/"/g, '').trim();
                const cleanMono = monosaccharide.replace(/"/g, '').trim();
                
                if (!cleanClass) {
                    skippedCount++;
                    continue;
                }
                
                if (!ccdData[cleanClass]) {
                    ccdData[cleanClass] = [];
                }
                
                // Extract abbreviation from monosaccharide name
                const abbrevMatch = cleanMono.match(/\(([^)]+)\)/);
                const abbrev = abbrevMatch ? abbrevMatch[1] : cleanMono.split(' ')[0];
                
                const sugarEntry = {
                    name: cleanMono,
                    abbreviation: abbrev,
                    stereochemistry: stereo,
                    anomeric: anomer,
                    ring: ring,
                    ccd: ccdCode.trim(),
                    class: cleanClass
                };
                
                ccdData[cleanClass].push(sugarEntry);
                processedCount++;
                
                // Log first few entries for debugging
                if (processedCount <= 5) {
                }
            }
            
            
            // Log entry counts per class
            Object.entries(ccdData).forEach(([className, entries]) => {
            });
            
            this.ccdSugars = ccdData;
            return ccdData;
            
        } catch (error) {
            return {};
        }
    }

    async toggleExtendedLibrary() {
        
        const basicLibrary = document.getElementById('basicSugarLibrary');
        const extendedLibrary = document.getElementById('extendedSugarLibrary');
        const toggleIcon = document.getElementById('libraryToggleIcon');
        const toggleText = document.getElementById('libraryToggleText');

        // Check if library elements exist
        if (!basicLibrary || !extendedLibrary || !toggleIcon || !toggleText) {
            return;
        }

        if (!this.extendedModeActive) {
            // Show extended library
            basicLibrary.style.display = 'none';
            extendedLibrary.style.display = 'block';
            toggleIcon.className = 'fas fa-compress me-1';
            toggleText.textContent = 'Show Basic Library';
            this.extendedModeActive = true;

            // Load CCD data if not already loaded
            if (!this.ccdSugars) {
                extendedLibrary.innerHTML = '<div class="text-muted small mb-2">Loading CCD sugar database...</div>';
                const ccdData = await this.loadCCDSugars();
                
                if (ccdData && Object.keys(ccdData).length > 0) {
                    this.renderExtendedLibrary(ccdData);
                } else {
                    // Fallback if no data loaded
                    extendedLibrary.innerHTML = `
                        <div class="alert alert-warning">
                            <h6>⚠️ CCD Database Loading Failed</h6>
                            <p>Could not load the CCD sugar database. This might be due to:</p>
                            <ul>
                                <li>File access restrictions (try running with a local server)</li>
                                <li>Missing ccd.csv file</li>
                                <li>Network issues</li>
                            </ul>
                            <p>Please check the browser console for more details.</p>
                        </div>
                    `;
                }
            } else {
                this.renderExtendedLibrary(this.ccdSugars);
            }
        } else {
            // Show basic library
            basicLibrary.style.display = 'grid';
            extendedLibrary.style.display = 'none';
            toggleIcon.className = 'fas fa-expand me-1';
            toggleText.textContent = 'Show All CCD Sugars';
            this.extendedModeActive = false;
        }
    }

    renderExtendedLibrary(ccdData) {
        
        const extendedLibrary = document.getElementById('extendedSugarLibrary');
        if (!extendedLibrary) {
            return;
        }
        
        // Priority order for classes
        const classOrder = ['Hexose', 'Pentose', 'HexNAc', 'HexA', 'DeoxyHex', 'HexN'];
        const sortedClasses = [...classOrder];
        
        // Add any remaining classes
        Object.keys(ccdData).forEach(cls => {
            if (!classOrder.includes(cls)) {
                sortedClasses.push(cls);
            }
        });


        let html = '';
        let renderedSections = 0;
        
        for (const className of sortedClasses) {
            const sugars = ccdData[className];
            
            if (!sugars || sugars.length === 0) {
                continue;
            }

            const classHTML = `
                <div class="sugar-class-section mb-3">
                    <div class="sugar-class-header" onclick="toggleClassSection('${className}')">
                        <h6 class="mb-0">
                            <i class="fas fa-chevron-right me-2 class-toggle-icon" id="toggle_${className}"></i>
                            ${className} (${sugars.length})
                        </h6>
                    </div>
                    <div class="sugar-class-content" id="class_${className}" style="display: none;">
                        <div class="sugar-palette">
                            ${this.renderClassSugars(sugars, className)}
                        </div>
                    </div>
                </div>
            `;
            
            html += classHTML;
            renderedSections++;
        }


        const finalHTML = html + `
            <style>
                .sugar-class-section {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: white;
                    margin-bottom: 10px;
                }
                
                .sugar-class-header {
                    padding: 10px 15px;
                    background: #f8f9fa;
                    border-radius: 8px 8px 0 0;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .sugar-class-header:hover {
                    background: #e9ecef;
                }
                
                .sugar-class-content {
                    padding: 15px;
                }
                
                .class-toggle-icon {
                    transition: transform 0.2s;
                }
                
                .class-toggle-icon.expanded {
                    transform: rotate(90deg);
                }
            </style>
        `;

        extendedLibrary.innerHTML = finalHTML;

        // Re-setup event listeners for new sugar items
        this.setupExtendedEventListeners();
    }

    renderClassSugars(sugars, className) {
        // Group sugars by monosaccharide name to avoid duplicates
        const groupedSugars = {};
        
        sugars.forEach(sugar => {
            const key = sugar.name;
            if (!groupedSugars[key]) {
                groupedSugars[key] = [];
            }
            groupedSugars[key].push(sugar);
        });

        let html = '';
        
        for (const [name, variants] of Object.entries(groupedSugars)) {
            // Pick the most common variant (preferably D-alpha-Pyr)
            const preferredVariant = variants.find(v => 
                v.stereochemistry === 'D' && v.anomeric === 'alpha' && v.ring === 'Pyr'
            ) || variants[0];

            const sugarKey = `${preferredVariant.abbreviation.toLowerCase()}_${preferredVariant.ccd}`;
            const shape = this.getSNFGShapeForClass(className);
            const color = this.getSNFGColorForSugar(preferredVariant);

            html += `
                <div class="sugar-item" data-sugar="${sugarKey}" data-ccd="${preferredVariant.ccd}" 
                     data-class="${className}" data-config="${preferredVariant.stereochemistry}-${preferredVariant.anomeric}-${preferredVariant.ring}">
                    <div class="snfg-icon-container">
                        ${this.generateSNFGIcon(shape, color, preferredVariant.abbreviation)}
                    </div>
                    <div class="sugar-label">${preferredVariant.abbreviation}<br><small>${preferredVariant.ccd}</small></div>
                </div>
            `;
        }

        return html;
    }

    setupExtendedEventListeners() {
        // Re-setup event listeners for new sugar items
        document.querySelectorAll('#extendedSugarLibrary .sugar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const sugarType = item.dataset.sugar;
                const ccdCode = item.dataset.ccd;
                this.selectSugar(sugarType, item);
            });
        });
    }

    getSNFGShapeForClass(className) {
        const shapeMap = {
            'Hexose': 'circle',
            'Pentose': 'star',
            'HexNAc': 'square',
            'HexA': 'circle', // Will be filled differently
            'DeoxyHex': 'triangle',
            'HexN': 'square'
        };
        return shapeMap[className] || 'circle';
    }

    getSNFGColorForSugar(sugar) {
        // Simplified color mapping based on sugar name
        const colorMap = {
            'Glc': '#0073e6', 'GlcNAc': '#0073e6', 'GlcA': '#0073e6',
            'Gal': '#ffcc00', 'GalNAc': '#ffcc00', 'GalA': '#ffcc00',
            'Man': '#00b050', 'ManNAc': '#00b050', 'ManA': '#00b050',
            'Fuc': '#ff0000',
            'Xyl': '#ff9500',
            'Ara': '#00ff00',
            'Rha': '#ff69b4'
        };
        return colorMap[sugar.abbreviation] || '#666666';
    }

    generateSNFGIcon(shape, color, label) {
        let svgContent = '';
        const size = 40;
        const center = size / 2;
        const strokeWidth = 2;

        switch (shape) {
            case 'circle':
                svgContent = `<circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
            case 'square':
                svgContent = `<rect x="${strokeWidth}" y="${strokeWidth}" width="${size - strokeWidth*2}" height="${size - strokeWidth*2}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}" rx="4"/>`;
                break;
            case 'triangle':
                svgContent = `<polygon points="${center},${strokeWidth*2} ${size-strokeWidth*2},${size-strokeWidth*2} ${strokeWidth*2},${size-strokeWidth*2}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
            case 'star':
                const outerRadius = center - strokeWidth*2;
                const innerRadius = outerRadius * 0.4;
                const starPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const r = i % 2 === 0 ? outerRadius : innerRadius;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    starPoints.push(`${x},${y}`);
                }
                svgContent = `<polygon points="${starPoints.join(' ')}" fill="${color}" stroke="#000" stroke-width="${strokeWidth}"/>`;
                break;
        }

        return `
            <svg width="${size}" height="${size}" class="snfg-icon">
                ${svgContent}
            </svg>
        `;
    }
}

// Global instance
let simpleGlycanBuilder = null;

// Global functions for HTML onclick handlers
function toggleSugarLibraryMode() {
    if (simpleGlycanBuilder) {
        simpleGlycanBuilder.toggleExtendedLibrary();
    }
}

function toggleClassSection(className) {
    const content = document.getElementById(`class_${className}`);
    const icon = document.getElementById(`toggle_${className}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.add('expanded');
    } else {
        content.style.display = 'none';
        icon.classList.remove('expanded');
    }
}

function restoreOriginalDrawer() {
    const container = document.getElementById('sugarDrawerContainer');
    container.innerHTML = `
        <div class="text-center p-4">
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>SugarDrawer Integration Area</strong><br>
                This area can host the full SugarDrawer component from GitLab when available.
                <br><br>
                <div class="btn-group">
                    <button class="btn btn-primary btn-sm" onclick="simulateGlycanDraw()">
                        <i class="fas fa-paint-brush me-1"></i>Simulate Structure
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="loadSimpleBuilder()">
                        <i class="fas fa-cube me-1"></i>Use SNFG Builder
                    </button>
                </div>
                <br><br>
                <small class="text-muted">
                    The SNFG Builder provides a simplified interface with standardized sugar symbols.<br>
                    Future versions will integrate the full SugarDrawer component for advanced features.
                </small>
            </div>
        </div>
    `;
}

function loadSimpleBuilder() {
    // Reinitialize the simple glycan builder
    if (simpleGlycanBuilder) {
        simpleGlycanBuilder.createInterface();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        simpleGlycanBuilder = new SimpleGlycanBuilder();
        window.simpleGlycanBuilder = simpleGlycanBuilder; // Make it globally accessible
        simpleGlycanBuilder.init();
    }, 2000);
});
