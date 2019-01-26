import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { val } from 'src/environments/environment';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],

})
export class RegistrationComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  

  ngOnInit() {
  }

  registration(event) {
    event.preventDefault();
    console.log(event);

    let target = event.target;

    let username = target.querySelector("#uname2").value
    let firstname = target.querySelector("#fname").value
    let surname = target.querySelector("#sname").value
    let password1 = target.querySelector("#pw2").value 
    let password2 = target.querySelector("#pw3").value 

  if(!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(surname)) {
    console.log("nur Buchstaben erlaubt") 
  } else if(!username.match(/^[A-Za-z0-9][A-Za-z0-9 ]\*[A-Za-z0-9]\*$/)) {  
    console.log("nur Buchstaben und Zahlen erlaubt")
  } else if(password1 != password2) {
    console.log("Passwörter stimmen nicht überein")
  } else if(false){//val(username)&&val(firstname)&&val(surname)&&val(password1)&&val(password2)){
    console.log("SQL Zeichen wurden gefunden") 
  } else {
    let jsonO={
        username:username,
        firstname:firstname,
        surname:surname,
        password1:password1,
        password2:password2,
    };

    this.http.post("http://localhost:5001/registration",jsonO).subscribe((response)=>{
      console.log('response from post data is ', response);
      let tmp=JSON.parse(JSON.stringify(response))
      this.router.navigate(['/Login']);

    },(error)=>{
      let tmp=JSON.parse(JSON.stringify(error))
      console.log('error during post is '+error.error.message);
      if(error.error.message.startsWith("ER_DUP_ENTRY")){
        //snack
        console.log("Nutzer bereits vorhanden");
      }
    });
  }
}
}
