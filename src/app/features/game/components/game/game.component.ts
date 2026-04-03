import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
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

  @ViewChild('mobileInput') mobileInput!: ElementRef<HTMLInputElement>;

  sniperAngle = 0;
  muzzleFlash = false;
  screenShake = false;
  shooterRecoil = false; // NEW: Shooter animation

  constructor(public gs: GameService) {}

  ngOnInit() {
    // Preload sounds in assets folder
  }

  // START GAME + FOCUS INPUT
  startGame() {
    this.gs.startGame();
    setTimeout(() => this.focusInput(), 200);
  }

  // 🎯 FORCE KEYBOARD OPEN
  focusInput() {
    this.mobileInput?.nativeElement.focus();
  }

  // 📱 MOBILE INPUT HANDLER
  onMobileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    const key = input.value.slice(-1).toLowerCase();
    input.value = ''; // clear instantly

    this.processKey(key);
  }

  // 💻 DESKTOP KEYBOARD
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (this.gs.gameState !== 'playing') return;
    if (event.key.length !== 1) return;

    this.processKey(event.key.toLowerCase());
  }

  // 🧠 UNIFIED INPUT PROCESSOR
  processKey(key: string) {
    const result = this.gs.handleKeyPress(key);

    if (result === 'hit' || result === 'complete') {
      this.fireWeapon();
      this.updateSniperAim();
    }

    if (result === 'complete') {
      this.triggerShake();
    }
  }

  // 🔫 FIRE WEAPON
  fireWeapon() {
    // Muzzle flash
    this.muzzleFlash = true;
    setTimeout(() => this.muzzleFlash = false, 80);

    // Shooter recoil animation
    this.shooterRecoil = true;
    setTimeout(() => this.shooterRecoil = false, 100);
  }

  updateSniperAim() {
    const target = this.gs.words.find(w => w.id === this.gs.lockedWordId);
    if (!target) return;

    const dx = target.x - 50;
    const dy = target.y - 95;
    const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

    this.sniperAngle += (angle - this.sniperAngle) * 0.25;
  }

  triggerShake() {
    this.screenShake = true;
    setTimeout(() => this.screenShake = false, 250);
  }

  // Calculate bullet position (missile trajectory)
  getBulletX(b: Bullet) {
    return b.startX + (b.targetX - b.startX) * b.progress;
  }

  getBulletY(b: Bullet) {
    // Add some arc/curve to the missile
    const baseY = b.startY + (b.targetY - b.startY) * b.progress;
    const arc = Math.sin(b.progress * Math.PI) * 3; // Slight arc
    return baseY - arc;
  }

  // Get rotation for spinning meme missiles
  getBulletRotation(b: Bullet) {
    return b.rotation;
  }

  ngOnDestroy() {
    this.gs.endGame();
  }
}