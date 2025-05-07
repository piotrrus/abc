import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
     exports: [
          MatFormFieldModule,
          MatCheckboxModule,
          MatRadioModule,
          MatIconModule,
          MatInputModule,
          MatSelectModule,
          CdkAccordionModule,
          MatExpansionModule,
          MatChipsModule,
          MatAutocompleteModule,
          MatButtonModule,
          MatBadgeModule,
          MatTabsModule,
          MatDialogModule,
          MatTooltipModule,
          MatProgressSpinnerModule,
          MatToolbarModule,
          MatMenuModule,
          MatListModule,
          MatSlideToggleModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatToolbarModule,
          MatCardModule,
          MatStepperModule,
          MatDividerModule,
          MatTableModule,
          CdkTableModule,
          MatTreeModule,
          DragDropModule,
     ],
     providers: [MatSnackBar, MatDatepickerModule],
})
export class MaterialModule {}
