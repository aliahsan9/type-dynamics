import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GameService, Bullet } from '../../services/game.service';
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

  private shootAudio = new Audio('assets/shoot.mp3');

  constructor(public gs: GameService) {}

  ngOnInit(): void {
    this.shootAudio.volume = 0.4;
  }

  // 🎯 KEY INPUT SYSTEM (NO INPUT FIELD)
  @HostListener('window:keydown', ['$event'])
  handleInput(event: KeyboardEvent) {
    if (this.gs.gameState !== 'playing') return;
    if (event.key.length !== 1) return;

    const key = event.key.toLowerCase();

    const result = this.gs.handleKeyPress(key);

    if (result === 'hit' || result === 'complete') {
      this.fireWeapon();
      this.updateSniperAim();
    }

    if (result === 'complete') {
      this.triggerShake();
    }
  }

  // 🔫 FIRE SYSTEM (Sound + FX)
  fireWeapon() {
    this.playShootSound();
    this.triggerWeaponFX();
  }

  playShootSound() {
    this.shootAudio.currentTime = 0;
    this.shootAudio.play().catch(() => {});
  }

  // 🎯 SMART AIM (LOCK TARGET)
  updateSniperAim() {
    const target = this.gs.words.find(w => w.id === this.gs.lockedWordId);

    if (target) {
      const dx = target.x - 50;
      const dy = target.y - 95;
      this.sniperAngle = Math.atan2(dx, -dy) * (180 / Math.PI);
    } else {
      this.sniperAngle = 0;
    }
  }

  // 🔥 WEAPON FX
  triggerWeaponFX() {
    this.isRecoil = true;
    this.muzzleFlash = true;

    setTimeout(() => {
      this.isRecoil = false;
      this.muzzleFlash = false;
    }, 80);
  }

  // 💥 SCREEN SHAKE (ON WORD DESTROY)
  triggerShake() {
    this.screenShake = true;
    setTimeout(() => this.screenShake = false, 250);
  }

  // 🚀 BULLET POSITION
  getBulletX(b: Bullet) {
    return b.startX + (b.targetX - b.startX) * b.progress;
  }

  getBulletY(b: Bullet) {
    return b.startY + (b.targetY - b.startY) * b.progress;
  }

  ngOnDestroy(): void {
    this.gs.endGame();
  }
}