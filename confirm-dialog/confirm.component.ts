import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalData } from './confirm-data.interface';

@Component({
     selector: 'bld-confirm',
     templateUrl: './confirm.component.html',
     styleUrls: ['./confirm.component.scss'],
})
export class ConfirmDialogComponent {
     constructor(
          public dialogRef: MatDialogRef<ConfirmDialogComponent>,
          @Inject(MAT_DIALOG_DATA) public data: ConfirmModalData
     ) {}

     public onConfirm(): void {
          this.dialogRef.close(true);
     }

     public onClose(): void {
          this.dialogRef.close(false);
     }
}
