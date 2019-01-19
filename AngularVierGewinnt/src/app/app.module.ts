import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { WebsocketService } from './web-socket.service';
import { HttpClientModule } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

const appRoutes: Routes = [
  { path: 'Login', component: LoginComponent},
  { path: 'Registration', component: RegistrationComponent},
  { path: 'Gamescreen/:gameId', component: GamescreenComponent},
  { path: 'Matchmaking', component: MatchmakingComponent},
  { path: '', redirectTo: 'Login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GamescreenComponent,
    MatchmakingComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [WebsocketService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
