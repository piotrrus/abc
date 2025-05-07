import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@shared/components/base.component';
import { Observable, tap } from 'rxjs';
import { ConfirmDialogsHelper } from '@shared/components/confirm-dialog/confirm-modals.helper';
import { BusinessAreaDialogsHelper } from '@shared/components/modals/business-areas-modal/business-area-modal.helper';
import { DialogSize } from '@shared/enums/dialog-size.enum';
import { BaldoBusinessArea } from '@shared/services/data/business-areas/business-area.interface';
import { BusinessAreaList } from '../../partners/components/tables/partner-business-area-table/partner-business-area-table.interface';
import { UnitsBusinessAreasModalComponent } from '../components/modals/units-business-areas-modal/units-business-areas-modal.component';

@Injectable()
export class UnitsDialogsHelper extends BaseComponent {
     public confirmDialogsHelper: ConfirmDialogsHelper = new ConfirmDialogsHelper(this.dialog);
     public businessAreaDialogsHelper: BusinessAreaDialogsHelper = new BusinessAreaDialogsHelper(this.dialog);

     constructor(public dialog: MatDialog) {
          super();
     }

     public cancelNewUnit(): Observable<boolean> {
          const showImg: boolean = false;
          return this.confirmDialogsHelper.confirmDialog(undefined, showImg);
     }

     public showBusinessAreaModal(
          businessAreasList: BaldoBusinessArea[] | null
     ): Observable<BusinessAreaList[]> {
          const dialogRef = this.dialog.open(UnitsBusinessAreasModalComponent, {
               width: DialogSize.MEDIUM_LARGE,
               disableClose: true,
               data: { businessAreasList: businessAreasList, title: 'unit.businessAreas' },
          });
          return dialogRef.afterClosed().pipe(
               tap((dataTable: BusinessAreaList[]) => {
                    return dataTable;
               })
          );
     }
}
