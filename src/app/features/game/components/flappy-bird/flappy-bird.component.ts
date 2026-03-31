import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlappyBirdService } from '../../services/flappy-bird.service';

@Component({
  selector: 'app-flappy-bird',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flappy-bird.component.html',
  styleUrls: ['./flappy-bird.component.scss']
})
export class FlappyBirdComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  showControls = true;

  constructor(public game: FlappyBirdService) {}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    
    // Responsive canvas sizing
    const container = canvas.parentElement;
    if (container) {
      const width = Math.min(450, container.clientWidth - 40);
      const height = Math.min(700, window.innerHeight - 200);
      
      canvas.width = width;
      canvas.height = height;
    } else {
      canvas.width = 400;
      canvas.height = 600;
    }

    this.game.start(canvas);

    // Hide controls after 3 seconds
    setTimeout(() => {
      this.showControls = false;
    }, 4000);
  }

  @HostListener('click')
  onClick() {
    this.game.jump();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.game.jump();
    }
    
    if (event.code === 'KeyP') {
      event.preventDefault();
      this.game.togglePause();
    }

    if (event.code === 'KeyM') {
      event.preventDefault();
      this.game.toggleSound();
    }
  }

  @HostListener('window:resize')
  onResize() {
    // Handle responsive resize if needed
  }
}