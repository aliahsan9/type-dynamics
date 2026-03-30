import { Component } from '@angular/core';
import { FooterComponent } from "./shared/footer/footer.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [FooterComponent, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'typedynamics';
}
