document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const levelElement = document.getElementById('level');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const startScreen = document.getElementById('start-screen');
    const playBtn = document.getElementById('play-btn');
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    
    // Game settings
    const gridSize = 20;
    const boardWidth = canvas.width;
    const boardHeight = canvas.height;
    const gridWidth = boardWidth / gridSize;
    const gridHeight = boardHeight / gridSize;
    
    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let level = 1;
    let speed = 120; // milliseconds between updates (lower = faster)
    let gameLoop;
    
    // Load high score from local storage
    highScoreElement.textContent = highScore;
    
    // Initialize the game
    function initGame() {
        // Create initial snake (3 segments)
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        
        // Reset game state
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        level = 1;
        scoreElement.textContent = score;
        levelElement.textContent = level;
        
        // Place food
        placeFood();
        
        // Draw initial state
        draw();
    }
    
    // Place food in a random position
    function placeFood() {
        let validPosition = false;
        
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
            
            // Check if food is on any snake segment
            validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
    }
    
    // Draw the game
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1E1E1E';
        ctx.fillRect(0, 0, boardWidth, boardHeight);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Create gradient for snake
            const gradient = ctx.createLinearGradient(
                segment.x * gridSize, 
                segment.y * gridSize, 
                segment.x * gridSize + gridSize, 
                segment.y * gridSize + gridSize
            );
            
            if (index === 0) { // Head
                gradient.addColorStop(0, '#64FFDA');
                gradient.addColorStop(1, '#1DE9B6');
                ctx.fillStyle = gradient;
            } else { // Body
                const colorIntensity = 1 - (index / snake.length * 0.5);
                gradient.addColorStop(0, `rgba(100, 255, 218, ${colorIntensity})`);
                gradient.addColorStop(1, `rgba(29, 233, 182, ${colorIntensity})`);
                ctx.fillStyle = gradient;
            }
            
            // Draw segment
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // Draw eyes for the head
            if (index === 0) {
                ctx.fillStyle = '#121212';
                const eyeSize = gridSize / 5;
                
                // Eye positions based on direction
                let eyeOffsetX1, eyeOffsetY1, eyeOffsetX2, eyeOffsetY2;
                
                switch (direction) {
                    case 'up':
                        eyeOffsetX1 = gridSize / 3;
                        eyeOffsetY1 = gridSize / 3;
                        eyeOffsetX2 = gridSize * 2/3;
                        eyeOffsetY2 = gridSize / 3;
                        break;
                    case 'down':
                        eyeOffsetX1 = gridSize / 3;
                        eyeOffsetY1 = gridSize * 2/3;
                        eyeOffsetX2 = gridSize * 2/3;
                        eyeOffsetY2 = gridSize * 2/3;
                        break;
                    case 'left':
                        eyeOffsetX1 = gridSize / 3;
                        eyeOffsetY1 = gridSize / 3;
                        eyeOffsetX2 = gridSize / 3;
                        eyeOffsetY2 = gridSize * 2/3;
                        break;
                    case 'right':
                        eyeOffsetX1 = gridSize * 2/3;
                        eyeOffsetY1 = gridSize / 3;
                        eyeOffsetX2 = gridSize * 2/3;
                        eyeOffsetY2 = gridSize * 2/3;
                        break;
                }
                
                ctx.fillRect(
                    segment.x * gridSize + eyeOffsetX1, 
                    segment.y * gridSize + eyeOffsetY1, 
                    eyeSize, 
                    eyeSize
                );
                ctx.fillRect(
                    segment.x * gridSize + eyeOffsetX2, 
                    segment.y * gridSize + eyeOffsetY2, 
                    eyeSize, 
                    eyeSize
                );
            }
        });
        
        // Draw food with glow effect
        ctx.shadowColor = '#FF5252';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2, 
            food.y * gridSize + gridSize / 2, 
            gridSize / 2 - 1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw grid lines (subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        
        // Draw vertical grid lines
        for (let x = 0; x <= boardWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, boardHeight);
            ctx.stroke();
        }
        
        // Draw horizontal grid lines
        for (let y = 0; y <= boardHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(boardWidth, y);
            ctx.stroke();
        }
    }
    
    // Update game state
    function update() {
        // Update direction from nextDirection
        direction = nextDirection;
        
        // Calculate new head position
        const head = { ...snake[0] };
        
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for collisions
        if (
            head.x < 0 || 
            head.x >= gridWidth || 
            head.y < 0 || 
            head.y >= gridHeight ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = score;
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Increase level every 5 points
            if (score % 5 === 0) {
                level++;
                levelElement.textContent = level;
                
                // Speed up the game slightly
                speed = Math.max(40, speed - 5);
                clearInterval(gameLoop);
                gameLoop = setInterval(gameStep, speed);
            }
            
            // Place new food
            placeFood();
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw updated state
        draw();
    }
    
    // Game step function for the interval
    function gameStep() {
        if (!gamePaused && gameRunning) {
            update();
        }
    }
    
    // Handle key presses
    function handleKeydown(e) {
        if (!gameRunning) return;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'down') {
                    nextDirection = 'up';
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') {
                    nextDirection = 'down';
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') {
                    nextDirection = 'left';
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') {
                    nextDirection = 'right';
                }
                break;
            case 'p':
            case 'P':
                togglePause();
                break;
        }
    }
    
    // Start the game
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            gamePaused = false;
            
            initGame();
            
            // Start game loop
            gameLoop = setInterval(gameStep, speed);
            
            // Update buttons
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
        }
    }
    
    // Toggle pause state
    function togglePause() {
        if (gameRunning) {
            gamePaused = !gamePaused;
            pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        }
    }
    
    // Reset the game
    function resetGame() {
        // Clear game loop
        clearInterval(gameLoop);
        
        // Reset game state
        gameRunning = false;
        gamePaused = false;
        
        // Update buttons
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
        resetBtn.disabled = false;
        
        // Initialize game
        initGame();
    }
    
    // Game over function
    function gameOver() {
        // Stop game loop
        clearInterval(gameLoop);
        gameRunning = false;
        
        // Update buttons
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Show game over screen
        finalScoreElement.textContent = `Your score: ${score}`;
        gameOverScreen.classList.add('active');
        
        // Create win animation if score is high enough
        if (score > 10) {
            createConfetti();
        }
    }
    
    // Create confetti animation
    function createConfetti() {
        const colors = ['#FF5252', '#64FFDA', '#8A2BE2', '#FFEB3B', '#03DAC6'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle'; // Use new base class
            document.body.appendChild(confetti);
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const left = Math.random() * window.innerWidth;
            const initialRotation = Math.random() * 360; // For initial state and sway
            
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.left = `${left}px`;
            confetti.style.top = `-${size}px`; // Start above screen
            confetti.style.transform = `rotate(${initialRotation}deg)`;
            
            const fallDuration = Math.random() * 3 + 2; // e.g., 2s to 5s
            const swayDuration = (Math.random() * 1 + 0.5); // e.g., 0.5s to 1.5s for sway cycle
            const delay = Math.random() * 2;
            
            // Apply animations using names defined in CSS
            // Note: 'confetti-sway' will have its rotation overridden by the 'confetti-fall' if not careful.
            // However, 'confetti-fall' now includes rotation. We can simplify or make sway's rotation additive if needed.
            // For now, 'confetti-fall' handles the primary falling and rotation.
            // 'confetti-sway' can be for horizontal movement.
            // To make sway rotation work with fall rotation, one would typically nest elements or use JS to update transform.
            // Given the keyframes, `confetti-fall` handles rotation. `confetti-sway` will just add horizontal motion.
            confetti.style.animation = `
                confetti-fall ${fallDuration}s ease-in ${delay}s forwards,
                confetti-sway ${swayDuration}s ease-in-out ${delay}s infinite alternate
            `;
            
            // Remove confetti after animation completes (fallDuration + delay)
            setTimeout(() => {
                confetti.remove();
            }, (fallDuration + delay) * 1000);
        }
    }
    
    // Event listeners
    document.addEventListener('keydown', handleKeydown);
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', () => {
        gameOverScreen.classList.remove('active');
        resetGame();
        startGame();
    });
    
    // Start screen handlers
    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Set game speed based on selected difficulty
            speed = parseInt(option.dataset.speed);
        });
    });
    
    playBtn.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.style.display = 'none';
            startGame();
        }, 500);
    });
    
    // Initialize game on load (but don't start yet)
    initGame();
});
