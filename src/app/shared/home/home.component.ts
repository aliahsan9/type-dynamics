import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AllBlogsComponent } from "../../core/blogs/all-blogs/all-blogs.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule, AllBlogsComponent]
})
export class HomeComponent {

  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/game']);
  }

  practiceMode() {
    this.router.navigate(['/keyboard']);
  }
}