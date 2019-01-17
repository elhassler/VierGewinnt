import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  login (event) {
    event.preventDefault();
    console.log(event)
    const target = event.target
    let username = target.querySelector("#name").value
    let password = target.querySelector("#password").value
    console.log(username);
    console.log(password);
  }
}
