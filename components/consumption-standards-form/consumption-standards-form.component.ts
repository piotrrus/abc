import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { ConsumptionStandard } from '@features/consumption-standards/models/consumption-standards.model';
import { BaseFormComponent } from '@shared/components/base-form.component';
import { ConsumptionStandardsForm } from '@shared/forms/consumption-standards.form';

@Component({
     selector: 'app-consumption-standards-form',
     templateUrl: './consumption-standards-form.component.html',
     styleUrls: ['./consumption-standards-form.component.scss'],
})
export class ConsumptionStandardsFormComponent extends BaseFormComponent implements OnInit {
     @Input() public set nrOfRows(nrOfRows: number) {
          consumptionStandard ? this.addFormItems(nrOfRows) : null;
     }

     @Output() public formChange = new EventEmitter<ConsumptionStandard[]>();
     @Output() public isFormValid = new EventEmitter<boolean>();

     public form: ConsumptionStandardsForm = new ConsumptionStandardsForm(this.fb);
     public items: FormArray = this.form.itemsArray;

     constructor(private fb: FormBuilder) {
          super();
     }

     public ngOnInit(): void {
          this.checkFormAndEmit();
     }

     public addFormItems(nrOfRows): void {
          for (let i = 0; i <= nrOfRows; i++) {
               this.items.push(this.form.createForm(dataArr[i]));
          }
     }

     public getItemsControls(): AbstractControl[] {
          return this.form.getItemsControls();
     }

     public onSaveStandards(): void {}
}
