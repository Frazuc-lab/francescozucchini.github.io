// Game configuration
const CONFIG = {
    canvas_width: 400,
    canvas_height: 600,
    gravity: 0.5,
    jump_force: -8,
    pipe_speed: 2,
    pipe_gap: 120,
    pipe_width: 60,
    sprite_size: 35
};

// Game state
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

// Game variables
let canvas, ctx;
let gameState = GAME_STATES.START;
let score = 0;
let pipes = [];
let pipeTimer = 0;
let frameCount = 0;

// Duck-rabbit sprite state
const duckRabbit = {
    x: CONFIG.canvas_width / 4,
    y: CONFIG.canvas_height / 2,
    velocity: 0,
    size: CONFIG.sprite_size
};

// Load duck-rabbit image safely
const duckRabbitImg = new Image();
duckRabbitImg.src = "duck-rabbit.png"; 
let duckRabbitReady = false;

duckRabbitImg.onload = () => {
  duckRabbitReady = true;
    gameLoop();  
};

// Draw duck-rabbit sprite using the PNG
function drawDuckRabbit() {
    const x = duckRabbit.x;
    const y = duckRabbit.y;
    const size = duckRabbit.size;

    if (duckRabbitReady) {
        ctx.drawImage(
            duckRabbitImg,
            x - size / 2,
            y - size / 2,
            size,
            size
        );
    } else {
        console.warn("Duck-Rabbit image not yet loaded");
    }
}
// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Add event listeners
    canvas.addEventListener('click', handleInput);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            handleInput();
        }
    });
}

// Handle user input
function handleInput() {
    if (gameState === GAME_STATES.START) {
        startGame();
    } else if (gameState === GAME_STATES.PLAYING) {
        flap();
    } else if (gameState === GAME_STATES.GAME_OVER) {
        restartGame();
    }
}

// Start the game
function startGame() {
    gameState = GAME_STATES.PLAYING;
    score = 0;
    pipes = [];
    pipeTimer = 0;
    frameCount = 0;
    duckRabbit.y = CONFIG.canvas_height / 2;
    duckRabbit.velocity = 0;
}

// Make duck-rabbit flap
function flap() {
    duckRabbit.velocity = CONFIG.jump_force;
}

// Restart game
function restartGame() {
    gameState = GAME_STATES.START;
}

// Update game logic
function update() {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    frameCount++;
    
    // Update duck-rabbit physics
    duckRabbit.velocity += CONFIG.gravity;
    duckRabbit.y += duckRabbit.velocity;
    
    // Check bounds collision
    if (duckRabbit.y > CONFIG.canvas_height - duckRabbit.size/2 || duckRabbit.y < duckRabbit.size/2) {
        gameOver();
        return;
    }
    
    // Spawn pipes every 120 frames (2 seconds at 60fps)
    pipeTimer++;
    if (pipeTimer >= 120) {
        spawnPipe();
        pipeTimer = 0;
    }
    
    // Update pipe positions and check collisions
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= CONFIG.pipe_speed;
        
        // Remove off-screen pipes and increment score
        if (pipe.x + CONFIG.pipe_width < 0) {
            pipes.splice(i, 1);
            if (!pipe.scored) {
                score++;
                pipe.scored = true;
            }
            continue;
        }
        
        // Check if sprite passed through pipe (for scoring)
        if (!pipe.scored && pipe.x + CONFIG.pipe_width < duckRabbit.x) {
            score++;
            pipe.scored = true;
        }
        
        // Check collision
        if (checkCollision(pipe)) {
            gameOver();
            return;
        }
    }
}

// Spawn new pipe
function spawnPipe() {
    const minGapY = 100;
    const maxGapY = CONFIG.canvas_height - CONFIG.pipe_gap - 100;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    
    pipes.push({
        x: CONFIG.canvas_width,
        topHeight: gapY,
        bottomY: gapY + CONFIG.pipe_gap,
        scored: false
    });
}

// Check collision with pipe
function checkCollision(pipe) {
    const spriteLeft = duckRabbit.x - duckRabbit.size/2;
    const spriteRight = duckRabbit.x + duckRabbit.size/2;
    const spriteTop = duckRabbit.y - duckRabbit.size/2;
    const spriteBottom = duckRabbit.y + duckRabbit.size/2;
    
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + CONFIG.pipe_width;
    
    // Check if sprite is within pipe's horizontal bounds
    if (spriteRight > pipeLeft && spriteLeft < pipeRight) {
        // Check collision with top or bottom pipe
        if (spriteTop < pipe.topHeight || spriteBottom > pipe.bottomY) {
            return true;
        }
    }
    
    return false;
}

// Game over
function gameOver() {
    gameState = GAME_STATES.GAME_OVER;
}

// Add this function before drawPipe
function drawHandDrawnLine(x1, y1, x2, y2, wobble = 0.8) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const steps = Math.max(Math.floor(distance / 8), 2);
    for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const x = x1 + (x2 - x1) * progress;
        const y = y1 + (y2 - y1) * progress;
        const wobbleX = (Math.random() - 0.5) * wobble;
        const wobbleY = (Math.random() - 0.5) * wobble;
        ctx.lineTo(x + wobbleX, y + wobbleY);
    }
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw hand-drawn pipe (white instead of green)
function drawPipe(pipe) {
    ctx.fillStyle = '#FFFFFF'; // white pipes

    // Top pipe
    ctx.fillRect(pipe.x, 0, CONFIG.pipe_width, pipe.topHeight);

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, CONFIG.pipe_width, CONFIG.canvas_height - pipe.bottomY);

    // Hand-drawn outlines
    drawHandDrawnLine(pipe.x, 0, pipe.x, pipe.topHeight);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width, 0, pipe.x + CONFIG.pipe_width, pipe.topHeight);
    drawHandDrawnLine(pipe.x, pipe.topHeight, pipe.x + CONFIG.pipe_width, pipe.topHeight);

    drawHandDrawnLine(pipe.x, pipe.bottomY, pipe.x, CONFIG.canvas_height);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width, pipe.bottomY, pipe.x + CONFIG.pipe_width, CONFIG.canvas_height);
    drawHandDrawnLine(pipe.x, pipe.bottomY, pipe.x + CONFIG.pipe_width, pipe.bottomY);

    // Pipe caps (light gray for subtle shading)
    ctx.fillStyle = '#DDDDDD';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, CONFIG.pipe_width + 10, 20);
    ctx.fillRect(pipe.x - 5, pipe.bottomY, CONFIG.pipe_width + 10, 20);

    // Outline the caps
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight - 20, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight - 20);
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight);
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight - 20, pipe.x - 5, pipe.topHeight);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width + 5, pipe.topHeight - 20, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight);

    drawHandDrawnLine(pipe.x - 5, pipe.bottomY, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY);
    drawHandDrawnLine(pipe.x - 5, pipe.bottomY + 20, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY + 20);
    drawHandDrawnLine(pipe.x - 5, pipe.bottomY, pipe.x - 5, pipe.bottomY + 20);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width + 5, pipe.bottomY, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY + 20);
}

// Render game
function render() {
    // Clear canvas with paper-like background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, CONFIG.canvas_width, CONFIG.canvas_height);
    
    if (gameState === GAME_STATES.START) {
        // Start screen
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Duck-Rabbit Flapper', CONFIG.canvas_width/2, CONFIG.canvas_height/2 - 80);
        
        ctx.font = '16px Arial';
        ctx.fillText('Click anywhere to start!', CONFIG.canvas_width/2, CONFIG.canvas_height/2 + 20);
        ctx.fillText('Can you see both duck and rabbit?', CONFIG.canvas_width/2, CONFIG.canvas_height/2 + 40);
        
        // Draw sample sprite
        const tempX = duckRabbit.x;
        const tempY = duckRabbit.y;
        duckRabbit.x = CONFIG.canvas_width/2;
        duckRabbit.y = CONFIG.canvas_height/2 - 30;
        drawDuckRabbit();
        duckRabbit.x = tempX;
        duckRabbit.y = tempY;
        
    } else if (gameState === GAME_STATES.PLAYING) {
        // Game playing
        
        // Draw pipes first (behind sprite)
        pipes.forEach(pipe => drawPipe(pipe));
        
        // Draw duck-rabbit sprite
        drawDuckRabbit();
        
        // Draw score
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('§. ' + score, 10, 35);
        
        // Draw instructions
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Click or SPACE to flap', CONFIG.canvas_width - 10, CONFIG.canvas_height - 10);
        
    } else if (gameState === GAME_STATES.GAME_OVER) {
        // Game over screen
        
        // Draw pipes and sprite
        pipes.forEach(pipe => drawPipe(pipe));
        drawDuckRabbit();
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, CONFIG.canvas_width, CONFIG.canvas_height);
        
        // Game over text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', CONFIG.canvas_width/2, CONFIG.canvas_height/2 - 40);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Final Score: ' + score, CONFIG.canvas_width/2, CONFIG.canvas_height/2);
        
        ctx.font = '16px Arial';
        ctx.fillText('Click to play again', CONFIG.canvas_width/2, CONFIG.canvas_height/2 + 40);
    }
}

// Main game loop
function gameLoop() {
    try {
        console.log('Frame:', gameState, duckRabbit.y.toFixed(1));
        update();
        render();
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('GAME CRASHED:', error);
        console.error('Stack trace:', error.stack);
        // Stop calling requestAnimationFrame so we can see the error
    }
}

// Initialize when page loads
window.addEventListener('load', init);
