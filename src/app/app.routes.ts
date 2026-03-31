import { Routes } from '@angular/router';
import { KeyboardInputComponent } from './features/game/components/keyboard-input/keyboard-input.component';
import { HomeComponent } from './shared/home/home.component';
import { GameComponent } from './features/game/components/game/game.component';
import { PrivacyComponent } from './shared/privacy/privacy.component';
import { AllBlogsComponent } from './core/blogs/all-blogs/all-blogs.component';
import { ImproveTypingSpeedComponent } from './core/blogs/improve-typing-speed/improve-typing-speed.component';
import { ScienceBehindAccuracyComponent } from './core/blogs/science-behind-accuracy/science-behind-accuracy.component';
import { TopOnlineTypingGamesComponent } from './core/blogs/top-online-typing-games/top-online-typing-games.component';
import { TypingChallengeComponent } from './core/blogs/typing-challenge/typing-challenge.component';
import { TypingGameComponent } from './core/blogs/typing-game/typing-game.component';
import { ContactComponent } from './shared/contact/contact.component';
import { SnakeGameComponent } from './features/game/components/snake-game/snake-game.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'game', component: GameComponent},
    {path: 'snake-game', component: SnakeGameComponent},
    {path: 'keyboard', component: KeyboardInputComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'typing-blogs', component: AllBlogsComponent},
    {path: 'improve-typing-speed', component: ImproveTypingSpeedComponent},
    {path: 'sciece-behind-accuracy', component: ScienceBehindAccuracyComponent},
    {path: 'top-online-typing-games', component: TopOnlineTypingGamesComponent},
    {path: 'typing-challenge', component: TypingChallengeComponent},
    {path: 'typing-game', component: TypingGameComponent}, 
    {path: 'contact', component: ContactComponent}
];
