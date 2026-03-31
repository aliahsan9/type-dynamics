import { Injectable } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Pipe {
  x: number;
  top: number;
  bottom: number;
  passed: boolean;
  highlight: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FlappyBirdService {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  // 🐦 Bird with animation
  bird = {
    x: 100,
    y: 250,
    radius: 16,
    velocity: 0,
    gravity: 0.6,
    jump: -9.5,
    rotation: 0,
    wingPosition: 0,
    color: '#FFD700'
  };

  // 🧱 Pipes
  pipes: Pipe[] = [];
  pipeWidth = 70;
  pipeGap = 180;
  pipeSpeed = 3;
  basePipeSpeed = 3;

  // 🎯 Game State
  score = 0;
  highScore = 0;
  isGameOver = false;
  isStarted = false;
  isPaused = false;
  frame = 0;
  combo = 0;
  maxCombo = 0;

  // 🌆 Background layers (parallax)
  bgLayers = {
    back: 0,
    mid: 0,
    front: 0
  };

  // ⭐ Particles for effects
  particles: Particle[] = [];

  // 🏆 Achievements
  achievements = {
    firstScore: false,
    score10: false,
    score25: false,
    score50: false,
    perfectLanding: false
  };

  // 🎨 Theme colors
  theme = {
    sky: ['#87CEEB', '#4A90E2', '#2C5F8D'],
    pipe: '#2ECC71',
    pipeShade: '#27AE60',
    ground: '#DEB887',
    stars: '#FFD700'
  };

  // 🔊 Sound toggle
  soundEnabled = true;

  start(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.highScore = Number(localStorage.getItem('flappyHighScore') || 0);
    this.maxCombo = Number(localStorage.getItem('flappyMaxCombo') || 0);
    this.loadAchievements();

    this.reset();
    this.loop();
  }

  reset() {
    this.bird.y = 250;
    this.bird.velocity = 0;
    this.bird.rotation = 0;
    this.bird.wingPosition = 0;
    this.pipes = [];
    this.particles = [];
    this.score = 0;
    this.combo = 0;
    this.pipeSpeed = this.basePipeSpeed;
    this.isGameOver = false;
    this.frame = 0;
    this.bgLayers = { back: 0, mid: 0, front: 0 };
  }

  startGame() {
    if (!this.isStarted) {
      this.isStarted = true;
    }
  }

  togglePause() {
    if (this.isStarted && !this.isGameOver) {
      this.isPaused = !this.isPaused;
    }
  }

  jump() {
    if (!this.isStarted) {
      this.startGame();
      return;
    }

    if (this.isPaused) {
      this.togglePause();
      return;
    }

    if (!this.isGameOver) {
      this.bird.velocity = this.bird.jump;
      this.bird.rotation = -25;
      this.playSound('jump');
      
      // Jump particles
      this.createParticles(this.bird.x, this.bird.y + this.bird.radius, 8, '#64ffda');
    } else {
      this.reset();
      this.isStarted = false;
    }
  }

  loop = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  };

  update() {
    if (!this.isStarted || this.isGameOver || this.isPaused) return;

    this.frame++;

    // 🐦 Bird physics
    this.bird.velocity += this.bird.gravity;
    this.bird.y += this.bird.velocity;

    // 🐦 Bird rotation based on velocity
    this.bird.rotation = Math.min(Math.max(this.bird.velocity * 3, -25), 90);

    // 🐦 Wing animation
    this.bird.wingPosition = Math.sin(this.frame * 0.2) * 8;

    // 🌆 Parallax scrolling
    this.bgLayers.back -= 0.3;
    this.bgLayers.mid -= 0.8;
    this.bgLayers.front -= 1.5;

    if (this.bgLayers.back <= -this.canvas.width) this.bgLayers.back = 0;
    if (this.bgLayers.mid <= -this.canvas.width) this.bgLayers.mid = 0;
    if (this.bgLayers.front <= -this.canvas.width) this.bgLayers.front = 0;

    // 🧱 Generate pipes (adaptive difficulty)
    const pipeInterval = Math.max(70, 100 - Math.floor(this.score / 5) * 5);
    if (this.frame % pipeInterval === 0) {
      const minTop = 80;
      const maxTop = this.canvas.height - this.pipeGap - 100;
      const top = Math.random() * (maxTop - minTop) + minTop;

      this.pipes.push({
        x: this.canvas.width,
        top,
        bottom: top + this.pipeGap,
        passed: false,
        highlight: false
      });
    }

    // 🧱 Update pipes
    this.pipes.forEach(pipe => {
      pipe.x -= this.pipeSpeed;

      // Highlight upcoming pipe
      pipe.highlight = pipe.x > this.bird.x - 50 && pipe.x < this.bird.x + 100;

      if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
        this.score++;
        this.combo++;
        pipe.passed = true;

        this.playSound('score');
        this.createParticles(pipe.x + this.pipeWidth / 2, this.canvas.height / 2, 15, '#FFD700');

        // Check achievements
        this.checkAchievements();

        // Progressive difficulty
        if (this.score % 5 === 0) {
          this.pipeSpeed = Math.min(this.basePipeSpeed + this.score * 0.15, 8);
          this.createParticles(this.canvas.width / 2, 50, 20, '#00ff99');
        }
      }

      // 💥 Collision detection
      const birdLeft = this.bird.x - this.bird.radius;
      const birdRight = this.bird.x + this.bird.radius;
      const birdTop = this.bird.y - this.bird.radius;
      const birdBottom = this.bird.y + this.bird.radius;

      if (
        birdRight > pipe.x &&
        birdLeft < pipe.x + this.pipeWidth &&
        (birdTop < pipe.top || birdBottom > pipe.bottom)
      ) {
        this.gameOver();
      }
    });

    this.pipes = this.pipes.filter(p => p.x + this.pipeWidth > 0);

    // 💥 Boundary collision
    if (this.bird.y + this.bird.radius > this.canvas.height - 50 || this.bird.y - this.bird.radius < 0) {
      this.gameOver();
    }

    // ⭐ Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.02;
      return p.life > 0;
    });
  }

  gameOver() {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    this.combo = 0;
    this.playSound('hit');

    // Explosion effect
    this.createParticles(this.bird.x, this.bird.y, 30, '#ff6b6b');

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('flappyHighScore', this.highScore.toString());
      this.createParticles(this.canvas.width / 2, 100, 50, '#FFD700');
    }

    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
      localStorage.setItem('flappyMaxCombo', this.maxCombo.toString());
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 🌆 Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
    skyGradient.addColorStop(0, this.theme.sky[0]);
    skyGradient.addColorStop(0.5, this.theme.sky[1]);
    skyGradient.addColorStop(1, this.theme.sky[2]);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, w, h);

    // ☁️ Clouds (parallax)
    this.drawClouds(ctx, this.bgLayers.back, 0.5);
    this.drawClouds(ctx, this.bgLayers.mid, 0.8);

    // 🧱 Pipes with 3D effect
    this.pipes.forEach(pipe => {
      const pipeColor = pipe.highlight ? '#3DDC84' : this.theme.pipe;
      
      // Top pipe
      this.drawPipe(ctx, pipe.x, 0, this.pipeWidth, pipe.top, pipeColor);
      
      // Bottom pipe
      this.drawPipe(ctx, pipe.x, pipe.bottom, this.pipeWidth, h - pipe.bottom, pipeColor);
    });

    // 🌿 Ground
    ctx.fillStyle = this.theme.ground;
    ctx.fillRect(0, h - 50, w, 50);
    
    // Ground grass effect
    ctx.fillStyle = '#8B7355';
    for (let i = 0; i < w; i += 20) {
      ctx.fillRect(i, h - 50, 2, 5);
    }

    // ⭐ Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 🐦 Bird with animation
    ctx.save();
    ctx.translate(this.bird.x, this.bird.y);
    ctx.rotate((this.bird.rotation * Math.PI) / 180);

    // Bird body
    ctx.beginPath();
    ctx.arc(0, 0, this.bird.radius, 0, Math.PI * 2);
    const birdGradient = ctx.createRadialGradient(-5, -5, 2, 0, 0, this.bird.radius);
    birdGradient.addColorStop(0, '#FFE066');
    birdGradient.addColorStop(1, this.bird.color);
    ctx.fillStyle = birdGradient;
    ctx.fill();

    // Bird outline
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wing
    ctx.fillStyle = '#FFB347';
    ctx.beginPath();
    ctx.ellipse(0, this.bird.wingPosition, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(8, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(9, -5, 1, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(18, -2);
    ctx.lineTo(18, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 🎯 HUD
    this.drawHUD(ctx, w);

    // 🎮 Screens
    if (!this.isStarted) this.drawStartScreen(ctx, w, h);
    if (this.isPaused) this.drawPauseScreen(ctx, w, h);
    if (this.isGameOver) this.drawGameOverScreen(ctx, w, h);
  }

  drawPipe(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
    // Main pipe
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    // 3D edge
    ctx.fillStyle = this.theme.pipeShade;
    ctx.fillRect(x, y, 5, height);

    // Pipe cap
    const capHeight = 30;
    if (y === 0) {
      ctx.fillStyle = color;
      ctx.fillRect(x - 5, height - capHeight, width + 10, capHeight);
      ctx.fillStyle = this.theme.pipeShade;
      ctx.fillRect(x - 5, height - capHeight, 5, capHeight);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x - 5, y, width + 10, capHeight);
      ctx.fillStyle = this.theme.pipeShade;
      ctx.fillRect(x - 5, y, 5, capHeight);
    }
  }

  drawClouds(ctx: CanvasRenderingContext2D, offset: number, alpha: number) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#fff';
    
    const clouds = [
      { x: 100, y: 80, size: 40 },
      { x: 300, y: 120, size: 50 },
      { x: 500, y: 90, size: 35 }
    ];

    clouds.forEach(cloud => {
      const x = (cloud.x + offset) % (this.canvas.width + 100);
      ctx.beginPath();
      ctx.arc(x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.arc(x + cloud.size * 0.6, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
      ctx.arc(x + cloud.size * 1.2, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  drawHUD(ctx: CanvasRenderingContext2D, w: number) {
    // Score
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(this.score.toString(), w / 2, 60);
    ctx.fillText(this.score.toString(), w / 2, 60);

    // High score
    ctx.font = '16px Arial';
    ctx.strokeText(`Best: ${this.highScore}`, w / 2, 90);
    ctx.fillText(`Best: ${this.highScore}`, w / 2, 90);

    // Combo
    if (this.combo > 2 && !this.isGameOver) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${this.combo}x COMBO!`, w / 2, 120);
    }

    ctx.textAlign = 'left';
  }

  drawStartScreen(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.font = 'bold 48px Arial';
    ctx.strokeText('🐦 Flappy Bird', w / 2, h / 2 - 80);
    ctx.fillText('🐦 Flappy Bird', w / 2, h / 2 - 80);

    // Instructions
    ctx.fillStyle = '#64ffda';
    ctx.font = '20px Arial';
    ctx.fillText('Click or Press SPACE to Jump', w / 2, h / 2);
    ctx.fillText('Press P to Pause', w / 2, h / 2 + 35);

    // Pulsing play hint
    const pulse = Math.sin(this.frame * 0.1) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('▶ TAP TO START', w / 2, h / 2 + 100);
    ctx.globalAlpha = 1;

    ctx.textAlign = 'left';
  }

  drawPauseScreen(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('⏸ PAUSED', w / 2, h / 2);

    ctx.fillStyle = '#64ffda';
    ctx.font = '18px Arial';
    ctx.fillText('Press P or Click to Resume', w / 2, h / 2 + 40);
    ctx.textAlign = 'left';
  }

  drawGameOverScreen(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';

    // Game Over
    ctx.fillStyle = '#ff6b6b';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.font = 'bold 48px Arial';
    ctx.strokeText('GAME OVER', w / 2, h / 2 - 80);
    ctx.fillText('GAME OVER', w / 2, h / 2 - 80);

    // Stats panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(w / 2 - 120, h / 2 - 30, 240, 130);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${this.score}`, w / 2, h / 2);
    ctx.fillText(`Best: ${this.highScore}`, w / 2, h / 2 + 35);
    ctx.fillText(`Max Combo: ${this.maxCombo}`, w / 2, h / 2 + 70);

    // New record
    if (this.score === this.highScore && this.score > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('🏆 NEW RECORD!', w / 2, h / 2 - 50);
    }

    // Restart hint
    const pulse = Math.sin(this.frame * 0.1) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('↻ CLICK TO RESTART', w / 2, h / 2 + 130);
    ctx.globalAlpha = 1;

    ctx.textAlign = 'left';
  }

  createParticles(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 1,
        color
      });
    }
  }

  checkAchievements() {
    if (this.score === 1 && !this.achievements.firstScore) {
      this.achievements.firstScore = true;
      this.saveAchievements();
    }
    if (this.score === 10 && !this.achievements.score10) {
      this.achievements.score10 = true;
      this.saveAchievements();
    }
    if (this.score === 25 && !this.achievements.score25) {
      this.achievements.score25 = true;
      this.saveAchievements();
    }
    if (this.score === 50 && !this.achievements.score50) {
      this.achievements.score50 = true;
      this.saveAchievements();
    }
  }

  saveAchievements() {
    localStorage.setItem('flappyAchievements', JSON.stringify(this.achievements));
  }

  loadAchievements() {
    const saved = localStorage.getItem('flappyAchievements');
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
  }

  playSound(type: 'jump' | 'score' | 'hit') {
    if (!this.soundEnabled) return;
    // Sound implementation (requires audio files)
    // You can add actual audio files or use Web Audio API for beeps
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
  }
}