import { Component } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";

declare var gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent {
  title = 'typedynamics';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Safe check (prevents runtime errors)
        if (typeof gtag === 'function') {
          gtag('config', 'G-YZG1KE2R60', {
            page_path: event.urlAfterRedirects
          });
        }
      }
    });
  }
}