import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

export class ConsumptionStandardsForm {
     public form: FormGroup = this.createFormsArray();

     constructor(private fb: FormBuilder) {}

     public get itemsArray(): FormArray {
          return this.form.get('items') as FormArray;
     }

     public createForm(): FormGroup {
          return this.fb.group({
               id: [''],
               consumpion_standard: [''],
               name: [''],
          });
     }

     public getItemsControls(): AbstractControl[] {
          return (this.form.get('items') as FormArray).controls;
     }

     private createFormsArray(): FormGroup {
          return (this.form = this.fb.group({
               items: new FormArray([]),
          }));
     }
}
