import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { ConsumptionStandard } from '@features/consumption-standards/models/consumption-standards.model';
import { BaseFormComponent } from '@shared/components/base-form.component';
import { AbcForm } from '@shared/forms/abc.form';

@Component({
     selector: 'app-form-abc',
     templateUrl: './abc-form.component.html',
     styleUrls: ['./abc-form.component.scss'],
})
export class AbcComponent extends BaseFormComponent implements OnInit {
     @Input() public set nrOfRows(nrOfRows: number) {
          this.addFormItems(nrOfRows);
     }

     @Output() public formChange = new EventEmitter<ConsumptionStandard[]>();
     @Output() public isFormValid = new EventEmitter<boolean>();

     public form: AbcForm = new AbcForm(this.fb);
     public items: FormArray = this.form.itemsArray;

     constructor(private fb: FormBuilder) {
          super();
     }

     public ngOnInit(): void {
          this.checkFormAndEmit();
     }

     public addFormItems(nrOfRows: number): void {
          this.items.clear();
          for (let i = 0; i <= nrOfRows; i++) {
               this.items.push(this.form.createForm());
          }
     }

     public getItemsControls(): AbstractControl[] {
          return this.form.getItemsControls();
     }
}
