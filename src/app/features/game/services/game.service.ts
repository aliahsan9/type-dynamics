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
  memeUrl: string; // NEW: Meme image/video for this word
  memeType: 'image' | 'video'; // NEW: Type of meme
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
  memeUrl: string; // NEW: Meme attached to bullet
  rotation: number; // NEW: Spinning meme effect
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
  type: 'spark' | 'ember' | 'meme-fragment'; // NEW: Meme fragments
  memeUrl?: string; // NEW: For meme fragments
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

  // Audio system
  private shootSound: HTMLAudioElement[] = [];
  private explosionSound: HTMLAudioElement[] = [];
  private hitSound: HTMLAudioElement[] = [];
  private comboSound: HTMLAudioElement[] = [];
  private missSound!: HTMLAudioElement;

  readonly wordList = [
    { text: 'fire', meme: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif' },
    { text: 'boom', meme: 'https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif' },
    { text: 'bruh', meme: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif' },
    { text: 'oof', meme: 'https://media.giphy.com/media/26ufcVAp3AiJJsrIs/giphy.gif' },
    { text: 'yeet', meme: 'https://media.giphy.com/media/3oEjI5VtIhHvK37WYo/giphy.gif' },
    { text: 'lol', meme: 'https://media.giphy.com/media/T3Vx6sVAXzuG4/giphy.gif' },
    { text: 'wow', meme: 'https://media.giphy.com/media/3o8dFn5CXJlCV9ZEsg/giphy.gif' },
    { text: 'nope', meme: 'https://media.giphy.com/media/wYyTHMm50f4Dm/giphy.gif' },
    { text: 'sus', meme: 'https://media.giphy.com/media/4kWeXCB5jqCPJsmDWw/giphy.gif' },
    { text: 'doge', meme: 'https://media.giphy.com/media/Qld1cd6a6QlWw/giphy.gif' },
    { text: 'stonks', meme: 'https://i.imgur.com/9uhHc3L.gif' },
    { text: 'nice', meme: 'https://media.giphy.com/media/pCO5tKdP22RC8/giphy.gif' },
    { text: 'chad', meme: 'https://media.giphy.com/media/CAYVZA5NRb529kKQUc/giphy.gif' },
    { text: 'meme', meme: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
    { text: 'epic', meme: 'https://media.giphy.com/media/QyWBTLDn9WHt0FXGJS/giphy.gif' },
    { text: 'rekt', meme: 'https://media.giphy.com/media/r1HGFou3mUwMw/giphy.gif' },
    { text: 'rage', meme: 'https://media.giphy.com/media/fwbZnTftCXVocKzfxR/giphy.gif' },
    { text: 'flex', meme: 'https://media.giphy.com/media/l3vRfhFD8hJCiP0uQ/giphy.gif' },
    { text: 'vibes', meme: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif' },
    { text: 'goat', meme: 'https://media.giphy.com/media/l0HlR3kHtkgFbYfgQ/giphy.gif' }
  ];

  readonly colors = ['#00ff88', '#00cfff', '#ff6b35', '#ffd23f', '#ee4266', '#b967ff'];

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    // Create audio pool for rapid fire
    for (let i = 0; i < 5; i++) {
      const shoot = new Audio('assets/ak47-shot.mp3');
      shoot.volume = 0.3;
      this.shootSound.push(shoot);

      const explode = new Audio('assets/explosion.mp3');
      explode.volume = 0.4;
      this.explosionSound.push(explode);

      const hit = new Audio('assets/hit.mp3');
      hit.volume = 0.2;
      this.hitSound.push(hit);
    }

    // Combo sound
    for (let i = 0; i < 3; i++) {
      const combo = new Audio('assets/combo.mp3');
      combo.volume = 0.5;
      this.comboSound.push(combo);
    }

    this.missSound = new Audio('assets/miss.mp3');
    this.missSound.volume = 0.3;
  }

  playSound(pool: HTMLAudioElement[]) {
    const available = pool.find(s => s.paused);
    if (available) {
      available.currentTime = 0;
      available.play().catch(() => {});
    }
  }

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
    const wordData = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // Determine if meme is video or image
    const memeType = wordData.meme.includes('.mp4') || wordData.meme.includes('.webm') ? 'video' : 'image';
    
    this.words.push({
      id: this.idCounter++,
      text: wordData.text,
      color,
      speed: 0.12 + (this.level * 0.04),
      x: 5 + Math.random() * 80,
      y: -5,
      typedIndex: 0,
      locked: false,
      exploding: false,
      shaking: false,
      memeUrl: wordData.meme,
      memeType
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

    // Update Projectiles (missiles flying upward!)
    this.bullets.forEach(b => {
      b.progress += 0.06; // Slightly slower for dramatic effect
      b.rotation += 15; // Spinning meme missile!
      if (b.progress >= 1) b.done = true;
    });
    this.bullets = this.bullets.filter(b => !b.done);

    // Particles & FX
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      
      // Different physics for meme fragments
      if (p.type === 'meme-fragment') {
        p.vy -= 0.08; // Float upward!
        p.vx *= 0.98; // Slow down horizontally
      } else {
        p.vy += 0.05; // Normal gravity for sparks
      }
      
      p.life -= 2;
    });
    this.particles = this.particles.filter(p => p.life > 0);

    this.floatingTexts.forEach(ft => { ft.y -= 0.3; ft.life -= 2; });
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
        this.playSound([this.missSound]);
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

    this.playSound([this.missSound]);
    return 'miss';
  }

  private fire(word: Word): string {
    const letter = word.text[word.typedIndex];
    this.hits++;
    this.lettersFired++;
    
    // Play AK-47 sound
    this.playSound(this.shootSound);
    
    // Create meme missile!
    this.bullets.push({
      id: this.idCounter++,
      startX: 50, startY: 95,
      targetX: word.x + (word.typedIndex * 2), targetY: word.y,
      progress: 0,
      letter,
      color: word.color,
      done: false,
      memeUrl: word.memeUrl, // Attach the meme!
      rotation: 0
    });

    // Play hit sound
    this.playSound(this.hitSound);

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
    
    // Play explosion sound
    this.playSound(this.explosionSound);
    
    // Play combo sound for streaks
    if (this.combo >= 3) {
      this.playSound(this.comboSound);
    }
    
    this.createExplosion(word.x, word.y, word.color, word.memeUrl);
    
    // Funny combo messages
    const comboMessages = ['NICE!', 'EPIC!', 'LEGENDARY!', 'GODLIKE!', 'UNSTOPPABLE!'];
    const comboText = this.combo >= 3 ? comboMessages[Math.min(this.combo - 3, 4)] : '';
    
    this.floatingTexts.push({
      id: this.idCounter++, x: word.x, y: word.y,
      text: `+${points}`, color: word.color, life: 100
    });
    
    if (comboText) {
      this.floatingTexts.push({
        id: this.idCounter++, x: word.x, y: word.y - 5,
        text: `${comboText} x${this.combo}`, color: '#FFD700', life: 120
      });
    }

    this.lockedWordId = null;
    setTimeout(() => {
      this.words = this.words.filter(w => w.id !== word.id);
    }, 400);
  }

  private createExplosion(x: number, y: number, color: string, memeUrl: string) {
    // Regular sparks
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        id: this.idCounter++, x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 100, maxLife: 100, color, size: Math.random() * 4 + 2, type: 'spark'
      });
    }
    
    // MEME FRAGMENTS flying upward!
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        id: this.idCounter++, x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * -2 - 1, // Negative = upward!
        life: 150, maxLife: 150,
        color: '#fff',
        size: 20 + Math.random() * 20,
        type: 'meme-fragment',
        memeUrl
      });
    }
  }

  getLevelName() {
    const names = ['NOOB', 'CASUAL', 'PRO', 'MEME LORD', 'ULTIMATE CHAD'];
    return names[this.level - 1] || 'LEGENDARY SHITPOSTER';
  }
}