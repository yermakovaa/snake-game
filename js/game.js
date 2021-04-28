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

let dir;
const direction = e => {
  if (e.keyCode === 37 && dir !== 'right') dir = 'left';
  else if (e.keyCode === 38 && dir !== 'down') dir = 'up';
  else if (e.keyCode === 39 && dir !== 'left') dir = 'right';
  else if (e.keyCode === 40 && dir !== 'up') dir = 'down';
};
document.addEventListener('keydown', direction);

class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
  }
  play() {
    document.body.appendChild(this.sound);
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}

const eatSound = new Sound('./audio/EatSound.ogg');
const dieSound = new Sound('./audio/DieSound.ogg');

const forceReload = () => {
  dieSound.play();
  clearInterval(game);
  alert('Game Over! Score: ' + score);
  dieSound.stop();
  location.reload();
};

const eatTail = (head, arr) => {
  arr.forEach(el => head.x === el.x && head.y === el.y && forceReload());
};

const drawGame = () => {
  ctx.drawImage(ground, 0, 0);
  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i += 1) {
    ctx.fillStyle = i === 0 ? 'green' : 'red';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.fillText(`score: ${score}`, box * 6, box * 1.6);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (
    snakeX < box ||
    snakeX > box * 17 ||
    snakeY < 3 * box ||
    snakeY > box * 17
  )
    forceReload();

  if (snakeX === food.x && snakeY === food.y) {
    eatSound.play();
    score += 1;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  if (dir === 'left') snakeX -= box;
  if (dir === 'right') snakeX += box;
  if (dir === 'up') snakeY -= box;
  if (dir === 'down') snakeY += box;

  const newHead = {
    x: snakeX,
    y: snakeY,
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
};

const game = setInterval(drawGame, 250);
