// top-online-typing-games.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-online-typing-games',
  imports:[CommonModule, RouterModule],
  templateUrl: './top-online-typing-games.component.html',
  styleUrls: ['./top-online-typing-games.component.scss']
})
export class TopOnlineTypingGamesComponent implements OnInit {

  blogTitle: string = "Top 5 Free Online Typing Games to Master Your Skills";
  blogDate: string = "March 30, 2026";
  author: string = "TypeDynamics Team";

  games: { title: string, description: string, image?: string, link?: string }[] = [
    {
      title: "1. TypeRacer",
      description: "Race against other players online and improve your speed and accuracy. Typing real texts from books, articles, and quotes makes practice fun and competitive.",
      image: "assets/images/typeracer.jpg",
      link: "https://play.typeracer.com/"
    },
    {
      title: "2. 10FastFingers",
      description: "A simple and fast typing test platform that tracks your words per minute (WPM) and accuracy. Compete with friends and improve gradually.",
      image: "assets/images/10fastfingers.jpg",
      link: "https://10fastfingers.com/typing-test/english"
    },
    {
      title: "3. NitroType",
      description: "A fun car racing typing game where your typing speed controls your car. Perfect for both beginners and advanced typists looking for an engaging experience.",
      image: "assets/images/nitrotype.jpg",
      link: "https://www.nitrotype.com/"
    },
    {
      title: "4. TypingClub",
      description: "An interactive typing platform with structured lessons, progress tracking, and games. It emphasizes accuracy while gradually increasing typing speed.",
      image: "assets/images/typingclub.jpg",
      link: "https://www.typingclub.com/"
    },
    {
      title: "5. Keybr",
      description: "Generates random, readable text to help you practice typing efficiently. Focuses on finger placement and rhythm, improving both speed and accuracy.",
      image: "assets/images/keybr.jpg",
      link: "https://www.keybr.com/"
    }
  ];

  constructor() { }

  ngOnInit(): void { }

}