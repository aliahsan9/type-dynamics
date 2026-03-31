import { Injectable } from '@angular/core';

export interface Point {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class SnakeGameService {

  gridSize = 20;

  snake: Point[] = [];
  food!: Point;

  direction: Point = { x: 1, y: 0 };
  nextDirection: Point = { x: 1, y: 0 };

  score = 0;
  speed = 120;
  minSpeed = 60;

  gameOver = false;

  private lastMoveTime = 0;

  // sounds
  eatSound = new Audio('assets/sounds/eat.mp3');
  gameOverSound = new Audio('assets/sounds/gameover.mp3');

  startGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    this.score = 0;
    this.speed = 120;
    this.gameOver = false;

    this.spawnFood();
    this.gameLoop(0);
  }

  gameLoop = (timestamp: number) => {
    if (this.gameOver) return;

    if (timestamp - this.lastMoveTime > this.speed) {
      this.update();
      this.lastMoveTime = timestamp;
    }

    requestAnimationFrame(this.gameLoop);
  };

  update() {
    this.direction = this.nextDirection;

    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

    // collision
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= this.gridSize || head.y >= this.gridSize ||
      this.snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      this.endGame();
      return;
    }

    this.snake.unshift(head);

    // eat food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.eatSound.play();

      // increase speed
      this.speed = Math.max(this.minSpeed, this.speed - 3);

      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }

  spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };
  }

  changeDirection(dir: Point) {
    if (
      this.direction.x + dir.x === 0 &&
      this.direction.y + dir.y === 0
    ) return;

    this.nextDirection = dir;
  }

  endGame() {
    this.gameOver = true;
    this.gameOverSound.play();
  }
}