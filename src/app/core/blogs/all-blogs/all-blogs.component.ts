import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Blog {
  title: string;
  thumbnail: string;
  publishedDate: string;
  link: string;
}

@Component({
  selector: 'app-all-blogs',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.scss']
})
export class AllBlogsComponent {
  blogs: Blog[] = [
    {
      title: 'Boost Your Typing Speed: Essential Tips',
      thumbnail: 'assets/blogs/typing-speed.webp',
      publishedDate: '2026-03-20',
      link: '/improve-typing-speed'
    },
    {
      title: 'The Science Behind Typing Accuracy',
      thumbnail: 'assets/blogs/accuracy-science.webp',
      publishedDate: '2026-03-22',
      link: '/sciece-behind-accuracy'
    },
    {
      title: 'Top Online Typing Games to Improve Your Skills',
      thumbnail: 'assets/blogs/programming-games.webp',
      publishedDate: '2026-03-24',
      link: '/top-online-typing-games'
    },
    {
      title: 'Join the Ultimate Typing Challenge',
      thumbnail: 'assets/blogs/typing-challenge.webp',
      publishedDate: '2026-03-26',
      link: '/typing-challenge'
    },
    {
      title: 'Play & Learn: The Best Typing Game',
      thumbnail: 'assets/blogs/typing-game.webp',
      publishedDate: '2026-03-28',
      link: '/typing-game'
    }
  ];
}