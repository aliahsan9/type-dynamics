import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GameService, Word, Bullet } from '../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  sniperAngle = 0;
  isRecoil = false;
  muzzleFlash = false;
  screenShake = false;

  constructor(public gs: GameService) {}

  ngOnInit() {}

  @HostListener('window:keydown', ['$event'])
  handleInput(event: KeyboardEvent) {
    if (this.gs.gameState !== 'playing') return;
    if (event.key.length !== 1) return;

    const result = this.gs.handleKeyPress(event.key.toLowerCase());
    
    if (result === 'hit' || result === 'complete') {
      this.triggerWeaponFX();
      this.updateSniperAim();
      if (result === 'complete') this.triggerShake();
    }
  }

  updateSniperAim() {
    const target = this.gs.words.find(w => w.id === this.gs.lockedWordId);
    if (target) {
      // Calculate angle from bottom-center (50, 95) to target (x, y)
      const dx = target.x - 50;
      const dy = target.y - 95;
      this.sniperAngle = Math.atan2(dx, -dy) * (180 / Math.PI);
    } else {
      this.sniperAngle = 0;
    }
  }

  triggerWeaponFX() {
    this.isRecoil = true;
    this.muzzleFlash = true;
    setTimeout(() => {
      this.isRecoil = false;
      this.muzzleFlash = false;
    }, 100);
  }

  triggerShake() {
    this.screenShake = true;
    setTimeout(() => this.screenShake = false, 300);
  }

  getBulletX(b: Bullet) { return b.startX + (b.targetX - b.startX) * b.progress; }
  getBulletY(b: Bullet) { return b.startY + (b.targetY - b.startY) * b.progress; }

  ngOnDestroy() {
    this.gs.endGame();
  }
}