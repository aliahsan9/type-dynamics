// typing-game.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-typing-game',
  imports:[CommonModule, RouterModule],
  templateUrl: './typing-game.component.html',
  styleUrls: ['./typing-game.component.scss']
})
export class TypingGameComponent implements OnInit {

  blogTitle: string = "How Playing Typing Games Can Boost Your Coding Skills";
  blogDate: string = "March 30, 2026";
  author: string = "TypeDynamics Team";

  benefits: { title: string, description: string, image?: string }[] = [
    {
      title: "1. Faster Code Writing",
      description: "Typing games improve finger agility and muscle memory, which allows programmers to write code faster and more efficiently without constantly looking at the keyboard.",
      image: "assets/images/faster-coding.jpg"
    },
    {
      title: "2. Improved Accuracy",
      description: "Accuracy is critical when coding. Regular typing practice reduces typos and syntax errors, making debugging easier and reducing wasted time.",
      image: "assets/images/accuracy-coding.jpg"
    },
    {
      title: "3. Enhanced Focus and Concentration",
      description: "Typing games require sustained attention, training your brain to concentrate for longer periods—an essential skill for coding sessions.",
      image: "assets/images/focus-coding.jpg"
    },
    {
      title: "4. Better Keyboard Shortcuts Usage",
      description: "Frequent typing increases familiarity with keyboard shortcuts, which are essential for navigating code editors quickly and efficiently.",
      image: "assets/images/keyboard-shortcuts.jpg"
    },
    {
      title: "5. Mental Agility and Cognitive Speed",
      description: "Coding requires quick thinking and problem-solving. Typing games stimulate neural pathways, improving cognitive speed and mental agility.",
      image: "assets/images/cognitive-speed.jpg"
    },
    {
      title: "6. Confidence in Code Testing",
      description: "Typing games reduce hesitation and errors, making you more confident when testing and debugging code under time constraints.",
      image: "assets/images/confidence-coding.jpg"
    }
  ];

  constructor() { }

  ngOnInit(): void { }

}