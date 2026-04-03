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
      title: 'Word Battle',
      thumbnail: 'assets/games/word.webp',
      route: '/game'
    },
    {
      id: 2,
      title: 'Typing Master',
      thumbnail: 'assets/games/typing.webp',
      route: '/keyboard'
    }
      
  ];

  playGame(route: string) {
    this.router.navigate([route]);
  }
}