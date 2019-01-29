import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { val } from 'src/environments/environment';
import { MyDialogService } from '../my-dialog.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],

})
export class RegistrationComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private dialog:MyDialogService) { }

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

  if(!firstname.match("^[A-z]+$") || !surname.match("^[A-z]+$")) {
    console.log("nur Buchstaben erlaubt");
    this.dialog.openInfoDialog("Invalid Input","Only letters allowed for: firstname and surname!");
  } else if(!username.match("^[A-z0-9]+$")) {  
    console.log("nur Buchstaben und Zahlen erlaubt");
    this.dialog.openInfoDialog("Invalid Input","Only letters and numbers allowed for: username!");
  } else if(password1 != password2) {
    console.log("Passwörter stimmen nicht überein");
    this.dialog.openInfoDialog("Invalid Input","Passwords do not match!");
  } else if(!val(password1)){
    console.log("SQL Zeichen wurden gefunden") 
    this.dialog.openInfoDialog("Invalid Input","Do NOT use restricted Symbols (in Password) (SQL/HTML MetaSymbols)!");
  } else {
    let jsonO={
        username:username,
        firstname:firstname,
        surname:surname,
        password1:password1,
        password2:password2,
    };

    this.http.post("http://localhost:5000/registration",jsonO).subscribe((response)=>{
      console.log('response from post data is ', response);
      let tmp=JSON.parse(JSON.stringify(response))
      this.router.navigate(['/Login']);

    },(error)=>{
      console.log('error during post is '+error.error.message);
      if(error.error.message.startsWith("ER_DUP_ENTRY")){
        this.dialog.openInfoDialog("Error","Username already taken!");
        console.log("Nutzer bereits vorhanden");
      }else{
        this.dialog.openInfoDialog("Error",error.error.message);
      }
    });

  }
}
}
