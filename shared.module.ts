import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NewAddressFormComponent } from '@shared/components/new-address-form/new-address-form.component';
import { PhonesFormComponent } from '@shared/components/phones-form/phones-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm.component';
import { CommentFormComponent } from '@shared/components/comment-form/comment-form.component';
import { BrandsModalComponent } from '@shared/components/modals/brands-modal/brands-modal.component';
import { SimpleFilterModule } from '@shared/components/simple-search-form/simple-search-filter.module';
import { MultitypesFormsModule } from '@shared/components/multitype-forms/multitypes-forms.module';
import { LeaveDialogComponent } from '@shared/components/leave-page-dialog/leave-dialog.component';
import { MultiselectTypeaheadModule } from './multiselect-typeahead/multiselect-typeahead.module';
import { MaterialModule } from './material-module';
import { DatePickerModule } from './pick-date.adapter/date-picker.module';
import { TripleCheckboxModule } from './triple-checkbox/triple-checkbox.module';
import { RolesModule } from './roles.module';
import '@volvo/vcdk';
import { DirectivesModule } from './directives.module';

const MODULES = [
     CommonModule,
     MaterialModule,
     FormsModule,
     ReactiveFormsModule,
     TranslateModule,
     MultiselectTypeaheadModule,
     MultitypesFormsModule,
     DatePickerModule,
     TripleCheckboxModule,
     SimpleFilterModule,
     RolesModule,
     DirectivesModule,
];
const COMPONENTS = [
     ConfirmDialogComponent,
     NewAddressFormComponent,
     PhonesFormComponent,
     CommentFormComponent,
     BrandsModalComponent,
     LeaveDialogComponent,
];

@NgModule({
     declarations: [COMPONENTS],
     imports: [MODULES],
     schemas: [CUSTOM_ELEMENTS_SCHEMA],
     exports: [MODULES, COMPONENTS],
})
export class SharedModule {}
