import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AllBlogsComponent } from '../../core/blogs/all-blogs/all-blogs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, AllBlogsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
// Added connstructor here for routing
  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/game']);
  }

  practiceMode() {
    this.router.navigate(['/keyboard']);
  }
}