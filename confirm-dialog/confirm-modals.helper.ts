import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSize } from '@shared/enums/dialog-size.enum';
import { BaseComponent } from '@shared/components/base.component';
import { Observable, tap } from 'rxjs';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm.component';
import { ConfirmModalData } from './confirm-data.interface';

@Injectable()
export class ConfirmDialogsHelper extends BaseComponent {
     constructor(public dialog: MatDialog) {
          super();
     }

     public confirmDialog(confirmationsText?: ConfirmModalData, showMainImg?: boolean): Observable<boolean> {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
               width: DialogSize.SMALL,
               disableClose: confirmationsText ? !confirmationsText.showCloseIcon : false,
               data: this.checkConfirmationData({ confirmationsText, showMainImg }),
          });
          return dialogRef.afterClosed().pipe(
               tap((data: boolean) => {
                    return data;
               })
          );
     }

     private checkConfirmationData({
          confirmationsText = {
               title: 'confirmations.confirmTitle',
               messageTxt: 'confirmations.confirmMsg',
          },
          showMainImg = true,
     }: {
          confirmationsText?: ConfirmModalData;
          showMainImg?: boolean;
     }): ConfirmModalData {
          const defaultConfirmationsText: ConfirmModalData = {
               title: 'confirmations.confirmTitle',
               messageTxt: 'confirmations.confirmMsg',
               showCloseIcon: true,
               showImg: true,
          };

          return {
               ...defaultConfirmationsText,
               ...confirmationsText,
               showImg: showMainImg,
          };
     }
}
