import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../components/shared/mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  openConfirmDialog(msg: string) {
    return this.dialog.open(MatConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      width: '400px',
      disableClose: false,
      data: {
        message: msg,
      }
    });
  }
}
