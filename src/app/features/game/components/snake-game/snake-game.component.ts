import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
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

  @ViewChild('boardRef') boardRef!: ElementRef;

  gridArray: number[] = [];

  constructor(public game: SnakeGameService) {}

  ngOnInit() {
    this.gridArray = Array(this.game.gridSize).fill(0);
    this.game.startGame();
  }

  /* 🧠 HELPERS */
  isSnake(x: number, y: number): boolean {
    return this.game.snake.some(s => s.x === x && s.y === y);
  }

  isFood(x: number, y: number): boolean {
    return this.game.food?.x === x && this.game.food?.y === y;
  }

  /* 💻 DESKTOP CONTROL */
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

  /* 📱 TAP ANYWHERE CONTROL (MAIN FEATURE) */
  onTouch(event: TouchEvent) {
    const touch = event.touches[0];

    const rect = this.boardRef.nativeElement.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;

    // Decide direction based on tap position
    if (Math.abs(dx) > Math.abs(dy)) {
      this.game.changeDirection(dx > 0
        ? { x: 1, y: 0 }
        : { x: -1, y: 0 });
    } else {
      this.game.changeDirection(dy > 0
        ? { x: 0, y: 1 }
        : { x: 0, y: -1 });
    }
  }

  /* 🔄 RESTART */
  restart() {
    this.game.startGame();
  }

  trackByFn(i: number) {
    return i;
  }
}