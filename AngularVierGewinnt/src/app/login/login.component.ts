import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  login(event) {
    event.preventDefault();
    console.log(event);

    let target = event.target;

    let username = target.querySelector("#name").value
    let password = target.querySelector("#pw").value 
    
    console.log(username + password);
    let jsonO={
        username:username,
        password:password
    };
    this.http.post("http://localhost:5001/login",jsonO).subscribe((response)=>{
      console.log('response from post data is ', response);
    },(error)=>{
      console.log('error during post is ', error)
    });
  }
}
