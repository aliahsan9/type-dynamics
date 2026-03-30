import { Injectable } from '@angular/core';

export type Difficulty = 'easy' | 'medium' | 'hard';

@Injectable({ providedIn: 'root' })
export class TypingService {
  private passages: Record<Difficulty, string[]> = {
    easy: [
      'The sun sets slowly behind the mountains.',
      'A gentle breeze flows through the open window.',
      'The cat sat on the warm wooden floor.',
      'Blue skies and green fields stretch endlessly.',
    ],
    medium: [
      'Angular makes it easy to build modern web applications with reactive patterns.',
      'Consistency and deliberate practice are the foundations of all great skills.',
      'The quick brown fox jumps over the lazy dog near the old oak tree.',
      'Focus on accuracy first, then speed will follow naturally over time.',
    ],
    hard: [
      'Asynchronous programming with RxJS observables enables powerful reactive data streams in Angular applications.',
      'The Byzantine generals problem illustrates the challenge of achieving consensus in distributed systems.',
      'Polymorphism, encapsulation, and abstraction are the three pillars of object-oriented design.',
      'Quantum entanglement suggests that particles can instantaneously affect each other regardless of distance.',
    ],
  };

  getPassage(difficulty: Difficulty = 'medium'): string {
    const pool = this.passages[difficulty];
    return pool[Math.floor(Math.random() * pool.length)];
  }
}