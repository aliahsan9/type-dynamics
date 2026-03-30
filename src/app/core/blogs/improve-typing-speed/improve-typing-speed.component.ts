// improve-typing-speed.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-improve-typing-speed',
  imports:[CommonModule, RouterModule],
  templateUrl: './improve-typing-speed.component.html',
  styleUrls: ['./improve-typing-speed.component.scss']
})
export class ImproveTypingSpeedComponent implements OnInit {

  blogTitle: string = "10 Proven Tips to Improve Your Typing Speed Fast";
  blogDate: string = "March 30, 2026";
  author: string = "TypeDynamics Team";

  tips: {title: string, description: string, image?: string}[] = [
    {
      title: "1. Practice Regularly",
      description: "Consistency is key. Set aside 20-30 minutes daily for typing practice. Use typing games or practice passages to gradually improve speed and accuracy.",
      image: "assets/images/typing-practice.jpg"
    },
    {
      title: "2. Master Proper Finger Placement",
      description: "Follow the touch typing technique where each finger is assigned to specific keys. This improves muscle memory and reduces errors.",
      image: "assets/images/finger-placement.jpg"
    },
    {
      title: "3. Start Slow, Focus on Accuracy",
      description: "Speed comes with accuracy. Avoid rushing. Type slowly at first, and correct mistakes immediately. Once accurate, gradually increase speed.",
      image: "assets/images/accuracy.jpg"
    },
    {
      title: "4. Use All Fingers",
      description: "Avoid typing with just two fingers. Using all fingers increases typing speed and ensures more efficient hand movement across the keyboard.",
      image: "assets/images/all-fingers.jpg"
    },
    {
      title: "5. Practice with Real Texts",
      description: "Type articles, blogs, or your own writing instead of repetitive exercises. Real content practice enhances speed in real-world scenarios.",
      image: "assets/images/real-text.jpg"
    },
    {
      title: "6. Focus on Weak Keys",
      description: "Identify the keys you struggle with most and practice them intensively. Repeating difficult key combinations improves overall speed.",
      image: "assets/images/weak-keys.jpg"
    },
    {
      title: "7. Use Online Typing Tests",
      description: "Platforms like 10FastFingers, TypeRacer, and Typing.com provide structured tests to measure WPM (words per minute) and track progress.",
      image: "assets/images/typing-test.jpg"
    },
    {
      title: "8. Maintain Proper Posture",
      description: "Sit upright, keep wrists straight, and position your monitor at eye level. Good posture reduces fatigue and allows faster, more accurate typing.",
      image: "assets/images/posture.jpg"
    },
    {
      title: "9. Learn Keyboard Shortcuts",
      description: "Shortcuts save time and reduce unnecessary hand movement. Practice frequently used commands like copy-paste, undo, and navigation shortcuts.",
      image: "assets/images/shortcuts.jpg"
    },
    {
      title: "10. Stay Relaxed and Take Breaks",
      description: "Typing can be strenuous on your hands. Take short breaks every 20-30 minutes, stretch your fingers, and avoid tension to maintain speed.",
      image: "assets/images/typing-break.jpg"
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}