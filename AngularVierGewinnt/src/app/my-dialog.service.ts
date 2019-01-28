import { Injectable } from '@angular/core';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyDialogService {

  constructor(public dialog: MatDialog,private router: Router) { }
  public openInfoDialog(title,desc): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: {title:title,desc:desc,closeMsg:"Ok!"}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public gameEndDialog(title,desc){
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: {title:title,desc:desc,closeMsg:"Back to Matchmaking"}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.router.navigate(["/Matchmaking"]);
    });
  }
}