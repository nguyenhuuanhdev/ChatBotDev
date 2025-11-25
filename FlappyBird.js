const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let bestScore = parseInt(localStorage.getItem('flappyBirdBestScore')) || 0;
let frames = 0;

// Bird object
const bird = {
    x: 80,
    y: 300,
    width: 30,
    height: 25,
    velocity: 0,
    gravity: 0.2,
    jumpPower: -5,
    rotation: 0,
    color: '#FFD700'
};

// Pipes array
let pipes = [];
const pipeWidth = 60;
const pipeGap = 200;
const pipeSpeed = 1.5;

// Particles array
let particles = [];

// Initialize best score display
document.getElementById('bestScore').textContent = bestScore;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
            bird.velocity = bird.jumpPower;
            createParticles(bird.x, bird.y);
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        bird.velocity = bird.jumpPower;
        createParticles(bird.x, bird.y);
    }
});

// Create particles effect
function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x + Math.random() * 20 - 10,
            y: y + Math.random() * 20 - 10,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 4 - 2,
            life: 30,
            color: `hsl(${Math.random() * 60 + 30}, 100%, 70%)`
        });
    }
}

// Start game function
function startGame() {
    gameState = 'playing';
    document.getElementById('startScreen').style.display = 'none';
    resetGame();
    gameLoop();
}

// Reset game function
function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes = [];
    particles = [];
    score = 0;
    frames = 0;
    updateScore();
}

// Restart game function
function restartGame() {
    gameState = 'playing';
    document.getElementById('gameOver').style.display = 'none';
    resetGame();
}

// Reset to start screen function
function resetToStart() {
    gameState = 'start';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    resetGame();
    // Reset best score
    // bestScore = 0;
    // localStorage.setItem('flappyBirdBestScore', 0);
    // document.getElementById('bestScore').textContent = 0;
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBirdBestScore', bestScore);
        document.getElementById('bestScore').textContent = bestScore;
    }
}

// Draw bird with animation
function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

    // Calculate rotation based on velocity
    bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 30);
    ctx.rotate(bird.rotation * Math.PI / 180);

    // Draw bird body with gradient
    const gradient = ctx.createLinearGradient(-bird.width / 2, -bird.height / 2, bird.width / 2, bird.height / 2);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');

    ctx.fillStyle = gradient;
    ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);

    // Draw bird outline
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.strokeRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);

    // Draw eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(7, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw beak
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(bird.width / 2, 0);
    ctx.lineTo(bird.width / 2 + 10, -2);
    ctx.lineTo(bird.width / 2 + 10, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Draw pipes with 3D effect
function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        topGradient.addColorStop(0, '#228B22');
        topGradient.addColorStop(0.5, '#32CD32');
        topGradient.addColorStop(1, '#006400');

        ctx.fillStyle = topGradient;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Top pipe cap
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipeWidth + 10, 30);

        // Bottom pipe
        const bottomGradient = ctx.createLinearGradient(pipe.x, pipe.topHeight + pipeGap, pipe.x + pipeWidth, canvas.height);
        bottomGradient.addColorStop(0, '#228B22');
        bottomGradient.addColorStop(0.5, '#32CD32');
        bottomGradient.addColorStop(1, '#006400');

        ctx.fillStyle = bottomGradient;
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);

        // Bottom pipe cap
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x - 5, pipe.topHeight + pipeGap, pipeWidth + 10, 30);

        // Add shine effect
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(pipe.x + 5, 0, 8, pipe.topHeight);
        ctx.fillRect(pipe.x + 5, pipe.topHeight + pipeGap, 8, canvas.height - pipe.topHeight - pipeGap);
    });
}

// Draw particles
function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.save();
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
}

// Draw ground
function drawGround() {
    const groundHeight = 50;
    const groundGradient = ctx.createLinearGradient(0, canvas.height - groundHeight, 0, canvas.height);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(0.5, '#A0522D');
    groundGradient.addColorStop(1, '#654321');

    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // Add grass texture
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < canvas.width; i += 10) {
        ctx.fillRect(i, canvas.height - groundHeight, 2, 10);
    }
}

// Update bird physics
function updateBird() {
    if (gameState !== 'playing') return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check ground collision
    if (bird.y + bird.height > canvas.height - 50) {
        gameOver();
    }

    // Check ceiling collision
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

// Update pipes
function updatePipes() {
    if (gameState !== 'playing') return;

    // Add new pipe - increased spacing
    if (frames % 120 === 0) {
        const topHeight = Math.random() * (canvas.height - pipeGap - 150) + 75;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            scored: false
        });
    }

    // Update existing pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Check if bird passed pipe
        if (!pipe.scored && bird.x > pipe.x + pipeWidth) {
            pipe.scored = true;
            score++;
            updateScore();
            createParticles(bird.x + 20, bird.y);
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }

        // Check collision
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)) {
            gameOver();
        }
    });
}

// Game over function
function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalBestScore').textContent = bestScore;
    document.getElementById('gameOver').style.display = 'block';

    // Create explosion effect
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: bird.x + Math.random() * 40 - 20,
            y: bird.y + Math.random() * 40 - 20,
            vx: Math.random() * 8 - 4,
            vy: Math.random() * 8 - 4,
            life: 60,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background elements
    drawGround();
    drawPipes();
    drawBird();
    drawParticles();

    // Update game objects
    updateBird();
    updatePipes();

    frames++;

    // Continue game loop
    if (gameState === 'playing' || particles.length > 0) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize game
document.getElementById('bestScore').textContent = bestScore;


//âm thanh game
// Khởi tạo đối tượng âm thanh
const flapSound = new Audio('img/click.mp3');
const dieSound = new Audio('img/die.mp3');

// Phát âm khi click/tap hoặc bấm Space
function playFlap() {
    flapSound.currentTime = 0;
    flapSound.play();
}

// Thay đổi trong event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
            bird.velocity = bird.jumpPower;
            createParticles(bird.x, bird.y);
            playFlap();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        bird.velocity = bird.jumpPower;
        createParticles(bird.x, bird.y);
        playFlap();
    }
});

// Phát âm game over
function gameOver() {
    if (gameState === 'gameOver') return;
    gameState = 'gameOver';
    dieSound.play();

    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalBestScore').textContent = bestScore;
    document.getElementById('gameOver').style.display = 'block';

    // Hiệu ứng particle như trước
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: bird.x + Math.random() * 40 - 20,
            y: bird.y + Math.random() * 40 - 20,
            vx: Math.random() * 8 - 4,
            vy: Math.random() * 8 - 4,
            life: 60,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}
