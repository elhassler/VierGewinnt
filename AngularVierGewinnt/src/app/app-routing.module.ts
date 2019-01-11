import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: 'LoginComponent', component: LoginComponent},
  { path: 'RegistrationComponent', component: RegistrationComponent},
  { path: '', redirectTo: 'LoginComponent', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
