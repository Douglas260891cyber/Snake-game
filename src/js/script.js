// Configurações do canvas e dimensões do jogo
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
const BOX_SIZE = 32;
const GRID_SIZE = 16;
const GAME_SPEED = 100;

// Estado do jogo
let snake = [{ x: 8 * BOX_SIZE, y: 8 * BOX_SIZE }];
let direction = "right";
let nextDirection = "right";
let food = generateFood();
let gameInterval;

// Gera posição aleatória para a comida
function generateFood() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
        y: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE
    };
}

// Desenha o fundo do jogo
function drawBackground() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, GRID_SIZE * BOX_SIZE, GRID_SIZE * BOX_SIZE);
}

// Desenha a cobra
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, BOX_SIZE, BOX_SIZE);
    }
}

// Desenha a comida
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, BOX_SIZE, BOX_SIZE);
}

// Controla a direção da cobra com as setas do teclado
function handleKeyPress(event) {
    // Impede movimento direto para trás
    if (event.keyCode === 37 && direction !== "right") nextDirection = "left";    // Esquerda
    if (event.keyCode === 38 && direction !== "down") nextDirection = "up";       // Cima
    if (event.keyCode === 39 && direction !== "left") nextDirection = "right";    // Direita
    if (event.keyCode === 40 && direction !== "up") nextDirection = "down";       // Baixo
}

document.addEventListener("keydown", handleKeyPress);

// Loop principal do jogo
function gameLoop() {
    // Atualiza a direção para evitar múltiplas mudanças em um frame
    direction = nextDirection;

    // Teleporta a cobra ao sair da tela
    let head = snake[0];
    if (head.x > GRID_SIZE * BOX_SIZE && direction === "right") head.x = 0;
    if (head.x < 0 && direction === "left") head.x = GRID_SIZE * BOX_SIZE;
    if (head.y > GRID_SIZE * BOX_SIZE && direction === "down") head.y = 0;
    if (head.y < 0 && direction === "up") head.y = GRID_SIZE * BOX_SIZE;

    // Verifica colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameInterval);
            alert("Game Over :(");
            location.reload();
            return;
        }
    }

    // Desenha o jogo
    drawBackground();
    drawSnake();
    drawFood();

    // Calcula nova posição da cabeça
    let newHeadX = head.x;
    let newHeadY = head.y;

    if (direction === "right") newHeadX += BOX_SIZE;
    if (direction === "left") newHeadX -= BOX_SIZE;
    if (direction === "up") newHeadY -= BOX_SIZE;
    if (direction === "down") newHeadY += BOX_SIZE;

    // Remove cauda ou gera nova comida ao comer
    if (newHeadX !== food.x || newHeadY !== food.y) {
        snake.pop();
    } else {
        food = generateFood();
    }

    // Adiciona nova cabeça
    snake.unshift({ x: newHeadX, y: newHeadY });
}

// Inicia o jogo
gameInterval = setInterval(gameLoop, GAME_SPEED);
