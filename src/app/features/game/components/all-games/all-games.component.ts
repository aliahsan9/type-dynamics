import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  route: string;
}

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.scss']
})
export class AllGamesComponent {

  constructor(private router: Router) {}

  games: Game[] = [
    {
      id: 1,
      title: 'Typing Master',
      thumbnail: 'assets/games/typing.webp',
      route: '/keyboard'
    },
        {
      id: 3,
      title: 'Word Battle',
      thumbnail: 'assets/games/word.webp',
      route: '/game'
    }
  ];

  playGame(route: string) {
    this.router.navigate([route]);
  }
}