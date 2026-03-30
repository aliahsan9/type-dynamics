// typing-challenge.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-typing-challenge',
  imports:[CommonModule, RouterModule],
  templateUrl: './typing-challenge.component.html',
  styleUrls: ['./typing-challenge.component.scss']
})
export class TypingChallengeComponent implements OnInit {

  blogTitle: string = "Daily Typing Challenges to Level Up Your Keyboard Skills";
  blogDate: string = "March 30, 2026";
  author: string = "TypeDynamics Team";

  challenges: { title: string, description: string, image?: string }[] = [
    {
      title: "1. Speed Sprint",
      description: "Set a timer for 1 minute and type as many words as you can without errors. Track your words per minute (WPM) daily to measure improvement.",
      image: "assets/images/speed-sprint.jpg"
    },
    {
      title: "2. Accuracy Drill",
      description: "Focus on typing passages perfectly without making a single mistake. Accuracy drills help strengthen muscle memory and reduce errors.",
      image: "assets/images/accuracy-drill.jpg"
    },
    {
      title: "3. Finger Strength Challenge",
      description: "Type sequences of difficult key combinations to strengthen weaker fingers. Repeating challenging patterns daily improves overall typing control.",
      image: "assets/images/finger-strength.jpg"
    },
    {
      title: "4. Text Mastery",
      description: "Choose a new article or book passage each day and type it word for word. This improves adaptability and your ability to type unfamiliar content quickly.",
      image: "assets/images/text-mastery.jpg"
    },
    {
      title: "5. Random Word Blitz",
      description: "Use random word generators to type 50–100 words quickly. This challenge improves your reflexes and typing rhythm while keeping practice exciting.",
      image: "assets/images/random-blitz.jpg"
    },
    {
      title: "6. Game-based Challenge",
      description: "Play a typing game like TypeRacer or NitroType every day. Incorporating fun elements boosts motivation and helps track real-time typing skills.",
      image: "assets/images/game-challenge.jpg"
    }
  ];

  constructor() { }

  ngOnInit(): void { }

}