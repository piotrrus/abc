import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@shared/modules/material-module';

const MODULES = [FormsModule, ReactiveFormsModule, TranslateModule, MaterialModule];

@NgModule({
     imports: [MODULES],
     exports: [MODULES],
})
export class CoreModule {}
