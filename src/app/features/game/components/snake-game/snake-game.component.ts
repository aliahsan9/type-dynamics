import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import { SnakeGameService } from '../../services/snake-game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.scss']
})
export class SnakeGameComponent implements OnInit {

  gridArray: number[] = [];

  touchStartX = 0;
  touchStartY = 0;

  constructor(public game: SnakeGameService) {}

  ngOnInit() {
    this.gridArray = Array(this.game.gridSize).fill(0);
    this.game.startGame();
  }

  // FIXED (moved logic from HTML)
  isSnake(x: number, y: number): boolean {
    return this.game.snake.some(s => s.x === x && s.y === y);
  }

  isFood(x: number, y: number): boolean {
    return this.game.food?.x === x && this.game.food?.y === y;
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const map: any = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };

    if (map[event.key]) {
      this.game.changeDirection(map[event.key]);
    }
  }

  // mobile swipe
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.game.changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      this.game.changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  }

  restart() {
    this.game.startGame();
  }

  trackByFn(i: number) {
    return i;
  }
}