import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {RegistrationComponent } from './registration/registration.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';

const routes: Routes = [
  { path: 'LoginComponent', component: LoginComponent},
  { path: 'RegistrationComponent', component: RegistrationComponent},
  { path: 'Gamescreen/:gameId', component: GamescreenComponent},
  { path: 'Matchmaking', component: MatchmakingComponent},
  { path: '', redirectTo: 'LoginComponent', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
