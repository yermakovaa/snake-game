const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = './img/ground.png';

const foodImg = new Image();
foodImg.src = './img/food.png';

let box = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

document.addEventListener('keydown', direction);

let dir;

function direction(event) {
  if (event.keyCode == 37 && dir != 'right') dir = 'left';
  else if (event.keyCode == 38 && dir != 'down') dir = 'up';
  else if (event.keyCode == 39 && dir != 'left') dir = 'right';
  else if (event.keyCode == 40 && dir != 'up') dir = 'down';
}

function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

const eatSound = new sound('./audio/EatSound.ogg');
const dieSound = new sound('./audio/DieSound.ogg');

const forceReload = () => {
  clearInterval(game);
  location.reload(true);
  dieSound.stop();
};

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (head.x == arr[i].x && head.y == arr[i].y) {
      clearInterval(game);
      alert('Game Over! Score: ' + score);
      window.location.reload();
    }
  }
}

function drawGame() {
  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i += 1) {
    ctx.fillStyle = i == 0 ? 'green' : 'red';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.fillText(`score: ${score}`, box * 6, box * 1.6);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX == food.x && snakeY == food.y) {
    eatSound.play();
    score += 1;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  if (
    snakeX < box ||
    snakeX > box * 17 ||
    snakeY < 3 * box ||
    snakeY > box * 17
  ) {
    dieSound.play();
    clearInterval(game);
    alert('Game Over! Score: ' + score);
    window.location.reload();
  }

  if (dir == 'left') snakeX -= box;
  if (dir == 'right') snakeX += box;
  if (dir == 'up') snakeY -= box;
  if (dir == 'down') snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
};

let game = setInterval(drawGame, 150);
