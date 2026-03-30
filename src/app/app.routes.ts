import { Routes } from '@angular/router';
import { KeyboardInputComponent } from './features/game/components/keyboard-input/keyboard-input.component';
import { HomeComponent } from './shared/home/home.component';
import { GameComponent } from './features/game/components/game/game.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'game', component: GameComponent},
    {path: 'keyboard', component: KeyboardInputComponent}
];
