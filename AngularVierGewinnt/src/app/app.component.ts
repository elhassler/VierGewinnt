import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MyDialogService } from './my-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularVierGewinnt';
  loggedIn =false;
  username="";
  constructor( private router: Router,private cookieService:CookieService,private http: HttpClient, private dialog:MyDialogService){
    let authJSON=this.cookieService.get('auth');
    if(authJSON){
      console.log("User signed in!");
      let auth=JSON.parse(authJSON);
      this.username=auth.username;
      this.loggedIn=true;
    }
  }
  logout(){
   
    this.loggedIn=false;
    this.username="";
    let auth=JSON.parse(this.cookieService.get('auth'));
    this.cookieService.delete("auth",'/');
    this.http.post("http://localhost:5000/logout",auth).subscribe(()=>{
      console.log("succesfull logout");
    },(error)=>{
      this.dialog.openInfoDialog("Error",error.error.message+"!");
    });
    this.router.navigate(['/Login']);
  }
}


