
class PuzzleGame {  
    constructor() {  
        // Game Container Elements  
        this.puzzleContainer = document.getElementById('puzzleContainer');  
        this.levelSelect = document.getElementById('levelSelect');  
        this.shuffleBtn = document.getElementById('shuffleBtn');  
        this.themeSwitch = document.getElementById('theme-switch');  
        this.timerDisplay = document.getElementById('timer');  
        
        // Start Screen Elements  
        this.startScreen = document.getElementById('start-screen');  
        this.gameContainer = document.getElementById('game-container');  
        this.startBtn = document.getElementById('start-btn');  
        
        // Game State Variables  
        this.pieces = [];  
        this.emptyIndex = 0;  
        this.currentLevel = 1;  
        this.gridSize = 3;  
        this.moveCount = 0;  

        // Timer Variables  
        this.startTime = 0;  
        this.elapsedTime = 0;  
        this.timerInterval = null;  

        // Initialize Game  
        this.initEventListeners();  
        this.loadTheme();  
    }  

    initEventListeners() {  
        this.levelSelect.addEventListener('change', () => this.loadLevel());  
        this.shuffleBtn.addEventListener('click', () => this.shufflePuzzle());  
        this.themeSwitch.addEventListener('change', () => this.toggleTheme());  
        this.startBtn.addEventListener('click', () => this.startGame());  
    }  

    startGame() {  
        this.startScreen.classList.add('hidden');  
        this.gameContainer.classList.remove('hidden');  
        this.createPuzzleBoard(this.currentLevel);  
        this.startTimer();  
    }  

    startTimer() {  
        this.startTime = Date.now() - (this.elapsedTime || 0);  
        this.timerInterval = setInterval(() => {  
            this.elapsedTime = Date.now() - this.startTime;  
            this.updateTimerDisplay();  
        }, 1000);  
    }  

    stopTimer() {  
        clearInterval(this.timerInterval);  
    }  

    resetTimer() {  
        this.stopTimer();  
        this.elapsedTime = 0;  
        this.updateTimerDisplay();  
    }  

    updateTimerDisplay() {  
        const seconds = Math.floor(this.elapsedTime / 1000) % 60;  
        const minutes = Math.floor(this.elapsedTime / (1000 * 60));  
        this.timerDisplay.textContent = `Time: ${  
            minutes.toString().padStart(2, '0')  
        }:${  
            seconds.toString().padStart(2, '0')  
        }`;  
    }  

    createPuzzleBoard(level) {  
        this.puzzleContainer.innerHTML = '';  
        this.pieces = [];  
        this.gridSize = level + 2;  
        this.moveCount = 0;  
        this.resetTimer();  

        this.puzzleContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;  
        this.puzzleContainer.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;  

        // Generate a solvable puzzle  
        const totalPieces = this.gridSize * this.gridSize;  
        let puzzle;  
        do {  
            puzzle = this.generateSolvablePuzzle(totalPieces);  
        } while (!this.isSolvable(puzzle, this.gridSize));  

        for (let i = 0; i < totalPieces; i++) {  
            const piece = document.createElement('div');  
            piece.classList.add('puzzle-piece');  
            piece.dataset.index = i;  

            if (puzzle[i] === totalPieces) {  
                piece.classList.add('empty');  
                piece.textContent = '';  
                this.emptyIndex = i;  
            } else {  
                piece.textContent = puzzle[i];  
            }  

            piece.addEventListener('click', () => this.movePiece(i));  
            this.puzzleContainer.appendChild(piece);  
            this.pieces.push(piece);  
        }  

        // Start timer when board is created  
        this.startTimer();  
    }  

    generateSolvablePuzzle(totalPieces) {
        // Create initial solved state
        const solvedPuzzle = Array.from({ length: totalPieces }, (_, i) => i + 1);
        this.emptyIndex = totalPieces - 1; // Reset empty tile to last position

        // Shuffle while maintaining solvability by doing legal moves
        for (let i = 0; i < totalPieces * 10; i++) {
            const adjacentIndices = this.getAdjacentEmptyIndices();
            if (adjacentIndices.length > 0) {
                const randomIndex = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];
                this.swapPuzzlePieces(solvedPuzzle, this.emptyIndex, randomIndex);
                this.emptyIndex = randomIndex;
            }
        }

        return solvedPuzzle;
    }

    isSolvable(puzzle, gridSize) {
        // Remove empty tile from puzzle for inversion count.
        const arr = puzzle.filter((num) => num !== gridSize * gridSize);

        let inversionCount = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) inversionCount++;
            }
        }

        if (gridSize % 2 !== 0) {
            // Odd grid size - solvable if inversion count even
            return inversionCount % 2 === 0;
        } else {
            // Even grid size - check blank position as well
            const emptyRowFromBottom = gridSize - Math.floor(this.emptyIndex / gridSize);
            if (emptyRowFromBottom % 2 === 0) {
                return inversionCount % 2 !== 0;
            } else {
                return inversionCount % 2 === 0;
            }
        }
    }

    getAdjacentEmptyIndices() {
        const adjacentIndices = [];
        const possibleMoves = [
            this.emptyIndex - this.gridSize,  // Up
            this.emptyIndex + this.gridSize,  // Down
            this.emptyIndex - 1,              // Left
            this.emptyIndex + 1               // Right
        ];

        possibleMoves.forEach(move => {
            if (move >= 0 && move < this.gridSize * this.gridSize) {
                const currentRow = Math.floor(this.emptyIndex / this.gridSize);
                const currentCol = this.emptyIndex % this.gridSize;
                const moveRow = Math.floor(move / this.gridSize);
                const moveCol = move % this.gridSize;

                if (
                    (Math.abs(currentRow - moveRow) === 1 && currentCol === moveCol) ||
                    (Math.abs(currentCol - moveCol) === 1 && currentRow === moveRow)
                ) {
                    adjacentIndices.push(move);
                }
            }
        });

        return adjacentIndices;
    }

    swapPuzzlePieces(puzzle, index1, index2) {
        [puzzle[index1], puzzle[index2]] = [puzzle[index2], puzzle[index1]];
    }

    movePiece(clickedIndex) {
        if (this.isAdjacent(clickedIndex, this.emptyIndex)) {
            this.moveCount++;
            this.swapPieces(clickedIndex, this.emptyIndex);
            this.emptyIndex = clickedIndex;
            
            // Check for win
            if (this.checkWin()) {
                this.handleWin();
            }
        }
    }

    isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / this.gridSize);
        const col1 = index1 % this.gridSize;
        const row2 = Math.floor(index2 / this.gridSize);
        const col2 = index2 % this.gridSize;

        return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1);
    }

    swapPieces(index1, index2) {
        const piece1 = this.pieces[index1];
        const piece2 = this.pieces[index2];

        // Add move animation
        piece1.classList.add('move');
        piece2.classList.add('move');

        // Swap text content
        const temp = piece1.textContent;
        piece1.textContent = piece2.textContent;
        piece2.textContent = temp;

        // Toggle empty class
        piece1.classList.toggle('empty');
        piece2.classList.toggle('empty');

        // Remove animation class after animation
        setTimeout(() => {
            piece1.classList.remove('move');
            piece2.classList.remove('move');
        }, 300);
    }

    checkWin() {
        const currentOrder = this.pieces.map(piece => 
            piece.textContent === '' ? this.gridSize * this.gridSize : parseInt(piece.textContent)
        );

        const correctOrder = Array.from({length: this.gridSize * this.gridSize}, (_, i) => i + 1);
        
        return JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    }

    handleWin() {  
        this.stopTimer();  
        alert(`Congratulations! You solved the puzzle in ${this.moveCount} moves and ${  
            Math.floor(this.elapsedTime / 1000)  
        } seconds!`);  
        this.shufflePuzzle();  
    }  

    shufflePuzzle() {
        this.createPuzzleBoard(this.currentLevel);
    }

    loadLevel() {
        this.currentLevel = parseInt(this.levelSelect.value);
        this.createPuzzleBoard(this.currentLevel);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeSwitch.checked = true;
        }
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    const puzzleGame = new PuzzleGame();
});
