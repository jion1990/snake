const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [];
let food = { x: 0, y: 0 };
let dx = 1;
let dy = 0;
let score = 0;
let gameLoop = null;
let gameSpeed = 100;

function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    score = 0;
    scoreElement.textContent = score;
    dx = 1;
    dy = 0;
    placeFood();
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCountY);
    
    // تأكد من أن الطعام لا يظهر على جسم الثعبان
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            break;
        }
    }
}

function drawGame() {
    // مسح الشاشة
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // رسم الطعام
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // رسم الثعبان
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // التحقق من الاصطدام بالحدود
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCountY - 1;
    if (head.y >= tileCountY) head.y = 0;
    
    // التحقق من الاصطدام بالجسم
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // التحقق من أكل الطعام
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        placeFood();
        gameSpeed = Math.max(50, gameSpeed - 2); // زيادة السرعة
    } else {
        snake.pop();
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    alert('انتهت اللعبة! النتيجة: ' + score);
    startButton.disabled = false;
}

function gameUpdate() {
    moveSnake();
    drawGame();
}

startButton.addEventListener('click', () => {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    initGame();
    gameLoop = setInterval(gameUpdate, gameSpeed);
    startButton.disabled = true;
});

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});
