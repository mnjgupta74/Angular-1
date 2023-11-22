import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private matSnackBar: MatSnackBar) { }

  show = (message: string, type: string) => {
    this.matSnackBar.open(message, 'Ok', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [type]
    });
  }
}