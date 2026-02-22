/**
 * DIAGONAL WAVE LOADING ANIMATION
 * Full-screen edge-to-edge grid with mathematically accurate diagonal progression
 */

class DiagonalWaveLoader {
    constructor() {
        this.loaderContainer = document.getElementById('loaderContainer');
        this.mainContent = document.getElementById('mainContent');
        this.squares = [];
        this.gridConfig = {
            rows: 0,
            cols: 0,
            squareSize: 80
        };
        this.animationConfig = {
            diagonalDelay: 20, // ms between diagonal waves
            transitionDuration: 400, // CSS transition duration
            pauseBetweenPhases: 10 // pause between appear and disappear
        };
        
        this.init();
    }

    init() {
        this.calculateGrid();
        this.setupGridLayout();
        this.generateSquares();
        this.startAppearanceWave();
    }

    /**
     * Calculate optimal grid dimensions for viewport
     */
    calculateGrid() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        // Responsive square sizing
        if (vw < 480) {
            this.gridConfig.squareSize = 50;
        } else if (vw < 768) {
            this.gridConfig.squareSize = 65;
        } else if (vw < 1200) {
            this.gridConfig.squareSize = 75;
        } else {
            this.gridConfig.squareSize = 85;
        }
        
        // Calculate rows and columns (edge-to-edge, no gaps)
        this.gridConfig.cols = Math.ceil(vw / this.gridConfig.squareSize);
        this.gridConfig.rows = Math.ceil(vh / this.gridConfig.squareSize);
    }

    /**
     * Set up CSS Grid layout on container
     */
    setupGridLayout() {
        const size = this.gridConfig.squareSize;
        this.loaderContainer.style.gridTemplateColumns = `repeat(${this.gridConfig.cols}, ${size}px)`;
        this.loaderContainer.style.gridTemplateRows = `repeat(${this.gridConfig.rows}, ${size}px)`;
    }

    /**
     * Generate all grid squares
     */
    generateSquares() {
        const fragment = document.createDocumentFragment();
        
        for (let row = 0; row < this.gridConfig.rows; row++) {
            for (let col = 0; col < this.gridConfig.cols; col++) {
                const square = document.createElement('div');
                square.className = 'grid-square';
                
                // Calculate diagonal index (top-left = 0, bottom-right = max)
                const diagonalIndex = row + col;
                
                // Store for later use
                square.dataset.row = row;
                square.dataset.col = col;
                square.dataset.diagonal = diagonalIndex;
                
                fragment.appendChild(square);
                this.squares.push({
                    element: square,
                    row,
                    col,
                    diagonal: diagonalIndex
                });
            }
        }
        
        this.loaderContainer.appendChild(fragment);
    }

    /**
     * Start appearance wave (top-left to bottom-right)
     */
    startAppearanceWave() {
        const maxDiagonal = this.gridConfig.rows + this.gridConfig.cols - 2;
        
        // Group squares by diagonal
        const diagonals = this.groupByDiagonal();
        
        // Animate each diagonal group
        Object.keys(diagonals).forEach(diagonal => {
            const delay = parseInt(diagonal) * this.animationConfig.diagonalDelay;
            
            setTimeout(() => {
                diagonals[diagonal].forEach(square => {
                    square.element.classList.add('appear');
                });
            }, delay);
        });
        
        // Calculate when appearance wave completes
        const appearanceDuration = maxDiagonal * this.animationConfig.diagonalDelay + 
                                   this.animationConfig.transitionDuration;
        
        // Start disappearance wave after pause
        setTimeout(() => {
            this.startDisappearanceWave();
        }, appearanceDuration + this.animationConfig.pauseBetweenPhases);
    }

    /**
     * Start disappearance wave (top-left to bottom-right)
     */
    startDisappearanceWave() {
        const maxDiagonal = this.gridConfig.rows + this.gridConfig.cols - 2;
        
        // Group squares by diagonal
        const diagonals = this.groupByDiagonal();
        
        // Animate each diagonal group
        Object.keys(diagonals).forEach(diagonal => {
            const delay = parseInt(diagonal) * this.animationConfig.diagonalDelay;
            
            setTimeout(() => {
                diagonals[diagonal].forEach(square => {
                    square.element.classList.remove('appear');
                    square.element.classList.add('disappear');
                });
            }, delay);
        });
        
        // Calculate when disappearance wave completes
        const disappearanceDuration = maxDiagonal * this.animationConfig.diagonalDelay + 
                                      this.animationConfig.transitionDuration;
        
        // Fade out loader and reveal main content (crossfade)
        setTimeout(() => {
            this.crossfadeToContent();
        }, disappearanceDuration - 200); // Start slightly before completion for smooth crossfade
    }

    /**
     * Group squares by diagonal index
     */
    groupByDiagonal() {
        const groups = {};
        
        this.squares.forEach(square => {
            const diagonal = square.diagonal;
            if (!groups[diagonal]) {
                groups[diagonal] = [];
            }
            groups[diagonal].push(square);
        });
        
        return groups;
    }

    /**
     * Crossfade from loader to main content
     */
    crossfadeToContent() {
        // Fade out loader
        this.loaderContainer.classList.add('fade-out');
        
        // Reveal main content (crossfade overlap)
        setTimeout(() => {
            this.mainContent.classList.add('reveal');
            document.body.style.overflow = 'auto';
        }, 100);
        
        // Remove loader from DOM
        setTimeout(() => {
            this.loaderContainer.remove();
        }, 800);
    }
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DiagonalWaveLoader();
    });
} else {
    new DiagonalWaveLoader();
}
