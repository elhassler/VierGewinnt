import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {Router} from "@angular/router";
import { val } from 'src/environments/environment';
import {MyDialogService} from '../my-dialog.service';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(private http: HttpClient, private CookieService: CookieService, private router: Router, private dialog:MyDialogService,private appComp:AppComponent) { }


  ngOnInit() {
  }
  
  login(event) {
    event.preventDefault();
    console.log(event);

    let target = event.target;
    let username = target.querySelector("#uname1").value
    let password = target.querySelector("#pw1").value 

    if(!val(password)){
      this.dialog.openInfoDialog("Invalid Input","Do NOT use restricted Symbols (in Password)(SQL/HTML MetaSymbols)!");
    }else if(!username.match("^[A-z0-9]+$")){
      this.dialog.openInfoDialog("Invalid Input","Only letters and numbers allowed for: username!");
    }else {
      
    let jsonO={
        username:username,
        password:password
    };
    
    this.http.post("http://localhost:5000/login",jsonO).subscribe((response)=>{
      console.log('response from post data is ', response);  
    
      let tmp=JSON.parse(JSON.stringify(response));
      let authObj={
        username:username,
        token:tmp.Data.token
      }
      this.CookieService.set("auth",JSON.stringify(authObj));
      this.appComp.loggedIn=true;
      this.appComp.username=username;
      this.router.navigate(['/Matchmaking']);

    },(error)=>{
      this.dialog.openInfoDialog("Error",error.error.message+"!");
    });
  }
}
}
