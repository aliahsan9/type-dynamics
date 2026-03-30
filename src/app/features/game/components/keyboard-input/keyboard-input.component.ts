import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypingService, Difficulty } from '../../services/typing.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-keyboard-input',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './keyboard-input.component.html',
  styleUrls: ['./keyboard-input.component.scss']
})
export class KeyboardInputComponent implements OnInit, OnDestroy {
  paragraph = '';
  userInput = '';
  difficulty: Difficulty = 'medium';

  correctChars = 0;
  totalTyped = 0;
  accuracy = 0;
  wpm = 0;
  score = 0;
  combo = 0;
  maxCombo = 0;
  bestWpm = 0;
  lives = 3;
  isStarted = false;
  isFinished = false;
  startTime = 0;
  lastErrorIndex = -1;
  particles: { id: number; x: number; y: number }[] = [];
  private particleId = 0;
  private timerInterval: any;

  elapsedSeconds = 0;

  constructor(private typingService: TypingService) {}

  ngOnInit(): void {
    this.bestWpm = Number(localStorage.getItem('typingBestWpm') || 0);
    this.loadNew();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  loadNew(): void {
    this.paragraph = this.typingService.getPassage(this.difficulty);
  }

  onInputChange(value: string): void {
    if (this.isFinished) return;
    if (!this.isStarted && value.length > 0) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.calculateStats();
      }, 500);
    }

    const prevLen = this.userInput.length;
    this.userInput = value;

    const i = value.length - 1;
    if (i >= 0) {
      if (value[i] === this.paragraph[i]) {
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        const multiplier = Math.min(Math.floor(this.combo / 5) + 1, 5);
        this.score += 10 * multiplier;
        this.spawnParticle();
      } else {
        this.combo = 0;
        this.lives = Math.max(0, this.lives - 1);
        if (this.lives === 0) { this.finishGame(); return; }
      }
    }

    this.calculateStats();

    if (value.length === this.paragraph.length && this.areAllCorrect()) {
      this.finishGame();
    }
  }

  areAllCorrect(): boolean {
    return this.userInput.split('').every((c, i) => c === this.paragraph[i]);
  }

  calculateStats(): void {
    this.totalTyped = this.userInput.length;
    this.correctChars = this.userInput.split('').filter((c, i) => c === this.paragraph[i]).length;
    this.accuracy = this.totalTyped ? Math.round((this.correctChars / this.totalTyped) * 100) : 0;
    const minutes = (Date.now() - this.startTime) / 60000;
    this.wpm = minutes > 0 ? Math.round((this.correctChars / 5) / minutes) : 0;
  }

  finishGame(): void {
    this.isFinished = true;
    clearInterval(this.timerInterval);
    this.calculateStats();
    if (this.wpm > this.bestWpm) {
      this.bestWpm = this.wpm;
      localStorage.setItem('typingBestWpm', String(this.wpm));
    }
  }

  spawnParticle(): void {
    const id = this.particleId++;
    const x = 30 + Math.random() * 70;
    const y = 30 + Math.random() * 40;
    this.particles.push({ id, x, y });
    setTimeout(() => {
      this.particles = this.particles.filter(p => p.id !== id);
    }, 700);
  }

  getHighlightedText() {
    return this.paragraph.split('').map((char, index) => {
      if (index < this.userInput.length) {
        return { char, class: this.userInput[index] === char ? 'correct' : 'incorrect' };
      }
      if (index === this.userInput.length) return { char, class: 'cursor' };
      return { char, class: '' };
    });
  }

  setDifficulty(d: Difficulty): void {
    this.difficulty = d;
    this.reset();
  }

  get comboMultiplier(): number {
    return Math.min(Math.floor(this.combo / 5) + 1, 5);
  }

  reset(): void {
    clearInterval(this.timerInterval);
    this.userInput = '';
    this.correctChars = 0;
    this.totalTyped = 0;
    this.accuracy = 0;
    this.wpm = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.elapsedSeconds = 0;
    this.isStarted = false;
    this.isFinished = false;
    this.particles = [];
    this.loadNew();
  }

  get progressPercent(): number {
    return this.paragraph.length ? Math.round((this.userInput.length / this.paragraph.length) * 100) : 0;
  }

  get livesArray(): number[] {
    return Array(3).fill(0).map((_, i) => i);
  }
}