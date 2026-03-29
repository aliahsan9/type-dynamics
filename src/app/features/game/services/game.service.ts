import { Injectable } from '@angular/core';

export interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  typedIndex: number;
  locked: boolean;
  exploding: boolean;
  shaking: boolean;
}

export interface Bullet {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
  letter: string;
  color: string;
  done: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'ember';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  words: Word[] = [];
  bullets: Bullet[] = [];
  particles: Particle[] = [];
  floatingTexts: FloatingText[] = [];

  score = 0;
  highScore = 0;
  lives = 3;
  level = 1;
  timeLeft = 60;
  gameState: 'idle' | 'playing' | 'gameover' = 'idle';
  combo = 0;
  maxCombo = 0;
  wordsDestroyed = 0;
  lettersFired = 0;
  totalKeystrokes = 0;
  hits = 0;
  accuracy = 100;
  lockedWordId: number | null = null;

  private idCounter = 0;
  private timers: any[] = [];

  readonly wordList = [
    'fire','code','type','speed','blast','aim','shot','swift','storm','flash',
    'laser','rapid','scope','lock','hunt','ghost','fury','blaze','pulse','surge',
    'hyper','turbo','nitro','snipe','apex','elite','shadow','venom','recon','delta',
    'bravo','omega','alpha','zero','strike','react','angular','nexus','pixel','forge'
  ];

  readonly colors = ['#00ff88','#00cfff','#ff6b35','#ffd23f','#ee4266','#b967ff'];

  startGame() {
    this.resetState();
    this.gameState = 'playing';
    this.scheduleSpawn();
    
    // Main Game Loop (60fps)
    const loop = setInterval(() => this.tick(), 16);
    // Countdown Timer
    const clock = setInterval(() => {
      if (this.gameState !== 'playing') return;
      this.timeLeft--;
      this.level = Math.min(5, Math.floor((60 - this.timeLeft) / 12) + 1);
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);

    this.timers.push(loop, clock);
  }

  private resetState() {
    this.clearTimers();
    this.score = 0; this.lives = 3; this.level = 1; this.timeLeft = 60;
    this.combo = 0; this.maxCombo = 0; this.wordsDestroyed = 0;
    this.lettersFired = 0; this.totalKeystrokes = 0; this.hits = 0;
    this.accuracy = 100; this.lockedWordId = null;
    this.words = []; this.bullets = []; this.particles = []; this.floatingTexts = [];
  }

  private clearTimers() {
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  }

  endGame() {
    this.gameState = 'gameover';
    if (this.score > this.highScore) this.highScore = this.score;
    this.clearTimers();
  }

  private scheduleSpawn() {
    const delay = Math.max(700, 2000 - this.level * 250);
    const spawn = setInterval(() => {
      if (this.gameState === 'playing') {
        this.spawnWord();
        if (this.level >= 3 && Math.random() > 0.7) this.spawnWord();
      }
    }, delay);
    this.timers.push(spawn);
  }

  spawnWord() {
    const text = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.words.push({
      id: this.idCounter++, text, color,
      speed: 0.12 + (this.level * 0.04),
      x: 5 + Math.random() * 80,
      y: -5,
      typedIndex: 0, locked: false, exploding: false, shaking: false
    });
  }

  private tick() {
    // Move Words
    this.words.forEach(w => { if (!w.exploding) w.y += w.speed; });

    // Check Failures
    const escaped = this.words.filter(w => w.y > 100 && !w.exploding);
    if (escaped.length > 0) {
      this.lives -= escaped.length;
      this.combo = 0;
      this.words = this.words.filter(w => w.y <= 100);
      if (this.lives <= 0) this.endGame();
    }

    // Update Projectiles
    this.bullets.forEach(b => {
      b.progress += 0.08;
      if (b.progress >= 1) b.done = true;
    });
    this.bullets = this.bullets.filter(b => !b.done);

    // Particles & FX
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.05; // Gravity Here
      p.life -= 2;
    });
    this.particles = this.particles.filter(p => p.life > 0);

    this.floatingTexts.forEach(ft => { ft.y -= 0.2; ft.life -= 2; });
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
  }

  handleKeyPress(key: string): string {
    if (this.gameState !== 'playing') return 'none';
    this.totalKeystrokes++;

    // Case 1: Continue locked word
    if (this.lockedWordId !== null) {
      const target = this.words.find(w => w.id === this.lockedWordId);
      if (target && target.text[target.typedIndex] === key) {
        return this.fire(target);
      }
      if (target) {
        target.shaking = true;
        setTimeout(() => target.shaking = false, 200);
      }
      return 'miss';
    }

    // Case 2: Start new word
    const potential = this.words.filter(w => !w.exploding && w.text[0] === key);
    if (potential.length > 0) {
      const target = potential.reduce((prev, curr) => (prev.y > curr.y) ? prev : curr);
      this.lockedWordId = target.id;
      target.locked = true;
      return this.fire(target);
    }

    return 'miss';
  }

  private fire(word: Word): string {
    const letter = word.text[word.typedIndex];
    this.hits++;
    this.lettersFired++;
    
    this.bullets.push({
      id: this.idCounter++,
      startX: 50, startY: 95,
      targetX: word.x + (word.typedIndex * 2), targetY: word.y,
      progress: 0, letter, color: word.color, done: false
    });

    word.typedIndex++;
    this.accuracy = Math.round((this.hits / this.totalKeystrokes) * 100);

    if (word.typedIndex >= word.text.length) {
      this.destroyWord(word);
      return 'complete';
    }
    return 'hit';
  }

  private destroyWord(word: Word) {
    word.exploding = true;
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    this.wordsDestroyed++;
    
    const points = word.text.length * 10 * this.level * Math.min(this.combo, 5);
    this.score += points;
    
    this.createExplosion(word.x, word.y, word.color);
    this.floatingTexts.push({
      id: this.idCounter++, x: word.x, y: word.y,
      text: `+${points}`, color: word.color, life: 100
    });

    this.lockedWordId = null;
    setTimeout(() => {
      this.words = this.words.filter(w => w.id !== word.id);
    }, 400);
  }

  private createExplosion(x: number, y: number, color: string) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        id: this.idCounter++, x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 100, maxLife: 100, color, size: Math.random() * 4 + 2, type: 'spark'
      });
    }
  }

  getLevelName() {
    const names = ['RECRUIT', 'AGENT', 'OPERATIVE', 'ELITE', 'GHOST'];
    return names[this.level - 1] || 'LEGEND';
  }
}