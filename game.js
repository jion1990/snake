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
let touchStartX = null;
let touchStartY = null;

// تحديث حجم Canvas ليناسب الشاشة
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const scale = containerWidth / canvas.width;
    
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = (canvas.height * scale) + 'px';
}

// استدعاء دالة تغيير الحجم عند تحميل الصفحة وتغيير حجم النافذة
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

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

// إضافة مستمعي الأحداث لأزرار التحكم
document.getElementById('upButton').addEventListener('click', () => {
    if (dy === 0) { dx = 0; dy = -1; }
});

document.getElementById('downButton').addEventListener('click', () => {
    if (dy === 0) { dx = 0; dy = 1; }
});

document.getElementById('leftButton').addEventListener('click', () => {
    if (dx === 0) { dx = -1; dy = 0; }
});

document.getElementById('rightButton').addEventListener('click', () => {
    if (dx === 0) { dx = 1; dy = 0; }
});

// إضافة دعم اللمس للأجهزة المحمولة
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // تحديد الاتجاه بناءً على حركة اللمس
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // حركة أفقية
        if (deltaX > 0 && dx === 0) {
            dx = 1;
            dy = 0;
        } else if (deltaX < 0 && dx === 0) {
            dx = -1;
            dy = 0;
        }
    } else {
        // حركة رأسية
        if (deltaY > 0 && dy === 0) {
            dx = 0;
            dy = 1;
        } else if (deltaY < 0 && dy === 0) {
            dx = 0;
            dy = -1;
        }
    }
    
    touchStartX = null;
    touchStartY = null;
});
