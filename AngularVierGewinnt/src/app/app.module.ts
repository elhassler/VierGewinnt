import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GamescreenComponent,
    MatchmakingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
