import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private CookieService: CookieService, private router: Router) { }

  ngOnInit() {
  }

  login(event) {
    event.preventDefault();
    console.log(event);

    let target = event.target;

    let username = target.querySelector("#uname1").value
    let password = target.querySelector("#pw1").value 
    
    console.log(username + password);
    let jsonO={
        username:username,
        password:password
    };
    this.http.post("http://localhost:5001/login",jsonO).subscribe((response)=>{
      console.log('response from post data is ', response);

      let tmp=JSON.parse(JSON.stringify(response))
      let authObj={
        username:username,
        token:tmp.Data.token
      }
      this.CookieService.set("auth",JSON.stringify(authObj));
      this.router.navigate(['/Matchmaking']);
    },(error)=>{
      console.log('error during post is ', error)
    });
  }
}
