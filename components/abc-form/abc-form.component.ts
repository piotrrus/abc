import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '@shared/components/base-form.component';
import { AbcForm } from '@shared/forms/abc.form';
import { AbcData } from './abc-data.interface';

@Component({
     selector: 'app-form-abc',
     templateUrl: './abc-form.component.html',
     styleUrls: ['./abc-form.component.scss'],
})
export class AbcFormComponent extends BaseFormComponent implements OnInit {
     @Input() public set nrOfRows(nrOfRows: number) {
          // nrOfRows ?
          this.addFormItems();
          // : null;
     }

     @Output() public formChange = new EventEmitter<AbcData[]>();
     @Output() public isFormValid = new EventEmitter<boolean>();

     public form: AbcForm = new AbcForm(this.fb);
     public items: FormArray = this.form.itemsArray;

     constructor(private fb: FormBuilder) {
          super();
     }

     public ngOnInit(): void {
          this.checkFormAndEmit();
     }

     public addFormItems(): void {
          console.log('addItem');
          // this.items.clear();
          // for (let i = 0; i <= nrOfRows; i++) {
          this.items.push(this.form.createForm());
          // }
     }

     public getItemsControls(): AbstractControl[] {
          return this.form.getItemsControls();
     }
}
